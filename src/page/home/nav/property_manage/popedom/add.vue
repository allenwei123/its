<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose" width="645px">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="辖区名称：" :label-width="formLabelWidth" prop="name" required class="c-must">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item  prop="buildingIds" label="选择楼栋：" :label-width="formLabelWidth">
              <el-transfer labelWidth v-model="form.buildingIds" :data="floorData" :titles="['可选楼栋','已选楼栋']"></el-transfer>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
  name: "PopedomAdd",
  data() {
    return {
      form: {
        buildingIds: [], //已选楼栋
        name: "",
        communityId: this.$store.getters.communityId
      },
      formLabelWidth: "100px",
      titleFont: "新增辖区",
      floorData: [], //可选楼栋
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg", "add"],
  created() {
    this.getFloor();
    if (this.add) {
      //判断此时组件为 编辑
      this.form.name = this.add.name;
      this.titleFont = "编辑辖区";
    }
  },
  mounted() {},
  methods: {
    getFloor() {
      let communityId = this.$store.getters.communityId;
      let obj = { communityId };
      if (this.add) {
        obj["districtId"] = this.add.id;
      }
      this.$xttp.post(`/district/available-buildings`, obj).then(res => {
        if (res.errorCode === 0) {
          this.floorData = [];
          this.form.buildingIds = [];
          res.data.forEach(item => {
            let o = {
              key: item.buildingId,
              label: item.buildingName
            };
            if (item.availableType) {
              this.form.buildingIds.push(o.key);
            }
            this.floorData.push(o);
          });
        }
      });
    },
    handleClose() {
      this.$emit("upup", this.current);
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      });
    },
    postData() {
      let msg = this.add ? "编辑" : "添加";
      let uri = this.add ? "/district/edit" : "/district/add";
      const body = Object.assign({},this.form);
      if(this.add) {
        body.id = this.add.id;
      }
      this.$xttp
        .post(uri, body )
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "辖区成功",
              type: "success"
            });
            this.handleClose();
            this.$emit("reload");
          } else {
            this.$message({ message: res.data.errorMsg, type: "error" });
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


