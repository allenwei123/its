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
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-select v-model="value1" placeholder="全部" clearable @change="changeStatus">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker
              v-model="value6"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" clearable @change="changeStatus">
            </el-date-picker>
            <el-form-item label="">
              <el-input placeholder="投诉人" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query" v-if="pms['11H1']">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="投诉人" min-width="180" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.userName}}</template>
            </el-table-column>
            <el-table-column label="身份" min-width="180" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{identity(scope.row.messageSource)}}</template>
            </el-table-column>
            <!-- <el-table-column label="联系方式" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.phone}}</template>
            </el-table-column> -->
            <el-table-column label="投诉时间" min-width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{getTime(scope.row.createAt, 'yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column label="投诉内容" min-width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.content}}</template>
            </el-table-column>
            <el-table-column label="操作" width="150" :fixed="tableData.length ? 'right' : '/'">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="del(scope.row)" v-if="pms['11H2']">删除</el-button>
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
  import time from '@/utils/time.js';
  export default {
    name: 'complaint',
    data () {
      return {
        pms: this.$store.getters.pms,//菜单权限
        value6: '',
        value1: '',
        options: [ {
          value: '1',
          label: '住户投诉'
        }, {
          value: '2',
          label: '员工投诉'
        }],
        loading: false,
        input: '',
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        navDetailData: [
          { id: 0, name: "物业服务", router: '/home/nav/propertyService/rpass' },
          { id: 1, name: "投诉报事", router: '/home/nav/propertyService/complaint' },
          { id: 2, name: "住户投诉" }
        ],
      }
    },
    methods: {
      identity(status) {
        let names = {
          "1": "住户",
          "2": '物业'
        };
        return names[status];
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
      changeStatus() {
        this.query();
        this.tableData=[];
      },
      getTableList(pages) {
        this.loading = true;
        let url = `property/complain/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if (this.q_input) {
          params['userName'] = this.q_input;
        };
        params['messageSource'] = this.value1;

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
      },
      del(item) {
        this.$confirm('确认删除投诉？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          let url = `property/complain/${item.id}/delete`;
          this.$xttp.get(url).then((res) => {
            this.loading = false;
            if (res.errorCode === 0) {
              this.getTableList(1);
            }
          }).catch(() => {
            this.loading = false;
          });
        }).catch(() => {});
      },
      getTime(timestamp, format) {
        if (timestamp == null) return '/';
        return time.timestampToFormat(timestamp, format);
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

</style>
