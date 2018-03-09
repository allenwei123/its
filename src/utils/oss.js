import http from './request';
import store from '@/store';

function createData(info,file) {
    let fileKey = 'web1' + store.getters.uid + info.bucket + Date.parse(new Date());
    // 组装发送数据
    var request = new FormData();
    request.append("OSSAccessKeyId", info.accessid);//Bucket 拥有者的Access Key Id。
    request.append("policy", info.policyBase64);//policy规定了请求的表单域的合法性
    request.append("Signature", info.signature);//根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
    //---以上都是阿里的认证策略 
    request.append("key", fileKey);//文件名字，可设置路径
    request.append("success_action_status", '200');// 让服务端返回200,不然，默认会返回204
    request.append('file', file);//需要上传的文件 file
}


export function send(file) {
    let info = JSON.parse(window.localStorage.getItem('uploadInfo'));
    let now = Date.parse(new Date()) / 1000;
    if(info.expire < now + 3) {
        http.get("/oss/bit-test/policy")
            .then(res => {
                if(!res.errorCode) {
                    window.localStorage.setItem('uploadInfo',JSON.stringify(res.data));
                    send();
                }
            })
    }else {
        let data = createData(info,file);
        // http.post(host, data).then(res => {
        //     return res
        // })
    }
}

//选自https://www.cnblogs.com/mottled/p/6979536.html