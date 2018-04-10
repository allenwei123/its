<template>
  <el-container>
    <el-main>
    <ul class="c-navDetail clear">
        <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
    </ul>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input  placeholder="商户名称" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="addNotice">新增轮播图</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="60" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="轮播图" min-width="300" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope"><img :src="uri"></template>
            </el-table-column>
            <el-table-column label="关联社区" min-width="180" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.communityName}}</template>
            </el-table-column>
            <el-table-column label="播放顺序" min-width="100" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.rank}}</template>
            </el-table-column>
            <el-table-column label="跳转类型" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{gotoType(scope.row.gotoType)}}</template>
            </el-table-column>
            <el-table-column label="关联商家" min-width="100" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.shopName}}</template>
            </el-table-column>
            <el-table-column label="链接地址" min-width="100" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.href}}</template>
            </el-table-column>
            <el-table-column label="状态" min-width="160" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getPublishStatusName(scope.row.published)}}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="left">
              <template slot-scope="scope">
                <!-- <el-button type="primary" size="mini" @click="preview(scope.row)">预览</el-button> -->
                <template v-if="scope.row.published === 1">
                  <el-button type="primary" size="mini" v-if="scope.row.published === 0" @click="push(scope.row)">推送</el-button>
                  <el-button type="primary" size="mini" @click="revoke(scope.row)">撤销</el-button>
                </template>

                <template v-if="scope.row.published !== 1">
                  <el-button type="primary" size="mini" @click="publish(scope.row)">发布</el-button>
                  <el-button type="primary" size="mini" @click="modify(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="c-pagination">
          <el-pagination
            layout="total, prev, pager, next, jumper" @current-change="handlegetTableList"
            :total="total" :page-size="pageSize" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </div>

      <NoticeForm :detail="formDetail" :isModify="formIsModify" :visible.sync="formVisible" v-if="formVisible" @saveSuccess="saveSuccess"></NoticeForm>
      <!-- <NoticePreview :visible.sync="previewVisible" v-if="previewVisible" :noticeInfo="previewNoticeInfo"></NoticePreview> -->
    </el-main>
  </el-container>
</template>

<script>
  import NoticeForm from './add';
  // import NoticePreview from './preview';
  import { getUri } from '@/utils/oss';

  export default {
    name: 'slideShow',
    components: {
      NoticeForm,
      // NoticePreview
    },
    data () {
      return {
        navDetailData: [
          { id: 0, name: "首页" },
          { id: 1, name: "周边商圈" },
          { id: 2, name: "轮播图管理" }
        ],
        loading: false,
        isShow: false,
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
        q_input: null,
        uri: '',
        // 当前页
        temp: '',
      }
    },
    methods: {
      handlegetTableList(val) {
        this.temp = val;
        this.getTableList(this.temp);
      },
      query() {
        this.q_input = this.input;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList(1);
        }
      },
      gotoType(type) {
          let names = {
              '1': '本地商店',
              '2': '外来链接',
          };
          return names[type];
      },
      dataStatusFilter(type) {
          let names = {
              '0': '无效',
              '1': '有效'
          };
          return names[type];
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
      // 发布轮播图
      publish(item) {
        this.loading = true;
        let slideId = item.id;
        let url = `biz/slide/${slideId}/publish`;
        this.$xttp.get(url).then((res) => {
          this.loading = false;
          if (res.errorCode === 0) {
            item.published = 1;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      // 删除
      del(item) {
        this.$confirm('确认删除轮播图？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$xttp.get(`biz/slide/${item.id}/delete`).then(res => {
            this.loading = false;
            if (res.errorCode === 0) {
              this.getTableList(this.temp);
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
      saveSuccess() {
        this.$message({
          message: '新增成功',
          type: 'success'
        });
        this.getTableList(this.temp);
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
              this.getTableList(this.temp);
            }
          }).catch(() => {
            this.loading = false;
          })
        });
      },
      // 撤销
      revoke(item) {
        this.loading = true;
        let id = item.id;
        this.$xttp.get(`biz/slide/${id}/revoke`).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.getTableList(this.temp);
            item.published = -1;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      getTableList(pages) {
        this.loading = true;
        let url = `biz/slide/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if (this.q_input) {
          params['shopName'] = this.q_input;
        }
        this.$xttp.post(url,params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.tableData.forEach(element => {
              getUri(element.photo,(uri)=> {
                  this.uri = uri;
              });
            });
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },

      
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
          cursor: pointer;
      }
    }

</style>
