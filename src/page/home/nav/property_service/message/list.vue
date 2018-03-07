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
            <el-table-column label="#" width="80">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="发布住户" width="80">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="发布时间" width="160">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="所属社区" width="80">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="动态详情" width="200">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="缩略图" width="120">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="回复数" width="80">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="点赞数" width="80">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini">查看详情</el-button>
                <el-button type="primary" size="mini">删除动态</el-button>
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
  import {communityId as getCommunityList} from '@/biz/community';
  export default {
    name: 'message',
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
        params.communityId = this.communityId;
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
      getTime(timestamp, format) {
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {
      getCommunityList().then(res => {
        this.communityList = res;
        if (this.communityList.length) {
          this.communityId = this.communityList[0].id;
          this.getTableList();
        }
      });
    }
  }
</script>

<style scoped lang="scss">

</style>
