<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input placeholder="车闸名称" v-model.trim="input"></el-input>
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
            <el-table-column label="车闸" width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="ID" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="小区名称" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="楼栋名称" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="车闸设备产商" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="型号" width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="运行状态" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini">查看进出记录</el-button>
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
      },
      getTableList() {
        this.loading = true;
        let url = `vehicle/car-gate/list`;
        let params = {};
        if (this.q_input) {
          params['name'] = this.q_input;
        }
        this.$xttp.get(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      }
    }, created() {
      this.query();
    }
  }
</script>
<style scoped lang="scss"></style>
