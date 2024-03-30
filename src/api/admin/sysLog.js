import request from '@/utils/axios'
import qs from 'qs'

export function fetchSysLogList(data) {
  return request({
    method:"post",
    url:"/sysLog/listSysLogsByPage",
    data: data,
  })
}

export function fetchSysLog(params) {
  return request({
    method: "get",
    url: "/sysLog/getSysLogById",
    params:params
  })
}

export function createSysLog(data) {
  return request({
    method: "put",
    url: "/sysLog/saveSysLog",
    data: data
  })
}

export function updateSysLog(data) {
  return request({
    method: "post",
    url: "/sysLog/updateSysLog",
    data: data
  })
}

export function deleteSysLog(data){
  return request({
    method:'post',
    url:'/sysLog/delSysLog',
    data: qs.stringify(data)
  })
}

export function delBatchSysLog(data){
  return request({
    url: '/sysLog/delBatchSysLog',
    method: 'post',
    data: data
  })
}

// export function fetchSysLogCount() {
//   return request({
//     method: "get",
//     url: "/SysLog/getSysLogCount",
//   })
// }
