<template>
    <div class="c-err-body">
        <div class="c-font-mix">
            <span class="c-tranlate1">4</span>
            <span>0</span>
            <span class="c-tranlate2">4</span>
            <div>
                <el-button  type="primary" round @click="goBack">返回上一页</el-button>
                <el-button type="primary" round @click="goHome">返回登陆页</el-button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'errPage',
    data() {
        return {
            name: '返回上一页'
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        goHome() {
            this.$router.push({path:'/login'})
        }
    }
}
</script>

<style scoped lang="scss">
    .c-err-body {
        width:100vw;
        height: 100vh;
        background: skyblue;
        .c-font-mix {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -100px;
            width: 300px;
            text-align: center;
            font-size: 80px;
            color: #fff;
            span {
                display: inline-block;
            }
            .c-tranlate1 {
                transform: rotateZ(-24deg);
                margin-right: 20px;
            }
            .c-tranlate2 {
                margin-left: 20px;
                transform: rotateZ(24deg);
            }
        }
    }


</style>
