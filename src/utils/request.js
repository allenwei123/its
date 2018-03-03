import axios from 'axios';
let service = axios.create({
  baseURL: '/api', // api的base_url
  timeout: 5000 // request timeout
});

service.interceptors.request.use(config => {
  // Do something before request is sent
  // if (store.getters.token) {
  //   config.headers['token'] = getToken()
  // }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

service.interceptors.response.use(
  res => {
    return res.data;
  }, err => {
    return Promise.reject(error)
  }
)

export default service;
