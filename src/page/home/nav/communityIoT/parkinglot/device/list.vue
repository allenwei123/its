<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li> -->
      </ul>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input placeholder="车闸" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query" v-if="pms['11Q1']">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="车闸" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.gateName}}</template>
            </el-table-column>
            <!-- <el-table-column label="车库名称" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">/</template>
            </el-table-column> -->
            <!-- <el-table-column label="车闸设备产商" width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="型号" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="设备编号" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">???</template>
            </el-table-column> -->
            <!-- <el-table-column label="运行状态" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getStatusName(scope.row.gateStatus)}}</template>
            </el-table-column> -->
            <el-table-column label="操作" width="150" fixed="right" align="left">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" v-if="pms['11Q2']" @click="viewRecord(scope.row)">进出记录</el-button>
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
  export default {
    data() {
      return {
        pms: this.$store.getters.pms,//菜单权限
        navDetailData: [
          { id: 0, name: "社区物联", router:'/home/nav/communityIoT/elevator' },
          { id: 1, name: "停车管理", router:'/home/nav/communityIoT/parkinglotDevice' },
          { id: 2, name: "停车设备" }
        ],
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
        let url = `vehicle/car-gate/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        if (this.q_input) {
          params['gateName'] = this.q_input;
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
      getStatusName(status) {
        let names = {
          '0': '未知',
          '1': '运行正常',
          '2': '运行故障'
        };
        return names[status];
      },
      viewRecord(item) {
        this.$router.push({
          path: 'parkinglotRecord',
          query: {
            gateName: item.gateName,
            gateNO: item.gateNO,
            inOutTag: item.inOutTag
          }
        })
      }
    }, created() {
      this.query();
    }
  }
</script>
<style scoped lang="scss">
  .c-navDetail {
    margin-bottom: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
  }
</style>
