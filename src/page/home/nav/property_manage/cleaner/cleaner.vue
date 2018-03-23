<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="员工：" prop="empl">
              <el-select v-model="formInline.empl" placeholder="请选择员工">
                <el-option v-for="item in emplData" :key="item.userName" :label="item.userName" :value="item.userName"> 
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间：">
                <el-date-picker
                    v-model="formInline.rangeDate"
                    type="daterange"
                    align="right"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                    </el-date-picker>
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
import time from '@/utils/time.js'

export default {
  name: "checkin",
  data () {
    return {
      columnWidth: '260',
      q_input: null,
      formInline:{
        empl: '',
        rangeDate: '',
        startDate: '',
        endDate: ''
      },
      pickerOptions: {
        shortcuts: [{
        text: '最近一周',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
        }
        }, {
        text: '最近一个月',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
        }
        }, {
        text: '最近三个月',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
        }
        }]
      },
      // postOptions:[],
      postCode:'CLEANER',
      emplData: [],
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
    changeDate(){
      this.getTableList();
    },
    initRole(){
      let communityId = this.$store.getters.communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    },
    initEmpl() {
      let communityId = this.$store.getters.communityId
      let postCode = this.postCode
      this.$xttp.get(`/user/property/${communityId}/user-list`,{params:{postCode:postCode}})
          .then(res => {
            if(!res.errorCode) {
                console.log(res);
              this.emplData = res.data  
            }
          })
    },
    getTableList(page, userName) {
      let nPage = page || this.$route.query.page || 1;
      let params = {page:nPage}
      if(this.formInline.empl){
        //输入的搜索字添加params中
        params.userName = this.formInline.empl;
      }else {
        delete params.userName ;
      };
      if(this.formInline.startDate == ''){
        //   time.dateFormat(new Date(),'yyyy-MM-01')
          params.startDate = time.dateFormat(new Date(),'yyyy-MM-01')
      }else {
          params.startDate = this.formInline.rangeDate[0];
      }

      if(this.formInline.endDate == ''){
        //   time.dateFormat(new Date(),'yyyy-MM-01')
          params.endDate = time.dateFormat(new Date(),'yyyy-MM-30')
      }else {
          params.endDate = this.formInline.rangeDate[1];
      }

      let communityId = this.$store.getters.communityId;
      params.postCode = this.postCode;
    //   let date = this.formInline.date;
      // let taskType = this.formInline.taskType;
      params.communityId = communityId;
    //   params.startDate = date;
    //   params.endDate = date;
        // params.startDate = this.formInline.rangeDate[0];
        // params.endDate = this.formInline.rangeDate[1];
      // params.taskType = taskType;
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
    this.initEmpl();
    // this.formInline.rangeDate = time.dateFormat(new Date(),'yyyy-MM-01');
    this.getTableList();
  }
}
</script>

