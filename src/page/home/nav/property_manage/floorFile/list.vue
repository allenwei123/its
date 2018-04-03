<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="formInline.name" placeholder="楼栋搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="onSubmit">新增楼栋</el-button>
        </div>
      </div>

      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">{{( currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="楼栋名称" min-width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="楼面层数" min-width="60" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.overGround}}</template>
        </el-table-column>
        <el-table-column label="地下层数" min-width="60" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{0 - scope.row.underGround}}</template>
        </el-table-column>
        <el-table-column label="总层数" min-width="60" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.overGround - scope.row.underGround}}</template>
        </el-table-column>
        <el-table-column label="房间数量" min-width="70" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.roomNum}}</template>
        </el-table-column>
        <el-table-column label="已录入房间数" min-width="70" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.inputRoomNum}}</template>
        </el-table-column>
        <el-table-column align="left" fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
            <el-button @click="editHandle(scope.row)" type="warning" size="small">编辑</el-button>
            <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button>
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
    </el-main>
</template>

<script>
import axios from "axios";
import AddPage from "./add";
import SeePage from "./see";
import { mapGetters } from "vuex";

export default {
  name: "floorFileList",
  data() {
    return {
      isSou: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "楼栋档案" }
      ],
      formInline: {
        name: ""
      },
      currentPage: 1,
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
    handleCurrentChange(val) {
      if(this.currentPage !== val){
        this.sendAjax(val);
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
    delHandle(row) {
      this.visible2 = true;
      this.delData = row;
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/community/building/${this.delData.id}/delete`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:res.data,type:'success'});
            this.find();
          }
        })
      }
    },
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        this.sendAjax();
        this.isShow = false;
      }
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    find(){
      this.sendAjax(1);
    },
    sendAjax(page) {
      let nPage = page || this.$route.query.page || 1;
      let obj = {page:nPage,communityId:this.$store.getters.communityId};
      if(this.formInline.name){
        obj.name = this.formInline.name;
      }else {
        delete obj.name ;
      }
      this.loading = true;
      this.$xttp.get("/community/building/page",{params:obj})
      .then(res => {
        if (!res.errorCode) {
          this.tableData = res.data.records;
          this.currentPage = res.data.currentPage;
          this.total = res.data.total;
          this.tableData.forEach(item => {
            if (item.overGround || item.underGround) {
              item.allGound = item.overGround + item.underGround;
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
    this.sendAjax();
    this.$on('upup',(res)=> {
      console.log(res)
    })
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
