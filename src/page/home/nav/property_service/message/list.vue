<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
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
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="发布住户" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="发布时间" min-width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="所属社区" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="动态详情" min-width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="缩略图" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="回复数" min-width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="点赞数" min-width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="操作" width="200" :fixed="tableData.length ? 'right' : '/'">
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
  export default {
    name: 'message',
    data () {
      return {
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
        this.currentPage = 1;
        this.q_input = this.input;
        this.getTableList();
      },
      getTableList() {
        this.loading = true;
        let url = `property/rpass/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if (this.q_input) {
          params['userName'] = this.q_input;
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

<style scoped lang="scss">

</style>
