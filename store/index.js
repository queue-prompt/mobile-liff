import Vuex from 'vuex'

import appStateModule from './modules/appState'
import reserveModule from './modules/reserve'
import myReserveModule from './modules/myReserve'


const createStore = () => {
  return new Vuex.Store({
    modules: {
      appState: appStateModule,
      reserve: reserveModule,
      myReserve: myReserveModule,
    },
  })
}

export default createStore