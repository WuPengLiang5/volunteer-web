import request from '@/utils/axios'

export function fetchRoleList(query) {
  return request({
    url: '/admin/role/listRoles',
    method: 'post',
    data:query
  })
}

export function fetchRole(id) {
  return request({
    url: '/admin/role/getRoleById',
    method: 'get',
    params: { id }
  })
}

export function createRole(data) {
  return request({
    url: '/admin/role/saveRole',
    method: 'post',
    data:data
  })
}

export function updateRole(data) {
  return request({
    url: '/admin/role/updateRole',
    method: 'put',
    data:data
  })
}

export function deleteRole(data){
  return request({
    url: '/admin/role/removeRole',
    method: 'post',
    data:data
  })
}
