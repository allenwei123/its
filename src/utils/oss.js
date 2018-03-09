import http from './request';
import store from '@/store';

function createData(info,file) {
    let fileKey = 'web1' + store.getters.uid + info.bucket + Date.parse(new Date()) + file.name.substr(file.name.lastIndexOf('.'));
    // 组装发送数据
    console.log(info);
    var request = new FormData();
    request.append("OSSAccessKeyId", info.accessid);//Bucket 拥有者的Access Key Id。
    request.append("policy", info.policy);//policy规定了请求的表单域的合法性
    request.append("signature", info.signature);//根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
    //---以上都是阿里的认证策略 
    request.append("key", 'user-dir/' + fileKey);//文件名字，可设置路径
    request.append("success_action_status", '200');// 让服务端返回200,不然，默认会返回204
    request.append('file', file);//需要上传的文件 file
    request.append('Filename', 'user-dir/' + fileKey);
    return request;
}


export function send(file) {
    let info = JSON.parse(window.localStorage.getItem('uploadInfo'));
    let now = Date.parse(new Date()) / 1000;
    if(info.expire < now + 3) {
        http.get("/oss/bit-test/policy")
            .then(res => {
                if(!res.errorCode) {
                    window.localStorage.setItem('uploadInfo',JSON.stringify(res.data));
                    send(file);
                }
            })
    }else {
        let data = createData(info,file);
        // return data;
        http.post(info.host, data).then(res => {
            console.log(res)
        })
    }
}

//选自https://www.cnblogs.com/mottled/p/6979536.html