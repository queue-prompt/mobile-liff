import axiosApi from '../../service/config_axios'
import axiosApiRetry from '../../service/config_axiosRetry'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'

const errorServer = { status: 'มีข้อผิดพลาด', errorMessage: 'กรุณาลองใหม่อีกครั้ง' }

const reserveModule = {
  namespaced: true,
  state: {
    timeslotList: [],
    reserveToken: '',

    reserveQueue: {},
    register: {},
  },
  mutations: {
    setState(state, { key, payload }) {
      state[key] = payload
    },
  },
  actions: {
    getTokenByUserId(context) {
      const { state, commit, rootState } = context
      const p = new Promise(async (resolve, reject) => {
        const userId = rootState.appState.userId
        const entityId = rootState.appState.entityId

        try {

          const payload = {
            idCardNumber: userId,
            entityId: entityId,
            date: dayjs().format('YYYY-MM-DDD')
          }

          const response = await axiosApiRetry.post('/token', payload)

          if (response.data.status == 'ok') {
            commit('appState/setState', { key: 'idToken', payload: response.data.token }, { root: true })

            // Set Header Authorization Global
            axiosApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            resolve(true)
          }
        }
        catch (error) {
          console.log(error)
          commit('appState/setState', { key: 'idToken', payload: '' }, { root: true })
          commit('appState/setState', { key: 'isLoading', payload: false }, { root: true })
          await alertError(errorServer)
          reject()
        }
      })

      return p
    },

    getTimeSlots(context, date) {
      const { state, commit, rootState } = context
      const p = new Promise(async (resolve, reject) => {
        const entityId = rootState.appState.entityId

        try {
          const response = await axiosApi.get(`/timeslots/${entityId}/${date}`)
          const data = response.data

          if (data !== null) {
            let tmpArray = []

            _.forEach(data.time, (value, time) => {
              tmpArray.push({
                time: time,
                ...value
              })
            })

            const sortedTime = _.orderBy(tmpArray, ['time'], ['asc'])
            commit('setState', { key: 'timeslotList', payload: sortedTime })

          } else {
            commit('setState', { key: 'timeslotList', payload: [] })
          }

          resolve(true)
        }

        catch (error) {
          console.log(error)
          commit('setState', { key: 'timeslotList', payload: [] })
          commit('appState/setState', { key: 'isLoading', payload: false }, { root: true })

          if (error.response.status == 400 && error.response.data.errorMessage) {
            await alertError(error.response.data)
          }

          if (error.response.status > 400) {
            await alertError(errorServer)
          }

          reject()
        }
      })

      return p
    },

    registerQueue(context, payloadReserve) {
      const { state, commit, rootState } = context
      const p = new Promise(async (resolve) => {
        const entityId = rootState.appState.entityId
        const userId = rootState.appState.userId
        const userData = rootState.appState.user
        const organization = rootState.appState.organizationData.organization
        const reserveQueue = payloadReserve

        const payload = { entityId, userId, organization, ...userData, ...reserveQueue }

        try {

          const response = await axiosApi.post(`/register`, payload)
          
          const data = response.data

          if(!data) {
            resolve(false)
          }

          if(data) {
            const registerPayload = {
              registerId: data.registerId,
              registerCode: data.registerCode
            }
  
            commit('setState', { key: 'reserveQueue', payload: payloadReserve })
            commit('setState', { key: 'register', payload: registerPayload })
            localStorage.setItem(data.registerId, true)
            localStorage.setItem(`r:${entityId}:${reserveQueue.date}`, true)
            localStorage.removeItem("form2");
            resolve(true)
          }
        }

        catch (error) {
          console.log(error)
          commit('setState', { key: 'register', payload: {} })
          commit('appState/setState', { key: 'isLoading', payload: false }, { root: true })

          if (error.response.status == 400 && error.response.data.errorMessage) {
            const errorResponse = error.response.data
            
            if(errorResponse.status == 'full') {
              localStorage.setItem(`t:${entityId}:${reserveQueue.date}:${reserveQueue.time}`, true)
            }

            if(errorResponse.status == 'already_register') {
              localStorage.setItem(`${entityId}:${reserveQueue.date}:${userId}`, true)
            }
            await alertError(errorResponse)
          }

          if (error.response.status > 400) {
            await alertError(errorServer)
          }
          resolve(false)
        }
      })

      return p
    },

    newRegisterQueue(context) {
      const { commit } = context

      commit('appState/setState', { key: 'user', payload: {} }, { root: true })
      commit('setState', { key: 'reserveToken', payload: '' })
      commit('setState', { key: 'reserveQueue', payload: {} })
      commit('setState', { key: 'register', payload: {} })
    }
  },
  getters: {}
};
export default reserveModule;


function alertError(errorData) {
  return new Promise(async (resolve) => {
    resolve(
      await Swal.fire({
        icon: 'error',
        title: errorData.status,
        text: errorData.errorMessage,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 4000
      })
    )
  });
}
