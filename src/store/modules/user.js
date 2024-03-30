import router, {resetRouter} from '@/router';
import {fetchMenus, fetchMenuByRoleId} from '@/api/admin/menu'
import {fetchRole} from '@/api/admin/role'
import store from "@/store";
import role from "@/views/admin/permission/role";

export function getBtnPermission (list,btn) {
  list.forEach(val => {
    // 与后台协商所有菜单资源（resCode)下的type是1表菜单，2为按钮
    const tmp = { ...val }
    if (tmp) {
      if (tmp.children && tmp.children.length > 0) {
        getBtnPermission(tmp.children,btn)
      }
    }
    if (tmp.type === 2) {
      btn.push(tmp.perms)
    }
  })
}

const state = {
  userInfo: JSON.parse(localStorage.getItem('userInfo'))?JSON.parse(localStorage.getItem('userInfo')):'',
  adminInfo: JSON.parse(localStorage.getItem('adminInfo'))?JSON.parse(localStorage.getItem('adminInfo')):'',
  role: "",
  allMenu:[], // 全部菜单
  showMenu:[], // 展示菜单
  hasButtonPerm:[],
  allButtonPerm:[]
}

const mutations = {
  SET_USERINFO:(state,user) => {
    state.userInfo = user
  },
  SET_ADMIN_INFO:(state,admin) => {
    state.adminInfo = admin
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_ALLMENU: (state, allMenu) => {
    state.allMenu = allMenu
  },
  SET_SHOWMENU: (state, showMenu) => {
    state.showMenu = showMenu
  },
  SET_HASBUTTON_PERM: (state, hasButtonPerm) => {
    state.hasButtonPerm = hasButtonPerm
  },
  SET_ALLBUTTON_PERM: (state, allButtonPerm) => {
    state.allButtonPerm = allButtonPerm
  },

}

const actions = {
  login({ commit },value){
    if (value.identity === 'user'){
      localStorage.setItem("userInfo", JSON.stringify(value.info));
      commit('SET_USERINFO', value.info)
      console.log(state.userInfo)
    }else{
      localStorage.setItem("adminInfo", JSON.stringify(value.info));
      commit('SET_ADMIN_INFO', value.info)
    }
  },
  getRole({ commit, state },roleId) {
    return new Promise((resolve, reject) => {
      fetchRole(roleId).then(response => {
        let role
        if (response.data.code === 200){
          role = response.data.data
          commit('SET_ROLE', role)
          resolve(role)
        }
        reject()
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ dispatch, commit },identity){
    if (identity === 'user'){
      commit('SET_USERINFO')
      localStorage.removeItem('userInfo')
    }else{
      commit('SET_ADMIN_INFO')
      localStorage.removeItem('adminInfo')
      resetRouter()

      dispatch("delAllMenus")
      dispatch('tagsView/delAllViews', null, { root: true })
      commit('SET_ROLE','')
      console.log('logout',localStorage.getItem('adminInfo'),store.getters.adminInfo)
    }
  },
  resetToken({dispatch, commit}){
    return new Promise(resolve => {
      commit('SET_ADMIN_INFO')
      localStorage.removeItem('adminInfo')
      dispatch("delAllMenus")
      commit('SET_ROLE','')
      resolve()
    })
  },
  async getMenuTree({ dispatch,commit },toUrl){
    return await new Promise(resolve => {
      //获取全部菜单
      fetchMenus().then(resp => {
        if (resp.data.code === 200){
          commit('SET_ALLMENU',resp.data.data);
          // let btn = []
          // getBtnPermission(resp.data.data,btn)
          // commit('SET_ALLBUTTON_PERM',btn)
        }
      })
      const roleId = state.role ? state.role.id : -1
      console.log(roleId)
      //这里通过接口获取当前用户拥有的所有权限(路由地址)
      fetchMenuByRoleId({roleId: roleId}).then(res => {
        if (res.data.code === 200) {
          // let newMenu = [];
          // let newButton = [];
          // // 当前用户拥有权限访问的页面
          // let menuUrlList = [];
          //
          // res.data.data.map(item => {
          //   // console.log(item)
          //   if (item.type === 2){
          //     newButton.push({
          //       id: item.id,
          //       pid: item.pid,
          //       name: item.name,
          //       title: item.title,
          //       perms: item.perms
          //     })
          //   }else{
          //     newMenu.push({
          //       id: item.id,
          //       pid: item.pid,
          //       name: item.name,
          //       title: item.title,
          //       url: item.url,
          //       children: []
          //     });
          //   }
          //
          //   if (item.url !== "") {
          //     menuUrlList.push(item.name);
          //   }
          // });

          // console.log("SHOWMENU",res.data.data)
          commit('SET_SHOWMENU',res.data.data);

          let btn = []
          getBtnPermission(res.data.data,btn)

          console.log(btn,res.data.data)
          // 存所有按钮权限
          commit('SET_HASBUTTON_PERM',btn);
          // console.log(state.allMenu,state.showMenu,state.buttonPerm)
          resolve(state.showMenu);
        }
      });
    })
  },
  async recursionMenuList({ dispatch,commit },fatherMenu) {
    return await new Promise((resolve, reject) => {
      let oldMenuList = JSON.parse(JSON.stringify(state.allMenu));
      fatherMenu.map((fItem, fKey) => {
        let isChildrenList = oldMenuList.filter(itemChild => {
          return fItem.id === itemChild.pid
        });
        if (isChildrenList.length !== 0) {
          fItem.children = isChildrenList;
          dispatch("recursionMenuList",isChildrenList).then((res) => {
            resolve(res);
          });
        } else {
          resolve(fatherMenu);
        }
      });
    });
  },
  delAllMenus({ dispatch, commit }) {
    commit("SET_ALLMENU",[])
    commit("SET_SHOWMENU",[])
  },
  async changeMenu({ commit, dispatch },path){
    console.log("更新菜单")
    resetRouter()
    dispatch("delAllMenus")
    console.log()
    console.log(state.allMenu,state.showMenu,store.getters.permission_routes)
    const menuTree = await dispatch('getMenuTree',path);
    const accessRoutes = await dispatch('permission/generateRoutes', menuTree,{ root: true })
    router.addRoutes(accessRoutes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
