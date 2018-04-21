<template>
  <el-container>
    <el-main>
      <!-- <div style="margin-bottom: 5px;"> <b>{{deviceName || '门禁'}}：</b>使用记录</div> -->
      <ul class="c-navDetail clear">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li> -->
      </ul>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-date-picker
                v-model="value6"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" clearable @change="changeStatus">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-input  placeholder="用户姓名" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="用户姓名" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.userName}}</template>
            </el-table-column>
            <el-table-column label="身份" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getuserStatus(scope.row.userStatus)}}</template>
            </el-table-column>
            <el-table-column label="使用时间" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.time | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="使用方式" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getuseStyle(scope.row.useStyle)}}</template>
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
  export default {
    data() {
      return {
        value6: '',
        communityId:this.$store.getters.communityId,
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        deviceName: '',
        navDetailData: [
          { id: 0, name: "社区物联" , router:'/home/nav/communityIoT/elevator' },
          { id: 1, name: "门禁管理", router:'/home/nav/communityIoT/door'},
          { id: 2, name: "门禁档案", router:'/home/nav/communityIoT/door' },
          { id: 3, name: "使用记录" }
        ]
      }
    },
    methods: {
      query() {
        this.q_input = this.input;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList(1);
        }
      },
      changeStatus() {
        this.query();
      },
      getuseStyle(status) {
        let names = {
          '1': '蓝牙',
          '2': '远程'
        };
        return names[status];
      },
      getuserStatus(status) {
        let names = {
          '1': '住户',
          '2': '物业'
        };
        return names[status];
      },
      getTableList(pages) {
        this.loading = true;
        let url = `sys/door-record/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.communityId;
        // params['communityId'] = '5a82adf3b06c97e0cd6c0f3d';
        if(this.value6) {
          let a = new Date(this.value6[0]);
          let b = new Date(this.value6[1]);
          params['startDate'] = a.getFullYear() + '-' +(a.getMonth() < 10 ? '0': '')  + (a.getMonth() + 1) + '-' + (a.getDate() < 10 ? '0': '') + a.getDate();
          params['endDate'] = b.getFullYear() + '-' +(b.getMonth() < 10 ? '0': '')  + (b.getMonth() + 1) + '-' + (b.getDate() < 10 ? '0': '') + b.getDate();
        }
        // params['deviceId'] = this.$route.query.deviceId;
         params['doorId'] = this.$route.query.deviceId;
        // params['doorId'] = '5a965d159ce9abb08ccf3e4a';
        if (this.q_input) {
          params['userName'] = this.q_input;
        }
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      }
    },
    created() {
      this.query();
    }
  }
</script>
<style scoped lang="scss"></style>
