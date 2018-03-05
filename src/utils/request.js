import axios from 'axios';
import store from '@/store';
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
    return res.data;
  }, error => {
    return Promise.reject(error)
  }
)

export default service;
