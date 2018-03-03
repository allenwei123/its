<template>
    <div class="home">
        <h1>ISP 智能网页</h1>
        <ul>
            <li v-for="item in dataArr" v-bind:key="item.id" v-text="item.name"></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            dataArr: [
                {id:0,name:'数据一',age:12},
                {id:1,name:'数据二',age:13},
                {id:2,name:'数据三',age:14}
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
    $fontColor: #f4f;
    .home {
        background:#f4f4f4;
        li {
            list-style: none;
            color:$fontColor;
        }
    }
</style>

