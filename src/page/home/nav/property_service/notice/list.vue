<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="communityId" placeholder="社区">
                <el-option v-for="item in communityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input  placeholder="标题" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="addNotice">新增公告</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="" label="#" width="80">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="180"></el-table-column>
            <el-table-column prop="" label="类型" width="60">
              <template slot-scope="scope">{{getNoticeTypeName(scope.row.noticeType)}}</template>
            </el-table-column>
            <el-table-column label="所属社区" width="150">
              <template slot-scope="scope">{{scope.row.communityName}}</template>
            </el-table-column>
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
  import time from '@/utils/time.js';
  import NoticeForm from './form';
  import NoticePreview from './preview';
  import {communityId as getCommunityList} from '@/biz/community';
  export default {
    name: 'notice',
    components: {
      NoticeForm,
      NoticePreview
    },
    data () {
      return {
        loading: false,
        communityList: [],
        communityId: '',
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        formVisible: false,
        previewVisible: false,
        previewNoticeInfo: null,
        input: '',
        q_input: null,
        q_communityId: ''
      }
    },
    methods: {
      query() {
        this.currentPage = 1;
        this.q_input = this.input;
        this.q_communityId = this.communityId;
        this.getTableList();
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
          this.loading = false;
          if (res.errorCode === 0) {
            item.publishStatus = 1;
          }
        }).catch(() => {
          this.loading = false;
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
        let url = `property/notice/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.q_communityId;
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            let communityName = this.communityList.find(item => item.id === this.q_communityId).name;
            this.tableData = res.data.records.map(item => {
              if (!item.communityName) {
                item.communityName = communityName;
              }
              return item;
            });
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getTime(timestamp, format) {
        if (timestamp == null) return '/';
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {
      getCommunityList().then(res => {
        this.communityList = res;
        if (this.communityList.length) {
          this.communityId = this.communityList[0].id;
          this.query();
        }
      });
    }
  }
</script>

<style scoped lang="scss">

</style>
