<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input  placeholder="标题" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="add">新增故障</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="" label="#" width="80">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="" label="故障类型" width="80">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column prop="" label="申报人" width="120">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column prop="" label="身份" width="80">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column prop="" label="联系方式" width="120">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column prop="" label="申报时间" width="160">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column prop="" label="故障描述" width="120">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column prop="" label="故障状态" width="80">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="small">查看详情</el-button>
                <el-button type="primary" size="small">受理故障</el-button>
                <el-button type="primary" size="small">驳回申报</el-button>
                <el-button type="primary" size="small">分配人员</el-button>
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

      <NoticeForm :visible.sync="formVisible"></NoticeForm>
    </el-main>
  </el-container>
</template>

<script>
  import time from '@/utils/time.js';
  import NoticeForm from './form';
  export default {
    name: 'fault',
    components: {
      NoticeForm
    },
    data () {
      return {
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        formVisible: false,
        previewVisible: false,
        previewNoticeInfo: null,
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
      // 发布公告
      publish(item) {
        this.loading = true;
        let noticeId = item.id;
        let url = `property/notice/${noticeId}/publish`;
        this.$xttp.get(url).then((res) => {
          this.loading = false;
          if (res.errorCode === 0) {
            item.publishStatus = 1;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      add() {
        this.formVisible = true;
      },
      getTableList() {
        this.loading = true;
        let url = `property/notice/page?page=${this.currentPage}&size=${this.pageSize}`;
        // this.$xttp.post(url, {
        //   communityId: this.communityId
        // }).then(res => {
        //   this.loading = false;
        //   if (res.errorCode === 0) {
        //     this.tableData = res.data.records;
        //     this.total = res.data.total;
        //   }
        // }).catch(() => {
        //   this.loading = false;
        // })
      },
      getTime(timestamp, format) {
        if (timestamp == null) return '/';
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {

    }
  }
</script>

<style scoped lang="scss">

</style>
