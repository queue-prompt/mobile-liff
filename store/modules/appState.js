import axiosApi from '../../service/config_axios'
import _ from 'lodash-core'
import dayjs from 'dayjs'
import {formatDate} from '../../static/transform'

const appStateModule = {
  namespaced: true,
  state: {
    isLoading: false,
    textLoading: null,
    appVersion: '1.0.0',
    opacityLoading: 0.5,

    entityId: '',
    organizationData: {},

    server: {},

    dateReserve: [],
    dateReserveHolder: {},
    preRegisterText: '',
    postRegisterText: '',

    userId: '',
    idToken: '',
    user: {},
    userReservedList: [],

    canReserve: true,

    entityShutdown: false,
    entityShutdownText: '',
  },
  mutations: {
    setState(state, { key, payload }) {
      state[key] = payload
    },
  },
  actions: {
    init(context) {
      const { state, commit, dispatch } = context
      const p = new Promise(async (resolve) => {

        const entityId = window.localStorage.getItem('entityId')

        if (!entityId) {
          console.log('please login entity')
          commit('setState', { key: 'isLoading', payload: false })
          this.$router.push('/search')
          resolve(false)
          return
        }

        commit('setState', { key: 'entityId', payload: entityId })

        // set baseUrl & header global
        axiosApi.defaults.headers.common['Content-Type'] = `application/json`;

        const resultEvent = await dispatch('fetchEvent')

        if (!resultEvent) {
          commit('setState', { key: 'isLoading', payload: false })
          this.$router.push('/search')
          resolve(false)
          return
        }

        commit('setState', { key: 'validateEntity', payload: true })

        await dispatch('fetchServerOpenTime')
        await dispatch('fetchDateReserve')

        dispatch('checkEntity')

        this.$router.push('/')
        resolve(true)
      })

      return p
    },

    fetchEvent(context) {
      const { state, commit, dispatch } = context
      const p = new Promise(async (resolve, reject) => {
        const entityId = state.entityId

        try {
          const response = await axiosApi.get(`/entity/${entityId}`)

          const data = response.data
  
          if (!data) {
            localStorage.removeItem('entityId')
            resolve(false)
            return
          }
  
          if (data && data.organization) {
            localStorage.setItem('entityId', entityId)
            const entityData = {
              ...data,
              adress: data.location ? data.location.address : '',
            }
  
            commit('setState', { key: 'organizationData', payload: entityData })
            resolve(true)
          }
        }
  
        catch(error) {
          commit('setState', { key: 'isLoading', payload: false })
          localStorage.removeItem('entityId')
          alert('Entity Error')
          console.log(error)
          reject()
        }
      })

      return p
    },

    fetchServerOpenTime(context) {
      const { state, commit } = context
      const p = new Promise(async (resolve, reject) => {

        try {
          const response = await axiosApi.get(`/server/opentime`)
          commit('setState', { key: 'server', payload: response.data })
          resolve(true)
        }

        catch(error) {
          commit('setState', { key: 'isLoading', payload: false })
          alert('Server Error')
          console.log(error)
          reject()
        }
      })

      return p
    },

    fetchDateReserve(context) {
      const { state, commit } = context
      const p = new Promise(async (resolve, reject) => {

        const entityId = state.entityId

        try {
          const response = await axiosApi.get(`/timeslots/${entityId}`)
          const data = response.data

          if (_.size(data) == 0) {
            resolve(false)
            return
          } else {
            commit('setState', { key: 'dateReserveHolder', payload: data })
          }

          if (data) {
            let tmpArray = []

            _.forEach(data, (value, date) => {
              tmpArray.push({
                ...value,
                date: date,
                active: value.active
              })
            })

            const today = dayjs().format('YYYY-MM-DD')

            const orderbyDate = _.orderBy(tmpArray, ['date'], ['asc'])
            const filtered = _.filter(orderbyDate, d => d.date >= today)
            const takeDate = _.take(filtered, 7)

            commit('setState', { key: 'dateReserve', payload: takeDate })
            resolve(true)
          }
        }

        catch(error) {
          commit('setState', { key: 'isLoading', payload: false })
          alert('Date Error')
          console.log(error)
          reject()
        }

      })

      return p
    },

    fetchInformationRegister(context, { type, entityId }) {
      const { state, commit } = context
      const p = new Promise(async (resolve, reject) => {

        try {
          const response = await axiosApi.get(`/information/${entityId}/${type}`)

          const data = response.data
  
          if (data) {
            commit('setState', { key: type == 'pre_register' ? 'preRegisterText' : 'postRegisterText', payload: data.text })
          } else {
            commit('setState', { key: type == 'pre_register' ? 'preRegisterText' : 'postRegisterText', payload: '' })
          }
  
          resolve(true)
        }

        catch(error) {
          commit('setState', { key: 'isLoading', payload: false })
          alert('information Error')
          console.log(error)
          reject()
        }
      })

      return p
    },

    fetchUserReserved(context) {
      const { state, commit } = context
      const p = new Promise(async (resolve, reject) => {

        const userId = state.userId
        const entityId = state.entityId

        try {
          const response = await axiosApi.get(`/register/${userId}?entityId=${entityId}`)
          const data = response.data
  
          if (data.length > 0) {
            const sorted = _.orderBy(data, ['date'], ['asc'])
            commit('setState', { key: 'userReservedList', payload: sorted })
            resolve(true)
            return
          }
  
          resolve(false)
        }

        catch(error) {
          commit('setState', { key: 'isLoading', payload: false })
          alert('Reserved Error')
          console.log(error)
          reject()
        }
      })

      return p
    },

    async checkEntity(context) {
      const { state, commit } = context
      const firstDateObj = _.head(state.dateReserve)
      const newFormatFirstDate = formatDate(firstDateObj.date)

      // check active entity
      if (state.organizationData.active == false) {
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: 'ได้มีการปิดรับลงทะเบียนชั่วคราว กรุณาตรวจสอบอีกครั้งภายหลัง' })
        return 
      }

      // check date timeslots || no_data
      if (state.dateReserve.length == 0) {
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: 'ไม่พบวันที่สามารถลงทะเบียนได้' })
        return 
      }

      // check delay 
      if (state.server.delay !== 0) {
        let delay = state.server.delay

        commit('setState', { key: 'isLoading', payload: false })
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: `ระบบจะเปิดจองในวันที่ ${newFormatFirstDate} 9:00 น` })

        setTimeout(() => {
          window.location.reload()
        }, delay);
        
        return 
      }

      // check date tomorrow active && next day reservation
      const tomorrowList = _.filter(state.dateReserve, { date: state.server.tomorrow })
      const tomorrowObj = _.head(tomorrowList)
      const dateCanReserve = dayjs(firstDateObj.date).subtract(1, 'day').format("YYYY-MM-DD")
      const newFormatCanReserve = formatDate(dateCanReserve)
      
      if(tomorrowList.length == 0) {
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: `ระบบจะเปิดจองในวันที่ ${newFormatCanReserve} 09:00น.` })
        return
      }

      if (tomorrowObj && tomorrowObj.active == false) {
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: 'ได้มีการปิดรับลงทะเบียนชั่วคราว กรุณาตรวจสอบอีกครั้งภายหลัง' })
        return 
      }


      //check full
      const isFull = firstDateObj.open - firstDateObj.reserve == 0 
      if (isFull) {
        commit('setState', { key: 'canReserve', payload: false })
        const dateIsFull = formatDate(firstDateObj.date)
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: `คิววันที่ ${dateIsFull}เต็มแล้ว.` })
        return 
      }

      commit('setState', { key: 'entityShutdown', payload: false })
      commit('setState', { key: 'entityShutdownText', payload: '' })
      return 
    },

    searchEntity(context, entityId) {
      const p = new Promise(async (resolve, reject) => {
        try {
          const response = await axiosApi.get(`/entity/${entityId}`)
          const data = response.data

          if(data) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
        catch(error) {
          commit('setState', { key: 'isLoading', payload: false })
          alert('search entity Error')
          console.log(error)
          reject()
        }
      })

      return p
    },
  },
  getters: {}
};
export default appStateModule;
