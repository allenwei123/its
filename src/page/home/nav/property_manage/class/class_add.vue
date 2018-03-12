<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="岗位：" :label-width="formLabelWidth" prop="role" class="c-must">
              <el-select v-model="form.role" placeholder="roleOptions">
                <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="班次：" :label-width="formLabelWidth" prop="class" class="c-must">
              <el-input v-model="form.class"></el-input>
            </el-form-item>

            <el-form-item label="值班时间：" :label-width="formLabelWidth" class="c-must">
              <el-time-select placeholder="起始时间" v-model="form.attendTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }">
              </el-time-select>
              ---
              <el-time-select placeholder="结束时间" v-model="form.offTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30',
                  minTime: form.attendTime
                }">
              </el-time-select>
            </el-form-item>

            <el-form-item label="备注：" :label-width="formLabelWidth" prop="note" class="c-must">
              <el-input v-model="form.note"></el-input>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
const roleOptions = [
    { key: '0', value: '物业'},
    { key: '1', value: '保安'},
    { key: '2', value: '保洁'},
    { key: '3', value: '水电'}
];

const maleOptions = [
  { key: '0', value: '女' },
  { key: '1', value: '男' }
];
export default {
  name: "ClassAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'添加班次',
      form: {
        role: 0,
        class: '',
        attendTime: '',
        offTime: '',
        note: ''
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        pwd:[{required: true, message: '请输入密码', trigger: 'blur'} ]
      },
      roleOptions: roleOptions,
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg","add"],
  created() {
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
      let uri = this.add ? '/community/edit' : '/community/add';
      this.$xttp
        .post( uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "班次成功",
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


