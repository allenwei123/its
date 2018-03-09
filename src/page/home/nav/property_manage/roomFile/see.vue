<template>
    <el-dialog title="社区档案详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">房间名称:</span> <span class="c-content"> {{ data.name }} </span></li>
            <li class="c-list"><span class="c-label">房间编号:</span> <span class="c-content"> {{ data.code }} </span></li>
            <li class="c-list"><span class="c-label">房间楼层:</span> <span class="c-content"> {{ data.floorNo }} </span></li>
            <li class="c-list"><span class="c-label">楼层号:</span> <span class="c-content"> {{ data.floorCode }} </span></li>
            <li class="c-list"><span class="c-label">创建时间:</span> <span class="c-content"> {{ data.createAt | time }} </span></li>
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
  created(){},
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