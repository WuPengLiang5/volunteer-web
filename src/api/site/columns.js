import request from "@/utils/axios";

let url_prefix = "/api/v1.0/out"

export function columnsById(data) {
  return request({
    method: "post",
    url: url_prefix + "/columns/columnsById",
    data:data
  })
}

export function newsById(data) {
  return request({
    method: "post",
    url: url_prefix + "/columns/newsById",
    data:data
  })
}

export function listWebColumns() {
  return request({
    method: "get",
    url: url_prefix + "/columns/listWebColumns",
  })
}

export function getIndexesNewsList() {
  return request({
    method: "get",
    url: url_prefix + "/getIndexesNewsList",
  })
}
