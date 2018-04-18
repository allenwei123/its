<template>
  <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose" class="c-uploadDialog">
    <el-form :model="data" label-width="120px" ref="ruleForm" :rules="rules" class="c-myForm">

      <el-row  :gutter="10">
        <el-col  :md="24" :lg="10">
          <el-row>
            <el-form-item prop="name" label="优惠名称">
              <el-input auto-complete="false" v-model="data.name " size="small"></el-input>
            </el-form-item>

            <el-form-item prop="maxPrice" label="优惠金额">
              <el-input auto-complete="false" type="text" v-model="data.maxPrice" size="small"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col  :md="24" :lg="14">
          <el-upload
            class="avatar-uploader"
            action=""
            :file-list="fileList"
            list-type="picture-card"
            :http-request="httpRequest"
            :on-remove="removeFile"
            :limit="1"
            style="margin-left: 10px"
          > <i class="el-icon-plus avatar-uploader-icon"></i></el-upload>
        </el-col>
      </el-row>

      <el-form-item label="发行数量" prop="amount" >
        <el-input type="text" v-model="data.amount" size="small"></el-input>
      </el-form-item >

      <el-form-item label="有效期限" prop="validityBeginAt" class="c-must" >
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
          value-format="timestamp"
          @change="changeTime">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="领取限制" prop="couponLimit" >
        <el-input  v-model="data.couponLimit" size="small"></el-input>
      </el-form-item>

      <el-form-item label="使用须知" prop="prompt" >
        <el-input  v-model="data.prompt" size="small"></el-input>
      </el-form-item>

      <el-form-item label="校验密令" prop="validCode" class="c-must">
        <el-input  v-model="data.validCode" size="small" :disabled="editDisabled"></el-input>
      </el-form-item>

      <!--<el-form-item label="是否推送" prop="label" >-->
        <!--<el-checkbox-group v-model="data.label" size="small">-->
          <!--<el-radio v-model="data.label" label="1" border>是</el-radio>-->
          <!--<el-radio v-model="data.label" label="0" border>否</el-radio>-->
        <!--</el-checkbox-group>-->
      <!--</el-form-item>-->

      <!--<el-form-item prop="community" label="推送范围" required>-->
        <!--<el-select v-model="data.community" placeholder="请选择社区" clearable size="small">-->
          <!--<el-option-->
            <!--v-for="s in typeList"-->
            <!--:key="s.name"-->
            <!--:label="s.name"-->
            <!--:value="s.name"-->
          <!--&gt;-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
 import { send ,getUri } from '@/utils/oss'

  export default {
    name: "merchantForm",
    data() {
      return {
        titleFont: this.edata ? '编辑优惠券':'增加优惠券',
        autoUpload:false,
        data: {},
        fileList:[],//展示图片列表
        uploadFile:[],
        typeList:[],//推送社区
        editDisabled: false,
        rules: {
          name: [{required: true, message: '请输入优惠券名称', trigger: 'blur change'}],
          maxPrice: [{ required: true, message: '请输入优惠券金额', trigger: 'blur change' }],
          amount: [{ required: true, message: '请输入优惠券数量', trigger: 'blur change' }],
          time: [{type: 'array', required: true, message: '请选择时间', trigger: 'blur change'}],
          validCode: [{required: true, message: '请输入校验密令', trigger: 'blur change'},
                      {pattern: '^[A-Za-z0-9]+$', message: '请输入6-8位数字或字母', trigger: 'blur change'}
          ]
        },
        time: []
      }
    },
    props: ['msg','shopId','edata'],
    created() {
      if(this.edata) {
        console.log(this.edata);
        this.data = this.edata;
        this.time = [this.data.validityBeginAt,this.data.validityEndAt];
        getUri(this.data.icon,uri => {
            let o = {url: uri};
            this.fileList.push(o);
        });
        this.editDisabled = true;
        // this.fileList = [];
      }
    },
    methods: {
      handleClose() {
        this.$emit("upList", 1 );
        this.fileList = [];
        this.uploadFile = [];
      },
      showInfo(text) {
        this.$message({
          message: text,
          type: "warning"
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.data.shopId == ''){
              this.showInfo('请输入用户名称');
              return;
            }
            if(this.data.maxPrice == ''){
              this.showInfo('优惠券金额不能为空');
              return;
            }
            if(this.data.amount == ''){
              this.showInfo('请输入优惠券数量');
              return;
            }
            if(this.data.time == ''){
              this.showInfo('请选择优惠券有效期限');
              return;
            }
            if(this.data.validCode == ''){
              this.showInfo('请输入校验密码');
              return;
            }
            if(this.uploadFile.length){
              send(this.uploadFile[0],(key)=> {
                // that.data.icon = key;
                this.data.icon = key;
                this.save();
                // that.save();
              })
            }else {
                this.save();
            }
            // this.save();
          } else {
            return false;
          }
        });
      },
      save() {
        if(!this.data.maxPrice || !this.data.amount) return;

        let msg = this.edata ? '编辑' :'添加';
        let postUrl = this.edata ? '/biz/coupon/edit' :'/biz/coupon/add';
        this.data.shopId = this.shopId;
        this.$xttp.post( postUrl , this.data)
          .then(res => {
            if (!res.errorCode) {
              this.$message({
                message: msg + "优惠券成功",
                type: "success"
              });
              this.$emit("upList", 2);
              this.uploadFile = [];
              this.fileList = [];
            }
          })
      },
      httpRequest(file) {
        this.uploadFile.push(file.file);
      },
      removeFile(file) {
        this.uploadFile.splice(0,1);
      },
      changeTime() {
          if(!this.time) return;
        this.data['validityBeginAt'] = this.time[0];
        this.data['validityEndAt'] = this.time[1];
      }
    }
  }
</script>

<style scoped lang="scss">
  .c-myForm {
    .el-select,.el-cascader {
      width:100%;
    }
    .el-checkbox-group {
      margin-left: -30px;
    }
  }

</style>
