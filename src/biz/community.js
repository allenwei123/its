import http from '../utils/request';

let communityId = function (name) {
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
let toName = function () {
    let arr = arguments[0];
    let id = arguments[1];
    if(!id)return;
    for (let i = 0; i< arr.length;i++) {
        var item = arr[i];
        if(item.id == id) {
            return item.name;
        }
    }
}
export {
    communityId,
    toName
}