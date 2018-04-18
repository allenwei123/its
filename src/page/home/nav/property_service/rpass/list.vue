<template>
  <el-container>
    <el-main>
      <div class="c-rpass-container">
        <ul class="c-navDetail clear">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li> -->
        </ul>
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-select v-model="releaseStatus" clearable placeholder="放行条状态" @change="changeStatus">
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input placeholder="申请人" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query" v-if="pms['11D1']">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" border stripe>
            <el-table-column label="序号" width="80" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="申报人" min-width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.userName}}</template>
            </el-table-column>
            <el-table-column label="相关住房" min-width="150" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.building}}{{scope.row.room}}</template>
            </el-table-column>
            <el-table-column label="联系方式" min-width="150" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.phone}}</template>
            </el-table-column>
            <el-table-column label="有效时间" min-width="320" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.beginAt | time('yyyy-MM-dd HH:mm')}}~{{scope.row.endAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="放行备注" min-width="300" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.remark}}</template>
            </el-table-column>
            <el-table-column label="备注照片" min-width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope"><el-button type="text">{{scope.row.url === null ? '无' : scope.row.url }}</el-button></template>
            </el-table-column>
            <!-- <el-table-column label="备注照片" min-width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope"><el-button><img width="60px" height="60px" :src="scope.row.uri"></el-button></template>
            </el-table-column> -->
            <el-table-column label="状态" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.releaseStatus === 1 ? '已使用' : scope.row.releaseStatus === -1 ? '已过期': '未使用' }}</template>
            </el-table-column>
            <el-table-column label="使用时间" min-width="160" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.updateAt | time('yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="放行保安" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.verifierName}}</template>
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
import { send as ossUpload, getUri } from "@/utils/oss";

  export default {
    name: 'rpass',
    data () {
      return {
        pms: this.$store.getters.pms,//菜单权限
        navDetailData: [
          { id: 0, name: "物业服务" },
          { id: 1, name: "社区服务" },
          { id: 2, name: "放行条" }
        ],
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        releaseStatus: '',
        uri: null,
        statusOptions: [{key: 1, name: '已使用'}, {key: 0, name: '未使用'}, {key: -1, name: '已过期'}], //审核状态下拉框数据
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
      getTableList(pages) {
        this.loading = true;
        let url = `property/rpass/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if (this.q_input) {
          params['userName'] = this.q_input;
        }
        params['releaseStatus'] = this.releaseStatus;

        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            console.log(res.data.records);
            this.tableData = res.data.records;
            this.total = res.data.total;
            // this.tableData.forEach(function(item) {
            //   if(item.url != null){
            //       getUri(item.url,key => {
            //       item.uri = key;
            //     })
            //   }else{
            //     console.log("haha")
            //   }
              
            // })
            this.loading = false;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      changeStatus(){
        this.query()
      }
    },
    created() {
      // this.getListData(1);
      this.getTableList(1);
    }
  }
</script>

<style scoped lang="scss">
.c-body {
  width: 90%;
  &.c-maxWidth {
    max-width: calc(100vw - 200px);
  }
}
.c-navDetail {
  margin-bottom: 10px;
  li {
    float: left;
    margin-right: 10px;
  }
}
.c-block {
  margin-top: 15px;
}
</style>
