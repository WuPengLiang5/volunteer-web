import Vue from 'vue'
import Router from 'vue-router'

// 解决路由中点击路径重复
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)}

Vue.use(Router)

import AdminLayout from '@/views/admin/layout/index'
import Container from '@/views/site/layout/Container'
import fa from "element-ui/src/locale/lang/fa";

export const constantRoutes = [
  {
    path: "/",
    redirect: {
      name:"Home",
    }
  },
  {
    path:'/',
    name:'Container',
    redirect: "/site/home",
    component: Container,
    meta:{requiresAuth:false,title:'前台网页展示'},
    children:[
      {
        path:'/site/login',
        name:'Login',
        component:()=> import('@/views/site/common/Login'),
        meta:{requiresAuth:false,title:'用户登录'},
      },
      {
        path:'/site/register',
        name:'Register',
        component:()=> import('@/views/site/common/Register'),
        meta:{requiresAuth:false,title:'用户注册'},
      },
      {
        path:'/site/home',
        name:'Home',
        component: ()=> import('@/views/site/home/Home'),
        meta:{requiresAuth:false,title:'首页'},
      },
      {
        path:'/site/activity',
        name:'Activity',
        component: ()=> import('@/views/site/activity/index'),
        meta:{requiresAuth:false,title:'志愿活动'},
      },
      {
        path:'/site/activityDetail',
        name:'ActivityDetail',
        component: ()=> import('@/views/site/activity/ActivityDetail'),
        meta:{requiresAuth:false,title:'志愿活动详情'},
      },
      {
        path:'/site/news/voluntaryStyle/:menuId',
        name:'VoluntaryStyle',
        component: ()=> import('@/views/site/news/VolunteerStyle'),
        meta:{requiresAuth:false,title:'志愿风采'},
      },
      {
        path:'/site/news/volunteerStyleNews/:id',
        name:'VoluntaryStyle:Volunteer,Activity',
        component: ()=> import('@/views/site/news/VolunteerStyleNews'),
        meta:{requiresAuth:false,title:'志愿风采详情'},
      },
      {
        path:'/site/news/announcement',
        name:'Announcement',
        component: ()=> import('@/views/site/news/Announcement'),
        meta:{requiresAuth:false,title:'通知公告'},
      },
      {
        path:'/site/news/information',
        name:'NewsInformation',
        component: ()=> import('@/views/site/news/NewsInformation'),
        meta:{requiresAuth:false,title:'新闻资讯'},
      },
      {
        path:'/site/newsInfo/:id(\\d+)',
        name:'NewsInfo',
        component: ()=> import('@/views/site/news/NewsInfo'),
        meta:{requiresAuth:false,title:'新闻详情'},
      },
      {
        path:'/site/user/userLayout',
        name:'UserLayout',
        redirect:'/site/user/userLayout/home',
        component:()=> import('@/views/site/userCenter/index'),
        meta:{requiresAuth:true,title:'用户模块'},
        children: [
          {
            path: '/site/user/userLayout/home',
            name:'CenterHome',
            component:()=> import('@/views/site/userCenter/home/MyHome'),
            meta:{requiresAuth: true,title:'我的首页'},
          },
          {
            path: '/site/user/userLayout/personal',
            name:'CenterPersonal',
            component:()=> import('@/views/site/userCenter/personal/index'),
            // redirect:'/site/user/userLayout/userInfo',
            meta:{requiresAuth: true,title:'修改资料'},
            // children:[
            //   {
            //     path: '/site/user/userLayout/userInfo',
            //     name:'PersonalData',
            //     component:()=> import('@/views/site/userLayout/center/UserInfo'),
            //     meta:{requiresAuth: true,title:'基本资料'},
            //   },
            //   {
            //     path: '/site/user/userLayout/updatePassword',
            //     name:'PersonalUpPsd',
            //     component:()=> import('@/views/site/userLayout/center/components/UpdatePassword'),
            //     meta:{requiresAuth: true,title:'修改密码'},
            //   },
            //   {
            //     path: '/site/user/userLayout/updateAvatar',
            //     name:'PersonalAvatar',
            //     component:()=> import('@/views/site/userLayout/center/components/UpdateAvatar'),
            //     meta:{requiresAuth: true,title:'更换头像'},
            //   }
            // ]
          },
          {
            path: '/site/user/userLayout/activity',
            name:'VolunteerActivity',
            component:()=> import('@/views/site/userCenter/activity/MyActivity'),
            meta:{requiresAuth: true,title:'我的活动'},
          },
          {
            path: '/site/user/userLayout/duration',
            name:'VolunteerDuration',
            component:()=> import('@/views/site/userCenter/duration/Duration'),
            meta:{requiresAuth: true,title:'志愿时长'},
          },
        ]
      },
    ]
  },
  {
    path:"/admin",
    redirect: "/admin/home",
    component:AdminLayout,
    children: [
      {
        path:'/admin/home',
        component:()=> import('@/views/admin/home/index'),
        name:'AdminHome',
        meta:{
          requiresAuth:true,
          title:'首页',
          affix:true,
          icon:'el-icon-menu'
        }
      }
    ]
  },
  {
    path:'/admin/login',
    name:'AdminLogin',
    component:()=> import('@/views/admin/login/index'),
    hidden: true
  },
  {
    path: "/admin/profile",
    component: AdminLayout,
    redirect: "noRedirect",
    name: "Profile",
    hidden: true,
    children: [
      {
        path:'updatePassword',
        component:()=> import('@/views/admin/profile/UpdatePassword'),
        name:'AdminUpdatePassWord',
        meta:{requiresAuth:true,title:'修改密码'}
      },
      {
        path:'userInfo',
        component:()=> import('@/views/admin/profile/UserInfo'),
        name:'AdminUserInfo',
        meta:{requiresAuth:true,title:'个人信息'}
      },
    ]
  },
  { path: '/404', component: () => import('@/views/error-page/404'), hidden: true },
]

