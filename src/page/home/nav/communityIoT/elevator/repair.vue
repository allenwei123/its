<template>
  <el-container>
    <el-main>
      <div>{{deviceName}}</div>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-date-picker
                v-model="value6"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" clearable @change="changeStatus">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-input  placeholder="维修工单号" v-model.trim="input"></el-input>
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
            <el-table-column label="维修工单号" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.userName}}</template>
            </el-table-column>
            <!-- 暂无 -->
            <el-table-column label="梯号" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.userName}}</template>
            </el-table-column>
            <el-table-column label="故障时间" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.time | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="故障描述" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.useStyle }}</template>
            </el-table-column>
            <el-table-column label="维修状态" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.useStyle }}</template>
            </el-table-column>
            <el-table-column label="维修人员" :show-overflow-tooltip="true">
              <template slot-scope="name">{{ scope.row.useStyle }}</template>
            </el-table-column>
            <el-table-column label="维修时间" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.useStyle }}</template>
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
        value6: '',
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        // 头部的标题
        deviceName: '',
      }
    },
     methods: {
      query() {
        this.q_input = this.input;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
        }
      },
      changeStatus() {
        this.query();
      },
      getTableList() {
        this.loading = true;
        let url = `/communityIoT/elevator/repair/list`;
        let params = {};
        params['communityId'] = '5ab612aa1b2da567cf0d4181';//临时id
        params['elevatorId'] = this.$route.query.id;
        if (this.q_input) {
          // params['name'] = this.q_input;
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
<style scoped lang="scss"></style>
