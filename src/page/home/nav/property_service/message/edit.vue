<template>
  <el-dialog title="提示" :visible.sync="msg" :before-close="handleClose">
    <h2>审核管理设置</h2>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">

        <el-form-item label-width="120px"  label="审核管理设置" prop="close"> 
            <el-switch
                v-model="form.close"
                active-text="关闭"
                inactive-text="开始"
                class="c-isClose">
            </el-switch>
            <p class="c-tip">关闭后住户发布动态将自动通过系统审核</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="动态举报设置"></el-form-item> 

        <el-form-item label-width="120px"  label="提醒举报数:" prop="close" required> 
            <el-input type="number" v-model="form.jubao"  min='0'></el-input>
            <p class="c-tip">当举报数达到该数量后将提醒您</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="屏蔽举报数:" prop="close" required> 
            <el-input type="number" v-model="form.pinbbi" min='0'></el-input>
            <p class="c-tip">当举报数达到该数量后将自动屏蔽动态</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="评论举报设置" ></el-form-item> 

        <el-form-item label-width="120px"  label="提醒举报数:" prop="jb"> 
            <el-input v-model.number="form.jb"  min='0'></el-input>
            <p class="c-tip">当举报数达到该数量后将提醒您</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="屏蔽举报数:" prop="ad"> 
            <el-input v-model.number="form.ad" min='0' auto-complete="off"></el-input>
            <p class="c-tip">当举报数达到该数量后将自动屏蔽评论</p>
        </el-form-item>     



    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name:'editMessage',
    data() {
      return {
        buildingOptions: [],
        form: {
          communityId: this.$store.getters.communityId,
          close: false
        },
        rules: {
          ad: [{required: true, message: '请输入举报数量'},{ type: 'number', message: '年龄必须为数字值'}],
        },
      }
    },
    props: ['msg'],
    created() {
      this.getBuilding();
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.postData();
            } else {
              return false;
            }
        });
      },
      handleClose() {
        this.$emit("upsee", false );
      },
      getBuilding(){
        let url = 'community/building/list';
        this.$xttp.get('community/building/list',{params:{communityId:this.form.communityId}})
        .then(res => {
          if(res.success){
            this.buildingOptions = res.data;
          }
        })
      },
      postData() {
        let url = `property/fault/addFault`;
        this.$xttp
          .post(url, this.form)
          .then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.handleClose();
              this.$emit('addSuccess');
            }else {
              this.$message({message:res.data.errorMsg,type:'error'});
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
</script>

<style scoped lang="scss">
    h2 {
        text-align: center;
        line-height: 30px;
        height: 30px;;
    }
    .c-isClose {
        position: absolute;
        right: 0px;
        top: 15px;
    }
    .c-tip {
        position: absolute;
        bottom: -32px;
        right: 0px;
        color:gray;
        font-size: 12px;
    }
</style>
