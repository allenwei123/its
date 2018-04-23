<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </ul>
      <div class="c-notice-container">
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">

            <el-select v-model="status" placeholder="全部状态" clearable @change="changeStatus">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>

            <el-form-item label="">
              <el-input placeholder="住户姓名" v-model.trim="familyName"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="query" v-if="pms['11K1']">查询</el-button>
            </el-form-item>

          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>

            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>

            <el-table-column label="住户姓名" min-width="180" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.silentUserName }}</template>
            </el-table-column>

            <el-table-column label="禁言时长" min-width="100" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.silentMinutes  }}/分钟</template>
            </el-table-column>

            <el-table-column label="剩余时长" width="100">
              <template slot-scope="scope">{{ scope.row.silentEndAt | time }}</template>
            </el-table-column>

            <el-table-column label="状态" min-width="160" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.status == 0 ? '已禁言' :'禁言中' }}</template>
            </el-table-column>

            <el-table-column label="被屏蔽动态" min-width="160" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.publishAt }}</template>
            </el-table-column>

            <el-table-column label="被屏蔽评论" min-width="160" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.publishAt }}</template>
            </el-table-column>

            <el-table-column label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="preview(scope.row)" v-if="pms['11K3']">解除禁言</el-button>
                <el-button type="danger" size="mini" @click="del(scope.row)" v-if="pms['11K6']">禁言</el-button>
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
    name: 'notice',
    data () {
      return {
        pms: this.$store.getters.pms,//菜单权限
        status: '',
        statusOptions: [{label: '待审核',value: '0'},{label: '手动通过',value: '1'},{label: '自动通过',value: '2'},{label: '未通过',value: '-1'},{label: '自动屏蔽',value: '-2'},{label: '手动屏蔽',value: '-3'}],//状态选择数据
        navDetailData: [
          { id: 0, name: "物业服务" },
          { id: 1, name: "社区动态", router: '/home/nav/propertyService/notice' },
          { id: 2, name: "禁言管理" }
        ],
        familyName:'',//用户名称
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
      deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      // 撤销
      revoke(item) {
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
        let url = `mon/silent/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if(this.status){
          params['status'] = this.status;
        }
        if(this.familyName){
          params['silentUserName'] = this.familyName;
        }
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          console.log(res)
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
