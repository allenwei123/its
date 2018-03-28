<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
      </ul>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="value1" placeholder="全部状态">
                <el-option v-for="temp in options" :key="temp.value" :label="temp.label" :value="temp.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                v-model="date"
                type="month"
                format="yyyy年MM月"
                value-format="yyyy/MM/01"
                placeholder="账单日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-input  placeholder="房号" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="take(null, $event)">全部生效</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary">一键催交</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="账单号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="roomLocation" label="楼栋房号" width="180" :show-overflow-tooltip="true" align="center">
            </el-table-column>
            <el-table-column prop="proprietorName" label="业主姓名" min-width="120" :show-overflow-tooltip="true" align="center">
            </el-table-column>
            <!-- 无 -->
            <!-- <el-table-column prop="roomName" label="账单名称" min-width="150" :show-overflow-tooltip="true"> -->
              <!-- <template slot-scope="scope">{{scope.row.billDetailName}}</template> -->
            <!-- </el-table-column> -->
            <el-table-column prop="totalPrice" label="账单金额" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(scope.row.totalPrice /10000).toFixed(2)}}</template>
            </el-table-column>
            <el-table-column prop="makeAt" label="账单生成日" width="180" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getTime(scope.row.makeAt, 'yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <el-table-column prop="billStatus" label="账单状态" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getBillStatusName(scope.row.billStatus)}}</template>
            </el-table-column>
            <el-table-column prop="receiveWay" label="缴费方式" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{payBillStatus(scope.row.receiveWay)}}</template>
            </el-table-column>
            <el-table-column prop="updateAt" label="缴费时间" width="160" align="center">
              <template slot-scope="scope" v-if="scope.row.billStatus === 1">{{getTime(scope.row.updateAt, 'yyyy-MM-dd HH:mm')}}</template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="left">
              <template slot-scope="scope">

                <el-button type="primary" size="mini" @click="seeDetail(scope.row)">查看详情</el-button>
                <!-- 账单状态 未生效-->
                <template v-if="scope.row.billStatus === -1">
                  <!-- @click="edit(scope.row)" 暂无接口 -->
                  <el-button type="primary" size="mini">编辑</el-button>
                  <el-button type="warning" size="mini" @click="take(scope.row, $event)">生效</el-button>
                </template>

                <!-- 账单状态 待缴费-->
                <template v-if="scope.row.billStatus === 0 ">
                  <el-button type="warning" size="mini" >提醒缴费</el-button>
                  <el-button type="primary" size="mini" @click="take(scope.row, $event)">确认缴费</el-button>
                </template>

                <!-- 账单状态 已超期-->
                <template v-if="scope.row.billStatus === 2 ">
                  <el-button type="warning" size="mini">催缴</el-button>
                  <el-button type="primary" size="mini"  @click="take(scope.row, $event)">确认缴费</el-button>
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

      <!-- 账单详情 -->
      <transition name="fade">
        <BillDetail v-if="see" :msg="see" :detail="seeData" @upsee=seeChange></BillDetail>
      </transition>

      <!-- 编辑账单 -->
      <transition name="fade">
        <EditPage v-if="show" :msg="show" @change="editChange" :data="editData"></EditPage>
      </transition>

      <!-- 生效 -->
      <el-dialog title="温馨提示" :visible.sync="visible1">
          <p class="p-center">{{text}}</p>
          <p>{{warn}}</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirm">确定</el-button>
          </div>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import time from "@/utils/time.js";
