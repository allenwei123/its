<template>
  <el-dialog title="新增故障" :visible.sync="formVisible">
    <el-form :model="form" label-width="120px">
      <el-form-item label="故障类型" required>
        <el-select v-model="form.type" placeholder="故障类型">
          <el-option label="公共-电梯" value="1"></el-option>
          <el-option label="公共-门禁" value="2"></el-option>
          <el-option label="公共-其他" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障地址" label-width="120px" required>
        <el-input v-model="form.address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="故障描述" required>
        <el-input type="textarea" v-model="form.body" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="申报人" label-width="120px" required>
        <el-input v-model="form.address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" label-width="120px" required>
        <el-input v-model="form.address" auto-complete="off"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        formVisible: this.visible,
        communityList: [],
        form: {
          address: '',
          type: '1',
          obj: '',
          body: ''
        }
      }
    },
    watch: {
      visible(val) {
        this.formVisible = val;
      },
      formVisible(val) {
        this.$emit('update:visible', val);
      }
    },
    methods: {
      closeForm() {
        this.formVisible = false;
      },
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    props: ['visible'],
    created() {

    }
  }
</script>

<style scoped>

</style>
