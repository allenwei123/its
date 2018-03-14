<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
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
            <el-table-column prop="userName" label="申报人" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="住房" width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.building}}{{scope.row.room}}</template>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="name" label="有效时间" width="280" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.beginAt | time('yyyy-MM-dd HH:mm')}}~{{scope.row.endAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="date" label="状态" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.releaseStatus === 1 ? '有效' : '失效'}}</template>
            </el-table-column>
            <el-table-column prop="name" label="使用时间" width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.updateAt | time('yyyy-MM-dd HH:mm')}}</template>
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
    name: 'rpass',
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
        let url = `property/rpass/page?page=${this.currentPage}&size=${this.pageSize}`;
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
      }
    },
    created() {
      this.query();
    }
  }
</script>

<style scoped lang="scss">

</style>
