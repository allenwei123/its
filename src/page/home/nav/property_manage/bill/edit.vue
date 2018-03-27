<template>
  <el-dialog title="编辑账单" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="data"   label-width="120px">
      <el-form-item label="账单日期" prop="faultItem" >
        <el-input v-model="makeAt" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="楼栋房号" label-width="120px" prop="faultAddress" >
        <el-input v-model="data.roomLocation" auto-complete="off"></el-input>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="住房面积" label-width="120px" prop="userName" >
        <el-input  auto-complete="off"></el-input>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="管理费" label-width="120px" prop="userName" >
        <el-input  auto-complete="off"></el-input>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="卫生费" label-width="120px" prop="userName" >
        <el-input  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="其它" label-width="120px" prop="userName" >
        <el-input  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="账单总额" label-width="120px" prop="contact" >
        <el-input  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="faultContent">
        <el-input type="textarea"  :rows="5"></el-input>
      </el-form-item> 

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>    
  </el-dialog>
</template>

<script>
import time from "@/utils/time.js";
    export default {
        data() {
            return {
                value: '',
                makeAt: '',
            }
        },
        methods: {
            handleClose() {
                this.$emit('change');
            },
            submitForm() {
                
            },
            getTime(timestamp, format) {
                if (timestamp == null) return "/";
                return time.timestampToFormat(timestamp, format);
            }

        },
        created() {
            console.log(this.data);
            this.makeAt = this.getTime(this.data.makeAt, 'yyyy-MM-dd HH:mm');
        },
        props: ['msg', 'data'],
    }
    
</script>

<style scoped lang="scss">

</style>
