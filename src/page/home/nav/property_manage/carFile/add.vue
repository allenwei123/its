<template>
      <el-dialog title="新增车辆" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="所在社区" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-input v-model="form.communityId">localStorage.getItem("communityId")</el-input>
            </el-form-item>
            <el-form-item  label="用户ID：" :label-width="formLabelWidth" prop="userId" class="c-must">
              <el-input v-model="form.userId">JSON.parse(localStorage.getItem("userInfo")).id</el-input>
            </el-form-item>
            <el-form-item label="车牌号码：" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-input v-model="form.carNo"></el-input>
            </el-form-item>
            <el-form-item label="车辆型号：" label-width="120px" required>
              <el-input v-model="form.carType"></el-input>
            </el-form-item>
            <el-form-item label="车身颜色：" label-width="120px" required>
              <el-input v-model="form.carColor"></el-input>
            </el-form-item>
            <el-form-item label="行驶证号：" label-width="120px" required>
              <el-input v-model="form.drivingPermit"></el-input>
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
import {send as ossUpload} from '@/utils/oss';
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
      // msg: this.visible,
      form: {
        communityId: localStorage.getItem("communityId"),
        userId: JSON.parse(localStorage.getItem("userInfo")).id,
        carNo: '',
        carType: '',
        carColor: '',
        drivingPermit: '',
        drivingPermitPicUrl: null
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
      file: null,
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
  props: ['msg'],
  watch: {
    visible(val) {
      this.msg = val;
    }
  },
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
    },
    showInfo(text){
      this.$message({
        message: text,
        type: 'warning'
      })
    },
    onExceed() {
      this.$message('只能上传一张图片')
    },
    // save(formName) {
    //   this.$refs[formName].validate((valid) => {
    //       if (valid) {
    //         this.postData();
    //       } else {
    //         return false;
    //       }
    //     });
    // },
    save () {
      if (!this.form.carNo.length) {
        this.showInfo('车牌号码不能为空')
        return;
      }
      if (!this.form.carType.length) {
        this.showInfo('车辆型号不能为空')
        return;
      }
      if (!this.form.carColor.length) {
        this.showInfo('车身颜色不能为空')
        return;
      }
      if (!this.form.drivingPermit.length) {
        this.showInfo('行驶证号不能为空')
        return;
      }
      let files = this.$refs.upload.uploadFiles;
      if (files.length) {
        ossUpload(files[0], (key) => {
          this.form.drivingPermitPicUrl = key;
          this.submitForm();
        });
      } else {
        this.submitForm();
      }
    },
    submitForm() {
      this.loading = true;
      let params = {};
      params['communityId'] = this.form.communityId;
      params['userId'] = this.form.userId;
      params['carNo'] = this.form.carNo;
      params['carType'] = this.form.carType;
      params['carColor'] = this.form.carColor;
      params['drivingPermit'] = this.form.drivingPermit;
      if (this.form.thumbnailUrl) {
          params['drivingPermitPicUrl'] = this.form.drivingPermitPicUrl;
      }
      let url = '/vehicle/applyCarNum'
      this.$xttp.post(url, params).then(res => {
        this.loading = false;
        if(res.errorCode === 0) {
          this.msg = false;
          console.log(res);
          // this.$emit('saveSuccess');
        }
      }).catch(() => {
        this.loading = false;
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


