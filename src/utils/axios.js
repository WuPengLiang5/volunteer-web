import axios from "axios";
import {Message} from "element-ui";
import router from "../router";
import store from "../store";

axios.defaults.timeout = 10000

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断

    let systemType = store.getters.systemType
    // console.log(systemType)
    let token
    if(systemType === "backstage"){
      // console.log("admin")
      token = store.getters.adminInfo?store.getters.adminInfo.token:null
    }else{
      // console.log("user")
      token = store.getters.userInfo?store.getters.userInfo.token:null
    }

    // console.log(path,systemType,token)
    token && (config.headers.token = token);
    return config;
  },
  error => {
    return Promise.error(error);
  })

//响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status && response.status === 200 && response.data.code !== 200) {
      Message({
        type:"error",
        message:response.data.msg
      })

      console.log('response',response)
      if (response.data.code === 401 || response.data.code === 401001){
        // console.log(response)
        let systemType = store.getters.systemType
        if(systemType === "backstage"){
          store.dispatch("user/logout","admin")
          router.push("/admin/login")
        }else{
          store.dispatch("user/logout","user")
          router.push("/")
        }
      }

    }
    return response;
  },
  // 服务器状态码不是200的情况
  error => {
    console.log(error)
    if (error.response.status === 504 || error.response.status === 404) {
      Message.error({message: "没有找到服务，请确认请求地址是否正确"})
    } else if( error.response.status === 403) {
      Message.error({message: "权限不足"})
    } else if(error.response.status === 401){
      Message.error({message: "尚未登录，请登录"})
      router.push("/")
    } else {
      Message.error({message: "未知错误"})
    }
  })

export default axios
