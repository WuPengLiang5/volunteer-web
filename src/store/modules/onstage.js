import Cookies from 'js-cookie'

const state= {
  menuId:sessionStorage.getItem('menuId') ? sessionStorage.getItem('menuId') : '',
}

const mutations = {
  SET_MENUID: (state,menuId) => {
    state.menuId = menuId
    sessionStorage.setItem('menuId',menuId)
  },
}

const actions = {
  changeMenuId({ commit }, data) {
    commit('SET_MENUID', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
