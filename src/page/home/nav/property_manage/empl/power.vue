<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">
            <h3>职权范围：</h3>
          <el-form-item style="margin-top:20px;">
            <el-checkbox-group v-for="(items) in form.buildLists" :key="items.id" v-model="form.checkList">
              <el-col :span="8"><el-checkbox :label="items.code">{{items.name}}</el-checkbox></el-col>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item style="text-align:center">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import fun from "@/utils/fun.js";

export default {
  name: "EmplPower",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'职权管理',
      form: {
          buildLists:[],
          checkList:[]
      }
    };
  },
  props: ["msg","add","power"],
  created() {
    this.getInit();
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("uppower", false);
      this.$emit('reload');
    },
    showInfo(text) {
      this.$message({
        message: text,
        type: "warning"
      });
    },
    getInit(){
        let communityId = this.$store.getters.communityId;

        this.$xttp.get('community/building/list',{communityId:communityId}).then(res => {
            if(res.success){
                console.log(res.data);
                // console.log(res);
                this.form.buildLists = res.data;
            }
        })
    },
    save() {
        console.log(this.form.checkList);
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


