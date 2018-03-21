<template>
  <el-dialog title="新增故障" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="故障类型" prop="faultItem" required>
        <el-select v-model="form.faultItem"  placeholder="故障类型">
          <el-option label="公共-电梯" value="10"></el-option>
          <el-option label="公共-门禁" value="11"></el-option>
          <el-option label="公共-其他" value="99"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障地址" label-width="120px" prop="faultAddress" required>
        <el-input v-model="form.faultAddress" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="故障描述" prop="faultContent" required>
        <el-input type="textarea" v-model="form.faultContent" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="申报人" label-width="120px" prop="userName" required>
        <el-input v-model="form.userName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" label-width="120px" prop="contact" required>
        <el-input v-model="form.contact" auto-complete="off"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        communityList: [],
        form: {
          faultAddress: '',
          faultType: '2',
          // obj: '',
          faultContent: '',
          contact: '',
          userName: '',
          faultItem: '',
          // roomId: '',
          buildingId: '',
          communityId: '5a82adf3b06c97e0cd6c0f3d',
        },
        rules: {
          faultItem: [{required: true, message: '请输入故障类型', trigger: 'blur'}],
          faultAddress: [{ required: true, message: '请输入故障地址', trigger: 'blur' }],
          faultContent: [{ required: true, message: '请描述故障', trigger: 'blur' }],
          userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          contact: [{ required: true, message: '请填写联系方式', trigger: 'blur' }],
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.postData();
            } else {
              return false;
            }
        });
      },
      handleClose() {
        this.$emit("upsee", false );
      },
      postData() {
        let url = `property/fault/addFault`;
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
    props: ['msg'],
    created() {

    }
  }
</script>

<style scoped>

</style>
