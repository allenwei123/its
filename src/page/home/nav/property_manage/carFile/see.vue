<template>
    <el-dialog title="车辆档案详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">车牌号:</span> <span class="c-content"> {{ data.carNo }} </span></li>
            <li class="c-list"><span class="c-label">用户ID:</span> <span class="c-content"> {{ data.userId }} </span></li>
            <li class="c-list"><span class="c-label">车辆型号:</span> <span class="c-content"> {{ data.carType }} </span></li>
            <li class="c-list"><span class="c-label">车辆型号名称:</span> <span class="c-content"> {{ data.carTypeName }} </span></li>
            <li class="c-list"><span class="c-label">车辆颜色:</span> <span class="c-content"> {{ data.carColor }} </span></li>
            <li class="c-list"><span class="c-label">行驶证:</span> <span class="c-content"> {{ data.drivingPermit }} </span></li>
            <li class="c-list"><span class="c-label">行驶证照片:</span> <span class="c-content"> {{ data.drivingPermitPicUrl }} </span></li>
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