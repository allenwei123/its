<template>
  <el-container>
    <el-main>
      <div class="c-alarm-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input placeholder="申请人" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="编号" width="220" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="callerName" label="申报人" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="roomName" label="住房" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="callerPhoneNum" label="联系方式" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="报警时间" width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getTime(scope.row.callTime, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column prop="date" label="警报状态" width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.receiveStatus === 1 ? '待处理' : scope.row.receiveStatus === 2 ? '已接警' : '已排查' }}</template>
            </el-table-column>
            <el-table-column label="受理时间" width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getTime(scope.row.receiveTime, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column label="受理人员" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.receiverName ? scope.row.receiverName : '/'}}</template>
            </el-table-column>
            <el-table-column label="排查时间" width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getTime(scope.row.troubleShootingTime, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column label="排查结果" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.troubleShootingReport ? scope.row.troubleShootingReport : '/'}}</template>
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
  import time from '@/utils/time.js';
  export default {
    name: 'alarm',
    data () {
      return {
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null
      }
    },
    methods: {
      query() {
        this.currentPage = 1;
        this.q_input = this.input;
        this.getTableList();
      },
      getTableList() {
        this.loading = true;
        let url = `property/alarm/getAlarm?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        if (this.q_input && this.q_input.length) {
          params['callerName'] = this.q_input;
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
      },
      getTime(timestamp, format) {
        if (timestamp == null) return '/';
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {
      this.query();
    }
  }
</script>

<style scoped lang="scss">

</style>
