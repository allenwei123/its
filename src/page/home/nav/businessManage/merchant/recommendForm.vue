<template>
  <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose" class="c-uploadDialog">
    <el-form :model="data" label-width="120px" ref="ruleForm" :rules="rules" class="c-myForm">

      <el-form-item prop="picture" label="商品图片：" >
        <el-upload
          class="avatar-uploader"
          action=""
          :limit="1"
          :on-exceed="onExceed"
          :file-list="fileList"
          list-type="picture-card"
          :http-request="httpRequest"
          :on-remove="removeFile"
        ><i class="el-icon-plus avatar-uploader-icon"></i></el-upload>
      </el-form-item>

      <el-form-item label="商品名称：" prop="name" class="c-must">
        <el-input v-model="data.name" size="small"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {send, getUri} from '@/utils/oss'

  export default {
    name: "recommendForm",
    data() {
      return {
        autoUpload: false,
        titleFont: this.edata ? '编辑商品':'增加商品',
        data: {
          name: '',
        },
        fileList: [],
        uploadFiles: [],
        rules: {
          name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        },
      }
    },
    props: ['msg','shopId','edata'],
    created() {
      if(this.edata) {
          this.data = this.edata;
          getUri(this.edata.picture,key => {
              this.fileList.push({url:key});
          });
      }
    },
    methods: {
      handleClose() {
        this.$emit("upList", 1);
      },
      submitForm() {
          let that = this;
          this.$refs['ruleForm'].validate(valid => {
              if(valid) {
                  if(this.uploadFiles.length){
                    send(this.uploadFiles[0],(key)=> {
                      that.sendAjax(key);
                    });
                  }else {
                    that.sendAjax();
                  }
              }else {
                  this.$message({
                    message:'请检查参数',
                    type:'warning'
                  })
              }
          })
      },
      sendAjax(key){
        let obj = {name:this.data.name , picture: key || this.edata.picture,shopId:this.shopId,id:this.edata ? this.edata.id :null };
        let url = this.edata? '/biz/goods/edit' : '/biz/goods/add';
        let msg = this.edata? '编辑' : '添加';
        this.$xttp.post( url, obj)
          .then(res => {
            if(!res.errorCode) {
              this.$message({
                message:msg + '商品成功',
                type: 'success'
              })
              this.$emit("upList", 2);
            }
          })
      },
      httpRequest(file) {
        this.uploadFiles.push(file.file);
      },
      onExceed() {
        this.$message("只能上传一张图片");
      },
      removeFile(file) {
         this.uploadFiles.splice(0,1);
      }
    }
  }
</script>

<style scoped lang="scss">
  .c-myForm {
    .el-select, .el-cascader {
      width: 100%;
    }
    .el-checkbox-group {
      margin-left: -30px;
    }
  }

</style>
