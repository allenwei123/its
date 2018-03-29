<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">

          <el-form-item label="工号：" :label-width="formLabelWidth" prop="employeeId" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.employeeId" placeholder="请输入工号"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
            <el-radio-group v-model="form.postCode">
              <el-radio :label="item.key" :value="item.name" :key="item.name" v-for="(item) in postCodeOptions">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <!-- <el-form-item label="姓名" :label-width="formLabelWidth" prop="userName" class="c-must">
            <el-input v-model="form.userName"></el-input>
          </el-form-item> -->

          <el-form-item label="姓名：" :label-width="formLabelWidth" prop="userName" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.userName" placeholder="请输入姓名"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="手机号码：" :label-width="formLabelWidth" prop="phone" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.phone"  placeholder="请输入手机号"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="性别：" :label-width="formLabelWidth" prop="sex" class="c-must">
            <el-select v-model="form.sex" value-key="key" placeholder="请选择">
              <el-option v-for="item in maleOptions" :key="item.key" :label="item.value" :value="item.key">{{item.value}}</el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="密码：" :label-width="formLabelWidth" prop="password" class="c-must">
            <el-col :span="10">
              <el-input v-model.trim="form.password" type="password" v-bind:disabled ="disabled" placeholder="请输入密码"></el-input>
              <el-checkbox v-if="resetPass" v-model="checked" @change="changeChecked">重置密码</el-checkbox>
            </el-col>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="save('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
const maleOptions = [
  { key: '0', value: '未知' },
  { key: '1', value: '男' },
  { key: '2', value: '女' }
];
export default {
  name: "EmplAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'添加员工',
      checked: false,
      resetPass: false,
      disabled: false,
      required: false,
      message: '请输入密码',
      form: {
        employeeId: '',
        userName: "",
        phone: "",
        postCode: '',
        sex:'',
        checked: true,
        password: '',
        communityId: this.$store.getters.communityId,
        communityName: this.$store.getters.communityName,
        propertyId: localStorage.getItem('propertyId')
        // propertyName:'和谐景苑'
      },
      rules: {
        employeeId: [{required: true, message: '请输入工号', trigger: 'blur' }],
        userName: [{required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        // password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        postCode: [{ required: true, message: '请选择岗位', trigger: 'blur' }]
      },
      postCodeOptions: [],
      maleOptions: maleOptions,
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg","add"],
  created() {
    this.initPost();
    if(this.add){//判断此时组件为 编辑
      this.form = this.add;
      console.log(this.form);
      this.resetPass = true;
      this.titleFont = '编辑员工';
      this.disabled = true;
      this.required = false;
      if(this.add.sex == 1){
        this.form.sex = '男';
      } if(this.add.sex == 2){
        this.form.sex = '女'
      } if(this.add.sex == 0 || this.add.sex == null){
        this.form.sex = '未知'
      }
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
    },
    changeChecked(){
      if(this.form.checked){
        this.form.password = '';
        this.form.checked = false;
        this.disabled = false;
      }else{
        this.form.checked = true;
        this.form.password = '';
        this.disabled = true;
      }
    },
    initPost(){
      let communityId = this.$store.getters.communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postCodeOptions = res.data;
        }
      })
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postData();
          } else {
            return false;
          }
        });
    },
    postData() {
      let msg = this.add ? '编辑' : '添加';
      let uri = this.add ? '/community/edit' : '/user/property/create-user';
      this.$xttp
        .post( uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "员工成功",
              type: "success"
            });
            this.current =  2;
            this.handleClose();
            this.$emit('reload');
          }else {
            this.$message({message:res.errorMsg,type:'error'});
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


