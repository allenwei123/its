<template>
    <el-dialog title="卡片详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">卡编号:</span> <span class="c-content"> {{ data.keyNo }} </span></li>
            <li class="c-list"><span class="c-label">用户名:</span> <span class="c-content"> {{ data.name }} </span></li>
            <li class="c-list"><span class="c-label">卡片类型:</span> <span class="c-content"> {{ data.keyType | card }} </span></li>
            <li class="c-list"><span class="c-label">社区名称:</span> <span class="c-content"> {{ $store.getters.communityName }} </span></li>
            <li class="c-list"><span class="c-label">住房信息:</span> <span class="c-content"> {{ data.roomName }} </span></li>
        </ul>  
    </el-dialog>
</template>

<script>
export default {
  name: "ChargeSee",
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