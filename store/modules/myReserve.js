import axiosApi from '../../service/config_axios'
import _ from 'lodash-core'

const myReserveModule = {
  namespaced: true,
  state: {
    myReserveList: []
  },
  mutations: {
    setState(state, { key, payload }) {
      state[key] = payload
    },
  },
  actions: {

    fetchAllMyReserved(context, idCardNumber) {
      const { state, commit } = context
      const p = new Promise(async (resolve, reject) => {

        try {
          const response = await axiosApi.get(`/register/${idCardNumber}`)
          const data = response.data

          if(data.length > 0 ) {
            const sorted = _.orderBy(data, ['date'], ['asc'])
            commit('setState', { key: 'myReserveList', payload: sorted })
            resolve(true)
            return
          }

          commit('setState', { key: 'myReserveList', payload: [] })
          resolve(false)
        }

        catch(error) {
          console.log(error)
          commit("appState/setState", { key: "isLoading", payload: false }, {root: true});
          reject()
        }
      })

      return p
    }
  },
  getters: {}
};
export default myReserveModule;