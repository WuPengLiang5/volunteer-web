import request from "@/utils/axios";
import qs from 'qs'

export function fetchSignUpListByPage(query) {
  return request({
    method:"post",
    url:"/signup/listSignUpByPage",
    data: query,
  })
}

export function fetchSignUpById(params) {
  return request({
    method: "get",
    url: "/signup/getSignUpById",
    params:params
  })
}

export function fetchSignUpByActivityId(params) {
  return request({
    method: "get",
    url: "/signup/common/getSignUpByActivityId",
    params:params
  })
}

export function fetchSignUpByAIdAndUId(params) {
  return request({
    method: "get",
    url: "/signup/common/getSignUpByAIdAndUId",
    params:params
  })
}

export function createSignUp(data) {
  return request({
    method: "post",
    url: "/signup/saveSignUp",
    data: data
  })
}

export function updateSignUp(data) {
  return request({
    method: "put",
    url: "/signup/updateSignUp",
    data: data
  })
}

export function deleteSignUp(data){
  return request({
    method:'post',
    url:'/signup/delSignUp',
    data: qs.stringify(data)
  })
}

export function delBatchSignUps(data){
  return request({
    url: '/signup/delBatchSignUp',
    method: 'post',
    data: data
  })
}
