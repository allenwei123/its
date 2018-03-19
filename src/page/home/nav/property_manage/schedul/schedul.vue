<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
              <el-date-picker
                v-model="formInline.date"
                type="date"
                format="yyyy-MM-dd"
                placeholder="账单日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="formInline.role" placeholder="角色">
                <el-option v-for="item in roleOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="班次">
              <el-select v-model="formInline.schedul" placeholder="班次">
                <el-option v-for="item in schedulOptions" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="onSubmit"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-edit" class="c-addBtn" @click="handleCreate">新增排班</el-button>
        </div>
      </div>
      
      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <!-- <el-table-column label="序号" type="index" align="center"  width="60">{{(currentPage-1) * pageSize + scope.$index + 1}}</el-table-column> -->
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column prop="id" v-if="show"></el-table-column>
        <el-table-column prop="userId" v-if="show"></el-table-column>
        <el-table-column prop="" label="当前日期" width="180" align="center">
          <template slot-scope="scope">{{getTime(scope.row.createAt, 'yyyy-MM-dd hh:mm')}}</template>
        </el-table-column>
        <el-table-column prop="userName" label="员工" align="center" width="120"></el-table-column>
        <el-table-column prop="className" label="班次" align="center" width="120"></el-table-column>
        <el-table-column label="岗位" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.postCode | postCode}}</template>
        </el-table-column>
        <!-- <el-table-column prop="updateAt" label="当前日期" width="150" align="center">
          <template slot-scope="scope">{{getTime(scope.row.updateAt, 'yyyy-MM-dd hh:mm')}}</template>
        </el-table-column>
        <el-table-column prop="employeeId" label="员工ID" align="center" width="120"></el-table-column>
        <el-table-column prop="dataStatus" label="使用状态" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.dataStatus | dataStatus }}</template>
        </el-table-column> -->
        <!-- <el-table-column prop="dataStatus" label="使用状态" align="center" width="120" :formatter="dataStatusFilter"></el-table-column> -->
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleClick(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="30"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div> -->
      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
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
const schedulOptions = [
  { key: '', value: '休班' },
  { key: '0', value: '早班' },
  { key: '1', value: '中班' },
  { key: '2', value: '晚班' },
  { key: '3', value: '早中晚班'}
]

import AddPage from "./sched_add";
import SeePage from "./sched_see";
import { mapGetters } from "vuex";
import scheduleList from '@/mock/scheduleList'
import time from '@/utils/time.js';

export default {
  name: "schedul",
  data() {
    return {
      show: false,
      schedulOptions: schedulOptions,
      roleOptions: [],
      isSou: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "作业管理" },
        { id: 2, name: "排班管理" }
      ],
      formInline: {
        role: 'SECURITY',
        date: new  Date()
      },
      pageSize:10,
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      notice:null,//编辑传送的值
      see:false,//控制查看组件弹出
      seeData:null,//查看数据
      visible2:false,//控制删除框
      delData:null
    };
  },
  computed: mapGetters(["showAside"]),
  components: {
    AddPage,
    SeePage
  },
  methods: {
    onSubmit() {//添加按钮
      this.notice = null;
      this.isShow = !this.isShow;
    },
    getTime(timestamp, format) {
      return time.timestampToFormat(timestamp, format);
    },
    handleCurrentChange(val) {
      this.sendAjax(val);
    },
    handleCreate(){

    },
    handleClick(row) {
      //查看
      this.see = true;
      this.seeData = row;
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
    delHandle(row) {
      this.visible2 = true;
      this.delData = row; 
    },
    handleDiabled(row, usestate){
      this.$message({
        message: '启用成功',
        type: 'success'
      })
      row.usestate = usestate
    },
    handleAbled(row, usestate){
      this.$message({
        message: '禁用成功',
        type: 'success'
      })
      row.usestate = usestate
    },
    initPost(){
      let communityId = this.$store.getters.communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.roleOptions = res.data;
        }
      })
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
    sendAjax(page) {
      let nPage = page || this.$route.query.page || 1;
      let communityId = scheduleList[0].communityId
      console.log(this.formInline.date);
      // let startDate = getTime(this.formInline.date,'yyyy-MM-dd')
      // endDate = time(this.formInline.date)
      let obj = {page:nPage,size:this.pageSize,communityId:communityId}
      // console.log(startDate);
      // console.log(obj);
      // return;
      // return;
      // if(name){
      //   obj.name = this.formInline.name;
      // }else {
      //   delete obj.name ;
      // }
      this.loading = true;
      this.$xttp.post("task/schedule/page",obj)
      .then(res => {
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
    this.initPost();
    this.sendAjax();
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
