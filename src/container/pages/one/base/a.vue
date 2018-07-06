<template>
  <el-main>
    <div class="c-navDetail">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div  class="c-new-body">
      <div>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="formInline.name" size="small" placeholder="楼栋搜索" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="find">查询</el-button>
              <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
        <ul v-show="false">
          <li class="li">01</li>
          <li class="li">02</li>
          <li class="li">03</li>
          <li class="li">04</li>
          <li class="li">05</li>
        </ul>
        <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." highlight-current-row ref="multipleTable" style="width: 100%">

          <el-table-column label="楼栋名称" min-width="100" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="楼面层数" min-width="60" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.overGround}}</template>
          </el-table-column>
          <el-table-column label="地下层数" min-width="60" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{0 - scope.row.underGround}}</template>
          </el-table-column>
          <el-table-column label="总层数" min-width="60" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.overGround - scope.row.underGround}}</template>
          </el-table-column>
          <el-table-column label="房间数量" min-width="70" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.roomNum}}</template>
          </el-table-column>
          <el-table-column label="已录入房间数" min-width="70" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.inputRoomNum}}</template>
          </el-table-column>
          <el-table-column align="left" fixed="right" label="操作" width="220">
            <template slot-scope="scope">
              <span class="c-handle-btn" @click="handleClick(scope.row)" type="primary">查看</span>
              <span class="c-handle-btn" @click="editHandle(scope.row)"  type="warning">编辑</span>
              <span class="c-handle-btn" @click="delHandle(scope.row)" type="danger">删除</span>
            </template>
          </el-table-column>
        </el-table>
      
        <div class="c-block">
          <el-pagination
            @current-change="find"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>
      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您是否确定删除这条数据吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
          </div>
      </el-dialog>
    </div>
  </el-main>
</template>

<script>
import api from '@/api/basiManage'

export default {
  name: "floorFileList",
  data() {
    return {
      open: false,
      isSou: false,
      tableData: [],
      pms: this.$store.getters.pms,//菜单权限
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "基础管理", router: '/home/nav/side/floorFile' },
        { id: 2, name: "楼栋档案" }
      ],
      formInline: {
        name: ""
      },
      currentPage: + this.$route.query.page || 1,
      pageSize: 10,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      notice:null,//编辑传送的值
      see:false,//控制查看组件弹出
      seeData:null,//查看数据
      visible2:false,
      delData:null
    };
  },
  components: {
  },
  methods: {
    addFloor() {//添加按钮
      this.isShow = true;
      this.notice = null; 
    },
    handleClick(row) {
      //查看
      this.see = true;
      this.seeData = row;
    },
    editHandle(row) {
      //编辑
      this.isShow = true;
      this.notice = row;
    },
    delHandle(row) {
      this.visible2 = true;
      this.delData = row;
    },
    confirmDel(){
      if(this.delData.id){
        api.delete(id)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:res.data,type:'success'});
            this.find();
          }else{
            this.visible2 = false;
            this.delData = null;
          }
        }).catch(err =>{
          console.log(err);
        })
      }
    },
    change(msg) {//与编辑弹窗交互
      if(msg == 3) {
        this.sendAjax();
      }else if(msg == 2){//与添加弹窗交互
        this.formInline.name = null;
        this.currentPage = 1;
        this.sendAjax();
      }
      this.isShow = false;
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    find(){
      this.$router.push({path:this.$route.path ,query:{page:this.currentPage}})
      this.sendAjax();
    },
    sendAjax() {
      let obj = {page:this.currentPage,communityId:this.$store.getters.communityId};
      if(this.formInline.name){
        obj.name = this.formInline.name;
      }else {
        delete obj.name ;
      }
      this.loading = true;
      api.list(obj)
      .then(res => {
        if (!res.errorCode) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.tableData.forEach(item => {
            if (item.overGround || item.underGround) {
              item.allGound = item.overGround + item.underGround;
            }
          });
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    },
  },
  created() {

    this.open = localStorage.getItem('isOpen');
    this.sendAjax();
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
  

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
