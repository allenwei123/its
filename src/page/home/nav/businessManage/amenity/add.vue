<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">
          <el-form-item label="服务名称：" :label-width="formLabelWidth" prop="name" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.name" placeholder="请输入服务名称"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="服务类型：" :label-width="formLabelWidth" prop="serviceType" class="c-must">
            <el-select v-model="form.serviceType" value-key="key" placeholder="请选择">
              <!-- <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option> -->
              <el-option label="生活服务" value="1">生活服务</el-option>
              <el-option label="家政服务" value="2">家政服务</el-option>
            </el-select>
          </el-form-item>

          <el-form-item  :label-width="formLabelWidth" label="图片：" required>
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
          </el-form-item>

          <el-form-item label="所属社区：" :label-width="formLabelWidth" prop="communityId" class="c-must">
            <el-select v-model="form.communityId" value-key="key" placeholder="请选择">
              <el-option v-for="item in communityOption" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="服务方式：" :label-width="formLabelWidth" prop="serviceWay" class="c-must">
              <el-radio-group v-model="form.serviceWay" @change="changeServiceType">
                <el-radio label="1">热线服务</el-radio>
                <el-radio label="2">在线服务</el-radio>
              </el-radio-group>
          </el-form-item>

          <el-form-item v-if="isSee" label="服务热线：" :label-width="formLabelWidth" prop="contact" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.contact" placeholder="请输入服务热线"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item v-if="isShow" label="服务链接：" :label-width="formLabelWidth" prop="url" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.url" placeholder="请输入服务链接"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item style="text-align:center">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { send as ossUpload, getUri } from "@/utils/oss";
import fun from "@/utils/fun.js";
export default {
  name: "AmenityAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'新增服务',
      isShow: false,
      isSee: true,
      file: null,
      fileList2: [],
      communityOption: [],
      form: {
        name: '',
        serviceType: '1',
        serviceWay:'1',
        communityId: '',
        contact: '',
        url: '',
        icon: null
      },
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg","add"],
  created() {
    // this.initPost();
    this.initCommunity();
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
      this.$emit('reload');
    },
    showInfo(text) {
      this.$message({
        message: text,
        type: "warning"
      });
    },
    changeServiceType(){
        let serviceWay = this.form.serviceWay;
        if(serviceWay == 1){
            if(this.isShow == true){
                this.isShow = false;
                this.isSee = true;
            }
        }
        if(serviceWay == 2){
            this.isSee = false;
            this.isShow = true;

        }
    },
    onExceed() {
      this.$message("只能上传一张图片");
    },
    initCommunity(){
      this.$xttp.get('/community/page').then(res =>{
        if(res.success){
            this.communityOption = res.data.records;
        }
      })
    },
    save() {
      if(this.form.name == ''){
        this.showInfo('请输入服务名称');
        return;
      }
      if(this.form.serviceType == ''){
        this.showInfo('请选择服务类型');
        return;
      }
      if(this.form.communityId == ''){
        this.showInfo('请选择社区');
        return;
      }

      if(this.form.serviceWay == 1){
        if(this.form.contact == ''){
          this.showInfo('请填写服务热线');
          return;
        }else{
          // if(!(/^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8})|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/).test(this.form.contact)){
          //   this,showInfo('服务热线填写错误，请重新填写');
          //   return;
          // }
          if(!fun.isTelOrPhoneAvailable(this.form.contact)){
            this.showInfo('服务热线填写错误，请重新填写');
            return;
          }
        }
      }
      if(this.form.serviceWay == 2) {
        if(this.form.url == ''){
          this.showInfo('请填写外部链接');
          return;
        }
      }

      let files = this.$refs.upload.uploadFiles;
      if (files.length) {
        ossUpload(files[0].raw, key => {
          this.form.icon = key;
          this.submitForm();
        });
      } else if (files.length === 0 ) {
        this.showInfo("图片内容不能为空");
        return;
      }
      else {
        this.submitForm();
      }
    },
    submitForm(){
      this.loading = true;
      let params = {};
      params['name'] = this.form.name;
      params['communityId'] = this.form.community;
      params['serviceType'] = this.form.serviceType;
      params['communityId'] = this.form.communityId;
      params['serviceWay'] = this.form.serviceWay;
      params['icon'] = this.form.icon;
      if(this.form.serviceWay == 1){
        params['contact'] = this.form.contact;
      }
      if(this.form.serviceWay == 2){
        params['url'] = this.form.url;
      }
      return;
      let url = 'biz/convenience/add';
      this.$xttp.post(url, params)
          .then(res => {
            if(res.success){
              this.handleClose();
              this.$message({
                message: "新增服务成功",
                type: "success"
              });
              this.$emit('reload');
            }else {
              this.$message({message:res.errorMsg,type:'error'});
            }
          })
          .catch(err => {
            console.log(err);
          })

    }
  }
};
</script>

<style lang="scss" scoped>

</style>


