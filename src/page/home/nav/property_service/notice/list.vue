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
      <div class="c-notice-container">
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">
            <el-select v-model="value1" placeholder="全部状态" clearable @change="changeStatus">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker
              v-model="value6"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" clearable @change="changeStatus">
            </el-date-picker>
            <!-- <el-form-item label="">
              <el-input  placeholder="标题" v-model.trim="input"></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="success" plain class="c-addBtn" @click="addNotice">新增公告</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="标题" min-width="180" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.title}}</template>
            </el-table-column>
            <el-table-column label="类型" min-width="60" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getNoticeTypeName(scope.row.noticeType)}}</template>
            </el-table-column>
            <el-table-column label="发布对象" width="100">
              <template slot-scope="scope">{{ scope.row.editorName }}</template>
            </el-table-column>
            <el-table-column label="状态" min-width="100" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getPublishStatusName(scope.row.publishStatus)}}</template>
            </el-table-column>
            <!--<el-table-column label="最后操作人员" min-width="150" :show-overflow-tooltip="true" align="center">-->
              <!--<template slot-scope="scope">{{scope.row.editorName}}</template>-->
            <!--</el-table-column>-->
            <el-table-column label="发布时间" min-width="160" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.updateAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="left">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="preview(scope.row)">预览</el-button>
                <!--已发布-->
                <template v-if="scope.row.publishStatus === 1">
                  <!--推送公告逻辑：此公告已经发布并且还未推送的才能给物业推送，一个公告只能推送一次-->
                  <el-button type="success" size="mini" v-if="scope.row.pushStatus === 0" @click="push(scope.row)">推送</el-button>
                  <el-button type="info" size="mini" @click="revoke(scope.row)">撤销</el-button>
                </template>

                <!--未发布-->
                <template v-if="scope.row.publishStatus !== 1">
                  <el-button type="success" size="mini" @click="publish(scope.row)">发布</el-button>
                  <el-button type="warning" size="mini" @click="modify(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
                </template>
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

      <NoticeForm :detail="formDetail" :isModify="formIsModify" :visible.sync="formVisible" v-if="formVisible" @saveSuccess="query"></NoticeForm>
      <NoticePreview :visible.sync="previewVisible" v-if="previewVisible" :noticeInfo="previewNoticeInfo"></NoticePreview>
    </el-main>
  </el-container>
</template>

<script>
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
        value6: '',
        value1: '',
        options: [ {
          value: '0',
          label: '未发布'
        }, {
          value: '1',
          label: '已发布'
        }, {
          value: '-1',
          label: '已撤销'
        }],
        navDetailData: [
          { id: 0, name: "物业服务" },
          { id: 1, name: "消息管理" },
          { id: 2, name: "社区公告" }
        ],
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        formVisible: false,
        formIsModify: false,
        formDetail: {},
        previewVisible: false,
        previewNoticeInfo: null,
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
      changeStatus() {
        this.query();
        this.tableData = [];
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
      // 删除
      del(item) {
        this.$confirm('确认删除公告？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$xttp.get(`property/notice/${item.id}/delete`).then(res => {
            this.loading = false;
            if (res.errorCode === 0) {
              this.getTableList(1);
            }
          }).catch(() => {
            this.loading = false;
          })
        }).catch(() => {});
      },
      // 修改
      modify(item) {
        this.formIsModify = true;
        this.formDetail = item;
        this.formVisible = true;
      },
      addNotice() {
        this.formIsModify = false;
        this.formVisible = true;
      },
      preview(item) {
        this.previewNoticeInfo = item;
        this.previewVisible = true;
      },
      deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      // 推送
      push(item) {
        this.$confirm('确认推送此公告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$xttp.get(`property/notice/${item.id}/push`).then(res => {
            this.loading = false;
            if (res.errorCode === 0) {
              this.getTableList(1);
            }
          }).catch(() => {
            this.loading = false;
          })
        });
      },
      // 撤销
      revoke(item) {
        // let newItem = this.deepCopy(item);
        // newItem.publishStatus = -1;
        this.loading = true;
        let params = {
          id: item.id,
          publishStatus: -1,
          body: item.body
        };
        this.$xttp.post('property/notice/edit', params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = this.tableData.map(it => {
              if (it === item) {
                it = res.data;
              }
              return it;
            });
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      getTableList(pages) {
        this.loading = true;
        let url = `property/notice/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if(this.value1){
          params['publishStatus'] = this.value1;
        }
        if(this.value6) {
          let a = new Date(this.value6[0]);
          let b = new Date(this.value6[1]);
          params['startAt'] = a.getFullYear() + '-' +(a.getMonth() < 10 ? '0': '')  + (a.getMonth() + 1) + '-' + (a.getDate() < 10 ? '0': '') + a.getDate();
          params['endAt'] = b.getFullYear() + '-' +(b.getMonth() < 10 ? '0': '')  + (b.getMonth() + 1) + '-' + (b.getDate() < 10 ? '0': '') + b.getDate();
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
  .c-navDetail {
    margin-bottom: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
  }

  .c-body {
    width: 90%;
    &.c-maxWidth {
      max-width: calc(100vw - 200px);
    }
  }

  .c-search {
    position: relative;
    width: 100%;
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }

</style>
