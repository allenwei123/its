<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="车牌号">
              <el-input v-model="formInline.carNo" placeholder="关键字搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="addCar">新增车辆</el-button>
        </div>
      </div>
      
      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column v-if="show" align="center" prop="id" label=""></el-table-column>
        <el-table-column v-if="show" align="center" prop="userId" label=""></el-table-column>
        <el-table-column align="center" prop="carNo" label="车牌号" width="120"></el-table-column>
        <el-table-column align="center" prop="carType" label="车辆型号" width="120"></el-table-column>
        <el-table-column align="center" prop="carColor" label="车身颜色" width="100"></el-table-column>
        <el-table-column align="center" prop="parkingName" label="车位信息" width="150"></el-table-column>
        <el-table-column align="center" prop="userName" label="所属住户" width="120"></el-table-column>
        <el-table-column align="center" prop="drivingPermit" label="行驶证号" width="150"></el-table-column>
        <el-table-column align="center" prop="drivingPermitPicUrl" label="行驶证照" width="200"></el-table-column>
        <el-table-column align="center" prop="auditStatus" label="审核状态" :formatter="auditStatusFilter" width="120"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
            <el-button v-if="scope.row.auditStatus == 1" @click="handleUnbundl(scope.row)" type="danger" size="small">解绑</el-button>
            <el-button v-if="scope.row.auditStatus == 0" @click="handleDone(scope.row, '1')" type="success" size="small">通过</el-button>
            <el-button v-if="scope.row.auditStatus == 0" @click="handleDone(scope.row,'-1')" type="warning" size="small">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <transition name="fade">
        <!-- <AddPage v-if="add" :msg="add" @upsee="addChange"  :data="addData"></AddPage> -->
        <AddPage v-if="isShow" :msg="isShow" @upup="change" :add.sync="notice"></AddPage>
      </transition>

      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您是否确定解绑车辆吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
          </div>
      </el-dialog>
    </el-main>
</template>

<script>
import AddPage from "./add";
// import SeePage from "./sched_see";
import { mapGetters } from "vuex";
import scheduleList from '@/mock/scheduleList'
import {communityId as getCommunityList} from '@/biz/community';
import time from '@/utils/time.js';

export default {
  name: "schedul",
  data() {
    return {
      show: false,
      roleOptions: [],
      isSou: false,
      tableData: [],
      msg: '',
      // communityId:'',
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "车辆档案" }
      ],
      formInline: {
        carNo: ''
      },
      pageSize:10,
      total: 0,
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出

      notice:null,//编辑传送的值
      add:false,//控制查看组件弹出
      addData:null,//查看数据
      visible2:false,//控制删除框
      delData:null
    };
  },
  computed: mapGetters(["showAside"]),
  components: {
      AddPage
  //   SeePage
  },
  methods: {
    onSubmit() {//添加按钮
      this.notice = null;
      this.isShow = !this.isShow;
    },
    addCar() {
      //新增
      this.notice = null;
      this.isShow = !this.isShow;
    },
    editHandle(row) {
      //编辑
      this.isShow = true;
      this.notice = row;
    },
    handleUnbundl(row) {
      this.visible2 = true;
      this.delData = row;
    },
    delHandle(row) {
      this.visible2 = true;
      this.delData = row; 
    },
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        // this.sendAjax();
        this.isShow = false;
      }
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    auditStatusFilter(row, column){
      let auditStatus = row[column.property]
      if (auditStatus === 0){
          return '未审核'
      }
      if (auditStatus === 1) {
        return '已审核'
      }
      if (auditStatus === -1) {
        return '未通过'
      }
      if (auditStatus === 3) {
        return '已解绑'
      }
    },
    handleDone(row,status){
      var id = row.id;
      var status = status;
      console.log(id);
      console.log(status)
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/vehicle/deleteCarNo/${this.delData.id}`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:'解绑成功',type:'success'});
            // this.find();
            this.getTableList();
          }
        })
      }
    },
    handleCurrentChange () {

    },
    initRole(){
      let communityId = scheduleList[0].communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.roleOptions = res.data;
        }
      })
    },
    getTableList() {

      let communityId = scheduleList[0].communityId

      this.$xttp.get(`/vehicle/${communityId}/page`)
                .then(res => {
                  if(!res.errorCode) {
                    console.log(res)
                    this.tableData = res.data.records;
                    localStorage.setItem("communityId",res.data.records[0].communityId);
                    this.currentPage = res.data.currentPage;
                    this.total = res.data.total;
                    this.totalPage = res.data.totalPage;
                  }
                  this.loading = false;
                }).catch(err =>{
                  this.loading = false;
                })
    },
    find(){
      let communityId = scheduleList[0].communityId;
      let carNo = this.formInline.carNo;
 
      this.$xttp.get(`/vehicle/${communityId}/page?carNo=${carNo}`)
                .then(res => {
        if(!res.errorCode) {
          this.tableData = res.data.records;
          localStorage.setItem("communityId",res.data.records[0].communityId);
          this.currentPage = res.data.currentPage;
          this.total = res.data.total;
          this.totalPage = res.data.totalPage;
        }
        this.loading = false;
      }).catch(err =>{
        this.loading = false;
      })
    }
  },
  created() {
    // this.sendAjax();
    // this.initRole();
    this.getTableList();
  },
  mounted() {
  }
};
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
.fade1-enter-active, .fade1-leave-active {
  transition: all 0.5s ease;
}
       
.fade1-enter, .fade1-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}
</style>
