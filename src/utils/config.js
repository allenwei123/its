//定义全局环境
export const env =  {
    dev:{
        api: 'http://apismcm.test.bitiot.com.cn/v1',
        bucket: 'bit-test'
    },
    prod: {
        api: 'https://api.smcm.bitiot.com.cn/v1',
        bucket: 'oss-cn-beijing'
    }
}
export function currentEnv() {
    return 'dev'// 'prod'
}