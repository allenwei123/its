<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <ul class="c-navDetail clear">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li> -->
        </ul>
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-form-item label="">
               <el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期" clearable  @change="changeStatus">
              </el-date-picker>
            </el-form-item>
            </el-form-item>
            <el-form-item label="">
              <el-input  placeholder="车牌号" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="车牌号码" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.carNo}}</template>
            </el-table-column>
            <el-table-column label="出入闸类型" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getType(gateTypeName)}}</template>
            </el-table-column>
            <el-table-column label="通过时间" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getTime(scope.row) | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <!-- <el-table-column label="车闸名称" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{$route.query.gateName}}</template>
            </el-table-column> -->
            <!-- <el-table-column label="车辆类型" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getChargeTypeName(scope.row.chargeType)}}</template>
            </el-table-column> -->
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
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        date: '',
        value1: '',
        navDetailData: [
          { id: 0, name: "社区物联", router:'/home/nav/communityIoT/elevator' },
          { id: 1, name: "停车管理", router:'/home/nav/communityIoT/parkinglotDevice' },
          { id: 2, name: "停车设备", router:'/home/nav/communityIoT/parkinglotDevice' },
          { id: 3, name: "进出记录" }
        ],
        // inOutTag: '',
      }
    },
    computed: {
      gateTypeName() {
        let inOutTag = parseInt(this.$route.query.inOutTag);
        // return inOutTag === 1 ? '入闸' : '出闸';
        return inOutTag;
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
      changeStatus() {
        this.query();
      },
      getTableList(pages) {
        this.loading = true;
        let url = `vehicle/inout/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        if (this.q_input) {
          params['carNo'] = this.q_input;
        };
        if (this.value1) {
          params['inOutDate'] = this.value1;
        }
        params['inOutTag'] = this.gateTypeName;
        params['gateNO'] = this.$route.query.gateNO;
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
      getType(type) {
        let names = {
          '1': '入闸',
          '2': '出闸',
        };
        return names[type];
      },
      getChargeTypeName(type) {
        let names = {
          '1': '月卡',
          '2': '临时车',
          '3': '免费车',
          '4': '储值卡'
        };
        return names[type];
      },
      getTime(item) {
        let inOutTag = parseInt(this.$route.query.inOutTag);
        return inOutTag === 1 ? item.inTime : item.outTime;
      }
    },
    created() {
      this.query();
    }
  }
</script>
<style scoped lang="scss"></style>
