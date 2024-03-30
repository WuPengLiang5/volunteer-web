import request from "@/utils/axios";
import qs from 'qs'

export function updatePassword(data){
  return request({
    method: "put",
    url: "/user/updatePassword",
    data: qs.stringify(data)
  })
}

export function updateAvatar(data){
  return request({
    method: "post",
    url: "/user/updateAvatar",
    data: data
  })
}

export function updateUserInfo(data){
  return request({
    method: "post",
    url: "/user/updateUserInfo",
    data: data
  })
}

export function fetchUserInfo(){
  return request({
    method: "get",
    url: "/user/getUserInfo",
  })
}
