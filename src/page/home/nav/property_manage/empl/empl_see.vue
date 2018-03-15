<template>
    <el-dialog title="社区档案详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">姓名:</span> <span class="c-content"> {{ data.name }} </span></li>
            <li v-if="data.role == 0" class="c-list"><span class="c-label">当前角色:</span> <span class="c-content"> 超级管理员 </span></li>
            <li v-if="data.role == 1" class="c-list"><span class="c-label">当前角色:</span> <span class="c-content"> 社区管理员 </span></li>
            <li v-if="data.role == 2" class="c-list"><span class="c-label">当前角色:</span> <span class="c-content"> 小区管理员 </span></li>
            <li v-if="data.male == 0" class="c-list"><span class="c-label">性别:</span> <span class="c-content"> 女 </span></li>
            <li v-if="data.male == 1" class="c-list"><span class="c-label">性别:</span> <span class="c-content"> 男 </span></li>
            <li class="c-list"><span class="c-label">手机号:</span> <span class="c-content"> {{ data.phone }} </span></li>
            <li class="c-list"><span class="c-label">创建时间:</span> <span class="c-content"> {{ data.time }} </span></li>
            <li class="c-list"><span class="c-label">员工ID:</span> <span class="c-content"> {{ data.emp_id }} </span></li>
            <li v-if="data.usestate == 0" class="c-list"><span class="c-label">使用状态:</span> <span class="c-content"> 已禁用 </span></li>
            <li v-if="data.usestate == 1" class="c-list"><span class="c-label">使用状态:</span> <span class="c-content"> 启动 </span></li>
        </ul>  
    </el-dialog>
</template>

<script>
export default {
  name: "EmplSee",
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