<template>
  <el-dialog title="新增门禁" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm"   label-width="120px">
      <el-form-item label="门禁" prop="name" required>
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属楼栋" prop="buildingId" label-width="120px" required>
        <el-select v-model="form.buildingId" placeholder="全部楼栋" clearable>
          <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="厂商" prop="brandNo" label-width="120px" required>
        <el-select v-model="form.brandNo" placeholder="品牌" clearable>
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="型号" prop="deviceType" label-width="120px" required>
        <el-input v-model="form.deviceType" auto-complete="off"></el-input>
      </el-form-item>
      <!-- 暂无 -->
      <el-form-item label="设备编号" prop="deviceCode" label-width="120px" required>
        <el-input v-model="form.deviceCode" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>    
  </el-dialog>
</template>

<script>
import time from "@/utils/time.js";
    export default {
        data() {
            return {
                form: {
                  name: "",
                  buildingId: '',
                  brand: "",
                  deviceType: '',
                  deviceId: '',
                  communityId: this.$store.getters.communityId,
                },
                rules: {
                  name: [{required: true, message: '请输入门禁', trigger: 'blur'}],
                  buildingId: [{ required: true, message: '请选择楼栋', trigger: 'blur' }],
                  brandNo: [{ required: true, message: '请输入厂商', trigger: 'blur' }],
                  deviceType: [{ required: true, message: '请输入型号', trigger: 'blur' }],
                  deviceCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                },
                data: {},
                value: '',
                makeAt: '',
                options3: [],
                options: [{
                  id:1,
                  name:'米立'
                },{
                  id:2,
                  name:'康途'
                },{
                  id:3,
                  name:'金博'
                }],
            }
        },
        methods: {
            handleClose() {
                this.$emit('change');
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      this.postData();
                    } else {
                      return false;
                    }
                });
            },
            getTime(timestamp, format) {
                if (timestamp == null) return "/";
                return time.timestampToFormat(timestamp, format);
            },
            getFloorList() {//获取社区对应的楼栋
                this.$xttp.get('community/building/list',{params:{communityId:this.communityId}})
                  .then(res => {
                    if(!res.errorCode) {
                      this.options3 = res.data;
                    }
                })
            },
            postData() {
              let url = `communityIoT/door/add`;
              this.$xttp
                .post(url, this.form)
                .then(res => {
                  if (res.errorCode === 0) {
                    this.$message({
                      message: "新增成功",
                      type: "success"
                    });
                    this.handleClose();
                    this.$emit('addSuccess');
                  }else {
                    this.$message({message:res.data.errorMsg,type:'error'});
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }

        },
        created() {
          this.getFloorList();
        },
        props: ['msg'],
    }
    
</script>

<style scoped lang="scss">

</style>
