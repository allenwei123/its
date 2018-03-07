import http from '../utils/request';

export function communityId(name) {
    let obj = name ? {name} : {};
    return http.post('/community/list', obj).then(res => {
        if(!res.errorCode) {
            return res.data;
        }else {
            return {msg: '请联系开发人员'}
        }
    }).catch(err => {
        return {code:1,msg:'温馨提示：网络有问题!!'}
    })
}
