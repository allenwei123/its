<template>
  <el-dialog :title="title" :visible.sync="formVisible">
    <el-form :model="form" label-width="120px">
      <el-form-item label="轮播图：" class="c-must">
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

      <el-form-item label="所属社区：" label-width="120px" prop="communityId" class="c-must">
        <el-select v-model="form.communityId"  @change="changCommunity">
          <el-option v-for="item in communityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="播放顺序：" class="c-must">
        <el-select v-model="form.rank" placeholder="请选择播放顺序">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="跳转类型：" label-width="120px" class="c-must">
        <!-- <el-radio-group v-model="form.gotoType" @change="changeGotoType()"> -->
        <el-radio v-model="form.gotoType" @change="changeGotoType()" :label="1">商家</el-radio>
        <el-radio v-model="form.gotoType" @change="changeGotoType()" :label="2">第三方</el-radio>
        <!-- </el-radio-group> -->
      </el-form-item>

      <el-form-item v-if="isShow" label="跳转商家：" label-width="120px" prop="shopId" class="c-must">
        <el-select v-model="form.shopId">
          <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="isSee" label="跳转链接：" prop="href" class="c-must">
        <el-col :span="14">
          <el-input v-model.trim="form.href" placeholder="请输入跳转链接"></el-input>
        </el-col>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { send as ossUpload, getUri } from "@/utils/oss";
  export default {
    data() {
      return {
        formVisible: true,
        communityList: [],
        file: null,
        isSee: false,
        isShow: true,
        form: {
          href: "",
          photo: null,
          communityId: '',
          rank: '1',
          gotoType: 1,
          shopId: ''
        },
        fileList2: [],
        title: '新增轮播图',
        shopList: []
      };
    },
    watch: {
      visible(val) {
        this.formVisible = val;
      },
      formVisible(val) {
        this.$emit("update:visible", val);
      }
    },
    methods: {
      showInfo(text) {
        this.$message({
          message: text,
          type: "warning"
        });
      },
      closeForm() {
        this.formVisible = false;
        this.communityList = [];
        this.shopList = [];
      },
      onExceed() {
        this.$message("只能上传一张图片");
      },
      changCommunity(){
        this.form.shopId = '';
        this.shop();
      },
      changeGotoType(){
        if(this.form.gotoType == 1){
          this.isSee = false;
          this.isShow = true;
          this.shop();
          this.form.href = '';
        }
        if(this.form.gotoType == 2){
          this.isSee = true;
          this.isShow = false;
          this.form.shopId = '';
        }
      },
      community() {
        this.loading = true;
        let url = `community/page`;
        this.$xttp.get(url).then( res => {
          if(!res.errorCode) {
            this.loading = false;
            this.communityList = res.data.records;
            if(res.data.records.length > 0){
              if(!this.isModify){
                // alert("新增")
                this.form.communityId = res.data.records[0].id;
              }
            }

          }
        }).catch( () => {
          this.loading = false;
        })
      },
      shop(){
        this.loading = true;
        let url = `/biz/shop/list`;
        let params = {};
        params['communityId']  = this.form.communityId;
        this.$xttp.post(url,params)
          .then(res => {
            if(res.success){
              this.loading = false;
              this.shopList = res.data;
              if(res.data.length > 0){
                if(!this.isModify){
                  this.form.shopId = res.data[0].id;
                }
              }

            }
          })
      },

      save() {
        if(this.form.gotoType == 2){
          if(this.form.href == ''){
            this.showInfo('请输入跳转链接');
            return;
          }
        }
        if(this.form.gotoType == 1){
          if(this.form.shopId == ''){
            this.showInfo('请选择跳转商家');
            return;
          }
        }

        if(this.isModify){
          let files = this.$refs.upload.uploadFiles;
          if(files.length){
            if(this.detail.photo == this.form.photo && this.detail.photo != ''){
              this.form.photo = this.detail.photo;
              this.submitForm();
            }else{
              ossUpload(files[0].raw, key => {
                this.detail.photo = '';
                this.form.photo = key;
                this.submitForm();
              });
            }
          }else{
            this.showInfo('轮播图不能为空');
            this.form.photo = '';
            this.detail.photo = '';
            return;
          }
        }else{
          let files = this.$refs.upload.uploadFiles;
          if (files.length) {
            ossUpload(files[0].raw, key => {
              this.form.photo = key;
              this.submitForm();
            });
          } else if (files.length === 0) {
            this.showInfo("请上传图片");
            return;
          } else {
            this.submitForm();
          }
        }


      },
      submitForm() {
        this.loading = true;
        let params = {};
        params["rank"] = this.form.rank;
        params["communityId"] = this.form.communityId;
        params["gotoType"] = this.form.gotoType;
        if(this.form.gotoType == 1){
          params['shopId'] = this.form.shopId;
          if(params['href']){
            delete params.href;
          }
        }else{
          params['href'] = this.form.href;
          if(params['shopId']){
            delete params.shopId;
          }
        }
        params["photo"] =this.form.photo;
        let url = "biz/slide/add";
        if (this.isModify) {
          url = "biz/slide/edit";
          params["id"] = this.detail.id;
        }
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.formVisible = false;
            if(this.isModify){
              this.$message({
                message: '编辑轮播图成功',
                type: 'success'
              });
            }else{
              this.$message({
                message: '新增轮播图成功',
                type: 'success'
              });
            }
            this.$emit('saveSuccess');
          }
        }).catch(() => {
          this.loading = false;
        });
      }
    },
    props: ["visible", "detail", "isModify"],
    created() {
      this.community();
      if (this.isModify) {
        this.title = "编辑轮播图";
        if(this.detail.photo){
          getUri(this.detail.photo,(uri) => {
            this.fileList2.push({url:uri});
          })
          this.form.photo = this.detail.photo;
        }
        this.form.rank = this.detail.rank;
        this.form.communityId = this.detail.communityId;
        this.form.gotoType = this.detail.gotoType;
        if(this.detail.href != null){
          this.isSee = true;
          this.form.href = this.detail.href;
          this.isShow = false;
        }else{
          this.isSee = false;
          this.isShow = true;
          this.shop();
          this.form.shopId = this.detail.shopId;
        }
      }else{
        this.shop();
      }
    }
  };
</script>

<style scoped>
  .el-upload {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
</style>

