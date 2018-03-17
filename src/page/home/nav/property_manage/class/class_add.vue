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
              <el-select v-model="form.postCode" placeholder="roleOptions">
                <!-- <el-option v-for="item in roleOptions" :key="item.key" :label="item.name" :value="item.value"></el-option> -->
                <el-option v-for="item in roleOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="班次：" :label-width="formLabelWidth" prop="name" class="c-must">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="班次类型:" :label-width="formLabelWidth" prop="type" class="c-must">
              <el-select v-model="form.type" placeholder="请选择">
                <!-- <el-option v-for="item in roleOptions" :key="item.key" :label="item.name" :value="item.value"></el-option> -->
                <el-option v-for="item in typeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="值班时间：" :label-width="formLabelWidth" class="c-must">
              <el-time-select placeholder="起始时间" v-model="form.attendTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00'
                }">
              </el-time-select>
              ---
              <!-- <el-time-select placeholder="结束时间" v-model="form.offTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00',
                  minTime: form.attendTime
                }"> -->
                <el-time-select placeholder="结束时间" v-model="form.offTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00'
                }">
              </el-time-select>
            </el-form-item>

            <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark" class="c-must">
              <el-input v-model="form.remark"></el-input>
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

const typeOptions = [
  { key: '1', value: '轮班' },
  { key: '2', value: '长班' }
];
export default {
  name: "ClassAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'添加班次',
      show: false,
      form: {
        postCode: 'SECURITY',
        name: '',
        type: '1',
        attendTime: '',
        offTime: '',
        remark: '',
        communityId: '5a82adf3b06c97e0cd6c0f3d',
        propertyId : '5a82adee9ce976452b7001ee'
      },
      rules: {
        name: [{required: true, message: '请输入班次', trigger: 'blur'}],
        attendTime: [{ required: true, message: '请选择起始时间', trigger: 'blur' }],
        offTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      },
      roleOptions: [],
      current: 1, //1 初始 2：添加后 3：编辑后
      typeOptions: typeOptions
    };
  },
  props: ["msg","add"],
  created() {
    // if(this.add){//判断此时组件为 编辑
    //   this.form = this.add;
    //   this.titleFont = '编辑员工';
    // }
    this.initRole()
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
      let communityId = scheduleList[0].communityId
      this.$xttp.get('/task/class/list',{params:{communityId:communityId,postCode:postCode,propertyId:'5a82adee9ce976452b7001ee'}})
                .then(res => {
                  if(!res.errorCode) {
                    this.tableData = res.data
                  }
                  this.loading = false;
                }).catch(err =>{
                  this.loading = false;
                })
      
    },
    postData() {
      let msg = this.add ? '编辑' : '添加';
      let uri = this.add ? '/community/edit' : '/task/class/add';
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
      let communityId = scheduleList[0].communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.roleOptions = res.data;
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


