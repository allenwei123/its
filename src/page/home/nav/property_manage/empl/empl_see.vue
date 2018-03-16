<template>
    <el-dialog title="社区档案详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">姓名:</span> <span class="c-content"> {{ data.userName }} </span></li>
            <li class="c-list"><span class="c-label">社区名称:</span> <span class="c-content"> {{ data.communityName }} </span></li>
            <li class="c-list"><span class="c-label">物业公司:</span> <span class="c-content"> {{ data.propertyName }} </span></li>
            <li class="c-list"><span class="c-label">姓名:</span> <span class="c-content"> {{ data.userName }} </span></li>
            <li v-if="data.postCode == 'MANAGER'" class="c-list"><span class="c-label">岗位:</span> <span class="c-content"> 物业管理员 </span></li>
            <li v-if="data.postCode == 'SECURITY'" class="c-list"><span class="c-label">岗位:</span> <span class="c-content"> 保安 </span></li>
            <li v-if="data.postCode == 'CLEANER'" class="c-list"><span class="c-label">岗位:</span> <span class="c-content"> 保洁 </span></li>
            <li v-if="data.postCode == 'SERVICEMAN'" class="c-list"><span class="c-label">岗位:</span> <span class="c-content"> 维修工 </span></li>
            <li v-if="data.postCode == 'SUPPORTSTAFF'" class="c-list"><span class="c-label">岗位:</span> <span class="c-content"> 客服人员 </span></li>
            <li v-if="data.sex == 0" class="c-list"><span class="c-label">性别:</span> <span class="c-content"> 女 </span></li>
            <li v-if="data.sex == 1" class="c-list"><span class="c-label">性别:</span> <span class="c-content"> 男 </span></li>
            <li class="c-list"><span class="c-label">手机号:</span> <span class="c-content"> {{ data.phone }} </span></li>
            <li class="c-list"><span class="c-label">创建时间:</span> <span class="c-content"> {{ data.createAt | time('yyyy-MM-dd HH:mm') }} </span></li>
            <li class="c-list"><span class="c-label">员工ID:</span> <span class="c-content"> {{ data.userId }} </span></li>
            <li v-if="data.dataStatus == 0" class="c-list"><span class="c-label">使用状态:</span> <span class="c-content"> 无效 </span></li>
            <li v-if="data.dataStatus == 1" class="c-list"><span class="c-label">使用状态:</span> <span class="c-content"> 有效 </span></li>
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