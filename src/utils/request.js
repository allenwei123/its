import axios from 'axios';
import store from '@/store';
import { Message } from 'element-ui'
import { env,currentEnv } from './config.js';
let current = currentEnv();

let service = axios.create({
  baseURL: env[current].api,
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

  //获取配置接口需要多加BIT_CID
  if(/(\/community\/config)$/.test(config.url)) {
    config.headers['BIT-CID'] = store.getters.communityId;
  }
  // token
  if (store.getters.token) {
    config.headers['BIT-TOKEN'] = store.getters.token
  }

  // uid
  if (store.getters.uid) {
    config.headers['BIT-UID'] = store.getters.uid
  }
  //communityId --社区ID
  if( store.getters.communityId) {
    config.headers['BIT-CID'] = store.getters.communityId
  }
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(
  res => {
    if (res.data) {
      if(res.data.errorCode === 9050001) {
        store.dispatch('changeToken',null);
        // Message({message:'登录已过期,请您重新登录',type:'error'})
        this.$router.push('/auth/login');
      }else if(res.data.errorCode !== 0) {
        Message({message:res.data.errorMsg,type:'error'})
      }
    }

    return res.data || res;
  }, error => {
    Message({message:'链接错误,请联系管理员',type:'error'})
    return Promise.reject(error)
  }
)

export default service;
