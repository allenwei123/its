<template>
  <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="form" ref="ruleForm" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
            <el-select v-model="form.postCode" placeholder="请选择岗位">
              <el-option v-for="item in postCodeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="类型：" :label-width="formLabelWidth" prop="classType" class="c-must">
            <el-select v-model="form.classType" placeholder="请选择类型">
              <el-option v-for="item in classTypeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
        <el-select v-model="form.postCode" placeholder="请选择岗位">
          <el-option v-for="item in postCodeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item> -->


      <!-- <el-form-item label="类型：" :label-width="formLabelWidth" prop="classType" class="c-must">
        <el-select v-model="form.classType" placeholder="请选择类型">
          <el-option v-for="item in classTypeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="值班周期：" :label-width="formLabelWidth" prop="daterange" class="c-must">
        <el-date-picker
          v-model="daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item :label-width="formLabelWidth">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </el-form-item>
    </el-form>
</el-dialog>
</template>

<script>
export default {
  name: "EmplAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'智能排班',
      form: {
        postCode: "",
        classType: "",
        communityId: this.$store.getters.communityId,
        startDate: '',
        endDate: ''
      },
      daterange: '',
      visabled: true,
      postCodeOptions: [],
      classTypeOptions: [{key:'1',name:'轮班'},{key: '2',name: '常班'}],
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg","add"],
  created() {
    this.initPost();
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", false );
    },
    showInfo(text) {
      this.$message({
        message: text,
        type: "warning"
      });
    },
    save() {
      if(this.form.postCode == ''){
        this.showInfo('请选择岗位');
        return;
      }
      if(this.form.classType == ''){
        this.showInfo('请选择类型');
        return;
      }

      if(this.daterange){
        let a = new Date(this.daterange[0]);
        let b = new Date(this.daterange[1]);
        this.form.startDate = a.getFullYear() + '-' +(a.getMonth() < 10 ? '0': '')  + (a.getMonth() + 1) + '-' + (a.getDate() < 10 ? '0': '') + a.getDate();
        this.form.endDate = b.getFullYear() + '-' +(b.getMonth() < 10 ? '0': '')  + (b.getMonth() + 1) + '-' + (b.getDate() < 10 ? '0': '') + b.getDate();
      }else{
        this.showInfo('请选择值班周期');
        return;
      }
      let uri = '/task/schedule/generate';
      this.$xttp.post(uri,this.form).then(
        res => {
          if(res.success){
            this.$message({
              message: '智能排班成功',
              type: "success"
            });
            this.$emit('reload');
            this.handleClose();
          }else{
            this.$message({message:res.data.errorMsg,type:'error'})
          }
        }
      ).catch(err => {
        console.log(err);
      })
      // this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       this.postData();
      //     } else {
      //       return false;
      //     }
      //   });
    },
    postData() {
      let msg = '添加';
      let uri = '/community/add';
      this.$xttp
        .post( uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "社区成功",
              type: "success"
            });
            this.$emit('reload');
            this.handleClose();
          }else {
            this.$message({message:res.data.errorMsg,type:'error'});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initPost(){
      let communityId = this.$store.getters.communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postCodeOptions = res.data;
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>

</style>


