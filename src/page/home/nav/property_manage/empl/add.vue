<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">

          <el-form-item label="工号：" :label-width="formLabelWidth" prop="employeeId" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.employeeId" placeholder="请输入工号"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
            <el-radio-group v-model="form.postCode">
              <el-radio :label="item.key" :value="item.name" v-bind:disabled="postDis" :key="item.name" v-for="(item) in postCodeOptions">{{item.name}}</el-radio>
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
              <el-input v-model.trim="form.phone" v-bind:disabled="phoneDis" placeholder="请输入手机号"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="性别：" :label-width="formLabelWidth" prop="sex" class="c-must">
            <el-select v-model="form.sex" value-key="key" placeholder="请选择">
              <el-option v-for="item in maleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          
          <el-form-item label="密码：" :label-width="formLabelWidth" prop="password" class="c-must">
            <el-col :span="10">
              <el-input v-model.trim="form.password" type="password" v-bind:disabled ="dis" placeholder="请输入密码"></el-input>
              <el-checkbox v-if="resetPass" v-bind:checked="ck" v-model="checked" @change="changeChecked">重置密码</el-checkbox>
            </el-col>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth">
            <el-button @click="handleClose">取 消</el-button>
            <!-- <el-button type="primary" @click="save('ruleForm')">保存</el-button> -->
            <el-button type="primary" @click="save()">保存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import fun from "@/utils/fun.js";
const maleOptions = [
  { value: '0', label: '未知' },
  { value: '1', label: '男' },
  { value: '2', label: '女' }
];
export default {
  name: "EmplAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'添加员工',
      checked: false,
      resetPass: false,
      dis: false,
      phoneDis: false,
      postDis: false,
      ck: false,
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
      },
      rules: {
        employeeId: [{required: true, message: '请输入工号', trigger: 'blur' }],
        userName: [{required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入正确号码', trigger: 'blur', pattern: /^1[34578]\d{9}$/}],
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
      this.dis = true;
      this.phoneDis = true;
      this.postDis = true;
      this.required = false;
      this.ck = false;
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
    showInfo(text) {
      this.$message({
        message: text,
        type: "warning"
      });
    },
    changeChecked(){
      if(this.ck){
        this.form.password = '';
        this.ck = false;
        this.dis = true;
      }else{
        this.ck = true;
        this.form.password = '';
        this.dis = false;
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
    save() {
      if(this.form.employeeId == ''){
        this.showInfo('请输入工号');
        return;
      }
      if(this.form.userName == ''){
        this.showInfo('请输入名称');
        return;
      }
      if(this.form.phone == ''){
        this.showInfo('请输入正确号码');
        return;
      }else{
        if(!(/^1[34578]\d{9}$/.test(this.form.phone))){
          this.showInfo('请输入正确号码');
          return;
        }
      }
      if(this.form.postCode == ''){
        this.showInfo('请选择岗位');
        return;
      }
      if(this.form.sex == '男'){
        this.form.sex = '1';
      } 
      if(this.form.sex == '女'){
        this.form.sex = '2';
      }
      if(this.form.sex == '未知'){
        this.form.sex = '0';
      } 
      // if(this.form.sex == ''){
      //   this.showInfo('请选择性别');
      //   return;
      // }else{
      //   if(this.form.sex == '男'){
      //     this.form.sex = 1;
      //   }
      //   if(this.form.sex == '女'){
      //     this.form.sex == 2;
      //   }
      //   if(this.form.sex == '未知'){
      //     this.form.sex = 0;
      //   }
      // }
      console.log(this.form.sex+"sssss");
      this.postData();
      // this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       this.postData();
      //     } else {
      //       return false;
      //     }
      //   });
    },
    postData() {
      let msg = this.add ? '编辑' : '添加';
      let uri = this.add ? '/user/property/update-user' : '/user/property/create-user';
      console.log(this.form)
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


