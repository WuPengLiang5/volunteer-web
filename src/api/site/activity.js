import request from '@/utils/axios'

let url_prefix = "/api/v1.0/out"

export function fetchActivityList(query) {
  return request({
    method:"post",
    url: url_prefix + "/activity/listActivities",
    data: query,
  })
}

export function fetchActivity(params) {
  return request({
    method: "get",
    url: url_prefix + "/activity/getActivityById",
    params:params
  })
}
