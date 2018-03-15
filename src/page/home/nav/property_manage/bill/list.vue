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
              <el-input  placeholder="标题" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="add">新增账单</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="账单号" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.title}}</template>
            </el-table-column>
            <el-table-column label="楼栋" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.buildingName}}</template>
            </el-table-column>
            <el-table-column label="房号" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.roomName}}</template>
            </el-table-column>
            <el-table-column label="业主姓名" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.proprietorName}}</template>
            </el-table-column>
            <el-table-column label="账单名称" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.editorName}}</template>
            </el-table-column>
            <el-table-column label="账单金额" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.editorName}}</template>
            </el-table-column>
            <el-table-column label="账单状态" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getBillStatusName(scope.row.paymentStatus)}}</template>
            </el-table-column>
            <el-table-column label="缴费方式" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.paymentMethod}}</template>
            </el-table-column>
            <!--缴费时间目前没有-->
            <!--<el-table-column label="缴费时间" width="160">-->
              <!--<template slot-scope="scope"></template>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="250" :fixed="tableData.length ? 'right' : '/'">
              <template slot-scope="scope">
                <el-button type="primary" size="mini">确认缴纳</el-button>
                <el-button type="primary" size="mini">查看</el-button>
                <el-button type="primary" size="mini">编辑</el-button>
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
    data () {
      return {
        loading: false,
        status: '',
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        q_status: '',
      }
    },
    methods: {
      query() {
        this.q_input = this.input;
        this.q_status = this.status;
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
        alert('add');
      },
      getTableList() {
        this.loading = true;
        let url = `fees/getPropBillForPropertyByCommunityId`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        params['page'] = this.currentPage;
        params['size'] = this.pageSize;
        if (this.q_status) {
          // params['paymentStatus'] = this.q_status;
        }
        if (this.q_input) {
          // params[''] = this.q_input;
        }
        this.$xttp.get(url, {
          params
        }).then(res => {
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
