//定义全局环境
export const env =  {
    dev:{
        api: 'http://dev.apismcm.bitiot.com.cn/v1',
        bucket: 'bit-test'
    },
    prod: {
        api: 'https://api.smcm.bitiot.com.cn/v1',
        bucket: 'bit-smcm-img'
    }
}
export function currentEnv() {
    return 'dev'// 'prod'
}