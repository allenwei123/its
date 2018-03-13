<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="formInline.class" placeholder="请选择班次">
                <el-option ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input placeholder="请输入名称" type="input" v-model.trim="formInline.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="c-list">
          <el-table :data="tableData" style="width:100%" v-loading="loading">
            <el-table-column label="序号" width="80" align="center">
              <template slot-scope="scope">{{ (currentPage -1) * pageSize + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="员工" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="打卡次数" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="迟到次数" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="缺卡次数" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="角色" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <el-button type="primary" size="mini">查看</el-button>
            </el-table-column>
          </el-table>
        </div>
        <div class="c-pagination">
          <el-pagination
            layout="total, prev, pager, next, jumper" @current-change="getTableList"
            :total="total" :page-size="pageSize" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import time from '@/utils/time.js'
import { communityId as getCommunityList } from '@/biz/community'
export default {
  data () {
    return {
      formInline:{
        class: '',
        name: ''
      },
      loading: false,
      tableData: [],
      pageSize: 10,
      total: 0,
      currentPage: 1
    }
  },
  methods: {
    query() {
      
    }
  }
}
</script>

