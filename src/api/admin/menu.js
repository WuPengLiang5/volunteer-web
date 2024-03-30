import request from '@/utils/axios'
import qs from 'qs'

export function fetchMenus() {
  return request({
    method:"get",
    url:"/admin/menu/getAllMenuTree",
  })
}

export function fetchMenuByRoleId(data) {
  return request({
    method:"post",
    url:"/admin/menu/getMenuByRoleId",
    data:qs.stringify(data)
  })
}

export function fetchMenu(params) {
  return request({
    method: "get",
    url: "/admin/menu/getMenuById",
    params:params
  })
}

export function createMenu(data) {
  return request({
    method: "post",
    url: "/admin/menu/saveMenu",
    data: data
  })
}

export function updateMenu(data) {
  return request({
    method: "put",
    url: "/admin/menu/updateMenu",
    data: data
  })
}

export function deleteMenu(data){
  return request({
    method:'post',
    url:'/admin/menu/delMenu',
    data: qs.stringify(data)
  })
}
