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
              <el-input placeholder="门禁名称" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column label="序号" width="80">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="门禁" width="200">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="ID">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="小区名称">
              <template slot-scope="scope">{{scope.row.communityName}}</template>
            </el-table-column>
            <el-table-column label="楼栋名称">
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
  import {communityId as getCommunityList} from '@/biz/community';
  export default {
    data() {
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
    }, methods: {
      query() {
        this.currentPage = 1;
        this.q_input = this.input;
        this.q_communityId = this.communityId;
        this.getTableList();
      }, getTableList() {
        this.loading = true;
        let url = `communityIoT/record/door/list?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.communityId;
        if (this.q_input) {
          params['deviceName'] = this.q_input;
        }
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            let communityName = this.communityList.find(item => item.id === this.q_communityId).name;
            this.tableData = res.data.records.map(item => {
              if (!item.communityName) {
                item.communityName = communityName;
              }
              return item;
            });
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
            communityId: item.communityId,
            deviceId: item.deviceId
          }
        });
      }
    }, created() {
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
<style scoped lang="scss"></style>
