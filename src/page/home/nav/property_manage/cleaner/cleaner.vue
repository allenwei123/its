<template>
  <el-container>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="员工：" prop="empl">
              <el-select v-model="formInline.empl" clearable @change="changeEmpl" placeholder="请选择员工">
                <el-option v-for="item in emplData" :key="item.userName" :label="item.userName" :value="item.userName"> 
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间：">
              <el-date-picker
                v-model="formInline.rangeDate"
                type="daterange"
                align="right"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changRangeDate"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-button type="primary" class="c-addBtn" @click="addClass">新增班次</el-button> -->
        </div>
      </div>
      <el-table class="c-table" :data="tableData" style="width: 100%" v-loading="loading" stripe >
        <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column v-if="show" label="ID" min-width="80" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column v-if="show" label="创建时间" min-width="160" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.createAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column label="员工" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="考勤时间" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{getTime(scope.row.createAt, 'yyyy-MM-dd hh:mm')}}</template>
        </el-table-column>
        <el-table-column label="凭证" min-width="300" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <!-- <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="seeHandle(scope.row)">查看</el-button>
            <el-button type="primary" size="mini" @click="editHandle(scope.row)">编辑</el-button>
            <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="c-pagination">
        <el-pagination
          layout="total, prev, pager, next, jumper" @current-change="getTableList"
          :total="total" :page-size="pageSize" :current-page.sync="currentPage">
        </el-pagination>
      </div>

      <!-- <transition name="fade">
        <SeePage v-if="isSee" :msg="isSee" @upsee="upsee" :data="seeData"></SeePage>
        <AddPage v-if="isShow" :msg="isShow" @reload="query" @upup="change" :add.sync="classData"></AddPage>
      </transition> -->

      <!-- <el-dialog title="温馨提示" :visible.sync="visible2">
        <p>请问您确定要删除这条数据吗？</p>
        <div style="text-align: right; marigin: 0">
          <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
        </div>
      </el-dialog> -->
    </el-main>
  </el-container>
</template>

<script>
// import SeePage from './see';
// import AddPage from './add';

import { mapGetters } from "vuex";
import time from '@/utils/time.js';
  export default {
    name: 'class',
    data () {
      return {
        loading: false,
        show: false,
        taskType :'2',
        navDetailData: [
          { id: 0, name: "物业管理" },
          { id: 1, name: "排班管理" },
          { id: 2, name: "保洁考勤" }
        ],
        formInline: {
          empl: '',
          rangeDate: '',
          // startDate: '',
          // endDate: ''
          start:'',
          end:''
        },
        pickerOptions: {
          shortcuts: [{
          text: '最近一周',
          onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
          }
          }, {
          text: '最近一个月',
          onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
          }
          }, {
          text: '最近三个月',
          onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
          }
          }]
        },
        postCode:'CLEANER',
        emplData: [],
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null
      }
    },
    computed: mapGetters(["showAside"]),
    components: {
      // SeePage,
      // AddPage
    },
    methods: {
      query() {
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
        }
      },
      getTableList() {
        this.loading = true;
        let params = {};
        params.communityId = this.$store.getters.communityId;
        params.taskType = this.taskType;
        if(this.formInline.empl){
          params.userName = this.formInline.empl;
        } else {
          delete params.userName;
        }

        if(this.formInline.rangeDate == '' || this.formInline.rangeDate == null || this.formInline.rangeDate == 'undefined'){
          params.startDate = time.dateFormat(new Date(),'yyyy-MM-01')
          params.endDate = time.dateFormat(new Date(),'yyyy-MM-30')
        } else {
          params.startDate = (this.formInline.rangeDate)[0];
          params.endDate = (this.formInline.rangeDate)[1]
        }

        let url = `/task/record/page?page=${this.currentPage}&size=${this.pageSize}`;
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      changePostCode(){
        this.query();
      },
      initEmpl() {
        let communityId = this.$store.getters.communityId
        let postCode = this.postCode
        this.$xttp.get(`/user/property/${communityId}/user-list`,{params:{postCode:postCode}})
        .then(res => {
          if(!res.errorCode) {
            this.emplData = res.data  
          }
        })
      },
      getTime(timestamp, format) {
        if (timestamp == null) return '/';
        return time.timestampToFormat(timestamp, format);
      },
      changRangeDate(){
        this.query();
      },
      changeEmpl(){
        this.query()
      }
    },
    created() {
      this.initEmpl()
      this.query();
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
.c-search {
  position: relative;
  width: 100%;
  .c-addBtn {
    position: absolute;
    right: 0px;
    top: 0px;
  }
}
// 切换动画
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter, .fade-leave-active {
  opacity: 0;
  transform: rotateY(180deg);
}
</style>
