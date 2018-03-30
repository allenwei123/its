<template>
  <el-dialog :title="pay + '账单'" :visible.sync="msg" :before-close="handleClose">
    <div class="printOrder-data">
      <div class="title">
        <h1>{{$store.getters.communityName}}{{detail.feeItemName}}账单</h1>
        <!--<span>账单号：{{detail.billId}}</span>-->
      </div>
      <div class="bill">
        <div class="header">
          <ul>
            <!-- <li>账单名称：{{detail.billDetailName}}</li> -->
            <li>楼栋房号：{{roomLocation}}</li>
            <li>姓名：{{proprietorName}}</li>
          </ul>
        </div>
        <table>
          <thead>
            <tr>
              <th>项目</th>
              <th>用量</th>
              <th>单价</th>
              <th>金额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in billDetailList" :key="idx">
              <td>{{item.feeItemName}}</td>
              <td>{{item.used}}</td>
              <td>{{(item.unitPrice/10000).toFixed(2)}}</td>
              <td>{{(item.currentFee/10000).toFixed(2)}}</td>
              <td>{{item.remark}}</td>
            </tr>
            <tr>
              <td>合计</td>
              <td colspan="4" style="text-align: right">{{(propertyBill.totalPrice/10000).toFixed(2)}}</td>
            </tr>
            <tr>
              <td>大写金额</td>
              <td colspan="4" style="text-align: right">{{(propertyBill.totalPrice/10000).toFixed(2) | digitUppercase}}</td>
            </tr>
            <tr>
              <td>缴纳状态</td>
              <td colspan="4" style="text-align: right">{{getBillStatusName(propertyBill.billStatus)}}</td>
            </tr>
            <!-- 缴纳人待定 -->
            <tr>
              <td>缴纳人</td>
              <td colspan="4" style="text-align: right">{{propertyBill.proprietorName}}</td>
            </tr>
            <tr>
              <td>缴纳方式</td>
              <td colspan="4" style="text-align: right">{{payBillStatus(propertyBill.receiveWay)}}</td>
            </tr>
            <tr v-if="pay==='已缴费'">
              <td>缴纳时间</td>
              <td colspan="4" style="text-align: right">{{getTime(propertyBill.updateAt, 'yyyy-MM-dd HH:mm')}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="print">打印账单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import time from "@/utils/time.js";
  export default {
    data() {
      return {
        billDetailList: '',
        propertyBill: '',
        pay: '',
        roomLocation: '',
        proprietorName: '',
      }
    },
    methods: {
      handleClose() {
        this.$emit('upsee');
      },
      print() {
        let prinText = document.getElementsByClassName("printOrder-data")[0].innerHTML;
        document.body.innerHTML = prinText;
        window.print();
        window.location.reload();
        return false;
      },
      payBillStatus(status) {
        let names = {
          "1": "线上收费",
          "2": '人工收费'
        };
        return names[status];
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
      getTime(timestamp, format) {
        if (timestamp == null) return "/";
        return time.timestampToFormat(timestamp, format);
      },
    },
    props: ['msg', 'detail'],
    created() {
      console.log(this.detail);
      this.propertyBill = this.detail.propertyBill;
      this.billDetailList = this.detail.billDetailList;
      let that = this.propertyBill;
      this.pay = this.getBillStatusName(that.billStatus);
      this.roomLocation = that.roomLocation;
      this.proprietorName = that.proprietorName;
      // console.log(that);
    }
  }
</script>

<style scoped lang="scss">
  .title {
    position: relative;
    h1 {
      line-height: 70px;
      text-align: center;
      font-size: 26px;
    }
    span {
      position: absolute;
      top: 5px;
      right: 10px;
      color: red;
    }
  }
  .bill {
    padding: 0 10px;
    .header {
      ul {
        li {
          display: inline;
          margin-right: 10px;
          &:not(:last-child):after {
            content: "|";
            padding-left: 10px;
          }
        }
      }
    }
    table {
      width: 100%;
      border:solid 1px #000;
      border-collapse: collapse;

      td, th {
        border:solid 1px #000;
        text-align: center;
        line-height: 35px;
      }
    }
  }
</style>