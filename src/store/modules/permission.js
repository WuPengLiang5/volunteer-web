import { asyncRoutes, constantRoutes } from '@/router'
import AdminLayout from '@/views/admin/layout/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasBtnPermission(menuTree) {
  // console.log(menuTree)
  menuTree.filter(x => {
    return x.type !== 2
  })
}

function filterAdminRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.path.includes("admin")) {
      if (tmp.children) {
        tmp.children = filterAdminRoutes(tmp.children)
      }
      res.push(tmp)
    }
  })

  return res
}

// export function filterAsyncRoutes(routes, menuTree) {
//   const res = []
//   // console.log(routes,menuTree)
//
//   routes.forEach(route => {
//     const tmp = {...route}
//     menuTree.forEach(item => {
//       // console.log('item',item,item.url)
//       // forEach
//       // break----用return false;
//       // continue --用return true;
//       if (!item.path){
//         return true
//       }
//       if (item.path.includes(tmp.path)){
//         if (item.children && item.children.length > 0) {
//           if (hasBtnPermission(item.children)){
//             // console.log(hasBtnPermission(item.children))
//             tmp.children = filterAsyncRoutes(tmp.children, hasBtnPermission(item.children))
//           }
//         }
//         res.push(tmp)
//       }
//     })
//   })
//
//   res.push({ path: '*', redirect: '/404', hidden: true })
//   return res
// }

export function filterAsyncRoutes(menuTree,meta){
  // console.log(menuTree)
  return menuTree.filter(route => {
    // console.log(route)
    if (route.type === 2){
      return false
    }
    if (route.title) {
      route.meta = {title:route.title};
      delete route.title
    }
    if (route.icon) {
      // 默认图标处理
      route.meta = Object.assign(route.meta,{icon:route.icon ? route.icon : ""});
      delete route.icon
    }
    if (route.perms) {
      route.meta = Object.assign(route.meta,{perms:route.perms});
      delete route.perms
    }

    if (route.hidden === 0){
      route.hidden = false
    }else{
      route.hidden = true
    }
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'AdminLayout') {
        route.component = AdminLayout;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children,route.meta);
    }
    return true;
  });
}

export const loadView = (view) => { // 路由懒加载
  // 路由懒加载
  return () => import(`@/views/${view}`);
};

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = filterAdminRoutes(constantRoutes).concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, menuTree) {
    return new Promise(resolve => {
      // 每个用户进入都要判断权限
      // let accessedRoutes = filterAsyncRoutes(asyncRoutes, menuTree)

      let accessedRoutes = filterAsyncRoutes(menuTree)
      console.log("accessedRoutes",accessedRoutes)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
