import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = []
const whiteList = [
  '/site/login', '/admin/login',"/site/home",
  "/site/register","/site/user/userLayout","/site/activity",
  "/site/activityDetail","/404","/site/news/voluntaryStyle"] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  const isAdmin = to.path.includes("admin");
  // console.log(isAdmin)
  store.commit("settings/SET_SYSTEM_TYPE",!isAdmin?"onstage":"backstage")

  // set page title
  // document.title = getPageTitle(to.meta.title)

  let hasToken;
  if (isAdmin){
    hasToken = store.getters.adminInfo && localStorage.getItem('adminInfo') ? store.getters.adminInfo.token: null
  }else {
    hasToken = store.getters.userInfo && localStorage.getItem('userInfo') ? store.getters.userInfo.token: null
  }

  // console.log(store)
  // console.log(store.getters,isAdmin, store.getters.userInfo)

  // 判断是否为后台登录
  if(isAdmin){
    if (hasToken){
      if (to.path === '/admin/login') {
        next({ path: '/admin' })
        NProgress.done()
      } else {
        const hasRole = store.getters.role
        // console.log("1",from.path)
        if (hasRole) {
          if (from.path === '/admin/login'){
            Message.success("登录成功")
          }
          next()
        } else {
          // console.log("has")
          try {
            const roleId = store.getters.adminInfo?store.getters.adminInfo.roleId:null
            const role = await store.dispatch("user/getRole",roleId)
            // console.log(role)

            const menuTree = await store.dispatch('user/getMenuTree',to.path);
            console.log("menuUrlList",menuTree)

            // generate accessible routes map based on roles
            const accessRoutes = await store.dispatch('permission/generateRoutes', menuTree)

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          } catch (error) {
            console.log(error)
            await store.dispatch('user/resetToken')
            next(`/admin/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    }else {
      if (to.path !== '/admin/login'){
        next(`/admin/login?redirect=${to.path}`)
        NProgress.done()
      }else {
        next()
      }
    }
  } else{
    if (hasToken){
      if (to.path === '/site/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        next()
      }
    } else{
      console.log("users",hasToken)

      // 判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
      if (to.matched.length === 0) {
        next('/404')
      }
      if (to.meta && to.meta.requiresAuth){
        Message.error("登录过期，请登录")
        next({path:'/login'})
        NProgress.done()
      }else {
        next()
      }
    }
  }

  // if (hasToken) {
  //   // 判断是否为后台登录
  //   if(isAdmin){
  //     if (to.path === '/admin/login') {
  //       next({ path: '/admin' })
  //       NProgress.done()
  //     } else {
  //       const hasRole = store.getters.role
  //       // console.log("1",from.path)
  //       if (hasRole) {
  //           if (from.path === '/admin/login'){
  //             Message.success("登录成功")
  //           }
  //           next()
  //       } else {
  //         // console.log("has")
  //         try {
  //           const roleId = store.getters.adminInfo?store.getters.adminInfo.roleId:null
  //           const role = await store.dispatch("user/getRole",roleId)
  //           // console.log(role)
  //
  //           const menuTree = await store.dispatch('user/getMenuTree',to.path);
  //           console.log("menuUrlList",menuTree)
  //
  //           // generate accessible routes map based on roles
  //           const accessRoutes = await store.dispatch('permission/generateRoutes', menuTree)
  //
  //           // dynamically add accessible routes
  //           router.addRoutes(accessRoutes)
  //
  //           // hack method to ensure that addRoutes is complete
  //           // set the replace: true, so the navigation will not leave a history record
  //           next({ ...to, replace: true })
  //         } catch (error) {
  //           console.log(error)
  //           await store.dispatch('user/resetToken')
  //           next(`/admin/login?redirect=${to.path}`)
  //           NProgress.done()
  //         }
  //       }
  //     }
  //   }
  //   else{
  //     // router.addRoutes(constantRoutes)
  //     console.log('to.path',to,to.path)
  //     console.log(router)
  //     if (to.path === '/site/login') {
  //       // if is logged in, redirect to the home page
  //       next({ path: '/' })
  //       NProgress.done()
  //     }else if (!whiteList.includes(to.path)){
  //       next()
  //     }else {
  //       next({path:'/404'})
  //       NProgress.done()
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //   if (!whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     if (isAdmin){
  //       next(`/admin/login?redirect=${to.path}`)
  //       NProgress.done()
  //     }else{
  //       // other pages that do not have permission to access are redirected to the login page.
  //       next(`/site/login?redirect=${to.path}`)
  //       NProgress.done()
  //     }
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