// export const asyncRoutes = [
//   {
//     path: '/admin/permission',
//     component: AdminLayout,
//     redirect: '/admin/permission/role',
//     alwaysShow: true, // will always show the root menu
//     name: 'Permission',
//     meta: {
//       title: '权限管理',
//       icon: 'iconfont icon-jiaosequanxian',
//     },
//     children: [
//       {
//         path: '/admin/permission/role',
//         component: () => import('@/views/admin/permission/role'),
//         name: 'RolePermission',
//         meta: {
//           title: '角色管理',
//         }
//       },
//       {
//         path:'/admin/menuList',
//         component:()=> import('@/views/admin/menu/index'),
//         name:'AdminMenu',
//         meta:{
//           title:'菜单管理',
//           affix:true,
//           icon:'el-icon-menu'
//         }
//       }
//     ]
//   },
//
//   {
//     path: '/admin/user',
//     component: AdminLayout,
//     name: 'UserManager',
//     redirect: '/admin/user/list',
//     children: [
//       {
//         path: '/admin/user/list',
//         component: () => import('@/views/admin/admin/list'),
//         meta: {
//           title: "用户管理",
//           icon: "iconfont icon-zhiyuanzheguanli"
//         },
//       }
//     ]
//   },
//
//   {
//     path: '/admin/sysLog',
//     component: AdminLayout,
//     name: 'SysLogManager',
//     redirect: '/admin/sysLog/list',
//     children: [
//       {
//         path: 'list',
//         component: () => import('@/views/admin/sysLog/sysLog'),
//         name: 'SysLogManager',
//         meta: {
//           title: "操作日志",
//           icon: "iconfont icon-zhiyuanzheguanli"
//         },
//       }
//     ]
//   },
//
//   {
//     path: '/admin/volunteer',
//     component: AdminLayout,
//     redirect: '/admin/volunteer/list',
//     name: 'VolunteerManager',
//     meta: {
//       title: "志愿者管理",
//       icon: "iconfont icon-zhiyuanzheguanli"
//     },
//     children: [
//       {
//         path: '/admin/volunteer/create',
//         component: () => import('@/views/admin/volunteer/create'),
//         name: 'CreateVolunteer',
//         meta: {requiresAuth: true, title: '新增志愿者'}
//       },
//       {
//         path:'/admin/volunteer/edit',
//         component:()=> import('@/views/admin/volunteer/edit'),
//         name:'EditVolunteer',
//         meta:{requiresAuth:true,title:'编辑志愿者'},
//         hidden: true
//       },
//       {
//         path: '/admin/volunteer/list',
//         component: () => import('@/views/admin/volunteer/list'),
//         name: 'VolunteerList',
//         meta: { requiresAuth:true,title: '志愿者列表'}
//       }
//     ]
//   },
//   {
//     path:"/admin/activity",
//     component:AdminLayout,
//     redirect:'/admin/activity/list',
//     name:'ActivityManager',
//     meta: {
//       requiresAuth: true,
//       title: '活动管理',
//       icon: 'iconfont icon-huodongguanli'
//     },
//     children:[
//       {
//         path: '/admin/activity/create',
//         component: () => import('@/views/admin/activity/create'),
//         name: 'CreateActivity',
//         meta: { title: '新增活动'}
//       },
//       {
//         path: '/admin/activity/edit',
//         component: () => import('@/views/admin/activity/edit'),
//         name: 'EditActivity',
//         meta: { title: '编辑活动', noCache: true,},
//         hidden: true
//       },
//       {
//         path: '/admin/activity/list',
//         component: () => import('@/views/admin/activity/list'),
//         name: 'ActivityList',
//         meta: { title: '活动列表'}
//       }
//     ]
//   },
//   {
//     path:'/admin/signup',
//     component:AdminLayout,
//     redirect: '/admin/signup/list',
//     name: 'SignUpManager',
//     children: [
//       {
//         path: 'list',
//         component: () => import('@/views/admin/signup/index'),
//         name: 'SignUpManager',
//         meta: {
//           title:'报名信息管理',
//           icon: 'iconfont icon-xinwenguanlixitong-xinwenguanli'
//         },
//       }
//     ]
//   },
//   {
//     path:'/admin/news',
//     component:AdminLayout,
//     redirect: '/admin/news/list',
//     name: 'NewsManager',
//     alwaysShow: true,
//     meta:{
//       requiresAuth:true,
//       title:'新闻管理',
//       icon: 'iconfont icon-xinwenguanlixitong-xinwenguanli'
//     },
//     children: [
//       {
//         path:'/admin/news/create',
//         component:()=> import('@/views/admin/news/create'),
//         name:'CreateNews',
//         meta:{requiresAuth:true,title:'发布新闻'}
//       },
//       {
//         path: '/admin/news/edit',
//         component: () => import('@/views/admin/news/edit'),
//         name: 'EditNews',
//         meta: { title: '编辑新闻',noCache: true,},
//         hidden: true
//       },
//       {
//         path:'/admin/news/list',
//         component:()=> import('@/views/admin/news/list'),
//         name:'AdminNewsList',
//         meta:{requiresAuth:true,title:'新闻列表'}
//       },
//     ]
//   }
// ]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
