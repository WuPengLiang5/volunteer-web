const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  // introduction: state => state.user.introduction,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes,
  // errorLogs: state => state.errorLog.logs
  userInfo:state => state.user.userInfo,
  adminInfo: state => state.user.adminInfo,
  currentBackground:state => state.settings.currentBackground,
  systemType: state => state.settings.systemType,
  allMenu: state => state.user.allMenu,
  hasMenu: state => state.user.hasMenu,
  showMenu: state => state.user.showMenu,
  hasButtonPerm: state => state.user.hasButtonPerm,
  allButtonPerm: state => state.user.allButtonPerm,
}
export default getters
