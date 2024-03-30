import request from "@/utils/axios";

export function uploadFile(data){
  return request({
    method: "post",
    url: "/upload/uploadFile",
    data: data
  })
}
