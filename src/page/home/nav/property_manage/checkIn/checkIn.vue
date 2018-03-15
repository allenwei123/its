<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-date-picker
              v-model="value2"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions1">
            </el-date-picker>
            <el-form-item label="岗位 :">
              <el-select v-model="formInline.class" placeholder="请选择岗位">
                <el-option v-for="item in roleOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="员工">
              <el-input placeholder="请输入员工" type="input" v-model.trim="formInline.name"></el-input>
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
            <el-table-column label="员工" :width="columnWidth" align="center">
              <template slot-scope="scope">{{ scope.row.userName }}</template>
            </el-table-column>
            <el-table-column label="考勤时间" :width="columnWidth" align="center">
              <template slot-scope="scope">{{getTime(scope.row.createAt, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column label="凭证" :width="columnWidth" align="center">
              <template slot-scope="scope">{{ scope.row.url }}</template>
            </el-table-column>
            <el-table-column label="操作" :width="columnWidth" align="center">
               <template slot-scope="scope">
                 <el-button type="primary" size="mini">查看</el-button>
               </template>
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
import scheduleList from '@/mock/scheduleList'
import { communityId as getCommunityList } from '@/biz/community'
export default {
  data () {
    return {
      columnWidth: '260',
      q_input: null,
      formInline:{
        class: 'SECURITY',
        name: ''
      },
      pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      value2: '',
      loading: false,
      roleOptions: [],
      tableData: [],
      pageSize: 10,
      total: 0,
      currentPage: 1
    }
  },
  methods: {
    query() {
      this.currentPage = 1;
      this.q_input = this.formInline.name;
      this.getTableList();
    },
    getTime(timestamp, format) {
      if (timestamp == null) return '/';
      return time.timestampToFormat(timestamp, format);
    },
    initRole(){
      let communityId = scheduleList[0].communityId

      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.roleOptions = res.data;
        }
      })
    },
    getTableList() {
      let communityId = scheduleList[0].communityId
      // let page = this.page
      // let size = this.pageSize
      let params = {
          "communityId":"5a82adf3b06c97e0cd6c0f3d",
        };
      if (this.q_input && this.q_input.length) {
        params['userName'] = this.q_input;
        console.log(33,params);
      };
      let url = `task/record/list`
      this.loading = true;
      this.$xttp
          .get(url, {params})
          .then(res => {
            if(!res.errorCode) {
              console.log(res);
              this.tableData = res.data
              // this.currentPage = res.data;
              this.total = res.data.length;
            }
            this.loading = false;
          })

    }
  },
  created () {
    this.initRole();
    this.getTableList();
  }
}
</script>

