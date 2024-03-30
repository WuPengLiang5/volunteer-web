import request from "@/utils/axios";

let url_prefix = "/api/v1.0/out"

export function fetchVolunteerMap() {
  return request({
    method: "get",
    url: url_prefix + "/volunteer//getVolunteerMap",
  })
}
