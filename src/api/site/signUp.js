import request from "@/utils/axios";

let url_prefix = "/api/v1.0/out"

export function fetchSignUpByActivityId(query) {
  return request({
    method: "post",
    url: url_prefix + "/signup/getSignUpByActivityId",
    data:query
  })
}

export function fetchSignUpByAIdAndUId(params) {
  return request({
    method: "get",
    url: url_prefix + "/signup/getSignUpByAIdAndUId",
    params:params
  })
}
