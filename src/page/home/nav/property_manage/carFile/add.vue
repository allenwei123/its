<template>
      <el-dialog title="新增车辆" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item v-if="show" label="所在社区" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-input v-model="form.communityId"></el-input>
            </el-form-item>
            <el-form-item v-if="show" label="用户ID：" :label-width="formLabelWidth" prop="userId" class="c-must">
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
  name: "CarAdd",
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
      },
      rules: {
        carNo: [{required: true, message: '请输入车牌号', trigger: 'blur,change' }],
        carType: [{ required: true, message: '请输入车型号', trigger: 'blur,change' }],
        carColor: [{required: true, message: '请输入车颜色', trigger: 'blur,change' }],
        drivingPermit: [{ required: true, message: '请输入驾驶证', trigger: 'blur,change' }],
        drivingPermitPicUrl: [{ required: true, message: '请上传驾驶证照片', trigger: 'blur,change' }]
      },
      file: null,
      roleOptions: [],
      current: 1, //1 初始 2：添加后 3：编辑后
      typeOptions: typeOptions
    };
  },
  // props: ["msg"],
  props: ["msg","add"],
  created() {
  },
  mounted() {},
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
          console.log("ssss")
          console.log(this.form.drivingPermitPicUrl);
          this.submitForm();
        });
      } else {
        this.submitForm();
      }
    },
    submitForm() {
      this.loading = true;
      let params = {};
      params['communityId'] = this.$store.getters.communityId;
      params['userId'] = this.form.userId;
      params['carNo'] = this.form.carNo;
      params['carType'] = this.form.carType;
      params['carColor'] = this.form.carColor;
      params['drivingPermit'] = this.form.drivingPermit;
      if (this.form.drivingPermitPicUrl) {
          params['drivingPermitPicUrl'] = this.form.drivingPermitPicUrl;
      }
      let url = '/vehicle/applyCarNum'
      this.$xttp.post(url, params).then(res => {
        this.loading = false;
        if(res.errorCode === 0) {
          this.msg = false;
          this.$emit('reload');
        }
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


