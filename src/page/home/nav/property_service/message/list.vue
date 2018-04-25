<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
      </ul>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">

            <el-form-item>
              <el-select v-model="type" placeholder="全部类型" clearable @change="changeTypes">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item>
              <el-select v-model="status" placeholder="全部状态" clearable>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-date-picker
                v-model="times"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" clearable @change="changeTimes">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-input placeholder="住户姓名" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>

            <el-form-item style="float: right;margin-left:126px;">
              <el-button type="success" plain class="c-addBtn" @click="manageClick">审核管理设置</el-button>
            </el-form-item>
          </el-form>

        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column v-if="isShow" align="center" label="ID" min-width="10" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="详情" align="center" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.content }}</template>
            </el-table-column>
            <el-table-column label="动态类型" align="center" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ typeFormat(scope.row.type) }}</template>
            </el-table-column>
            <el-table-column label="住户姓名" align="center" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.creatorName }}</template>
            </el-table-column>
            <el-table-column label="发布时间" align="center" min-width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.createAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
            </el-table-column>
            <el-table-column label="举报数量" align="center" min-width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.reportNum }}</template>
            </el-table-column>
            <el-table-column label="状态" align="center" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ statusFormat(scope.row.status) }}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="300" :fixed="tableData.length ? 'right' : '/'">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="detail(scope.row)">详情</el-button>
                <!--0:待审核-->
                <template v-if="scope.row.status === 0">
                  <el-button type="success" @click="handleDone(scope.row,'1')" size="mini">通过</el-button>
                  <el-button type="warning" @click="handleDone(scope.row,'-1')" size="mini">不通过</el-button>
                </template>

                <!--1:手动通过,2:自动通过-->
                <template v-if="scope.row.status === 1 || scope.row.status === 2">
                  <el-button type="danger" @click="handlePB(scope.row)" size="mini">屏蔽</el-button>
                </template>

                <!--2:自动通过-->
                <template v-if="scope.row.status === -1 || scope.row.status === -2 || scope.row.status === -3">
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="c-pagination">
          <el-pagination
            layout="total, prev, pager, next, jumper" @current-change="getTableList"
            :total="total" :page-size="pageSize" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </div>
      <transition name="fade">
        <editPage v-if="isManage" :msg="isManage" @upsee="manageEmit" ></editPage>
      </transition>

      <el-dialog title="审核" :visible.sync="visible2">
        <p v-if="pass">确定审核通过此条动态?</p>
        <p v-if="refuse">确定拒绝通过此条动态?</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmPR">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="屏蔽" :visible.sync="visible3">
        <p>确定屏蔽此条动态?</p>
        <div style="text-align: right; margin: 0;">
          <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
          <el-button size="mini" type="primary" @click="confirmPB">确定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import time from '@/utils/time.js';
  import editPage from './edit'

  export default {
    name: 'message',
    data () {
      return {
        navDetailData: [
          { id: 0, name: "物业服务" },
          { id: 1, name: "社区动态" ,router:'/home/nav/propertyService/message' },
          { id: 2, name: "动态消息" }
        ],
        isShow: false,
        isManage:false,//审核管理设置
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',//住户
        times: '',//开始结束时间
        typeOptions: [{label: '邻里社交',value: '1'},{label: '悬赏求助',value: '2'},{label: '二手交易',value: '3'}],//类型选择数据
        type:'',//类型
        statusOptions: [{label: '待审核',value: '0'},{label: '手动通过',value: '1'},{label: '自动通过',value: '2'},{label: '未通过',value: '-1'},{label: '自动屏蔽',value: '-2'},{label: '手动屏蔽',value: '-3'}],//状态选择数据
        status:'',//状态
        pass: false,  //通过
        refuse: false,  //拒绝
        visible2: false,  //审核页面
        commentId: '',
        commentStatus: '',
        visible3: false
      }
    },
    components: {
      editPage
    },
    created() {
      this.query();
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
      format(){
        return {
          a: ''
        }
      },
      getTableList() {
        this.loading = true;
        let url = `mom/moment/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        //输入的搜索字添加params中
        if(this.type){
          params['type'] = this.type;
        }
        if(this.status){
          params['status'] = this.status;
        }
        if(this.times){
          let bt = new Date(this.times[0]);
          let et = new Date(this.times[1]);
          params['createStart']= bt.getFullYear() + '-' + (bt.getMonth() < 10 ? '0': '') + (bt.getMonth() + 1) + '-' + (bt.getDate() < 10 ? '0': '') + bt.getDate();
          params['createEnd']= et.getFullYear() + '-' + (et.getMonth() < 10 ? '0': '') + (et.getMonth() + 1) + '-' + (et.getDate() < 10 ? '0': '') + et.getDate();
        }
        if(this.input){
          params['creatorName'] = this.input;
        }
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
      // 获取通知类型名称
      statusFormat(status) {
        let names = {
          '0': '待审核',
          '1': '手动通过',
          '2': '自动通过',
          '-1': '未通过',
          '-2': '自动屏蔽',
          '-3': '手动屏蔽'
        };
        return names[status];
      },
      typeFormat(type){
        let names = {
          '1': '邻里社交',
          '2': '悬赏求助',
          '3': '二手交易'
        };
        return names[type];
      },
      changeTimes(time) {
          
      },
      changeTypes(type) {
        console.log('type:'+ type);
      },
      manageEmit(msg) {
        this.isManage = false;
      },
      manageClick() {
        this.isManage = true;
      },
      detail(row) {
        this.$router.push({path:'/home/nav/propertyService/messageDetail',query:{id:row.id }})
      },
      handleDone(row,status){
        let id = row.id;
        
        if(status == 1){
          this.visible2 = true;
          this.pass = true;
          this.refuse = false;
          this.commentId = id;
          this.commentStatus = status;
        }
        if(status == -1){
          this.visible2 = true;
          this.pass = false;
          this.refuse = true;
          this.commentId = id;
          this.commentStatus = status;
        }

      },
      // 审核动态
      confirmPR(){
        // let url = `mom/moment/${id}/audit?status=${status}`;
        let url = `mom/moment/${this.commentId}/audit?status=${this.commentStatus}`;
        this.$xttp.get(url).then(res => {
          if(res.success){
            this.visible2 = false;
            this.commentId = '';
            this.commentStatus = '';
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getTableList()
          }
        })
      },
      handlePB(row){
        this.visible3 = true;
        this.commentId = row.id;
      },
      // 屏蔽动态
      confirmPB(){

      }
    }
  }
</script>

<style scoped lang="scss">
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 10px;
    }
</style>
