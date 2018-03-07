<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="value" placeholder="请选择">
                <el-option key="1" label="1" value="1"></el-option>
                <el-option key="2" label="2" value="2"></el-option>
                <el-option key="3" label="3" value="3"></el-option>
              </el-select>
            </el-form-item>
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
  import {communityId} from '@/biz/community'
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
        let communityId = communityList[0].id;
        let url = `property/rpass/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params.communityId = communityId;
        if (this.q_input) {
          params.userName = this.q_input;
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
      getCommunityList() {
        this.$xttp.get('community/list').then(res => {

        });
      },
      getTime(timestamp, format) {
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {
      this.getTableList();
    }
  }
</script>

<style scoped lang="scss">

</style>
