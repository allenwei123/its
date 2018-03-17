<template>
    <el-dialog title="班次详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">岗位:</span> <span class="c-content"> {{ data.postCode | postCode}} </span></li>
            <li class="c-list"><span class="c-label">班次:</span> <span class="c-content"> {{ data.name }} </span></li>
            <li class="c-list"><span class="c-label">值班时间:</span> <span class="c-content"> {{ data.attendTime }} - {{ data.offTime }} </span></li>
             <li class="c-list"><span class="c-label">备注信息:</span> <span class="c-content"> {{ data.remark }}</span></li>
        </ul>  
    </el-dialog>
</template>

<script>
export default {
  name: "ClassSee",
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