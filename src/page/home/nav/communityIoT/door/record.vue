<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-date-picker
                v-model="input"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
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
            <el-table-column label="使用时间" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.time | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="用户姓名" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.userName}}</template>
            </el-table-column>
            <el-table-column label="联系方式" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.phone}}</template>
            </el-table-column>
            <el-table-column label="使用方式" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.userCommand}}</template>
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
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null
      }
    }, methods: {
      query() {
        this.currentPage = 1;
        this.q_input = this.input;
        this.getTableList();
      }, getTableList() {
        this.loading = true;
        let url = `sys/door-record/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        params['deviceId'] = this.$route.query.deviceId;
        if (this.q_input) {
          params['time'] = this.q_input;
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
    }, created() {
      this.query();
    }
  }
</script>
<style scoped lang="scss"></style>
