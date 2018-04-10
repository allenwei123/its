<template>
  <el-container>
    <el-main>
      <div class="c-alarm-container">
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-select v-model="status" clearable placeholder="请选择处理状态" @change="changeStatus">
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
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
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="报警住户" min-width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.callerName}}</template>
            </el-table-column>
            <el-table-column label="住房" min-width="160" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.communityName}}{{scope.row.roomName}}</template>
            </el-table-column>
            <el-table-column label="联系方式" min-width="150" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.callerPhoneNum}}</template>
            </el-table-column>
            <el-table-column label="报警时间" min-width="160" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.callTime | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="警报状态" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.receiveStatus === 1 ? '待处理' : scope.row.receiveStatus === 2 ? '已接警' : '已排查' }}</template>
            </el-table-column>
            <el-table-column label="接警时间" min-width="160" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.receiveTime | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="接警保安" min-width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.receiverName ? scope.row.receiverName : '/'}}</template>
            </el-table-column>
            <el-table-column label="排查时间" min-width="160" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.troubleShootingTime | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="排查结果" min-width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.troubleShootingReport ? scope.row.troubleShootingReport : '/'}}</template>
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
    name: 'alarm',
    data () {
      return {
        navDetailData: [
          { id: 0, name: "物业服务" },
          { id: 1, name: "社区服务" },
          { id: 2, name: "警报记录" }
        ],
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        status: '',
        statusOptions: [{key: 1, name: '待处理'}, {key: 2, name: '已接警'}, {key: 3, name: '已排查'}], //审核状态下拉框数据
        // statusOptions: []
      }
    },
    methods: {
      query() {
        this.q_input = this.input;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList(1);
        }
      },
      getTableList(pages) {
        this.loading = true;
        let url = `property/alarm/getAlarm?page=${pages}&size=${this.pageSize}`;
        let params = {};
        if (this.q_input && this.q_input.length) {
          params['callerName'] = this.q_input;
        }
        params['receiveStatus'] = this.status;
        let communityId = this.$store.getters.communityId;
        params.communityId = communityId;
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
      changeStatus(){
        this.query()
      }
    },
    created() {
      this.getTableList(1);
    }
  }
</script>

<style scoped lang="scss">
.c-body {
  width: 90%;
  &.c-maxWidth {
    max-width: calc(100vw - 200px);
  }
}
.c-navDetail {
  margin-bottom: 10px;
  li {
    float: left;
    margin-right: 10px;
  }
}
.c-block {
  margin-top: 15px;
}
</style>
