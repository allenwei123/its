<template>
  <el-container>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="所在部门">
              <el-select v-model="formInline.dep" placeholder="所在部门">
                <el-option v-for="item in depOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="formInline.user" placeholder="关键字搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-edit" class="c-addBtn" @click="handleCreate">新增员工</el-button>
          <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button> -->
          <!-- <el-button type="primary" icon="el-icon-edit">新增角色</el-button> -->
        </div>
      </div>
      <el-table class="c-table" :data="tableData" border element-loading-text="给我一点时间" 
                border fit highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" type="index" align="center"  width="60"></el-table-column>
        <el-table-column prop="dep" align="center" label="所属部门"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="120"></el-table-column>
        <el-table-column prop="role" label="当前角色" align="center" width="200" :formatter="roleFilter"> </el-table-column>
        <el-table-column prop="male" label="性别" align="center" width="70" :formatter="maleFilter"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="120"> </el-table-column>
        <el-table-column prop="time" label="创建时间" align="center" width="120"></el-table-column>
        <el-table-column prop="emp_id" label="员工ID" align="center" width="120"></el-table-column>
        <el-table-column prop="usestate" label="使用状态" align="center" width="120" :formatter="usestateFilter"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleClick(scope.row)">查看</el-button>
            <el-button size="mini" type="danger" v-if="scope.row.usestate==='1'">禁用</el-button>
            <el-button v-if="scope.row.usestate==='0'" size="mini" type="success">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="10">
        </el-pagination>
      </div>
      <el-dialog :visible.sync="dialogFormVisible">
        <el-form :rules="rules" :model="temp" ref="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
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

  export default {
    name: 'role',
    data() {
        return {
          tableData: [{
            role: '0',
            dep: '住建部',
            name: '陈以桐',
            male: '0',
            phone: '13211112222',
            time: '2016-05-03 12:10:59',
            emp_id: '000',
            usestate: '0'
          }, {
            role: '1',
            dep: '住建部',
            name: '陈以桐',
            male: '0',
            phone: '13211112222',
            time: '2016-05-03 12:10:59',
            emp_id: '001',
            usestate: '1'
          }, {
            role: '2',
            dep: '住建部',
            name: '陈以桐',
            male: '0',
            phone: '13211112222',
            time: '2016-05-03 12:10:59',
            emp_id: '002',
            usestate: '0'
          }, {
            role: '2',
            dep: '住建部',
            name: '陈以桐',
            male: '0',
            phone: '13211112222',
            time: '2016-05-03 12:10:59',
            emp_id: '003',
            usestate: '1'
          }], 
          dialogFormVisible: false,
          dialogStatus: '',
          navDetailData:[{id:0,name:'物业管理'},{id:1,name:'员工管理'},{id:2,name:'员工管理'}],
          formInline: {
            user: '',
            dep: ''
          },
          currentPage4:1,
          loading:true,
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
          roleOptions: roleOptions
        }
    },
    methods: {
      onSubmit() {
        this.loading = false;
      },
      getData(){

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
      usestateFilter(row, column) {
        let usestate = row[column.property];
        if(usestate == 0){
          return '已禁用'
        }
        if(usestate == 1){
          return '正常'
        }
      }
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
