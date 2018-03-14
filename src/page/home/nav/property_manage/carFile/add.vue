<template>
      <el-dialog title="新增车辆" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="所在社区" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-input v-model.trim="form.communityId">localStorage.getItem("communityId")</el-input>
            </el-form-item>
            <el-form-item  label="用户ID：" :label-width="formLabelWidth" prop="userId" class="c-must">
              <el-input v-model.trim="form.userId">JSON.parse(localStorage.getItem("userInfo")).id</el-input>
            </el-form-item>
            <el-form-item label="车牌号码：" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-input v-model.trim="form.carNo"></el-input>
            </el-form-item>
            <el-form-item label="车牌型号：" label-width="120px" required>
              <el-input v-model.trim="form.carType"></el-input>
            </el-form-item>
            <el-form-item label="车身颜色：" label-width="120px" required>
              <el-input v-model.trim="form.carColor"></el-input>
            </el-form-item>
            <el-form-item label="行驶证号：" label-width="120px" required>
              <el-input v-model.trim="form.drivingPermit"></el-input>
            </el-form-item>

            <el-form-item label="行驶证照："  label-width="120px" required>
              <template>
                <el-upload
                  ref="upload"
                  action=""
                  :auto-upload="false"
                  :limit="1"
                  accept="image/*"
                  :on-exceed="onExceed"
                  list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <!--<el-dialog :visible.sync="dialogVisible">-->
                  <!--<img width="100%" :src="dialogImageUrl" alt="">-->
                <!--</el-dialog>-->
              </template>
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
      show: false,
      form: {
        communityId: '',
        userId: '',
        carNo: '',
        carType: '',
        carColor: '',
        drivingPermit: '',

        // postCode: 'SECURITY',
        // name: '',
        // type: '1',
        // attendTime: '',
        // offTime: '',
        // remark: '',
        // communityId: '5a82adf3b06c97e0cd6c0f3d',
        // propertyId : '5a82adee9ce976452b7001ee',
        // userId: JSON.parse(localStorage.getItem("userInfo")).id
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
      let uri = 'vehicle/applyCarNum';
      // let uri = this.add ? '/community/edit' : '/task/class/add';
      console.log(this.form)
      return;
      this.$xttp
        .post( uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: "绑定车辆成功",
              type: "success"
            });
            // this.current =  2;
            this.handleClose();
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


