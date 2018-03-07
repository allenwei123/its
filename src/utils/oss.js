import axios from 'axios';

send_request = function () {//这是从后台获取认证策略等信息。
    let uri = arguments[0] + "/v1/oss/sts-token";
    axios.get(uri).then(res=> {
        return res
    })
};

function get_signature()//读取获得的参数
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    　　now = timestamp = Date.parse(new Date()) / 1000;
    　　if (expire < now + 3) 　　{
        　　　　body = send_request();
        　　　　var obj = eval("(" + body + ")");
        　　　　host = obj['host']
        　　　　policyBase64 = obj['policy']
        　　　　accessid = obj['accessid']
        　　　　signature = obj['signature']
        　　　　expire = parseInt(obj['expire'])
        　　　　callbackbody = obj['callback']
        　　　　key = obj['dir']
        　　　　return true;
    　　}
    　　return false;
};

//组装发送数据
var request = new FormData(); 
request.append("OSSAccessKeyId",accessid);//Bucket 拥有者的Access Key Id。
request.append("policy",policyBase64);//policy规定了请求的表单域的合法性
request.append("Signature",signature);//根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
//---以上都是阿里的认证策略 
request.append("key",g_object_name);//文件名字，可设置路径
request.append("success_action_status",'200');// 让服务端返回200,不然，默认会返回204
request.append('file', file);//需要上传的文件 file  

request.append("callback",callbackbody);//回调，非必选，可以在policy中自定义

function send(){
    axios.post(host,request).then(res => {
        return res
    })
} 
//         url : host,  //上传阿里地址
//         data : request,
//         processData: false,//默认true，设置为 false，不需要进行序列化处理
//         cache: false,//设置为false将不会从浏览器缓存中加载请求信息
//         async: false,//发送同步请求
//         contentType: false,//避免服务器不能正常解析文件---------具体的可以查下这些参数的含义
//         dataType: 'JSONP',//不涉及跨域  写json即可
//    　　 type : 'post'

//选自https://www.cnblogs.com/mottled/p/6979536.html