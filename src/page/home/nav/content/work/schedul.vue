<template>
  <el-container>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="班次">
              <el-select v-model="formInline.schedul" placeholder="班次">
                <el-option v-for="item in schedulOptions" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="formInline.search" placeholder="关键字搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
              <el-button type="default" @click="setSchedule"><i class="iconfont">&nbsp;</i>早中晚设置</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-edit" class="c-addBtn" @click="handleCreate">新增员工排班</el-button>
        </div>
      </div>
      <el-table class="c-table" :data="tableData" border element-loading-text="努力加载..." 
                border fit highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" type="index" align="center"  width="60"></el-table-column>
        <el-table-column prop="id" v-if="show"></el-table-column>
        <el-table-column prop="userId" v-if="show"></el-table-column>
        <!-- <el-table-column prop="createAt" align="center" label="当前日期"></el-table-column> -->
        <el-table-column prop="" label="当前日期" width="180" align="center">
          <template slot-scope="scope">{{getTime(scope.row.createAt, 'yyyy-MM-dd hh:mm')}}</template>
        </el-table-column>
        <el-table-column prop="userName" label="员工" align="center" width="120"></el-table-column>
        <el-table-column prop="className" label="班次" align="center" width="120"></el-table-column>
        <el-table-column prop="postCode" label="角色" align="center" width="120" :formatter="postCodeFilter"></el-table-column>
        <el-table-column prop="" label="当前日期" width="150" align="center">
          <template slot-scope="scope">{{getTime(scope.row.updateAt, 'yyyy-MM-dd hh:mm')}}</template>
        </el-table-column>
        <el-table-column prop="employeeId" label="员工ID" align="center" width="120"></el-table-column>
        <el-table-column prop="dataStatus" label="使用状态" align="center" width="120" :formatter="dataStatusFilter"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleClick(scope.row)">查看</el-button>
            <!-- <el-button size="mini" type="danger" v-if="scope.row.usestate==='1'">禁用</el-button>
            <el-button v-if="scope.row.usestate==='0'" size="mini" type="success">启用</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <el-dialog :visible.sync="dialogFormVisible">
        <el-form :model="temp" ref="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
          <el-form-item label="早班" prop="name" style="width:540px;">
            <el-time-select
              placeholder="起始时间"
              v-model="mStartTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }">
            </el-time-select> - 
            <el-time-select
              placeholder="结束时间"
              v-model="mEndTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: startTime
              }">
            </el-time-select>
          </el-form-item>
          <el-form-item label="中班" prop="name" style="width:540px;">
            <el-time-select
              placeholder="起始时间"
              v-model="startTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }">
            </el-time-select> - 
            <el-time-select
              placeholder="结束时间"
              v-model="endTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: startTime
              }">
            </el-time-select>
          </el-form-item>
          <el-form-item label="晚班" prop="name" style="width:540px;">
            <el-time-select
              placeholder="起始时间"
              v-model="startTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }">
            </el-time-select> - 
            <el-time-select
              placeholder="结束时间"
              v-model="endTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: startTime
              }">
            </el-time-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import axios from 'axios';
  import { mapGetters, mapActions } from 'vuex'
  import scheduleList from '@/mock/scheduleList'
  import time from '@/utils/time.js';

  const depOptions = [
    { key: 'SD', display_name: '超级管理部门' },
    { key: 'WD', display_name: '维修部' },
    { key: 'GD', display_name: '管理部' }
  ]

  const maleOptions = [
    { key: '0', value: '女'},
    { key: '1', value: '男'}
  ]

  const roleOptions = [
    { key: '0', value: '物业'},
    { key: '1', value: '保安'},
    { key: '2', value: '保洁'},
    { key: '3', value: '水电'}
  ]

  const schedulOptions = [
    { key: '', value: '休班' },
    { key: '0', value: '早班' },
    { key: '1', value: '中班' },
    { key: '2', value: '晚班' },
    { key: '3', value: '早中晚班'}
  ]

  export default {
    name: 'role',
    data() {
        return {
          show: false,
          dialogFormVisible: false,
          dialogStatus: '',
          navDetailData:[{id:0,name:'物业管理'},{id:1,name:'作业管理'},{id:2,name:'排班管理'}],
          formInline: {
            search: '',
            schedul: ''
          },
          currentPage:1,
          loading:false,
          isShow: false,  //控制添加页面弹出
          tableData: [],
          pageSize: 10,
          total: 0,  // 列表总数
          see:false, //控制查看组件弹出
          seeData: null, //查看数据
          temp: {
            time: new Date(),
            role: '',
            dep: '',
            duty: '',
            num: '',
            state: '',
            usestate: '',
            pwd: '',
            phone: '',
            male: '0'
          },
          //  value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
          startTime: '',
          endTime: '',
          depOptions: depOptions,
          maleOptions: maleOptions,
          roleOptions: roleOptions,
          schedulOptions: schedulOptions
        }
    },
    methods: {
      onSubmit() {
        this.notice = null;
      },
      setSchedule(){

      },
      getData(){
        this.loading = true;
        let communityId = scheduleList[0].communityId;
        console.log(communityId)
        // let url = `task/schedule/page?communityId=${communityId}`;
        // let url = `task/schedule/page?page=${this.currentPage}&size=${this.pageSize}&communityId=${communityId}`;
        let url = `task/schedule/page`;
        console.log(url)
        this.$xttp.post(url,{page:this.currentPage,size:this.pageSize,communityId:communityId}).then(res => {
          console.log(res);
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(err => {
          this.$message({
            message: err.response.statusText,
            type: 'error'
          });
        })
      },
      getTime(timestamp, format) {
        return time.timestampToFormat(timestamp, format);
      },
      handleCreate() {
        this.loading = false
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleClick( row ) {
          console.log(row)
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
      dataStatusFilter(row, column) {
        let datastatus = row[column.property];
        if(datastatus == 0){
          return '无效'
        }
        if(datastatus == 1){
          return '有效'
        }
      },
      schedulFilter(row, column) {
        let schedul = row[column.property];
        if(schedul == ''){
          return '无'
        }
        if(schedul == 0){
          return '早班'
        }
        if(schedul == 1){
          return '中班'
        }
        if(schedul == 2){
          return '晚班'
        }
        if(schedul == 3){
          return '早中晚班'
        }
      }
    },
    created () {
      this.getData()
    },
    mounted() {
//      this.$xttp.get('/getUser?ID=12345')
//        .then((res)=> {
//          console.log(res);
//        })
    }
  }
</script>

<style scoped lang="scss">
  .c-navDetail {
    margin-bottom: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
  }
  .c-block {
    margin-top:15px;
  }
  .c-search {
    position: relative;
    width:100%;
    .c-addBtn {
      position: absolute;
      right:0px;
      top:0px;
    }
  }
</style>
