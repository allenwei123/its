<template>
  <el-dialog title="新增监控" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="data"   label-width="120px">
      <el-form-item label="监控：" prop="faultItem" class="c-must">
        <el-input  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属楼栋：" label-width="120px" class="c-must">
        <el-select v-model="form.building" placeholder="请选择楼栋">
          <el-option v-for="item in buildingOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="厂商：" label-width="120px" class="c-must" >
        <el-input  auto-complete="off"></el-input>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="型号：" label-width="120px" class="c-must" >
        <el-input  auto-complete="off"></el-input>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="设备编号：" label-width="120px" class="c-must" >
        <el-input  auto-complete="off"></el-input>
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
              buildingOptions: [],
                data: {},
                value: '',
                makeAt: '',
                form:{
                  building: ''
                }
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
            // console.log(this.data);
            // this.makeAt = this.getTime(this.data.makeAt, 'yyyy-MM-dd HH:mm');
        },
        props: ['msg'],
    }
    
</script>

<style scoped lang="scss">

</style>
