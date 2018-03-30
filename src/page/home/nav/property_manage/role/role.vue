<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <!-- <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="角色">
              <el-input v-model="formInline.role" placeholder="关键字搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="onSubmit">新增角色</el-button>
        </div> -->
      </div>
      
      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" type="index" align="center" min-width="25%"> </el-table-column>
        <!-- <el-table-column prop="key" label="ID" align="center"  width="200"> </el-table-column> -->
        <el-table-column prop="name" label="角色" align="center"  min-width="75%"> </el-table-column>
        <el-table-column v-if="isShow" align="center" label="操作" width="700">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleClick(scope.row)">查看权限</el-button>
            <!-- <el-button size="mini" type="danger" v-if="scope.row.usestate==='1'" @click="handleDiabled(scope.row,'0')">禁用</el-button>
            <el-button v-if="scope.row.usestate==='0'" @click="handleAbled(scope.row,'1')" size="mini" type="success">启用</el-button> -->
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
import AddPage from "./add";
import SeePage from "./see";
import { mapGetters } from "vuex";

export default {
  name: "role",
  data() {
    return {
      isSou: false,
      tableData: [], 
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "员工管理" },
        { id: 2, name: "角色管理" }
      ],
      formInline: {
        role: ""
      },
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      notice:null,//编辑传送的值
      see:false,//控制查看组件弹出
      seeData:null,//查看数据
      visible2:false,//控制删除框
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
      // this.sendAjax(val);
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
    find(){
      this.sendAjax(null,this.formInline.name);
    },
    delHandle(row) {
      this.visible2 = true;
      this.delData = row; 
    },
    handleDiabled(row, usestate){
      this.$message({
        message: '禁用成功',
        type: 'success'
      })
      row.usestate = usestate
    },
    handleAbled(row, usestate){
      this.$message({
        message: '启用成功',
        type: 'success'
      })
      row.usestate = usestate
    },
    maleFilter(row, column) {
      let male = row[column.property];
      if(male == '0'){
        return '女'
      }else if(male == '1'){
        return '男'
      }
    },
    roleFilter(row, column) {
      let role = row[column.property];
      if(role == 0){
        return '超级管理员'
      }
      if(role == 1){
        return '社区管理员'
      }
      if(role == 2){
        return '物业管理员'
      }
    },
    usestateFilter(row, column) {
      let usestate = row[column.property];
      if(usestate == 0){
        return '禁用'
      }
      if(usestate == 1){
        return '正常'
      }
    },
    stateFilter(row, column) {
      let state = row[column.property]
      if(state == 0){
        return '正常'
      }
      if(state == 1){
        return '异常'
      }
    },
    getRole(){
      let communityId = this.$store.getters.communityId;
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(res.success) {
          this.tableData = res.data;
          this.total = res.data.length;
        }
      })
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/community/${this.delData.id}/delete`)
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
    sendAjax(page,name) {
      let nPage = page || this.$route.query.page || 1;
      let obj = {page:nPage}
      if(name){
        obj.name = this.formInline.name;
      }else {
        delete obj.name ;
      }
      this.loading = true;
      this.$xttp.get("/community/page",{params:obj})
      .then(res => {
        if (res.success) {
          this.tableData = res.data.records;
          this.currentPage = res.data.currentPage;
          this.$router.push({path:this.$route.path,query:{page: nPage }})
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    }
  },
  created() {
    // this.sendAjax();
    this.getRole()
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
