import request from '@/utils/request.js'

export default {
    //登陆
    login: params => request.post('/user/signIn', params ),
    
}
