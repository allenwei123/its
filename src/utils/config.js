//定义全局环境
export const env =  {
    dev:{  // 开发环境
        api: 'http://dev.apismcm.bitiot.com.cn/v1',
        bucket: 'bit-test'
    },
    prod: {  //生产
        api: 'https://api.smcm.bitiot.com.cn/v1',
        bucket: 'bit-smcm-img'
    },
    test:{  //测试
        api: 'http://apismcm.test.bitiot.com.cn/v1',
        bucket: 'bit-test'
    }
}
export function currentEnv() {
    return 'dev'// 'prod'
}