import request from '@/utils/axios'
import qs from 'qs'

export function fetchNewsList(data) {
  return request({
    method:"post",
    url:"/news/listNews",
    data: data,
  })
}

export function fetchNews(params) {
  return request({
    method: "get",
    url: "/news/getNewsById",
    params:params
  })
}

export function createNews(data) {
  return request({
    method: "post",
    url: "/news/saveNews",
    data: data
  })
}

export function updateNews(data) {
  return request({
    method: "put",
    url: "/news/updateNews",
    data: data
  })
}

export function deleteNews(data){
  return request({
    method:'post',
    url:'/news/delNews',
    data: qs.stringify(data)
  })
}

export function delBatchNews(data){
  return request({
    url: '/news/delBatchNews',
    method: 'post',
    data: data
  })
}

export function fetchNewsCount() {
  return request({
    method: "get",
    url: "/news/getNewsCount",
  })
}
