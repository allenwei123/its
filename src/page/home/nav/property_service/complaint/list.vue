<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input  placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="" label="#" width="80">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="title" label="投诉人" width="180">
              <template slot-scope="scope">？？？</template>
            </el-table-column>
            <el-table-column prop="" label="社区" width="180">
              <template slot-scope="scope">？？？</template>
            </el-table-column>
            <el-table-column prop="date" label="联系方式" width="100">
              <template slot-scope="scope">？？？</template>
            </el-table-column>
            <el-table-column prop="" label="投诉时间" width="160">
              <template slot-scope="scope">？？？</template>
            </el-table-column>
            <el-table-column prop="" label="投诉内容" width="160">
              <template slot-scope="scope">？？？</template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="preview(scope.row)">预览</el-button>
                <el-button type="primary" size="small" v-if="scope.row.publishStatus !== 1">修改</el-button>
                <el-button type="primary" size="small" v-if="scope.row.publishStatus !== 1" @click="publish(scope.row)">发布</el-button>
                <el-button type="primary" size="small" v-if="scope.row.publishStatus !== 1">删除</el-button>
                <el-button type="primary" size="small" v-if="scope.row.publishStatus === 1" @click="">撤销</el-button>
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
  import communityList from '@/mock/communityList';
  import time from '@/utils/time.js';
  export default {
    name: 'complaint',
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
      onSubmit() {
        alert(1)
      },
      getTableList() {
        this.loading = true;
        let communityId = communityList[0].id;
        let url = `property/notice/page?page=${this.currentPage}&size=${this.pageSize}`;
        this.$xttp.post(url, {
          communityId: communityId
        }).then(res => {
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
      this.getTableList()
    }
  }
</script>

<style scoped lang="scss">

</style>
