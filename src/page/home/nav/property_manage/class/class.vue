<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="角色">
              <el-select v-model="formInline.role" placeholder="角色">
                <el-option v-for="item in roleOptions" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click=""><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="addClass">新增班次</el-button>
        </div>
      </div>
      
      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" type="index" align="center" width="60"> </el-table-column>
        <el-table-column prop="role" label="岗位" align="center"  width="200"> </el-table-column>
        <el-table-column prop="duty" label="班次" align="center"  width="150"> </el-table-column>
        <el-table-column prop="time" label="值班时间" align="center"  width="200"> </el-table-column>
        <el-table-column prop="num" label="备注信息" align="center"  width="200"> </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleClick(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!-- <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @upup="change" :add.sync="notice"></AddPage>
      </transition> -->
      <transition name="fade">
        <AddPage v-if="add" :msg="add" @upsee="addChange"  :data="addData"></AddPage>
      </transition>

      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您是否确定删除这条数据吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
          </div>
      </el-dialog>
    </el-main>
</template>

<script>

const roleOptions = [
    { key: '0', value: '物业'},
    { key: '1', value: '保安'},
    { key: '2', value: '保洁'},
    { key: '3', value: '水电'}
];

const schedulOptions = [
  { key: '', value: '休班' },
  { key: '0', value: '早班' },
  { key: '1', value: '中班' },
  { key: '2', value: '晚班' },
  { key: '3', value: '早中晚班'}
]

import AddPage from "./addClass";
// import SeePage from "./sched_see";
import { mapGetters } from "vuex";
import scheduleList from '@/mock/scheduleList'
import time from '@/utils/time.js';

export default {
  name: "schedul",
  data() {
    return {
      show: false,
      schedulOptions: schedulOptions,
      roleOptions: roleOptions,
      isSou: false,
      tableData: [{
        role: '0',
        dep: '住建部',
        name: '陈以桐',
        male: '0',
        phone: '13211112222',
        time: '2016-05-03 12:10:59',
        emp_id: '000',
        usestate: '0'
      }],
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "作业管理" },
        { id: 2, name: "班次管理" }
      ],
      formInline: {
        role: '0',
        schedul: '',
        name: ""
      },
      pageSize:10,
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      notice:null,//编辑传送的值
      add:false,//控制查看组件弹出
      addData:null,//查看数据
      visible2:false,//控制删除框
      delData:null
    };
  },
  computed: mapGetters(["showAside"]),
  components: {
      AddPage
  //   SeePage
  },
  methods: {
    onSubmit() {//添加按钮
      this.notice = null;
      this.isShow = !this.isShow;
    },
    getTime(timestamp, format) {
      return time.timestampToFormat(timestamp, format);
    },
    addClassAction(){

    },
    handleCurrentChange(val) {
      this.sendAjax(val);
    },
    handleCreate(){

    },
    addClass(row) {
      //查看
      this.add = true;
      this.addData = row;
    },
    editHandle(row) {
      //编辑
      this.isShow = true;
      this.notice = row;
    },
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        // this.sendAjax();
        this.isShow = false;
      }
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    find(){
      this.sendAjax(null,this.formInline.name);
    },
    maleFilter(row, column) {
      let male = row[column.property];
      if(male == '0'){
        return '女'
      }else if(male == '1'){
        return '男'
      }
    },
    roleFilter(row, column) {
      let role = row[column.property];
      if(role == 0){
        return '超级管理员'
      }
      if(role == 1){
        return '社区管理员'
      }
      if(role == 2){
        return '物业管理员'
      }
    },
    postCodeFilter(row, column){
      let postCode = row[column.property];
      console.log(postCode);
      if(postCode == 'SECURITY'){
        return '保安'
      }
      if(postCode == 'CLEANING'){
        return '保洁'
      }
      if(postCode == 'ADMINISTRATION'){
        return '行政'
      }
    },
    dataStatusFilter(row, column) {
      let datastatus = row[column.property];
      if(datastatus == 0){
        return '无效'
      }
      if(datastatus == 1){
        return '有效'
      }
    },
    usestateFilter(row, column) {
      let usestate = row[column.property];
      if(usestate == 0){
        return '禁用'
      }
      if(usestate == 1){
        return '正常'
      }
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/community/${this.delData.id}/delete`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:res.data,type:'success'});
            this.find();
          }
        })
      }
    },
    sendAjax(page,name) {
      let nPage = page || this.$route.query.page || 1;
      let communityId = scheduleList[0].communityId
      console.log(communityId)
      let obj = {page:nPage,size:this.pageSize,communityId:communityId}
      
      if(name){
        obj.name = this.formInline.name;
      }else {
        delete obj.name ;
      }
      this.loading = true;
      console.log(obj);
      this.$xttp.post("task/schedule/page",obj)
      .then(res => {
        console.log(res)
        if (!res.errorCode) {
          this.tableData = res.data.records;
          this.currentPage = res.data.currentPage;
          this.total = res.data.total;
          this.$router.push({path:this.$route.path,query:{page: nPage }})
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    }
  },
  created() {
    // this.sendAjax();
  },
  mounted() {
  }
};
</script>

<style scoped lang="scss">
.c-body {
  width: 90%;
  &.c-maxWidth {
    max-width: calc(100vw - 200px);
  }
}
.c-navDetail {
  margin-bottom: 10px;
  li {
    float: left;
    margin-right: 10px;
  }
}
.c-block {
  margin-top: 15px;
}
.c-search {
  position: relative;
  width: 100%;
  .c-addBtn {
    position: absolute;
    right: 0px;
    top: 0px;
  }
}
// 切换动画
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
       
.fade-enter, .fade-leave-active {
  opacity: 0;
  transform: rotateY(180deg);
}
.fade1-enter-active, .fade1-leave-active {
  transition: all 0.5s ease;
}
       
.fade1-enter, .fade1-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}
</style>
