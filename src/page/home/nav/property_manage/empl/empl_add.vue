<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="name" class="c-must">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>

            <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone" class="c-must">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>

            <!-- <el-form-item label="岗位" :label-width="formLabelWidth" prop="role" class="c-must">
              <el-radio-group v-model="form.postCode">
                <el-radio :label="item.name" :value="item.key" :key="item.key" v-for="(item,index) in postCodeOptions"></el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="岗位" :label-width="formLabelWidth" prop="postCode" class="c-must">
              <el-radio-group v-model="form.postCode">
                <el-radio :label="item.name" :value="item.key" :key="index" v-for="(item,index) in postCodeOptions"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="性别" :label-width="formLabelWidth" prop="male" class="c-must">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option v-for="item in maleOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="设置密码" :label-width="formLabelWidth" prop="pwd" class="c-must">
              <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import scheduleList from '@/mock/scheduleList'

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
      form: {
        userName: "",
        phone: "",
        postCode: '保安',
        sex:'',
        password: '',
        communityId: this.$store.getters.communityId,
        communityName: this.$store.getters.communityName,
        propertyId: '5a82adf3b06c97e0cd6c0f3d',
        propertyName:'和谐景苑'
      },
      rules: {
        userName: [{required: true, message: '请输入名称', trigger: 'blur'}],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur,change' }],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
      postCodeOptions: [],
      maleOptions: maleOptions,
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg","add"],
  created() {
    this.initRole();
    if(this.add){//判断此时组件为 编辑
      this.form = this.add;
      this.titleFont = '编辑员工';
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
    },
    initRole(){
      let communityId = scheduleList[0].communityId
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
      console.log(this.form)
      console.log(this.uri)
      return;
      this.$xttp
        .post( uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "社区成功",
              type: "success"
            });
            this.current =  2;
            this.handleClose();
          }else {
            this.$message({message:res.data.errorMsg,type:'error'});
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


