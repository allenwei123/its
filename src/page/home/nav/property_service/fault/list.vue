<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-input  placeholder="请输入故障申报编号" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="add">新增故障</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 表格 -->
        <div class="c-list">
          <el-table :data="tableData"  style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="编号" width="80">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="faultType" label="故障类型" min-width="80">
              <template slot-scope="scope">{{scope.row.faultType=== 1 ? '住户' : scope.row.faultType === 2 ? '公共' : '其它' }}-{{getfaultItem(scope.row.faultItem)}}</template>
            </el-table-column>
            <el-table-column prop="userName" label="申报人" width="120">
            </el-table-column>
            <el-table-column prop="identity" label="身份" width="80">
              <template slot-scope="scope">{{scope.row.identity=== 1 ? '住户' : scope.row.faultType === 2 ? '物业' : '其它' }}</template>
            </el-table-column>
            <el-table-column prop="contact" label="联系方式" width="120">
            </el-table-column>
            <el-table-column prop="playTime" label="申报时间" width="160">
              <template slot-scope="scope">{{getTime(scope.row.playTime, 'yyyy-MM-dd hh:mm')}}</template>
            </el-table-column>
            <el-table-column prop="faultItem" label="故障描述" width="120">
              <template slot-scope="scope">{{getfaultItem(scope.row.faultItem)}}</template>
            </el-table-column>
            <el-table-column prop="faultStatus" label="故障状态" width="80">
              <template slot-scope="scope">{{getPublishStatusName(scope.row.faultStatus)}}</template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="200" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleClick(scope.row)">查看详情</el-button>
                <!-- 已提交 待受理-->
                <template v-if="scope.row.faultStatus === 1">
                  <el-button type="primary" size="mini" @click="receive(scope.row)">受理故障</el-button>
                  <el-button type="danger" size="mini" @click="reject(scope.row)">驳回申请</el-button>
                </template>

                <!-- 已受理 待分派-->
                <template v-if="scope.row.faultStatus === 2">
                  <el-button type="primary" size="mini" @click="assignHandle(scope.row)">指派人员</el-button>
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
      <!-- 增加故障 -->
      <transition name = "fade1">
        <AddPage v-if="addSee" :msg="addSee" @upsee="addChange" @addSuccess="getTableList"></AddPage>
      </transition>
      <!-- 查看详情 -->
      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData" @accept="receive(seeData)" @del="reject(seeData)"></SeePage>
      </transition>
      <!-- 分配人员 -->
      <!-- <transition name = "fade">
        <AssignPage v-if="showAssign" :msg="showAssign" @upsee="assignChange" :data="assignData" @assignSuccess="assign(assignData)"></AssignPage>
      </transition> -->
      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您确定提交吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirm">确定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="温馨提示" :visible.sync="visible3">
          <p>驳回理由 :</p>
          <el-input type="textarea" v-model.trim="tableData.faultContent" :rows="5"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmReject">确定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="温馨提示" :visible.sync="visible1">
          <p>指派员工 :</p><span>{{repairName}}</span>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="assignStaff">确定</el-button>
          </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import scheduleList from '@/mock/scheduleList'
  import time from '@/utils/time.js';
  //新增故障
  import AddPage from './form';
  //查看详情
  import SeePage from "./see";
  //分配人员
  // import AssignPage from "./assign.vue";
  export default {
    name: 'fault',
    components: {
      AddPage,
      SeePage,
      // AssignPage,
    },
    data () {
      return {
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        formVisible: false,
        // formSee: false,
        previewVisible: false,
        previewNoticeInfo: null,
        input: '',
        q_input: null,
        see: false,//控制查看组件弹出
        seeData: null,//查看数据
        showAssign: false, //控制分配人员组件弹出
        assignData: null,//查看分配人员数组
        visible2: false,//确认框
        delData:null,
        addSee: false, //新增故障页面显示组件弹出
        visible3: false,//驳回申报确认框
        confirmData: '',
        visible1: false,
        confirmAssign: '',
        confirmRejectData: '',
        repairName: '',
        // assignStatus: '',//分派状态
      }
    },
    methods: {
      getTableList(val) {
        this.postData(val);
      },
      query() {
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.postData(null, this.input);
        }
      },
      addChange(msg) {
        this.addSee = false;
      },
      seeChange(msg) {//与查看弹窗交互
        this.see = false;

      },
      // assignChange(msg) {
      //   this.showAssign = false;
      // },
      getPublishStatusName(status) {
        let names = {
          '-1': '已驳回',
          '0': '已取消',
          '1': '已提交',
          '2': '已受理',
          '3': '已指派',
          '4': '已完成',
        };
        return names[status];
      },
      getfaultItem(status) {
        let items = {
          '1': '水电煤气',
          '2': '房屋结构',
          '3': '消防安防',
          '10': '电梯',
          '11': '门禁',
          '99': '其它',
        };
        return items[status];
      },
      handleClick(row) {
        //查看详情弹起 并传数据给see组件
        console.log(33,row.id);
        //查看报修单详细
        let url = `property/fault/${row.id}/detail`;
        this.$xttp.get(url).then(res => {
          if(res.errorCode === 0 ){
          this.seeData = res.data;
          this.see = true;
          return this.seeData;
          }
        }).catch( () => {
          this.loading = false;
        })
      },
      assignHandle(row) {
        this.visible1 = true;
        let url = `property/fault/${row.id}/detail`;
        this.$xttp.get(url).then(res => {
          if(res.errorCode === 0 ){
          this.seeData = res.data;
          row.faultStatus = 3;
          // this.assignStatus = row;
          }
        }).catch( () => {
          this.loading = false;
        })
      },
      assignStaff (){
        this.visible1 = false;
        this.$message({
          message: '分派成功',
          type: 'success'
        });
        this.assign(this.seeData);
        // this.assignStatus = 3;
      },
      //分配人员
      assign(row) {
        console.log(777, row);
        let url = `property/fault/allocation`;
        let params = {
          id: row.id,
          repairId: row.repairId,
          repairName: row.repairName,
          repairContact: row.repairContact
        }
        this.$xttp.post(url, params).then(res => {
          if(res.errorCode === 0) {
            this.loading = false;
            // console.log(123,res.data);
            this.repairName = res.data.repairName;
            // this.assignData = res.data;
            // console.log(this.assignData);
            // this.showAssign = true;
            // this.visible2 = true;
          }
        }).catch( () => {
          this.loading = false;
        })
      },
      //驳回申报弹窗
      reject(row) {
        this.visible3 = true;
        this.confirmRejectData = row;
      },
      confirmReject() {
        this.visible3 = false;
        this.see = false;
        this.$message({
          message: '驳回成功',
          type: 'success'
        });
        this.rejectAccept(this.confirmRejectData);
      },
      //驳回申报
      rejectAccept(row) {
        let url = `property/fault/${row.id}/delete`;
        this.$xttp.get(url).then(res => {
          if(res.errorCode === 0){
            this.loading = false;
            this.visible3 = true;
            this.$message({
              message: '驳回申报成功',
              type: 'success'
            });
          }
        }).catch(() => {
            this.loading = false;
        })
      },
      //受理故障二次确定弹窗
      receive(row) {
        this.visible2 = true;
        this.confirmData = row;
      },
      confirm(confirmData){
        this.visible2 = false;
        this.see = false;
        this.$message({
          message: '受理成功',
          type: 'success'
        });
        this.confirmData.faultStatus = 2;
        this.faultAccept(this.confirmData);
      },
      //受理故障
      faultAccept(row) {
        let url = `property/fault/editFaultStatus`;
        this.$xttp.post(url,{id: row.id, faultStatus: row.faultStatus}).then(res => {
          if(res.errorCode === 0){
            this.loading = false;
            // this.visible2 = true;
            // this.delData = row;
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error('故障受理失败');
        })
      },
      // 发布公告
      publish(item) {
        this.loading = true;
        let noticeId = item.id;
        let url = `property/notice/${noticeId}/publish`;
        this.$xttp.get(url).then((res) => {
          this.loading = false;
          if (res.errorCode === 0) {
            item.publishStatus = 1;
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      add() {
        this.addSee = true;
      },
      postData(page, id) {
        let nPage = page || this.$route.query.page || 1;
        let params = {page:nPage}
        if(id){
          //输入的搜索字添加params中
          params.id = this.input;
        }else {
          delete params.id;
        }
        let communityId = scheduleList[0].communityId;
        params['communityId'] = communityId;
        let url = `property/fault/queryFaultPage?page=${this.currentPage}&size=${this.pageSize}`;
        this.loading = true;
        this.$xttp.post(url, params).then(res => {
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.currentPage = res.data.currentPage;
            this.total = res.data.total;
            this.loading = false;
            this.$router.push({path:this.$route.path,query:{page: nPage }})
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getTime(timestamp, format) {
        if (timestamp == null) return '/';
        return time.timestampToFormat(timestamp, format);
      }
    },
    created() {
      this.postData();
    }
  }
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
