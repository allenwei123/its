<template>
    <el-dialog title="查看权限" :visible.sync="msg" width="600px" :before-close="handleClose">
        <span><b>权限范围：</b></span>
        <ul style="margin-left:30px;">
            <li class="c-list" v-for="(item,index) in roomInfo" :key="index" style="margin:5px;">{{item}}</li>
        </ul>
    </el-dialog>
</template>

<script>
export default {
  name: "ChargeSee",
  data() {
    return {
        arr:[1,2,4,5],
        roomInfo: []
    }
  },
  props: ["msg","data"],
  created(){
      this.roomInfo = this.data.roomName;
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
        margin-left: 40px;
        // .c-label {
        //     display: inline-block;
        //     width: 100px;
        //     text-align:right;
        // }
        // .c-content {
        //     display: inline-block;
        //     margin-left: 15px;
        //     font-weight: bold;
        // }
    }
</style>