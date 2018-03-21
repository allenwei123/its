<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="status">
                <el-option label="全部账单" value=""></el-option>
                <el-option label="未缴费" value="0"></el-option>
                <el-option label="已缴费" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                v-model="date"
                type="month"
                format="yyyy年MM月"
                value-format="yyyy/MM/01"
                placeholder="账单日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-input  placeholder="业主姓名" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <!--<el-form-item style="float: right">-->
              <!--<el-button type="primary" @click="add">新增账单</el-button>-->
            <!--</el-form-item>-->
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <!--<el-table-column label="账单号" min-width="120" :show-overflow-tooltip="true">-->
              <!--<template slot-scope="scope">{{scope.row.billId}}</template>-->
            <!--</el-table-column>-->
            <el-table-column label="楼栋房号" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.roomName}}</template>
            </el-table-column>
            <el-table-column label="业主姓名" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.proprietorName}}</template>
            </el-table-column>
            <el-table-column label="账单名称" min-width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.billDetailName}}</template>
            </el-table-column>
            <el-table-column label="账单金额" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.currentFee}}</template>
            </el-table-column>
            <el-table-column label="账单状态" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getBillStatusName(scope.row.paymentStatus)}}</template>
            </el-table-column>
            <!--<el-table-column label="缴费方式" min-width="120" :show-overflow-tooltip="true">-->
              <!--<template slot-scope="scope">{{scope.row.paymentMethod}}</template>-->
            <!--</el-table-column>-->
            <!--缴费时间目前没有-->
            <!--<el-table-column label="缴费时间" width="160">-->
              <!--<template slot-scope="scope"></template>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="200" :fixed="tableData.length ? 'right' : '/'">
              <template slot-scope="scope">
                <el-button type="primary" size="mini">确认缴纳</el-button>
                <el-button type="primary" size="mini" @click="viewDetail(scope.row)">查看</el-button>
                <!--<el-button type="primary" size="mini">编辑</el-button>-->
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

      <BillDetail :visible.sync="detailVisible" v-if="detailVisible" :detail="detailInfo"></BillDetail>
    </el-main>
  </el-container>
</template>

<script>
  import BillDetail from './detail';
  export default {
    components: {
      BillDetail
    },
    data () {
      return {
        loading: false,
        status: '',
        date: '',
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        q_status: '',
        q_date: null,
        detailVisible: false,
        detailInfo: {}
      }
    },
    methods: {
      query() {
        this.q_input = this.input;
        this.q_status = this.status;
        this.q_date = this.date;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
        }
      },
      // 账单状态
      getBillStatusName(status) {
        let names = {
          '0': '未缴费',
          '1': '已缴费'
        };
        return names[status];
      },
      add() {

      },
      getTableList() {
        this.loading = true;
        let url = `fees/property-bill/with-details/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        // 缴费状态
        if (this.q_status) {
          params['paymentStatus'] = this.q_status;
        }
        // 日期
        if (this.q_date) {
          params['makeAt'] = this.q_date;
        }
        // 业主名字查询
        if (this.q_input) {
          params['proprietorName'] = this.q_input;
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
      viewDetail(item) {
        this.detailInfo = item;
        this.detailVisible = true;
      }
    },
    created() {
      // this.query();
    }
  }
</script>
