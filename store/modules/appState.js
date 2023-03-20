import axiosApi from '../../service/config_axios'
import _ from 'lodash-core'
import dayjs from 'dayjs'
import { formatDate } from '../../static/transform'

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
            let entityData = {
              ...data,
            }

            if(entityData.identityType == undefined || entityData.identityType == null) {
              console.log('identityType is null or undefined')
              entityData['identityType'] = 0
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
          const reserveEntity = state.organizationData
          const reserveMode = reserveEntity.reserveMode == 1 ? 1 : 0
          let response = {}

          if(reserveMode == 1) {
            const currentDay = reserveEntity.reserveDate
            const currentTime = reserveEntity.reserveTime
            response = await axiosApi.get(`/server/opentime?date=${currentDay}&time=${currentTime}`)
          }

          commit('setState', { key: 'server', payload: response.data ?  response.data : {}})
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
            // const takeDate = _.take(filtered, 7)

            commit('setState', { key: 'dateReserve', payload: filtered })
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
      const todayDate = dayjs().format('YYYY-MM-DD')
      const reserveMode = state.organizationData.reserveMode  == 1 ? 1 : 0

      let target = ''
      let targetSplit = []
      let newFormatTargetDate = ''
      let newFormatTargetTime = ''

      if(reserveMode == 1) {
        target = state.server.target
        targetSplit = target.split('T')
        newFormatTargetDate = formatDate(targetSplit[0])
        newFormatTargetTime = targetSplit[1].slice(0, 5)
      }

      // check active entity
      if (state.organizationData.active == false) {
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: 'ระบบปิดรับลงทะเบียนชั่วคราว กรุณาตรวจสอบอีกครั้งในภายหลัง' })
        return 
      }

      // check date timeslots || no_data
      if (state.dateReserve.length == 0) {
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: 'ไม่พบวันที่สามารถลงทะเบียนได้' })
        return 
      }

      //check date timeslot active 
      if(state.dateReserve.length == 1 && firstDateObj.active == false) {
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: 'ระบบปิดรับลงทะเบียนชั่วคราว กรุณาตรวจสอบอีกครั้งในภายหลัง' })
        return 
      }

      // check delay
      if (state.server.delay && state.server.delay !== 0) {
        let delay = state.server.delay

        commit('setState', { key: 'isLoading', payload: false })
        commit('setState', { key: 'canReserve', payload: false })
        commit('setState', { key: 'entityShutdown', payload: true })
        commit('setState', { key: 'entityShutdownText', payload: `ระบบจะเปิดจองในวันที่ ${newFormatTargetDate} ${newFormatTargetTime} น` })

        setTimeout(() => {
          window.location.reload()
        }, delay);
        
        return 
      }

      // check entity reserve date and time 
      if(reserveMode == 0) {
        const entityReserveValue = state.organizationData.reserveValue ? state.organizationData.reserveValue : 1
        const canReserveDate = dayjs()
        .subtract(entityReserveValue, "day") 
        .format("YYYY-MM-DD");

        if(todayDate < canReserveDate) {
          commit('setState', { key: 'canReserve', payload: false })
          commit('setState', { key: 'entityShutdown', payload: true })
          commit('setState', { key: 'entityShutdownText', payload: `ระบบจะเปิดจองในวันที่ ${formatDate(canReserveDate)}` })
          return
        }
      }

      if(reserveMode == 1) {
        const entityReserveDate = state.organizationData.reserveDate
        const entityReserveTime = state.organizationData.reserveTime

        const newFormatReserveDate = formatDate(entityReserveDate)
        const newFormatReserveTime = entityReserveTime[0] + entityReserveTime[1] + ':' + entityReserveTime[2] + entityReserveTime[3]

        if(todayDate < entityReserveDate) {
          commit('setState', { key: 'canReserve', payload: false })
          commit('setState', { key: 'entityShutdown', payload: true })
          commit('setState', { key: 'entityShutdownText', payload: `ระบบจะเปิดจองในวันที่ ${newFormatReserveDate} ${newFormatReserveTime} น` })
          return
        }
      }


      //check full
      const isFull = firstDateObj.open - firstDateObj.reserve == 0 
      if (state.dateReserve.length == 1 && isFull) {
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
