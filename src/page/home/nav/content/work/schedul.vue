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
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-edit" class="c-addBtn" @click="handleCreate">早中晚班设置</el-button>
          <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button> -->
          <!-- <el-button type="primary" icon="el-icon-edit">新增角色</el-button> -->
        </div>
      </div>
      <el-table class="c-table" :data="tableData" border element-loading-text="给我一点时间" 
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
        <!-- <el-table-column prop="role" label="角色" align="center" width="200" :formatter="roleFilter"> </el-table-column>
        <el-table-column prop="dep" label="部门" align="center" width="120"></el-table-column> -->
        
        <!-- <el-table-column prop="male" label="性别" align="center" width="70" :formatter="maleFilter"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="120"> </el-table-column> -->
        <!-- <el-table-column prop="updateAt" label="修改时间" align="center" width="120"></el-table-column> -->
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
          @current-change="getData"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->
      <el-dialog :visible.sync="dialogFormVisible">
        <el-form :model="temp" ref="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
          <el-form-item label="所属部门" prop="dep">
            <el-select class="filter-item" v-model="temp.dep" placeholder="请选择">
              <el-option v-for="item in depOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置角色">
            <el-radio-group v-model="temp.role">
              <el-radio :label="item.value" :key="index" v-for="(item,index) in roleOptions"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="temp.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="male">
            <el-select v-model="temp.male" placeholder="请选择">
              <el-option v-for="item in maleOptions" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="temp.phone" type="text" placeholder="请输入手机号码">
            </el-input>
          </el-form-item>
          <el-form-item label="设置密码" prop="pwd">
            <el-input v-model="temp.pwd" type="password"></el-input>
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
          tableData1: [{
            date: '2018-03-03',
            name: '陈金辉',
            schedul: '0',
            role: '0',
            dep: '住建部'
          }, {
            date: '2018-03-03',
            name: '陈金辉',
            schedul: '0',
            role: '0',
            dep: '住建部'
          }, {
            date: '2018-03-03',
            name: '陈金辉',
            schedul: '0',
            role: '0',
            dep: '住建部'
          }, {
            date: '2018-03-03',
            name: '陈金辉',
            schedul: '0',
            role: '0',
            dep: '住建部'
          }], 
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
          tableData: [],
          pageSize: 10,
          total: 0,
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
          depOptions: depOptions,
          maleOptions: maleOptions,
          roleOptions: roleOptions,
          schedulOptions: schedulOptions
        }
    },
    methods: {
      onSubmit() {
        this.loading = false;
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
