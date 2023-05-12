import request from '@/utils/axios'
import qs from 'qs'

export function fetchActivityList(query) {
  return request({
    method:"post",
    url:"/activity/common/listActivities",
    data: query,
  })
}

export function fetchActivity(params) {
  return request({
    method: "get",
    url: "/activity/common/getActivityById",
    params:params
  })
}

export function createActivity(data) {
  return request({
    method: "post",
    url: "/activity/saveActivity",
    data: data
  })
}

export function updateActivity(data) {
  return request({
    method: "put",
    url: "/activity/updateActivity",
    data: data
  })
}

export function deleteActivity(data){
  return request({
    method:'post',
    url:'/activity/delActivity',
    data: data
  })
}

export function delBatchActivities(data){
  return request({
    url: '/activity/delBatchActivities',
    method: 'post',
    data: data
  })
}

export function fetchActivityCount() {
  return request({
    method: "get",
    url: "/activity/getActivityCount",
  })
}
