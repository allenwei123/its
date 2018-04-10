<template>
  <el-main>
    <div>
      <ul class="c-navDetail clear">
        <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span
          v-if="index !== navDetailData.length -  1"> > </span></li>
      </ul>
      <div class="c-search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-select v-model="formInline.floorSer" clearable placeholder="选择楼栋搜索" @change="changeFloor">
              <el-option
                v-for="item in floorOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.value" placeholder="请选择状态" @change="changeStatus">
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input v-model.trim="formInline.name" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
      <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
      <el-table-column label="序号" width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
      </el-table-column>

      <el-table-column label="合同编号" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.contract }}</template>
      </el-table-column>

      <el-table-column label="姓名" width="120" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="手机号" width="120" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>

      <el-table-column label="身份证" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.identityCard }}</template>
      </el-table-column>

      <el-table-column label="住房" width="120" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.roomName }}</template>
      </el-table-column>

      <el-table-column label="申请时间" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.time1 }}</template>
      </el-table-column>

      <el-table-column label="认证状态" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.filterStatus }}</template>
      </el-table-column>

      <!-- <el-table-column label="审核人员" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.auditor }}</template>
      </el-table-column>

      <el-table-column label="审核时间" width="200" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.auditTime | time('yyyy-MM-dd HH:mm:ss') }}</template>
      </el-table-column> -->

      <el-table-column align="left" fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="printHandle(scope.row)" type="primary" size="small">
            认证详情
          </el-button>
          <el-button @click="handle(scope.row,1)" v-if="scope.row.auditStatus == 0" type="success" size="small">审核
          </el-button>
          <el-button @click="handle(scope.row,2)" v-if="scope.row.auditStatus == 0" type="warning" size="small">驳回
          </el-button>
          <el-button @click="handle(scope.row,3)" v-if="scope.row.auditStatus == 1" type="danger" size="small">注销
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="c-block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="温馨提示" :visible.sync="visible3">
      <p v-if="pass">确定认证通过吗？</p>
      <p v-if="refuse">确定驳回认证吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmPR">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="温馨提示" :visible.sync="visible2">
      <p>请问您确定注销住户吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
      </div>
    </el-dialog>

    <printPage v-if="boolDialog" :data.sync="printData" @upup="change" :msg="boolDialog"></printPage>
  </el-main>
</template>

