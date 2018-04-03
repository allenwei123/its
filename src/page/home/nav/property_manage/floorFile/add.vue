<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="楼栋名称：" :label-width="formLabelWidth" prop="name" class="c-must">
            <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="楼面层数" :label-width="formLabelWidth" prop="code" class="c-must">
            <el-input type="number" v-model="form.overGround" placeholder="从一层开始算"></el-input>
            </el-form-item>

            <el-form-item label="地下层数" :label-width="formLabelWidth" prop="code" class="c-must">
              <el-input type="number" v-model="form.underGround" placeholder="从负一层开始算" ></el-input>
            </el-form-item>

          <el-form-item label="房间数量" :label-width="formLabelWidth" prop="code" class="c-must">
            <el-input type="number" v-model="form.roomNum" ></el-input>
          </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { toName } from "@/biz/community";

export default {
  name: "floorFileForm",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont: "添加楼栋档案",
      isShow: false,
      form: {
        overGround: "",
        name: "",
        overGround: '',
        underGround: '',
        roomNum: '',
        communityIdShow: this.$store.getters.communityName,
        communityId: this.$store.getters.communityId,
        communityName: this.$store.getters.communityName
      },
      // rules: {
      //   name: [{ required: true, message: "请输入楼栋名称", trigger: "blur" }],
      //   code: [{ required: true, message: "请输入楼栋编号", trigger: "blur" }],
      //   overGround: [{ required: true, message: "请输入楼面层数", trigger: "blur" }],
      //   underGround: [{ required: true, message: "请输入地下层数", trigger: "blur" }]
      //   // roomNum: [{ required: true, message: "请输入房间数量", trigger: "blur" }]
      // },
      cityArr: [],
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg", "add"],
  created() {
    if (this.add) {
      //判断此时组件为 编辑
      this.form = this.add;
      this.form.communityIdShow = toName(this.$store.getters.communityList,this.$store.getters.communityId);
      this.titleFont = "编辑楼栋档案";
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current);
    },
    save(formName) {
      // this.$message({message:'请输入楼栋名称',type:'warning'});
      if(this.form.name.length == 0){
        this.$message({message:'请输入楼栋名称',type:'warning'});
        return;
      }
      if(this.form.overGround.length == 0){
        this.$message({message:'请输入楼面层数',type:'warning'});
        return;
      }
      if(this.form.underGround.length == 0){
        this.$message({message:'请输入地下层数',type:'warning'});
        return;
      }
      // else{
      //   this.form.underGround = 0 - this.form.underGround;
      // }
      if(this.form.roomNum.length == 0){
        this.$message({message:'请输入房间数量',type:'warning'});
        return;
      }
      this.postData();

      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     this.postData();
      //   } else {
      //     return false;
      //   }
      // });
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


