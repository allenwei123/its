<template>
  <el-container>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li> -->
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="岗位">
              <el-select v-model.trim="formInline.postCode" placeholder="岗位" @change="changePostCode">
                <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query" v-if="pms['1181']">查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="success" plain class="c-addBtn" @click="addClass">新增班次</el-button>
        </div>
      </div>
      <el-table class="c-table" :data="tableData" style="width: 100%" v-loading="loading" stripe >
        <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column v-if="show" label="ID" min-width="80" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.createAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column label="岗位" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.postCode | postCode}}</template>
        </el-table-column>
        <el-table-column prop="name" label="班次" align="center"  width="150"> </el-table-column>
        <el-table-column label="值班时间" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.attendTime}}~{{scope.row.offTime}}</template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" width="250" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" @click="seeHandle(scope.row)">查看</el-button> -->
            <!-- <el-button type="primary" size="mini" @click="editHandle(scope.row)">编辑</el-button> -->
            <el-button @click="editHandle(scope.row)" v-if="pms['1183']" type="warning" size="small">编辑</el-button>
            <!-- <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="c-pagination">
        <el-pagination
          layout="total, prev, pager, next, jumper" @current-change="getTableList"
          :total="total" :page-size="pageSize" :current-page.sync="currentPage">
        </el-pagination>
      </div>

      <transition name="fade">
        <SeePage v-if="isSee" :msg="isSee" @upsee="upsee" :data="seeData"></SeePage>
        <AddPage v-if="isShow" :msg="isShow" @reload="query" @upup="change" :add.sync="classData"></AddPage>
      </transition>

      <el-dialog title="温馨提示" :visible.sync="visible2">
        <p>请问您确定要删除这条数据吗？</p>
        <div style="text-align: right; marigin: 0">
          <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import SeePage from './see';
import AddPage from './add';

import { mapGetters } from "vuex";
import time from '@/utils/time.js';
  export default {
    name: 'class',
    data () {
      return {
        loading: false,
        show: false,
        pms: this.$store.getters.pms,//菜单权限
        navDetailData: [
          { id: 0, name: "物业管理" },
          { id: 1, name: "作业管理" },
          { id: 2, name: "班次管理" }
        ],
        formInline: {
          postCode: 'SECURITY'
        },
        postOptions:[],
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        isSee: false,
        seeData: null,
        classData: null,
        isShow: false,

        visible2: false, //控制删除弹出框
        delData: null
      }
    },
    computed: mapGetters(["showAside"]),
    components: {
      SeePage,
      AddPage
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
        params.postCode = this.formInline.postCode;
        let url = `/task/class/page?page=${this.currentPage}&size=${this.pageSize}`;
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
      initPost(){
        let communityId = this.$store.getters.communityId
        this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
          if(!res.errorCode) {
            this.postOptions = res.data;
          }
        })
      },
      changePostCode(){
        this.query();
      },
      addClass (){
        this.classData = null;
        this.isShow = !this.isShow;
      },
      seeHandle(row){
        // 查看
        this.isSee = true;
        this.seeData = row;
      },
      editHandle(row) {
        //编辑
        this.isShow = true;
        this.classData = row;
      },
      upsee(msg) {  //查看弹窗交互
        this.isSee = false;
      },
      change(msg) {
        if (msg == 1) {
          this.isShow = false;
          this.query();
        } else if(msg == 2 || msg == 3) {
          this.isShow = false;
          this.query();
        }
      },
      delHandle(row){
        this.visible2 = true;
        this.delData = row;
      },
      confirmDel(){
        if(this.delData.id) {
          this.$xttp.get(`/task/class/${this.delData.id}/delete`)
          .then(res => {
            this.visible2 = false;
            this.delData = null;
            this.$message({message:res.data,type:'success'});
            this.query();
          }).catch(()=> {
            this.loading = false;
          })
        }
      }
    },
    created() {
      this.initPost()
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
