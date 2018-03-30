<template>
    <el-dialog title="车库档案详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">车库名称：</span> <span class="c-content"> {{ data.carportName }} </span></li>
            <li class="c-list"><span class="c-label">车位数量：</span> <span class="c-content"> {{ data.carNum }} </span></li>
            <li class="c-list"><span class="c-label">具体地址：</span> <span class="c-content"> {{ data.address }} </span></li>
            <li class="c-list"><span class="c-label">关联楼栋：</span> <span class="c-content"> {{ data.linkBuild }} </span></li>
        </ul>  
    </el-dialog>
</template>

<script>
export default {
  name: "carFileSee",
  data() {
    return {
        arr:[1,2,4,5]
    }
  },
  props: ["msg","data"],
  created(){
  },
  methods:{
      handleClose() {
        this.$emit("upsee", false );
      }
  }
}
</script>

<style lang="scss" scoped>
    .c-list {
        margin-bottom: 15px;
        .c-label {
            display: inline-block;
            width: 100px;
            text-align:right;
        }
        .c-content {
            display: inline-block;
            margin-left: 15px;
            font-weight: bold;
        }
    }
</style>