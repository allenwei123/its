<template>
  <el-dialog title="新增公告" :visible.sync="formVisible">
    <el-form :model="form" label-width="120px">
      <el-form-item label="公告标题" label-width="120px" required>
        <el-input v-model="form.title" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="公告类型" required>
        <el-select v-model="form.type" placeholder="请选择公告类型">
          <el-option label="公告" value="1"></el-option>
          <el-option label="新闻" value="2"></el-option>
          <el-option label="活动" value="3"></el-option>
          <el-option label="提醒" value="4"></el-option>
          <el-option label="其他" value="99"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属社区" required>
        <el-select v-model="form.communityId" placeholder="请选择社区">
          <el-option v-for="item in communityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布对象" required>
        <el-select v-model="form.obj" placeholder="发布对象">
          <el-option label="全部" value=""></el-option>
          <el-option label="住户" value="1"></el-option>
          <el-option label="员工" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配图" required>
        <template>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
          <!--<el-dialog :visible.sync="dialogVisible">-->
            <!--<img width="100%" :src="dialogImageUrl" alt="">-->
          <!--</el-dialog>-->
        </template>
      </el-form-item>
      <el-form-item label="公告内容" required>
        <el-input type="textarea" v-model="form.body" :rows="5"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {communityId as getCommunityList} from '@/biz/community';
  export default {
    data() {
      return {
        formVisible: this.visible,
        communityList: [],
        form: {
          communityId: '',
          title: '',
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
      getCommunityList().then(res => {
        this.communityList = res;
      });
    }
  }
</script>

<style scoped>
  >>> .el-upload {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
</style>
