import request from "@/utils/axios";

let url_prefix = "/api/v1.0/out"

export function fetchNews(params) {
  return request({
    method: "get",
    url: url_prefix + "/news/getNewsDetails",
    params:params
  })
}

export function fetchNewsByType(data) {
  return request({
    method: "post",
    url: url_prefix + "/news/getNewsByType",
    data:data
  })
}
