<template>
  <el-container>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
       <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item style="float: right; margin-bottom: 4px;">
              <el-button type="primary plain" @click="cycleMang">周期管理</el-button>
            </el-form-item>
            <el-form-item style="float: right; margin-bottom: 4px;">
              <el-button type="success plain" @click="addProject">新增项目</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      </div>
      <el-table class="c-table" border :data="tableData" style="width: 100%" v-loading="loading" stripe >
        <el-table-column label="序号" width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column v-if="show" label="ID" min-width="80" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column v-if="show" label="创建时间" min-width="160" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.createAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column label="收费项目" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.itemName }}</template>
        </el-table-column>
        <el-table-column fixed="right" align="left" label="操作" width="500">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="seeHandle(scope.row)">查看</el-button>
            <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button>
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
        <!-- <SeePage v-if="isSee" :msg="isSee" @upsee="upsee" :data="seeData"></SeePage> -->
        <AddPage v-if="isShow" :msg="isShow" @reload="query" @upup="change" :add.sync="projectData"></AddPage>
      </transition>
      <transition name="see">
        <!-- <SeePage v-if="isSee" :msg="isSee" @upsee="upsee" :data="seeData"></SeePage> -->
        <SeePage v-if="isSee" :detail="formDetail" :msg="isSee" @upsee="upsee"></SeePage>
      </transition>

      <transition name="cycle">
        <CyclePage v-if="isCycle" :msg="isCycle" @reload="query" @upcycle="upcycle" :data="cycleData"></CyclePage>
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
import CyclePage from './cycle';

import { mapGetters } from "vuex";
import time from '@/utils/time.js';
  export default {
    name: 'class',
    data () {
      return {
        loading: false,
        show: false,
        isShow: false,
        isSee: false,
        isCycle: false,
        seeData: null,
        visible2: false,
        delData: null,
        cycleData: null,
        formDetail: {},
        navDetailData: [
          { id: 0, name: "物业管理" },
          { id: 1, name: "收费管理" },
          { id: 2, name: "收费管理" }
        ],
        tableData: [],
        pageSize: 10,
        total: 0,
        msg: '',
        currentPage: 1,
        projectData: null
      }
    },
    computed: mapGetters(["showAside"]),
    components: {
      SeePage,
      AddPage,
      CyclePage
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
        let communityId = this.$store.getters.communityId;
        let propertyId = localStorage.getItem('propertyId');
        let url = `/fees/item/page?page=${this.currentPage}&size=${this.pageSize}`;
        this.$xttp.get(url, {params:{communityId:communityId,propertyId:propertyId}}).then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      addProject() {
        this.projectData = null;
        this.isShow = !this.isShow;
      },
      cycleMang() {
        this.cycleData = null,
        this.isCycle = !this.isCycle;
      },
      upcycle(msg){
        this.isCycle = false;
      },
      change(msg) {
        if (msg == 1) {
          this.isShow = false;
        } else if(msg == 2 || msg == 3) {
          this.isShow = false;
        }
      },
      upsee(msg) {  //查看弹窗交互
        this.isSee = false;
      },
      delHandle(row){
        this.visible2 = true;
        this.delData = row;
      },
      seeHandle(row){
        this.isSee = true;
        console.log(row);
        // this.formDetail = row;
        this.formDetail = row;
        // console.log(this.formDetail);
      },
      confirmDel(){
        if(this.delData.id) {
          this.$xttp.get(`fees/item/delete/${this.delData.id}`)
          .then(res => {
            this.loading = false;
            if(res.success){
              this.visible2 = false;
              this.delData = null;
              this.$message({message:'删除成功！',type:'success'});
              this.query();
            }else{
              this.visible2 = false;
              this.delData = null;
              // this.$message({message:'删除成功！',type:'success'});
              this.query();
            }
          }).catch(()=> {
            this.loading = false;
          })
        }
      }
    },
    created() {
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

.see-enter-active, .see-leave-active {
  transition: all 0.5s ease;
}

.see-enter, .see-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}

.cycle-enter-active, .cycle-leave-active {
  transition: all 0.5s ease;
}

.cycle-enter, .cycle-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}
</style>
