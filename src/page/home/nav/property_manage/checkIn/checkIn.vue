<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- <el-date-picker
              v-model="formInline.date"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions1">
            </el-date-picker> -->
             <el-form-item label="">
              <el-date-picker
                v-model="formInline.date"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="作业类型 :">
              <el-select v-model="formInline.taskType" placeholder="请选择作业类型">
                <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
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
            <el-table-column label="员工" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.userName }}</template>
            </el-table-column>
            <el-table-column label="考勤时间" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getTime(scope.row.createAt, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column label="凭证" min-width="300" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.url }}</template>
            </el-table-column>
            <!-- <el-table-column label="操作" :width="columnWidth" align="center">
               <template slot-scope="scope">
                 <el-button type="primary" size="mini">查看</el-button>
               </template>
            </el-table-column> -->
          </el-table>
        </div>
        <div class="c-pagination">
          <el-pagination
            layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"
            :total="total" :page-size="pageSize" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
const postOptions = [
  {
    key:'1',
    name: '巡更'
  },
  {
    key: '2',
    name: '保洁'
  }
]
import time from '@/utils/time.js'
import { communityId as getCommunityList } from '@/biz/community'
export default {
  name: "checkin",
  data () {
    return {
      columnWidth: '260',
      q_input: null,
      formInline:{
        date: '',
        taskType: '1',
        name: ''
      },
      // postOptions:[],
      postOptions:postOptions,
      value2: '',
      loading: false,
      tableData: [],
      pageSize: 10,
      total: 0,
      currentPage: 1
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.getTableList(val);
    },
    query() {
      this.getTableList(null, this.formInline.name);
    },
    getTime(timestamp, format) {
      if (timestamp == null) return '/';
      return time.timestampToFormat(timestamp, format);
    },
    initRole(){
      let communityId = this.$store.getters.communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    },
    getTableList(page, userName) {
      let nPage = page || this.$route.query.page || 1;
      let params = {page:nPage}
      if(userName){
        //输入的搜索字添加params中
        params.userName = this.formInline.name;
      }else {
        delete params.userName ;
      };
      let communityId = this.$store.getters.communityId;
      let date = this.formInline.date;
      let taskType = this.formInline.taskType;
      params.communityId = communityId;
      params.startDate = date;
      params.endDate = date;
      params.taskType = taskType;
      console.log(params);
      let url = '/task/record/page';
      this.loading = true;
      this.$xttp
          .post(url, params)
          .then(res => {
            if(!res.errorCode) {
              console.log(res);
              this.tableData = res.data.records;
              this.currentPage = res.data.currentPage;
              this.total = res.data.total;
              // this.$router.push({path:this.$route.path,query:{page: nPage }})
            }
            this.loading = false;
          })

    }
  },
  created () {
    // this.initRole();
    this.formInline.date = time.dateFormat(new Date(),'yyyy-MM-dd');
    this.getTableList();
  }
}
</script>

