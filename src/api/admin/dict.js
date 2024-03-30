import request from '@/utils/axios'
import qs from 'qs'

export function fetchDictListByPage(query) {
  return request({
    method:"post",
    url:"/dict/listDictByPage",
    data: query,
  })
}

export function fetchDictByType(params) {
  return request({
    method: "get",
    url: "/dict/listDictByType",
    params:params
  })
}

export function fetchDictType() {
  return request({
    method: "get",
    url: "/dict/listDictType",
  })
}

export function createDict(data) {
  return request({
    method: "post",
    url: "/dict/saveDict",
    data: data
  })
}

export function updateDict(data) {
  return request({
    method: "put",
    url: "/dict/updateDict",
    data: data
  })
}

export function updateDictType(data) {
  return request({
    method: "put",
    url: "/dict/updateDictType",
    data: data
  })
}

export function deleteDict(data){
  return request({
    method:'post',
    url:'/dict/delDict',
    data: qs.stringify(data)
  })
}
