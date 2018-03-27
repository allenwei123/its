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
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="报警住户" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.callerName}}</template>
            </el-table-column>
            <el-table-column label="住房" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.roomName}}</template>
            </el-table-column>
            <el-table-column label="联系方式" min-width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.callerPhoneNum}}</template>
            </el-table-column>
            <el-table-column label="报警时间" min-width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.callTime | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="警报状态" min-width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.receiveStatus === 1 ? '待处理' : scope.row.receiveStatus === 2 ? '已接警' : '已排查' }}</template>
            </el-table-column>
            <el-table-column label="接警时间" min-width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.receiveTime | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="接警保安" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.receiverName ? scope.row.receiverName : '/'}}</template>
            </el-table-column>
            <el-table-column label="排查时间" min-width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.troubleShootingTime | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="排查结果" min-width="120" :show-overflow-tooltip="true">
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
        this.q_input = this.input;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
        }
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
      }
    },
    created() {
      this.query();
    }
  }
</script>

<style scoped lang="scss">

</style>
