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
              <el-select v-model="formInline.region" placeholder="所在部门">
                <el-option label="物业部" value="shanghai"></el-option>
                <el-option label="交通部" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="formInline.user" placeholder="关键字搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-edit" class="c-addBtn" @click="handleCreate">新增角色</el-button>
          <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button> -->
          <!-- <el-button type="primary" icon="el-icon-edit">新增角色</el-button> -->
        </div>
      </div>
      <el-table
        v-loading="loading"
        class="c-table"
        :data="tableData"
        border
        element-loading-text="给我一点时间"
        border fit highlight-current-row
        ref="multipleTable"
        style="width: 100%">
        <!-- <el-table-column
          type="selection">
        </el-table-column> -->
        <el-table-column
          label="序号"
          type="index"
          width="60">
        </el-table-column>
        <el-table-column
          prop="role"
          label="角色"
          width="150">
        </el-table-column>
        <el-table-column
          prop="dep"
          label="部门">
        </el-table-column>
        <el-table-column
          prop="duty"
          label="功能职责"
          width="120">
        </el-table-column>
        <el-table-column
          prop="time"
          label="创建时间"
          width="200">
        </el-table-column>
        <el-table-column
          prop="num"
          label="人员数量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="usestate"
          label="使用状态"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="300">
        </el-pagination>
      </div>
      <el-dialog :visible.sync="dialogFormVisible">
        <el-form :rules="rules" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
          <!-- <el-form-item label="角色" prop="role">
            <el-input v-model="temp.role"></el-input>
          </el-form-item> -->
          <el-form-item label="所属部门" prop="dep">
            <el-select class="filter-item" v-model="temp.dep" placeholder="Please select" value-key="temp.dep">
              <el-option v-for="item in depOptions" :key="item.key" :label="item.display_name" :value="item.key">{item.k}
              <g></g>
              </el-option>
            </el-select>
            <!-- <el-input v-model="temp.dep"></el-input> -->
          </el-form-item>
          <el-form-item label="配置角色" prop="role">
            <div class="c-buttons">
            <el-button size="medium" class="c-el-button-mr">中等按钮</el-button>
            <el-button size="medium" class="c-el-button-mr">中等按钮</el-button>
            <el-button size="medium" class="c-el-button-mr">中等按钮</el-button>
            <el-button size="medium" class="c-el-button-mr">中等按钮</el-button>
            <el-button size="medium" class="c-el-button-mr">中等按钮</el-button>
            <el-button size="medium" class="c-el-button-mr">中等按钮</el-button>
            <el-button size="medium" class="c-el-button-mr">中等按钮</el-button>
            <el-button size="medium" class="c-el-button-mr">中等按钮</el-button>
            </div>
          </el-form-item>
          <!-- <el-form-item label="功能职责" prop="duty">
            <el-input v-model="temp.duty" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="time">
            <el-date-picker v-model="temp.time" type="datetime" placeholder="Please pick a date">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-input v-model="state"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button> -->
          <!-- <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
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

  export default {
    name: 'role',
    data() {
        return {
          tableData: [{
            role: '超级管理员',
            dep: '住建部',
            duty: '管理房地产',
            time: '2016-05-03 12:10:59',
            num: 200,
            state: '正常',
            usestate: '已禁用'
          }, {
            role: '超级管理员',
            dep: '住建部',
            duty: '管理房地产',
            time: '2016-05-03 12:10:59',
            num: 200,
            state: '正常',
            usestate: '已禁用'
          }, {
            role: '物业管理员',
            dep: '住建部',
            duty: '管理房地产',
            time: '2016-05-03 12:10:59',
            num: 200,
            state: '正常',
            usestate: '已禁用'
          }, {
            role: '普通人员',
            dep: '住建部',
            duty: '管理房地产',
            time: '2016-05-03 12:10:59',
            num: 200,
            state: '正常',
            usestate: '已禁用'
          }], 
          dialogFormVisible: false,
          dialogStatus: '',
          navDetailData:[{id:0,name:'物业管理'},{id:1,name:'员工管理'},{id:2,name:'角色管理'}],
          formInline: {
            user: '',
            region: ''
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
            usestate: ''
          }
        }
    },
    methods: {
      onSubmit() {
        this.loading = false;
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
