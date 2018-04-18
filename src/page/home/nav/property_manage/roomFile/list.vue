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

            <el-form-item>
              <el-select v-model="formInline.floorSer" @change="changeFloor" placeholder="选择楼栋搜索">
                <el-option
                  v-for="item in floorOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="formInline.name" placeholder="房号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="success" class="c-addBtn" @click="onSubmit" v-if="pms['1111']">新增房间</el-button>
        </div>
      </div>

      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <!-- <el-table-column prop="name" align="center" label="房号"></el-table-column> -->
        <el-table-column label="房号" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <!-- <el-table-column prop="buildingId" align="center" label="所属楼栋"></el-table-column> -->
        <!-- <el-table-column prop="floorNo" align="center" label="所在楼层"></el-table-column> -->
        <el-table-column label="所在楼层" min-width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.floorCode }}</template>
        </el-table-column>
        <el-table-column label="房间面积(P)" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ (scope.row.area / 100).toFixed(2) }}</template>
        </el-table-column>
        <!-- <el-table-column prop="area" align="center" label="房间面积(P)"></el-table-column> -->
        <el-table-column align="left" fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button> -->
            <el-button @click="editHandle(scope.row)" v-if="pms['1112']" type="warning" size="small">编辑</el-button>
            <el-button @click="delHandle(scope.row)" v-if="pms['1114']" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button icon="el-icon-search" circle></el-button>
      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @upup="change"  @reload="find" :add.sync="notice"></AddPage>
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
    </el-main>
</template>

<script>
import axios from "axios";
import AddPage from "./add";
import SeePage from "./see";

export default {
  name: "floorFileList",
  data() {
    return {
      isSou: false,
      tableData: [],
      pms: this.$store.getters.pms,//菜单权限
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "房间档案" }
      ],
      formInline: {
        name: "",
        floorSer: '',
        select:''
      },
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      pageSize: 10,
      notice:null,//编辑传送的值
      see:false,//控制查看组件弹出
      seeData:null,//查看数据
      floorOptions:[],//楼栋下拉框数据
      visible2:false,
      delData:null,//记录删除数据
    };
  },
  components: {
    AddPage,
    SeePage
  },
  methods: {
    onSubmit() {//添加按钮
      this.notice = null;
      this.isShow = !this.isShow;
    },
    handleCurrentChange(val) {
      if(this.currentPage !== val){
        this.sendAjax(val,this.formInline.floorSer,this.formInline.name);
      };
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
    selectCommunity(num){
      let obj = { communityId:this.$store.getters.communityId };
      this.$xttp.get(`/community/building/list`,{params:obj})
        .then(res => {
          if(!res.errorCode){
            this.floorOptions = res.data;
            this.formInline.floorSer = this.floorOptions[0].id;
          }
          if(num) {
            this.sendAjax(1,this.formInline.floorSer)
          }
        })
    },
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        this.isShow = false;
      }
      this.sendAjax(1 ,this.formInline.floorSer);
    },
    delHandle(row) {
      this.visible2 = true;
      this.delData = row;
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/community/room/${this.delData.id}/delete`)
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
    changeFloor(){
      this.find();
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    find(){
      this.sendAjax(1,this.formInline.floorSer,this.formInline.name);
    },
    sendAjax(page,buildingId,name) {
      let nPage = page || this.$route.query.page || 1;
      let obj = {page:nPage}
      if(buildingId){
        obj.buildingId = this.formInline.floorSer;
      }else {
        delete obj.buildingId ;
      }
      if(name){
        obj.name = this.formInline.name;
      }else {
        delete obj.name ;
      }
      this.loading = true;
      this.$xttp.get("/community/room/page",{params:obj})
      .then(res => {
        if (!res.errorCode) {
          this.tableData = res.data.records;
          this.currentPage = res.data.currentPage;
          this.total = res.data.total;
          this.tableData.forEach(item => {
            if (item.createAt) {
              item.time1 = new Date(item.createAt)
                .toISOString()
                .split(".")[0]
                .replace("T", " ");
            }
          });
          this.$router.push({path:this.$route.path,query:{page: nPage }})
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    }
  },
  created() {
    this.selectCommunity(1);
  },
  mounted() {}
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
