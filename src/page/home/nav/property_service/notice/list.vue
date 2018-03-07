<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input  placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button @click="addNotice">新增公告</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="" label="#" width="80">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="180"></el-table-column>
            <el-table-column prop="" label="类型" width="60">
              <template slot-scope="scope">{{getNoticeTypeName(scope.row.noticeType)}}</template>
            </el-table-column>
            <el-table-column prop="communityId" label="所属社区" width="180"></el-table-column>
            <el-table-column prop="" label="发布对象" width="100">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column prop="date" label="状态" width="100">
              <template slot-scope="scope">{{getPublishStatusName(scope.row.publishStatus)}}</template>
            </el-table-column>
            <el-table-column prop="" label="最后操作人员" width="150">
              <template slot-scope="scope">{{scope.row.editorName}}</template>
            </el-table-column>
            <el-table-column prop="" label="最后操作时间" width="160">
              <template slot-scope="scope">{{getTime(scope.row.updateAt, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="preview(scope.row)">预览</el-button>
                <el-button type="primary" size="small" v-if="scope.row.publishStatus !== 1">修改</el-button>
                <el-button type="primary" size="small" v-if="scope.row.publishStatus !== 1" @click="publish(scope.row)">发布</el-button>
                <el-button type="primary" size="small" v-if="scope.row.publishStatus !== 1">删除</el-button>
                <el-button type="primary" size="small" v-if="scope.row.publishStatus === 1" @click="">撤销</el-button>
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
      <NoticePreview :visible.sync="previewVisible" :noticeInfo="previewNoticeInfo"></NoticePreview>
    </el-main>
  </el-container>
</template>

<script>
  import communityList from '@/mock/communityList';
  import time from '@/utils/time.js';
  import NoticeForm from './form';
  import NoticePreview from './preview';
  export default {
    name: 'notice',
    components: {
      NoticeForm,
      NoticePreview
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
        previewNoticeInfo: null
      }
    },
    methods: {
      onSubmit() {
        alert(1)
      },
      // 获取通知类型名称
      getNoticeTypeName(type) {
        let names = {
          '1': '公告',
          '2': '新闻',
          '3': '活动',
          '4': '提醒',
          '99': '其他'
        };
        return names[type];
      },
      getPublishStatusName(status) {
        let names = {
          '-1': '已撤销',
          '0': '未发布',
          '1': '已发布'
        };
        return names[status];
      },
      // 发布公告
      publish(item) {
        this.loading = true;
        let noticeId = item.id;
        let url = `property/notice/${noticeId}/publish`;
        this.$xttp.get(url).then((res) => {
          if (res.errorCode === 0) {
            item.publishStatus = 1;
          }
          else {
            this.$message({
              message: res.errorMsg,
              type: 'error'
            });
          }
        }).catch(err => {
          this.$message({
            meesage: err.response.statusText,
            type: 'error'
          });
        });
      },
      addNotice() {
        this.formVisible = true;
      },
      preview(item) {
        this.previewNoticeInfo = item;
        this.previewVisible = true;
      },
      getTableList() {
        this.loading = true;
        let communityId = communityList[0].id;
        let url = `property/notice/${communityId}/page?page=${this.currentPage}&size=${this.pageSize}`;
        this.$xttp.get(url).then(res => {
          console.log(res);
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          else {
            this.$message({
              message: res.errorMsg,
              type: 'error'
            });
          }
        }).catch(err => {
          this.$message({
            meesage: err.response.statusText,
            type: 'error'
          });
        })
      },
      getTime(timestamp, format) {
        if (timestamp == null) return '/';
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {
      this.getTableList()
    }
  }
</script>

<style scoped lang="scss">

</style>