<script>
  import printPage from "./print";
  import {mapGetters} from "vuex";
  import time from '@/utils/time.js';

  export default {
    name: "PromiseFile",
    data() {
      return {
        isSou: false,
        tableData: [],
        floorOptions: [],
        navDetailData: [
          {id: 0, name: "首页"},
          {id: 1, name: "基础管理"},
          {id: 2, name: "住户认证"}
        ],
        formInline: {
          floorSer: '',
          name: '',
          value: ''
        },
        // currentPage: 1,
        pageSize: 10,
        total: 0,
        currentPage: 1,
        loading: false,
        total: 0, //列表总数
        seeData: null, //查看数据
        // statusList: [{id: 0, name: '未审核'}, {id: 1, name: '已通过'}, {id: -1, name: '驳回'}, {id: -2, name: '违规'}, {id: 2, name: '已注销'}, {id: 3, name: '已解绑'}], //审核状态下拉框数据
        statusList: [{id: null, name: '未审核'}, {id: 1, name: '已通过'}, {id: -1, name: '驳回'}, {id: 2, name: '已注销'}], //审核状态下拉框数据
        visible2: false,
        boolDialog: false, //控制打印窗口
        printData: null,

        visible3: false,
        pass: false,
        refuse: false,
        auditData:null,
        num:''
      };
    },
    computed: mapGetters(["showAside"]),
    components: {
      printPage
    },
    methods: {
      handleCurrentChange(val) {
        if (this.currentPage !== val) {
          this.sendAjax(val, this.formInline.name);
        }
      },
      printHandle(row) {
        //打印
        // if (row.auditStatus == 1) {
          this.$xttp.get(`/user/${row.id}/contract-info`).then(res => {
            if (!res.errorCode) {
              this.boolDialog = true;
              this.printData = res.data;
            }
          });
        // }
      },
      handle(row, num) {
        let status, msg;
        if (num == 1 || num == 2) {
          //1 审核  2 驳回
          status = num == 1 ? 1 : -1;
          msg = num == 1 ? '审核' : '驳回';

          if(num == 1){
            this.visible3 = true;
            this.pass = true;
            this.refuse = false;
            this.auditData = row;
            this.num = num;
          }

          if (num == 2){
            this.visible3 = true;
            this.pass = false;
            this.refuse = true;
            this.auditData = row;
            this.num = num;
          }
        } else if (num == 3) {
          this.visible2 = true;
          this.delData = row;
        }
      },
      change(msg) {
        //与打印交互
        this.boolDialog = false;
      },
      confirmPR() {
        this.$xttp
        .post(`/user/property/audit`, {id: this.auditData.id, auditStatus: this.num})
        .then(res => {
          if (!res.errorCode) {
            this.$message({
              message: '温馨提示：认证成功!',
              type: "success"
            });
            this.visible3 = false;
            this.auditData = null;
            this.num = '';
            this.find();
          }
        });
      },
      confirmDel() {
        this.$xttp
          .get(`/user/property/${this.delData.roomId}/relieve`)
          .then(res => {
            if (!res.errorCode) {
              this.$message({
                message: `温馨提示，该次注销成功！`,
                type: "success"
              });
              this.visible2 = false;
              this.delData = null;
              this.find();
            }
          });
      },
      change(msg) {
        //与添加弹窗交互
        this.boolDialog = msg;
      },
      selectCommunity(num){
        let obj = { communityId:this.$store.getters.communityId };
        this.$xttp.get(`/community/building/list`,{params:obj})
          .then(res => {
            if(!res.errorCode){
              this.floorOptions = res.data;
              // this.formInline.floorSer = this.floorOptions[0].id;
            }
            if(num) {
              this.sendAjax(1,this.formInline.floorSer)
            }
          })
      },
      seeChange(msg) {
        //与查看弹窗交互
        this.see = false;
      },
      find() {
        this.sendAjax(null, this.formInline.name);
      },
      changeStatus(){
        this.find();
      },
      changeFloor(){
        this.find();
      },
      sendAjax(page, name) {
        let nPage = page || this.$route.query.page || 1;
        let status = '';
        if(this.formInline.floorSer == ''){
          this.formInline.floorSer = null;
        }
        if(this.formInline.value == ''){
          this.formInline.value = null;
        }
        if(this.formInline.value == null){
          status = 0;
        }else{
          status = this.formInline.value
        }

        let obj = {page: nPage, relationship: 1, communityId: this.$store.getters.communityId ,buildingId:this.formInline.floorSer,auditStatus:status,name:this.formInline.name};
        if (name) {
          obj.name = this.formInline.name;
        } else {
          delete obj.name;
        }
        
        this.loading = true;
        this.$xttp
          .get(`/user/${obj.communityId}/getByCommunityId`, {params: obj})
          .then(res => {
            if (!res.errorCode) {
              this.tableData = res.data.records;
              this.currentPage = res.data.currentPage;
              this.total = res.data.total;
              if(this.obj.auditStatus == 0){
                this.formInline.value = '未认证';
              }
              
              this.tableData.forEach(item => {
                if (item.checkInTime) {
                  item.time1 = new Date(item.createAt)
                    .toISOString()
                    .split(".")[0]
                    .replace("T", " ");
                }

                switch (item.auditStatus) {
                  case 0:
                    item.filterStatus = "未审核";
                    break;
                  case 1:
                    item.filterStatus = "审核通过";
                    break;
                  case -1:
                    item.filterStatus = "驳回";
                    break;
                  case -2:
                    item.filterStatus = "违规";
                    break;
                  case 2:
                    item.filterStatus = "已注销";
                    break;
                  case 3:
                    item.filterStatus = "已解绑";
                    break;
                }
                switch (item.relationship) {
                  case 1:
                    item.filterRelationship = "业主";
                    break;
                  case 2:
                    item.filterRelationship = "家属";
                    break;
                  case 3:
                    item.filterRelationship = "租客";
                    break;
                }
              });
              this.$router.push({
                path: this.$route.path,
                query: {page: nPage}
              });
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      }
    },
    created() {
      this.selectCommunity();
      this.sendAjax(1);
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
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    transform: rotateY(180deg);
  }

  .fade1-enter-active,
  .fade1-leave-active {
    transition: all 0.5s ease;
  }

  .fade1-enter,
  .fade1-leave-active {
    opacity: 0;
    transform: translateX(-500px);
  }
</style>
