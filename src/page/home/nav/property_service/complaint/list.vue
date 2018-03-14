<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input placeholder="投诉人" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column label="#" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="投诉人" width="180" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.userName}}</template>
            </el-table-column>
            <el-table-column label="社区" width="180" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.communityName}}</template>
            </el-table-column>
            <el-table-column label="联系方式" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.phone}}</template>
            </el-table-column>
            <el-table-column label="投诉时间" width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getTime(scope.row.createAt, 'yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="投诉内容" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.content}}</template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
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
  import time from '@/utils/time.js';
  export default {
    name: 'complaint',
    data () {
      return {
        loading: false,
        input: '',
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
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
        let url = `property/complain/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
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
      },
      del(item) {
        this.$confirm('确认删除投诉？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          let url = `property/complain/${item.id}/delete`;
          this.$xttp.get(url).then((res) => {
            this.loading = false;
            if (res.errorCode === 0) {
              this.getTableList();
            }
          }).catch(() => {
            this.loading = false;
          });
        }).catch(() => {});
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
