<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-input placeholder="电梯名/设备ID" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="电梯名" width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="设备ID" width="220" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="所在社区" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.houseName}}</template>
            </el-table-column>
            <el-table-column label="所属楼栋" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.buildName}}</template>
            </el-table-column>
            <el-table-column label="产商" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.brandName}}</template>
            </el-table-column>
            <el-table-column label="型号" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.elevatorTypeName}}</template>
            </el-table-column>
            <el-table-column label="运行状态" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getStatusName(scope.row.elevatorStatus)}}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="viewFault(scope.row)">故障记录</el-button>
                <el-button type="primary" size="mini" @click="viewRecord(scope.row)">使用记录</el-button>
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
    name: 'message', data() {
      return {
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null
      }
    }, methods: {
      query() {
        this.currentPage = 1;
        this.q_input = this.input;
        this.getTableList();
      }, getTableList() {
        this.loading = true;
        let url = `/communityIoT/elevator/list?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if (this.q_input) {
          params['name'] = this.q_input;
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
          '0': '正常',
          '1': '检修',
          '2': '终端断开',
          '3': '故障'
        };
        return names[status];
      },
      // 查看故障记录
      viewFault(item) {
        this.$router.push({
          path: 'elevatorFault',
          query: {
            id: item.id
          }
        })
      },
      // 查看使用记录
      viewRecord(item) {
        this.$router.push({
          path: 'elevatorRecord',
          query: {
            id: item.id
          }
        })
      }
    }, created() {
      this.query();
    }
  }
</script>
<style scoped lang="scss"></style>
