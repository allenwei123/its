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
              <el-button type="primary" @click="query"  v-if="pms['11z1']">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="success" plain @click="addNotice"  v-if="pms['11z6']">新增轮播图</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="60" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column v-if="isShow" label="ID" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column v-if="isShow" label="社区ID" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.communityId}}</template>
            </el-table-column>
            <el-table-column label="标题" min-width="250" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.title}}</template>
            </el-table-column>
            <el-table-column label="类型" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{clientFilter(scope.row.client)}}</template>
            </el-table-column>
            <el-table-column label="素材链接" min-width="300" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope"><el-button type="text">{{scope.row.materialUrl}}</el-button></template>
            </el-table-column>
            <el-table-column label="标签" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.tags}}</template>
            </el-table-column>
            <el-table-column label="跳转链接" min-width="300" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope"><el-button type="text">{{scope.row.href}}</el-button></template>
            </el-table-column>
            <el-table-column label="开始时间" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.beginAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.deadline | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="发布状态" min-width="160" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getPublishedName(scope.row.published)}}</template>
            </el-table-column>
            <el-table-column label="发布时间" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.publishAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="创建时间" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.createAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="修改时间" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.updateAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="数据状态" min-width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{dataStatusFilter(scope.row.dataStatus)}}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center" :fixed="tableData.length ? 'right' : '/'">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="preview(scope.row)"  v-if="pms['11z2']">预览</el-button>
                <template v-if="scope.row.published === 1">
                  <el-button type="primary" size="mini" v-if="(scope.row.published === 0) && pms['11z3']" @click="push(scope.row)">推送</el-button>
                  <el-button type="primary" size="mini" @click="revoke(scope.row)" v-if="pms['11z3']">撤销</el-button>
                </template>

                <template v-if="scope.row.published !== 1">
                  <el-button type="primary" size="mini" @click="publish(scope.row)" v-if="pms['11z4']">发布</el-button>
                  <!-- <el-button type="primary" size="mini" @click="modify(scope.row)">修改</el-button> -->
                  <el-button type="danger" size="mini" @click="del(scope.row)" v-if="pms['11z4']">删除</el-button>
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

      <NoticeForm :detail="formDetail" :isModify="formIsModify" :visible.sync="formVisible" v-if="formVisible" @saveSuccess="getTableList"></NoticeForm>
      <NoticePreview :visible.sync="previewVisible" v-if="previewVisible" :noticeInfo="previewNoticeInfo"></NoticePreview>
    </el-main>
  </el-container>
</template>

<script>
  import NoticeForm from './add';
  import NoticePreview from './preview';
  export default {
    name: 'notice',
    components: {
      NoticeForm,
      NoticePreview
    },
    data () {
      return {
        pms: this.$store.getters.pms,//菜单权限
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
          this.getTableList();
        }
      },
      clientFilter(type) {
          let names = {
              '1000': '住户端',
              '1001': '物业端',
              '1002': 'WEB后台'
          };
          return names[type];
      },
      getPublishedName(type) {
          let names = {
              '1': '已发布',
              '0': '未发布'
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
        let url = `sys/slide/${slideId}/publish`;
        // let url = `property/notice/${slideId}/publish`;
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
          this.$xttp.get(`sys/slide/${item.id}/delete`).then(res => {
            this.loading = false;
            if (res.errorCode === 0) {
              this.getTableList();
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
              this.getTableList();
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
        let id = item.id;
        // sys/slide/{id}/retract

        this.$xttp.get(`sys/slide/${id}/retract`).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            // this.tableData = this.tableData.map(it => {
            //   if (it === item) {
            //     it = res.data;
            //   }
            //   return it;
            // });
            this.getTableList();
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      getTableList() {
        this.loading = true;
        let url = `/sys/slide/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        // params['communityId'] = this.$store.getters.communityId;
        if (this.q_input) {
          params['title'] = this.q_input;
        }
        this.$xttp.post(url,params).then(res => {
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
    //   this.query();
    this.getTableList();
    }
  }
</script>

<style scoped lang="scss">

</style>
