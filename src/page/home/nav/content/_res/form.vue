<template>
  <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
      <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="name" class="c-must">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="排序" prop="rank" :label-width="formLabelWidth" class="c-must">
        <el-input v-model="form.rank"></el-input>
      </el-form-item>

      <el-form-item :label-width="formLabelWidth">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { communityId } from '@/biz/community';
  import cityOptions from '@/utils/citys';

  export default {
    name: "formVue",
    data() {
      return {
        formLabelWidth: "120px",
        titleFont:'添加菜单',
        form: {
          name: "",
          rank: "",
          menuType: 1
        },
        rules: {
          name: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
          rank: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }]
        },
        current: 1 ,//1 初始 2：添加后 3：编辑后
      };
    },
    props: ["msg","add"],
    created() {
      if(this.add){//判断此时组件为 编辑

      }
    },
    mounted() {
    },
    methods: {
      handleClose() {
        this.$emit("upup", this.current );
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postData();
          } else {
            return false;
          }
        });
      },
      changeProvince(value) {
        this.form.cityArr = this.cityArr;
      },
      postData() {
        let msg = this.add ? '编辑' : '添加';
        let uri = this.add ? '/community/edit' : '/sys/menu/add';
        this.$xttp
          .post( uri, this.form)
          .then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: msg + "菜单成功",
                type: "success"
              });
              this.current =  2;
              this.handleClose();
            }else {
              this.$message({message:res.data.errorMsg,type:'error'});
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


