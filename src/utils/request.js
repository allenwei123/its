import axios from 'axios';
import store from '@/store';
import { Message } from 'element-ui'
let service = axios.create({
  baseURL: '/api', // api的base_url
  timeout: 5000 // request timeout
});

service.interceptors.request.use(config => {
  config.headers['OS'] = '3';
  config.headers['OS-VERSION'] = '3';
  config.headers['DEVICE-ID'] = 'h5';
  config.headers['DEVICE-TYPE'] = 'h5';
  config.headers['PUSH-ID'] = '10086';
  config.headers['CLIENT'] = '1002';
  config.headers['Content-Type'] = 'application/json';

  // token
  if (store.getters.token) {
    config.headers['BIT-TOKEN'] = store.getters.token
  }

  // uid
  if (store.getters.uid) {
    config.headers['BIT-UID'] = store.getters.uid
  }

  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

service.interceptors.response.use(
  res => {
    if(res.data.errorCode == 9050001) {
      store.dispatch('changeToken',null);
      Message({message:'登录已过期,请您重新登录',type:'error'})
    }else if(res.data.errorCode !== 0) {
      Message({message:res.data.errorMsg,type:'error'})
    }
    return res.data;
  }, error => {
    Message({message:'链接错误,请检查你的网络',type:'error'})
    return Promise.reject(error)
  }
)

export default service;
