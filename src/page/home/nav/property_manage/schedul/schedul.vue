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
            <el-form-item label="时间：">
              <el-date-picker
                v-model="formInline.rangeDate"
                type="daterange"
                align="right"
                @change="changeRangeDate"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="formInline.post" placeholder="请选项岗位" @change="changePostCode">
                <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <!-- <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button> -->
              <el-button type="primary" @click="find" v-if="pms['1181']">查询</el-button>
              <!-- <el-button type="success" plain @click="keySchedul">一键排班</el-button> -->
            </el-form-item>
          </el-form>
          <el-button type="success" plain class="c-addBtn" @click="onSubmit" v-if="pms['1182']">新增排班</el-button>
        </div>
      </div>

      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column prop="id" v-if="show"></el-table-column>
        <el-table-column prop="userId" v-if="show"></el-table-column>
        <el-table-column prop="" label="值班日" width="200" align="center">
          <template slot-scope="scope">{{getTime(scope.row.workDate, 'yyyy-MM-dd')}}</template>
        </el-table-column>
        <el-table-column prop="userName" label="员工" align="center" width="150"></el-table-column>
        <el-table-column prop="" label="班次" width="200" align="center">
          <template slot-scope="scope">{{scope.row.className}}({{scope.row.attendTimeStr}}-{{scope.row.offTimeStr}})</template>
        </el-table-column>
        <el-table-column label="岗位" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.postCode | postCode}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editHandle(scope.row)"  v-if="pms['1193']">编辑</el-button>
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
      <transition name="show">
        <AddPage v-if="isShow" :msg="isShow" @upup="change" @reload="sendAjax(1)" :add.sync="notice"></AddPage>
      </transition>
      <transition name="edit">
        <EditPage v-if="isEdit" :msg="isEdit" @upedit="editChange" @reload="sendAjax(1)" :edit.sync="editData"></EditPage>
      </transition>
      <transition name="see">
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
import { mapGetters } from "vuex";
import time from '@/utils/time.js';

import AddPage from "./add";
import SeePage from "./see";
import EditPage from './edit';

export default {
  name: 'schedul',
  data() {
      return {
        show: false,
        pms: this.$store.getters.pms,//菜单权限
        postOptions: [],
        isSou: false,
        tableData: [],
        navDetailData: [
            { id: 0, name: "物业管理", router: '/home/nav/side/floorFile' },
            { id: 1, name: "工作管理", router: '/home/nav/side/class' },
            { id: 2, name: "排班管理" }
        ],
        formInline: {
            rangeDate: '',
            post: 'SECURITY',
            date: ''
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
        total: 0,//列表总数
        pageSize:10,
        currentPage: 1,
        loading: false,
        //添加
        isShow: false, //控制添加页面弹出
        notice:null,//编辑传送的值
        //查看
        see:false,//控制查看组件弹出
        seeData:null,//查看数据
        //删除
        visible2:false,//控制删除框
        delData:null,
        // 修改
        isEdit: false,
        editData: null
      };
  },
  computed: mapGetters(["showAside"]),
  components:{
    AddPage,
    SeePage,
    EditPage
  },
  methods: {
    onSubmit() {//添加按钮
      this.notice = null;
      this.isShow = !this.isShow;
    },
    getTime(timestamp, format) {
      return time.timestampToFormat(timestamp, format);
    },
    handleCurrentChange(val) {
      if(this.currentPage !== val){
        this.sendAjax(val);
      }
    },
    handleCreate(){
      // this.notice = null;
      this.isShow = !this.isShow;
    },
    handleClick(row) {
      //查看
      this.see = true;
      this.seeData = row;
    },
    editHandle(row) {
      //编辑
      this.isEdit = true;
      this.editData = row;
      // this.isShow = true;
      // this.notice = row;
    },
    editHandle(row) {
      //编辑
      this.isEdit = true;
      this.editData = row;
      // this.isShow = true;
      // this.notice = row;
    },
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }
      else if(msg == 2 || msg == 3) {
        // this.sendAjax();
        this.isShow = false;
      }
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    editChange(msg){
      this.isEdit = false;
    },
    changeDate() {
      this.find();
    },
    changePostCode() {
      this.find();
    },
    find(){
      this.sendAjax(1);
    },
    delHandle(row) {
      this.visible2 = true;
      this.delData = row;
    },

    changeRangeDate() {
      this.find();
    },
    initPost(){
      let communityId = this.$store.getters.communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    },
    confirmDel(){
      if(this.delData.id){
        // task/schedule/{id}/delete
        this.$xttp.get(`task/schedule/${this.delData.id}/delete`)
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
    sendAjax(page){
        if(page == 'undefined'){
            this.currentPage = 1;
        }else{
            this.currentPage = page;
        }
        // let nPage = page || this.$store.query.page || 1;
        let obj = {};
        obj['communityId'] = this.$store.getters.communityId;
        if(this.formInline.rangeDate){
            obj['startDate'] = this.formInline.rangeDate[0];
            obj['endDate'] = this.formInline.rangeDate[1];
        }else{
            delete obj.startDate;
            delete obj.endDate;
        }
        if(this.formInline.post){
            obj['postCode'] = this.formInline.post;
        }else{
            delete obj.postCode;
        }

        this.loading = true;
        this.$xttp.post(`task/schedule/page?page=${this.currentPage}&size=${this.pageSize}`,obj).then(res => {
            if(res.success) {
                this.tableData = res.data.records;
                this.currentPage = res.data.currentPage;
                this.total = res.data.total;
                // this.$router.push({path:this.$route.path,query:{page: nPage }})
            }
            this.loading = false;
        }).catch(err => {
            this.loading = false;
        })
    }
  },
  created(){
      this.initPost();
      this.sendAjax(1);
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
.see-enter-active, .see-leave-active {
  transition: all 0.5s ease;
}

.see-enter, .see-leave-active {
  opacity: 0;
  transform: rotateY(180deg);
}
.edit-enter-active, .edit-leave-active {
  transition: all 0.5s ease;
}

.edit-enter, .edit-leave-active {
  opacity: 0;
  transform: rotateY(180deg);
}
.show-enter-active, .show-leave-active {
  transition: all 0.5s ease;
}

.show-enter, .show-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}
</style>
