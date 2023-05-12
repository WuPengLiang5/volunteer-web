import request from '@/utils/axios'
import qs from 'qs'

export function fetchVolunteerList(query) {
  return request({
    url: '/volunteer/listVolunteers',
    method: 'post',
    data:query
  })
}

export function fetchVolunteer(id) {
  return request({
    url: '/volunteer/getVolunteerById',
    method: 'get',
    params: { id }
  })
}

export function createVolunteer(data) {
  return request({
    url: '/volunteer/saveVolunteer',
    method: 'post',
    data: data
  })
}

export function updateVolunteer(data) {
  return request({
    url: '/volunteer/updateVolunteer',
    method: 'put',
    data: data
  })
}

export function deleteVolunteer(data){
  return request({
    url: '/volunteer/removeVolunteer',
    method: 'post',
    data:qs.stringify(data)
  })
}

export function delBatchVolunteers(data){
  return request({
    url: '/volunteer/delBatchVolunteers',
    method: 'post',
    data:data
  })
}

export function fetchVolunteerCount() {
  return request({
    method: "get",
    url: "/volunteer/getVolunteerCount",
  })
}

export function fetchVolunteerMap() {
  return request({
    method: "get",
    url: "/volunteer/common/getVolunteerMap",
  })
}

export function fetchVolunteerInfo(userId) {
  return request({
    method: "get",
    url: "/volunteer/getVolunteerInfoByUid",
    params:{userId:userId}
  })
}
