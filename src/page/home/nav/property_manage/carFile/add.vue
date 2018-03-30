<template>
      <el-dialog title="新增车辆" :visible.sync="ij" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item v-if="show" label="所在社区" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-input v-model="form.communityId"></el-input>
            </el-form-item>
            <el-form-item v-if="show" label="用户ID：" :label-width="formLabelWidth" prop="userId" class="c-must">
              <el-input v-model="form.userId">JSON.parse(localStorage.getItem("userInfo")).id</el-input>
            </el-form-item>
            <el-form-item label="车牌号码：" :label-width="formLabelWidth" prop="carNo" class="c-must">
              <el-col :span="12">
                <el-input v-model="form.carNo" placeholder="请输入车牌号"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
              <el-select v-model="form.postCode" placeholder="postOptions" @change="changePostCode">
                <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="员工：" :label-width="formLabelWidth" prop="empl" class="c-must">
              <el-select v-model="form.empl" placeholder="请选择员工">
                <el-option v-for="item in emplData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="员工：" prop="empl" class="c-must" style="display:block;margin-top:20px;">
              <el-select v-model="form.empl" placeholder="请选择员工" @change="changEmpl">
                <el-option v-for="item in emplData" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="车辆型号：" label-width="120px" required>
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
                  :file-list="fileList2"
                  list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </template>
            </el-form-item> -->
            <el-form-item :label-width="formLabelWidth">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {send as ossUpload} from '@/utils/oss';
const typeOptions = [
  { key: '1', value: '轮班' },
  { key: '2', value: '长班' }
];
export default {
  name: "CarAdd",
  data() {
    return {
      formLabelWidth: "120px",
      show: false,
      form: {
        communityId: localStorage.getItem("communityId"),
        userId: JSON.parse(localStorage.getItem("userInfo")).id,
        // userId: '',
        carNo: '',
        postCode: 'SECURITY',
        empl: ''
      },
      rules: {
        carNo: [{required: true, message: '请输入车牌号', trigger: 'blur,change' }],
        carType: [{ required: true, message: '请输入车型号', trigger: 'blur,change' }],
        carColor: [{required: true, message: '请输入车颜色', trigger: 'blur,change' }],
        drivingPermit: [{ required: true, message: '请输入驾驶证', trigger: 'blur,change' }],
        drivingPermitPicUrl: [{ required: true, message: '请上传驾驶证照片', trigger: 'blur,change' }]
      },
      file: null,
      fileList2: [],
      roleOptions: [],
      current: 1, //1 初始 2：添加后 3：编辑后
      typeOptions: typeOptions,
      ij:this.msg,
      postOptions: [],
      emplData: []
    };
  },
  props: ["msg","add"],
  created() {
    this.initRole();
    this.initEmpl();
  },
  mounted() {},
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
    save () {
      if (!this.form.carNo.length) {
        this.showInfo('车牌号码不能为空')
        return;
      }
      
      let regex =new RegExp('^([\u4e00-\u9fa5][a-zA-Z](([DF](?![a-zA-Z0-9]*[IO])[0-9]{4,5})|([0-9]{5}[DF])))|([冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5,6}[a-zA-Z0-9挂学警港澳]{1})$');

      if(!this.form.carNo.length){
        this.showInfo('车牌号码不能为空');
        return;
      }else if(!regex.test(this.form.carNo)) {
        this.showInfo('车牌号不正确');
        return;
      }


      if (!this.form.postCode.length) {
        this.showInfo('请选择岗位')
        return;
      }
      if (!this.form.empl.length) {
        this.showInfo('请选择员工')
        return;
      }
      // if (!this.form.carType.length) {
      //   this.showInfo('车辆型号不能为空')
      //   return;
      // }
      // if (!this.form.carColor.length) {
      //   this.showInfo('车身颜色不能为空')
      //   return;
      // }
      // if (!this.form.drivingPermit.length) {
      //   this.showInfo('行驶证号不能为空')
      //   return;
      // }
      // let files = this.$refs.upload.uploadFiles;
      // if (files.length) {
      //   ossUpload(files[0], (key) => {
      //     this.form.drivingPermitPicUrl = key;
      //     console.log("ssss")
      //     console.log(this.form.drivingPermitPicUrl);
      //     this.submitForm();
      //   });
      // } else {
      //   this.submitForm();
      // }

      // let files = this.$refs.upload.uploadFiles;

      // if (files.length) {
      //   ossUpload(files[0].raw, key => {
      //     this.form.drivingPermitPicUrl = key;
      //     this.submitForm();
      //   });
      // } else {
      //   this.submitForm();
      // }
      this.submitForm();
    },
    submitForm() {
      this.loading = true;
      let params = {};
      params['communityId'] = this.$store.getters.communityId;
      params['userId'] = this.form.empl;
      params['carNo'] = this.form.carNo;
      let url = '/vehicle/applyCarNum/property';

      this.$xttp.post(url, params).then(res => {
        this.loading = false;
        if(res.errorCode === 0) {
          this.ij = false;
          this.$message({
            message: "新增车辆成功",
            type: "success"
          });
          this.$emit('reload');
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    initRole(){
      let communityId = this.$store.getters.communityId;
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    },
    initEmpl() {
      let communityId = this.$store.getters.communityId
      let postCode = this.form.postCode
      this.$xttp.get(`/user/property/${communityId}/user-list`,{params:{postCode:postCode}})
          .then(res => {
            if(!res.errorCode) {
              this.emplData = res.data
              
            }
          })
    },
    changePostCode(){
      this.form.empl = '';
      this.initEmpl();
      // this.initClass();
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


