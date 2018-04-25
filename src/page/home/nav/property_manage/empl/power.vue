<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">
            <h3>职权范围：</h3>
          <el-form-item style="margin-top:20px;">
            <el-checkbox-group v-for="(items) in form.buildLists" :key="items.id" v-model="form.checkList">
              <el-col :span="6"><el-checkbox :label="items.id">{{items.name}}</el-checkbox></el-col>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item style="text-align:center">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="save()">授权</el-button>
          </el-form-item> -->
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
      // titleFont:'职权管理',
      titleFont:'查看职权',
      form: {
          buildLists:[],
          userToPropertyId: '',
          checkList:[]
      },
      communityId: this.$store.getters.communityId
    };
  },
  props: ["msg","add","power"],
  created() {
    this.getInit();
    this.form.userToPropertyId = this.power.id;
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
      this.$xttp.get('community/building/list',{params:{communityId:this.communityId}}).then(res => {
        // this.$xttp.post('user/district/list',{params:{communityId:this.communityId}}).then(res => {
        if(res.success){
          this.form.buildLists = res.data;
          this.form.checkList = this.power.buildingIds;
        }
      })
    },
    save() {
      let communityId = this.$store.getters.communityId;
      let userToPropertyId = this.form.userToPropertyId;
      let districtIds = ["5acc6e1de4b0bfa7f9927715"];
      let obj = {communityId:communityId};
      let params = Object.assign(obj,{userToPropertyId:userToPropertyId},{districtIds:districtIds});

      let url = 'user/property/add-district';
      this.$xttp.post(url,params).then(res => {
        if(res.success){
          this.$message({
            message: "赋权成功",
            type: "success"
          });
          this.current =  2;
          this.handleClose();
          this.$emit('reload');
        }else {
          this.$message({message:res.errorMsg,type:'error'});
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