import BillDetail from "./detail";
import EditPage from "./edit";
export default {
  components: {
    BillDetail,
    EditPage
  },
  data() {
    return {
      value1: '',
      options: [{
        value: '0',
        label: '待缴费'
      }, {
        value: '1',
        label: '已缴费'
      }, {
        value: '-1',
        label: '待生效'
      }],
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "收费管理" },
        { id: 2, name: "账单管理" }
      ],
      loading: false,
      status: "",
      date: "",
      tableData: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      input: "",
      see: false,
      seeData: null,
      // 编辑账单
      show: false,
      editData: '',
      //操作状态改变
      visible1: false,
      confirmData: '',
      text:'',
      warn: '',
    };
  },
  methods: {
    getTableList(val) {
      this.postData(val, this.date, this.value1);
    },
    query() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      } else {
        this.postData(null, this.date, this.value1);
      }
    },
    //查看详情
    seeDetail(row) {
      let url = `fees/property-bill/${row.id}/details/list`;
        this.$xttp.get(url).then(res => {
          if(res.errorCode === 0 ){
          this.seeData = res.data;
          this.see = true;
          }
        }).catch( () => {
          this.loading = false;
      })
    },
    seeChange() {
      this.see = false;
    },
    edit(row) {
      //编辑账单时 5.3.7.	物业新增子账单接口
      this.show = true;
      this.editData = row;

    },
    editChange() {
      this.show = false;
    },
    // 账单状态
    take(row, e) {
      this.visible1 = true;
      this.text = e.currentTarget.innerText;
      switch (this.text) {
        case '生效':
          this.warn = "生效后账单将发送给对应业主，且不可再次修改，是否立即生效？";
          break;
        case '提醒缴费':
          this.warn = "是否提醒A区1栋0302业主尽快缴纳本期物业管理费？";
          break;
        case '催缴':
          this.warn = "是否提醒A区1栋0302业主2018年2月物业管理费超期未缴，必须尽快缴纳！";
          break;
        case '确认缴费':
          this.warn = "是否确定A区1栋0302业主已经缴纳本期物业管理费？";
          break;
        case '全部生效':
          this.warn = "生效后账单将发送给对应业主，且不可再次修改，是否立即生效？";
          break;
        case '一键催交':
          this.warn = "是否提醒2018年2月物业管理费超期未缴账单相关业主尽快缴费";
          break;
      }
      this.confirmData = row;
    },
    confirm(confirmData) {
      this.visible1 = false;
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      switch (this.text) {
        case '生效':
          this.confirmData.billStatus = 0;
          break;
        case '提醒缴费':
          this.confirmData.billStatus = 0;
          break;
        case '催缴':
          this.confirmData.billStatus = 0;
          break;
        case '确认缴费':
          this.confirmData.billStatus = 1;
          break;
        case '全部生效':
          // this.confirmData.billStatus = 0;
          break;
        case '一键催交':
           this.confirmData.billStatus = 0;
          break;
      }
      this.publish(this.confirmData);
    },
    publish(row) {
      switch (this.text) {
        case '生效':
          var url = `fees/property-bill/${row.id}/publish`;
          break;
        case '提醒缴费':
          // this.confirmData.billStatus = 0;
          break;
        case '催缴':
          // this.confirmData.billStatus = 0;
          break;
        case '确认缴费':
          var url = `fees/property-bill/${row.id}/payment`;
          break;
        case '全部生效':
          var url = `fees/property-bill/publishAll`;
          let params = {};
          let communityId = this.$store.getters.communityId;
          params.communityId = communityId;
          params.propertyId = '5a82adee9ce976452b7001ee';
          console.log('params', params);
          this.$xttp.post(url, params).then(res => {
            if(res.errorCode === 0){
              this.loading = false;
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error('失败');
          })
          break;
        case '一键催交':
          //  this.confirmData.billStatus = 0;
          break;
      }
      //get请求
      this.$xttp.get(url).then(res => {
          if(res.errorCode === 0){
            this.loading = false;
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error('失败');
        })
    },
    // 账单状态
    getBillStatusName(status) {
      let names = {
        "0": "待缴费",
        "1": "已缴费",
        "-1": '待生效',
        "2": '已超期'
      };
      return names[status];
    },
    //缴费方式
    payBillStatus(status) {
      let names = {
        "1": "线上收费",
        "2": '人工收费'
      };
      return names[status];
    },
    postData(page, makeBillAt, billStatusSet) {
      let nPage = page || this.$route.query.page || 1;
      let params = { page: nPage };
      if (makeBillAt) {
        //输入的搜索字添加params中
        params.makeBillAt = this.date;
      } else {
        delete params.makeBillAt;
      };
      if (billStatusSet) {
        //输入的搜索字添加params中
        params.billStatusSet = [this.value1];
      } else {
        delete params.billStatusSet;
      };
      let communityId = this.$store.getters.communityId;
      params.communityId = communityId;
      console.log(33,params);
      let url = `fees/property-bill/page?page=${this.currentPage}&size=${this.pageSize}`;
      this.loading = true;
      this.$xttp
        .post(url, params)
        .then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.loading = false;
            console.log('res', res.data.records);
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    viewDetail(item) {
      this.detailInfo = item;
      this.detailVisible = true;
    },
    getTime(timestamp, format) {
      if (timestamp == null) return "/";
      return time.timestampToFormat(timestamp, format);
    }
  },
  created() {
    this.query();
  }
};
</script>

<style scoped lang="scss">
    .c-navDetail {
      margin-bottom: 10px;
      li {
        float: left;
        margin-right: 10px;
      }
    }
    .p-center {
      text-align: center;
      font-size: 20px;
      margin-bottom: 10px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: all 0.5s ease;
    }

    .fade-enter, .fade-leave-active {
      opacity: 0;
      transform: rotateY(180deg);
    }
</style>

