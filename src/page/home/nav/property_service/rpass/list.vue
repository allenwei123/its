<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <div class="c-searchbar">

        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="编号" width="220"></el-table-column>
            <el-table-column prop="userName" label="申报人" width="120"></el-table-column>
            <el-table-column prop="" label="住房" width="150">
              <template slot-scope="scope">{{scope.row.building}}{{scope.row.room}}</template>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
            <el-table-column prop="name" label="有效时间" width="280">
              <template slot-scope="scope">{{getTime(scope.row.beginAt, 'yyyy-MM-dd hh:mm')}}~{{getTime(scope.row.endAt, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="150"></el-table-column>
            <el-table-column prop="date" label="状态" width="80">
              <template slot-scope="scope">{{scope.row.releaseStatus === 1 ? '有效' : '失效'}}</template>
            </el-table-column>
            <el-table-column prop="name" label="使用时间" width="160">
              <template slot-scope="scope">{{getTime(scope.row.updateAt, 'yyyy-MM-dd hh:mm')}}</template>
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
  import communityList from '@/mock/communityList';
  import time from '@/utils/time.js';
  export default {
    name: 'rpass',
    data () {
      return {
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    methods: {
      getTableList() {
        this.loading = true;
        let communityId = communityList[0].id;
        let url = `property/rpass/page?page=${this.currentPage}&size=${this.pageSize}`;
        this.$xttp.post(url, {
          communityId: communityId,
        }).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          else {
            this.$message({
              message: res.errorMsg,
              type: 'error'
            });
          }
        }).catch(err => {
          this.loading = false;
          this.$message({
            message: err.response.statusText,
            type: 'error'
          });
        })
      },
      getTime(timestamp, format) {
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {
      this.getTableList()
    }
  }
</script>

<style scoped lang="scss">

</style>
