<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="communityId" placeholder="社区">
                <el-option v-for="item in communityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
            <el-table-column prop="id" label="编号" width="220" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="userName" label="申报人" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="住房" width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.building}}{{scope.row.room}}</template>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="name" label="有效时间" width="280" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getTime(scope.row.beginAt, 'yyyy-MM-dd hh:mm')}}~{{getTime(scope.row.endAt, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="date" label="状态" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.releaseStatus === 1 ? '有效' : '失效'}}</template>
            </el-table-column>
            <el-table-column prop="name" label="使用时间" width="160" :show-overflow-tooltip="true">
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
  import time from '@/utils/time.js';
  import {communityId as getCommunityList} from '@/biz/community';
  export default {
    name: 'rpass',
    data () {
      return {
        loading: false,
        communityList: [],
        communityId: '',
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        q_communityId: ''
      }
    },
    methods: {
      query() {
        this.currentPage = 1;
        this.q_input = this.input;
        this.q_communityId = this.communityId;
        this.getTableList();
      },
      getTableList() {
        this.loading = true;
        let url = `property/rpass/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.q_communityId;
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
      getTime(timestamp, format) {
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {
      getCommunityList().then(res => {
        this.communityList = res;
        if (this.communityList.length) {
          this.communityId = this.communityList[0].id;
          this.query();
        }
      });
    }
  }
</script>

<style scoped lang="scss">

</style>
