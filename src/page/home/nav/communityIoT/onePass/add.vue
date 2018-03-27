<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="楼栋名称" :label-width="formLabelWidth" prop="name" class="c-must">
            <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="楼栋编号" :label-width="formLabelWidth" prop="code" class="c-must">
            <el-input v-model="form.code"></el-input>
            </el-form-item>
            
            <el-form-item label="社区名称" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-select v-model="form.communityId" clearable>
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { communityId } from "@/biz/community";

export default {
  name: "floorFileForm",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont: "添加楼栋档案",
      form: {
        code: "",
        name: "",
        communityId: ""
      },
      rules: {
        name: [{ required: true, message: "请输入楼栋名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入楼栋编号", trigger: "blur" }],
        communityId: [
          { required: true, message: "请选择社区名称", trigger: "blur" }
        ]
      },
      options: [],
      cityArr: [],
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg", "add"],
  created() {
    communityId().then(res => {
      if (res.length) {
        this.options = res;
      }
    });
    if (this.add) {
      //判断此时组件为 编辑
      this.cityArr = [
        this.add.province,
        this.add.city,
        this.add.district || ""
      ];
      this.form = this.add;
      this.titleFont = "编辑楼栋档案";
    }
  },
  mounted() {},
  methods: {
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
      if (this.cityArr[0]) {
        this.form.province = this.cityArr[0];
        this.form.city = this.cityArr[1];
        this.form.district = this.cityArr[2];
      }
      let msg = this.add ? "编辑" : "添加";
      let uri = this.add
        ? "/community/building/edit"
        : "/community/building/add";
      this.$xttp
        .post(uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "楼栋成功",
              type: "success"
            });
            this.current = 2;
            this.handleClose();
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


