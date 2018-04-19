<template>
  <el-dialog title="新增故障" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="故障类型：" prop="faultItem">
        <el-select v-model="form.faultItem"  placeholder="故障类型">
          <el-option label="公共-水电燃气" value="1"></el-option>
          <el-option label="公共-房屋结构" value="2"></el-option>
          <el-option label="公共-电梯" value="10"></el-option>
          <el-option label="公共-消防安防" value="3"></el-option>
          <el-option label="公共-门禁" value="11"></el-option>
          <el-option label="公共-其它" value="99"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障楼栋：" prop="buildingId">
        <el-select v-model="form.buildingId" placeholder="全部楼栋" clearable>
          <el-option v-for="item in buildingOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障地址：" label-width="120px" prop="faultAddress">
        <el-input v-model="form.faultAddress" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="故障描述：" prop="faultContent">
        <el-input type="textarea" v-model="form.faultContent" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="申报人：" label-width="120px" prop="userName">
        <el-input v-model="form.userName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系方式：" label-width="120px" prop="contact">
        <el-input v-model.number="form.contact" auto-complete="off"></el-input>
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
        buildingOptions: [],
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
          communityId: this.$store.getters.communityId
        },
        rules: {
          faultItem: [{required: true, message: '请输入故障类型', trigger: 'blur'}],
          buildingId: [{required: true, message: '请选择故障楼栋', trigger: 'blur'}],
          faultAddress: [{ required: true, message: '请输入故障地址', trigger: 'blur' }],
          faultContent: [{ required: true, message: '请描述故障', trigger: 'blur' }],
          userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          contact: [{ type: "number", required: true, message: '请填写联系方式', trigger: 'blur' }],
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
      getBuilding(){
        let url = 'community/building/list';
        this.$xttp.get('community/building/list',{params:{communityId:this.form.communityId}})
        .then(res => {
          if(res.success){
            this.buildingOptions = res.data;
          }
        })
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
      this.getBuilding();
    }
  }
</script>

<style scoped>

</style>
