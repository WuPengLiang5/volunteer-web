import defaultSettings from '@/settings'

const { defaultBackground,backgroundColors } = defaultSettings

const state= {
  currentBackground:JSON.parse(localStorage.getItem("background_color"))?JSON.parse(localStorage.getItem("background_color")):defaultBackground,
  backgroundColors:backgroundColors,
  systemType:'onstage'
}

const mutations = {
  CHANGE_BACKGROUND_COLOR: (state,backgroundColor) => {
    for(let item in state.backgroundColors){
      if (state.backgroundColors[item].label === backgroundColor){
        state.currentBackground=Object.assign({},state.backgroundColors[item])
        console.log(state.currentBackground)
        localStorage.setItem("background_color",JSON.stringify(state.currentBackground))
        break;
      }
    }
  },
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_SYSTEM_TYPE:(state,systemType) => {
    state.systemType = systemType
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
