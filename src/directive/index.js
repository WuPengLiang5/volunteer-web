import Vue from 'vue'
import store from "@/store";

/**权限指令**/
const has = Vue.directive('has', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding, vnode) {
    // 获取页面按钮权限
    let btnPermissions = [];

    // console.log(binding)
    if (binding.value) {
      // 如果指令传值，获取指令参数，根据指令参数和当前登录人按钮权限做比较。
      btnPermissions = binding.value;
      // console.log(btnPermissions, '这里是指令绑定的参数')
    } else {
      // 用不到------------------
      btnPermissions = vnode.context.$route.meta.perms;
      // console.log(btnPermissions)
    }
    if (!Vue.prototype.$_has(btnPermissions)) {
      // el.parentNode.removeChild(el);
      el.style.display = 'none'
    }
  }
});

// 权限检查方法
Vue.prototype.$_has = function (value) {
  let isExist = false;
  let btnPermissionsStr = store.getters.hasButtonPerm;
  // console.log(value,btnPermissionsStr)
  if (btnPermissionsStr === undefined || btnPermissionsStr == null) {
    return false;
  }

  if (btnPermissionsStr.includes(value)){
    isExist = true
  }

  // let res = value.filter(x => {
  //   return btnPermissionsStr.includes(x)
  // })
  //
  // if (res.length > 0){
  //   isExist = true
  // }

  // console.log(isExist)
  return isExist;
};

export {has}
