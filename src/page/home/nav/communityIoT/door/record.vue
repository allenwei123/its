<template>
  <el-container>
    <el-main>
      <div>{{deviceName}}</div>
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
              <template slot-scope="scope">{{scope.row.phone}}</template>
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
      }
    },
    methods: {
      query() {
        this.q_input = this.input;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
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
      getTableList() {
        this.loading = true;
        let url = `sys/door-record/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.communityId;
        if(this.value6) {
          let a = new Date(this.value6[0]);
          let b = new Date(this.value6[1]);
          params['startDate'] = a.getFullYear() + '-' +(a.getMonth() < 9 ? '0': '')  + (a.getMonth() + 1) + '-' + (a.getDate() < 9 ? '0': '') + a.getDate();
          params['endDate'] = b.getFullYear() + '-' +(b.getMonth() < 9 ? '0': '')  + (b.getMonth() + 1) + '-' + (b.getDate() < 9 ? '0': '') + b.getDate();
        }
        // params['deviceId'] = this.$route.query.deviceId;
        // if (this.q_input) {
        //   params['time'] = this.q_input;
        // }
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
