import request from "@/utils/axios";
import qs from 'qs'

export function fetchDurationList(query) {
  return request({
    method:"post",
    url:"/durationInfo/getList",
    data: query,
  })
}

export function fetchDurationListByUserId(query) {
  return request({
    method:"post",
    url:"/durationInfo/getListByUserId",
    data: query,
  })
}

export function fetchInputDurationOfVolunteer(query) {
  return request({
    method:"post",
    url:"/durationInfo/getInputDurationOfVolunteer",
    data: query,
  })
}

export function createDurationInfo(data) {
  return request({
    method: "post",
    url: "/durationInfo/saveDurationInfo",
    data: data
  })
}

export function createDurationInfoByGroup(data) {
  return request({
    method: "post",
    url: "/durationInfo/saveDurationInfoByGroup",
    data: data
  })
}

export function deleteDurationInfo(data){
  return request({
    method:'post',
    url:'/durationInfo/delDurationInfo',
    data: qs.stringify(data)
  })
}

export function delBatchDurationInfos(data){
  return request({
    url: '/durationInfo/delBatchDurationInfos',
    method: 'post',
    data: data
  })
}

export function examineDuration(data){
  return request({
    url: '/durationInfo/examineDuration',
    method: 'post',
    data: data
  })
}
