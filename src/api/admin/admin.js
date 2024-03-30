import request from '@/utils/axios'
import qs from 'qs'

export function fetchAdminList(query) {
  return request({
    url: '/admin/listAdmins',
    method: 'post',
    data:query
  })
}

export function fetchAdmin(id) {
  return request({
    url: '/admin/getAdminById',
    method: 'get',
    params: { id }
  })
}

export function fetchAdminProfile(id) {
  return request({
    url: '/admin/getAdminProfile',
    method: 'get',
    params: { id }
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/saveAdmin',
    method: 'post',
    data: data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admin/updateAdmin',
    method: 'put',
    data: data
  })
}

export function deleteAdmin(data){
  return request({
    url: '/admin/removeAdmin',
    method: 'post',
    data:qs.stringify(data)
  })
}

export function fetchAdminCount() {
  return request({
    method: "get",
    url: "/admin/getAdminCount",
  })
}
export function updatePassword(data){
  return request({
    method: "put",
    url: "/admin/updatePassword",
    data: qs.stringify(data)
  })
}
