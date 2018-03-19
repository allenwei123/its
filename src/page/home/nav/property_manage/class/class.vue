<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="角色">
              <el-select v-model="formInline.role" placeholder="角色">
                <el-option v-for="item in roleOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="addClass">新增班次</el-button>
        </div>
      </div>
      
      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" type="index" align="center" width="60"> </el-table-column>
        <el-table-column label="ID" type="id" align="center" prop="id" v-if="show"></el-table-column>
        <el-table-column label="角色" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.postCode | postCode}}</template>
        </el-table-column>
        <el-table-column prop="name" label="班次" align="center"  width="150"> </el-table-column>
        <el-table-column label="值班时间" min-width="320" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.attendTime}}~{{scope.row.offTime}}</template>
        </el-table-column>
        <!-- <el-table-column prop="attendTime" label="值班时间" align="center"  width="200"></el-table-column>
        <el-table-column prop="offTime" label="结束时间" align="center"  width="200"> </el-table-column> -->
        <el-table-column prop="remark" label="备注信息" align="center"  width="200"> </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="seeHandle(scope.row)">查看</el-button>
            <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div> -->
      <transition name="fade">
        <!-- <AddPage v-if="add" :msg="add" @upsee="addChange"  :data="addData"></AddPage> -->
        <AddPage v-if="isShow" :msg="isShow" @reload="getTableList" @upup="change" :add.sync="notice"></AddPage>
        <SeePage v-if="isSee" :msg="isSee" @upsee="upsee"  :data="seeData" ></SeePage>
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
import AddPage from "./class_add";
import SeePage from "./class_see";
import { mapGetters } from "vuex";
import scheduleList from '@/mock/scheduleList'
import time from '@/utils/time.js';

export default {
  name: "class",
  data() {
    return {
      show: false,
      roleOptions: [],
      isSou: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "作业管理" },
        { id: 2, name: "班次管理" }
      ],
      formInline: {
        role: 'SECURITY'
      },
      pageSize:10,
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      isSee: false, //控制查看页面
      seeData: null,

      notice:null,//编辑传送的值
      add:false,//控制查看组件弹出
      addData:null,//查看数据
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
    addClass() {
      //新增
      this.notice = null;
      this.isShow = !this.isShow;
    },
    seeHandle(row) {
      //查看
      this.isSee = true;
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
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        // this.sendAjax();
        this.isShow = false;
      }
    },
    upsee(msg) {//与查看弹窗交互
      this.isSee = false;
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/task/class/${this.delData.id}/delete`)
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
    initPost(){
      let communityId = this.$store.getters.communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.roleOptions = res.data;
        }
      })
    },
    getTableList() {
      let communityId = this.$store.getters.communityId
      this.$xttp.get('/task/class/list',{params:{communityId:communityId,postCode:'SECURITY',propertyId:'5a82adee9ce976452b7001ee'}})
          .then(res => {
            if(!res.errorCode) {
              this.tableData = res.data;
            }
            this.loading = false;
          }).catch(err =>{
            this.loading = false;
          })
    },
    find(){
      var postCode = this.formInline.role;
      let communityId = this.$store.getters.communityId
      this.$xttp.get('/task/class/list',{params:{communityId:communityId,postCode:postCode,propertyId:'5a82adee9ce976452b7001ee'}})
          .then(res => {
            if(!res.errorCode) {
              this.tableData = res.data
            }
            this.loading = false;
          }).catch(err =>{
            this.loading = false;
          })
      
    }
  },
  created() {
    // this.sendAjax();
    this.initPost();
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
