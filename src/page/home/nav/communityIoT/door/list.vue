<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input placeholder="门禁名称" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="门禁" width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="ID" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="小区名称" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{communityName}}</template>
            </el-table-column>
            <el-table-column label="楼栋名称" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.buildingName}}</template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="view(scope.row)">使用记录</el-button>
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
  export default {
    data() {
      return {
        loading: false,
        communityName: this.$store.getters.communityName,
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
        let url = `communityIoT/record/door/list?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if (this.q_input) {
          params['deviceName'] = this.q_input;
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
      view(item) {
        this.$router.push({
          path: '/home/nav/communityIoT/doorRecord',
          query: {
            deviceId: item.deviceId
          }
        });
      }
    }, created() {
      this.query();
    }
  }
</script>
<style scoped lang="scss"></style>
