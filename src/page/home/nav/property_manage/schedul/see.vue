<template>
    <el-dialog title="排班详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">员工:</span> <span class="c-content"> {{ data.userName }} </span></li>
            <li class="c-list"><span class="c-label">班次:</span> <span class="c-content"> {{ data.className }} </span></li>
            <li class="c-list"><span class="c-label">角色:</span> <span class="c-content"> {{ data.postCode | postCode }} </span></li>
            <li class="c-list"><span class="c-label">创建时间:</span> <span class="c-content"> {{ data.updateAt | time('yyyy-MM-dd HH:mm:ss') }} </span></li>
            <li class="c-list"><span class="c-label">使用状态:</span> <span class="c-content"> {{ data.dataStatus | dataStatus }} </span></li>
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