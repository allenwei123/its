<template>
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
            <el-form-item label="车牌号">
              <el-input v-model.trim="formInline.carNo" placeholder="关键字搜索"></el-input>
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
        <el-table-column align="center" prop="carNo" label="车牌号" width="300"></el-table-column>
        <el-table-column label="车库信息" width="450" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.parkingName}}</template>
        </el-table-column>
        <el-table-column label="所属住户" width="250" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope"><a href="">{{ scope.row.userName}}</a></template>
        </el-table-column>
        <el-table-column align="center" prop="auditStatus" label="审核状态" :formatter="auditStatusFilter" width="120"></el-table-column>
        <el-table-column align="left" fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button> -->
            <el-button v-if="scope.row.auditStatus == 1 || scope.row.auditStatus == -1" @click="handleUnbundl(scope.row)" type="danger" size="small">注销</el-button>
            <el-button v-if="scope.row.auditStatus == 0" @click="handleDone(scope.row, '1')" type="success" size="small">通过</el-button>
            <el-button v-if="scope.row.auditStatus == 0" @click="handleDone(scope.row,'-1')" type="warning" size="small">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-block">
        <el-pagination
          @current-change="getTableList"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <transition name="fade">
        <AddPage v-if="isShow" :msg="isShow" @reload="getTableList" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <transition name="see">
        <SeePage v-if="isSee" :msg="isSee" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>

      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您是否确定注销车辆吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="温馨提示" :visible.sync="visible3">
          <p v-if="pass">请问您确定绑定车辆吗？</p>
          <p v-if="refuse">请问您确定拒绝绑定车辆吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmPR">确定</el-button>
          </div>
      </el-dialog>
    </el-main>
</template>

<script>
import AddPage from "./add";
import SeePage from "./see";
import { mapGetters } from "vuex";
import time from '@/utils/time.js';

export default {
  name: "schedul",
  data() {
    return {
      show: false,
      postOptions: [],
      isSou: false,
      tableData: [],
      msg: '',
      // communityId:'',
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "车辆认证" }
      ],
      formInline: {
        carNo: ''
      },
      pageSize:10,
      total: 0,
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      isSee: false,
      seeData: null,
      notice:null,//编辑传送的值
      add:false,//控制查看组件弹出
      addData:null,//查看数据
      visible2:false,//控制删除框
      delData:null,
      visible3: false, //审核车辆控件
      carId: null,
      refuse: false,
      pass: false
    };
  },
  computed: mapGetters(["showAside"]),
  components: {
      AddPage,
      SeePage
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
    handleClick(row) {
      //查看
      this.isSee = true;
      this.seeData = row;
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
    seeChange(msg){
      this.isSee = false;
    },
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        // this.sendAjax();
        this.isShow = false;
      }
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
      if (status == 1) {
        this.visible3 = true;
        this.pass = true;
        this.refuse = false;
        this.carId = id;
        this.status = 1;
      }
      if (status == -1) {
        this.visible3 = true;
        this.refuse = true;
        this.pass = false;
        this.carId = id;
        this.status = -1;
      }
    },
    confirmPR() {
      if(this.carId) {
        this.$xttp.post('/vehicle/auditCar',{
          carId: this.carId,
          verifyCode: this.status
        }).then(res => {
          if(res.success) {
            this.visible3 = false;
            this.carId = null,
            this.status = ''
            this.$message({message: '操作成功',type: 'success'});
            this.getTableList();
          }
        })
      }
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/vehicle/deleteCarNo/${this.delData.id}`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:'车辆注销成功',type:'success'});
            // this.find();
            this.getTableList();
          }
        })
      }
    },
    initPost(){
      let communityId = this.$store.getters.communityId;
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    },

    getTableList(page,carNo) {
      let nPage = page || this.$route.query.page || 1;
      let obj = {page:nPage};
      let communityId = this.$store.getters.communityId;
      if(carNo) {
        obj.carNo = this.formInline.carNo;
      } else {
        delete obj.carNo;
      }
      this.$xttp.get(`/vehicle/${communityId}/page`,{params:obj})
          .then(res => {
            if(res.success) {
              this.tableData = res.data.records;
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
      let communityId = this.$store.getters.communityId;
      let carNo = this.formInline.carNo;

      this.$xttp.get(`/vehicle/${communityId}/page?carNo=${carNo}`)
                .then(res => {
        if(!res.errorCode) {
          this.tableData = res.data.records;
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

.el-breadcrumb{
  margin-bottom: 20px;
  font-size: 16px;
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
</style>
