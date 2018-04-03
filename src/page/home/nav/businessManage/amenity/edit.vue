<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">

          <el-form-item label="服务名称：" :label-width="formLabelWidth" prop="seviceName" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.seviceName" placeholder="请输入服务名称"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="分类：" :label-width="formLabelWidth" prop="type" class="c-must">
            <el-select v-model="form.type" value-key="key" placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item  :label-width="formLabelWidth" label="配图：" required>
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

          <el-form-item label="所属社区：" :label-width="formLabelWidth" prop="community" class="c-must">
            <el-select v-model="form.community" value-key="key" placeholder="请选择">
              <el-option v-for="item in communityOption" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="服务类型：" :label-width="formLabelWidth" prop="seviceType" class="c-must">
              <el-radio-group v-model="form.seviceType" @change="changeServiceType">
                <el-radio label="1">热线服务</el-radio>
                <el-radio label="2">在线服务</el-radio>
              </el-radio-group>  
          </el-form-item>

          <el-form-item v-if="isSee" label="服务热线：" :label-width="formLabelWidth" prop="serviceTel" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.serviceTel" placeholder="请输入服务热线"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item v-if="isShow" label="服务链接：" :label-width="formLabelWidth" prop="serviceLink" class="c-must">
            <el-col :span="14">
              <el-input v-model.trim="form.serviceLink" placeholder="请输入服务链接"></el-input>
            </el-col>
          </el-form-item>

          

          <el-form-item style="text-align:center">
            <el-button @click="handleClose">取 消</el-button>
            <!-- <el-button type="primary" @click="save('ruleForm')">保存</el-button> -->
            <el-button type="primary" @click="save()">保存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { send as ossUpload, getUri } from "@/utils/oss";
import fun from "@/utils/fun.js";
const typeOptions = [
  { value: '0', label: '生活服务' },
  { value: '1', label: '家政服务' }
];
export default {
  name: "EmplAdd",
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
        seviceName: '',
        seviceType: '1',
        type:'',
        community: '',
        serviceTel: '',
        serviceLink: '',
        thumbnailUrl: null
      },
      rules: {
        employeeId: [{required: true, message: '请输入工号', trigger: 'blur' }],
        userName: [{required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入正确号码', trigger: 'blur', pattern: /^1[34578]\d{9}$/}],
        // password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        postCode: [{ required: true, message: '请选择岗位', trigger: 'blur' }]
      },
      postCodeOptions: [],
      typeOptions: typeOptions,
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
        let seviceType = this.form.seviceType;
        if(seviceType == 1){
            if(this.isShow == true){
                this.isShow = false;
                this.isSee = true;
            }
        }
        if(seviceType == 2){
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
                console.log(res.data.records);
                this.communityOption = res.data.records;
            }
        })
    },
    save() {
      if(this.form.employeeId == ''){
        this.showInfo('请输入工号');
        return;
      }
      if(this.form.userName == ''){
        this.showInfo('请输入名称');
        return;
      }
      if(this.form.phone == ''){
        this.showInfo('请输入正确号码');
        return;
      }else{
        if(!(/^1[34578]\d{9}$/.test(this.form.phone))){
          this.showInfo('请输入正确号码');
          return;
        }
      }

      let files = this.$refs.upload.uploadFiles;

      if (files.length) {
        ossUpload(files[0].raw, key => {
          this.form.thumbnailUrl = key;
          this.submitForm();
        });
      } else {
        this.submitForm();
      }

      this.postData();
      // this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       this.postData();
      //     } else {
      //       return false;
      //     }
      //   });
    },
    postData() {
      let msg = this.add ? '编辑' : '添加';
      let uri = this.add ? '/user/property/update-user' : '/user/property/create-user';
      console.log(this.form)
      this.$xttp
        .post( uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "员工成功",
              type: "success"
            });
            this.current =  2;
            this.handleClose();
            this.$emit('reload');
          }else {
            this.$message({message:res.errorMsg,type:'error'});
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


