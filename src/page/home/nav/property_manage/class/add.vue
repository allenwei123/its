<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item v-if="show" label="社区ID:" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-input v-model="form.communityId"></el-input>
            </el-form-item>
            <el-form-item v-if="show" label="物业ID:" :label-width="formLabelWidth" prop="propertyId" class="c-must">
              <el-input v-model="form.propertyId"></el-input>
            </el-form-item>
            <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
              <el-select v-model="form.postCode" placeholder="postOptions">
                <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="班次：" :label-width="formLabelWidth" prop="name" class="c-must">
              <el-col :span="14">
                <el-input v-model.trim="form.name" placeholder="请输入班次"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item v-if="show" label="班次类型：" :label-width="formLabelWidth" prop="type" class="c-must">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option v-for="item in typeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="出勤地点：" :label-width="formLabelWidth" prop="attendPlace">
              <el-col :span="14">
                <el-input v-model.trim="form.attendPlace" placeholder="请输入出勤地点"></el-input>
              </el-col>
            </el-form-item>

            <!-- <el-form-item label="出勤地点：" :label-width="formLabelWidth" prop="attendPlace">
              <el-input v-model="form.attendPlace"></el-input>
            </el-form-item> -->
            <el-form-item label="出勤时间：" :label-width="formLabelWidth" class="c-must">
              <el-time-select placeholder="出勤时间" v-model="form.attendTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00'
                }">
              </el-time-select>
            </el-form-item>

            <el-form-item label="退勤地点：" :label-width="formLabelWidth" prop="offPlace">
              <el-col :span="14">
                <el-input v-model.trim="form.offPlace" placeholder="请输入退勤地点"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="退勤时间：" :label-width="formLabelWidth" class="c-must">
              <el-time-select placeholder="退勤时间" v-model="form.offTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00'
                }">
              </el-time-select>
            </el-form-item>

            <el-form-item label="任务：" :label-width="formLabelWidth" prop="task">
              <el-col :span="14">
                <el-input v-model.trim="form.task" placeholder="请输入任务"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
              <el-col :span="14">
                <el-input type="textarea" :rows="2" v-model.trim="form.remark" placeholder="请输入备注"></el-input>
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
const typeOptions = [
  { key: '1', value: '轮班' },
  { key: '2', value: '长班' }
];
export default {
  name: "ClassAdd",
  isShow: false,
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'添加班次',
      show: false,
      form: {
        postCode: 'SECURITY',
        name: '',
        type: '1',
        attendPlace: '',
        attendTime: '',
        offPlace: '',
        offTime: '',
        task: '',
        remark: '',
        communityId: this.$store.getters.communityId,
        propertyId : localStorage.getItem('propertyId')
      },
      rules: {
        name: [{required: true, message: '请输入班次', trigger: 'blur'}],
        attendTime: [{ required: true, message: '请选择起始时间', trigger: 'blur' }],
        offTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      },
      postOptions: [],
      current: 1, //1 初始 2：添加后 3：编辑后
      typeOptions: typeOptions
    };
  },
  props: ["msg","add"],
  created() {
    this.initRole()
    if(this.add){  //判断此时组件为编辑
    this.form = this.add;
    this.titleFont = '编辑班次';
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
    find(){
      var postCode = this.formInline.role;
      let communityId = this.$store.getters.communityId
      this.$xttp.post('/task/class/page',{params:{communityId:communityId,postCode:postCode}})
                .then(res => {
                  if(!res.errorCode) {
                    this.tableData = res.data.records;
                  }
                  this.loading = false;
                }).catch(err =>{
                  this.loading = false;
                })
      
    },
    postData() {
      let msg = this.add ? '编辑' : '添加';
      let uri = this.add ? '/task/class/edit' : '/task/class/add';
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
            this.$emit('reload');
          }else {
            this.$message({message:res.data.errorMsg,type:'error'});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initRole(){
      let communityId = this.$store.getters.communityId;
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


