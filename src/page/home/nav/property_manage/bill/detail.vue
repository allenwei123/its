<template>
  <el-dialog :title="detail.feeItemName + '账单'" :visible.sync="formVisible">
    <div>
      <div class="title">
        <h1>{{$store.getters.communityName}}{{detail.feeItemName}}账单</h1>
        <!--<span>账单号：{{detail.billId}}</span>-->
      </div>
      <div class="bill">
        <div class="header">
          <ul>
            <li>账单名称：{{detail.billDetailName}}</li>
            <li>姓名：{{detail.proprietorName}}</li>
            <li>楼栋房号：{{detail.roomName}}</li>
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
            <tr>
              <td>{{detail.feeItemName}}</td>
              <td>{{detail.used}}</td>
              <td>{{detail.unitPrice}}</td>
              <td>{{detail.currentFee}}</td>
              <td>{{detail.remark}}</td>
            </tr>
            <tr>
              <td>合计</td>
              <td colspan="4" style="text-align: right">{{detail.subtotal}}</td>
            </tr>
            <tr>
              <td>大写金额</td>
              <td colspan="4" style="text-align: right">{{detail.subtotal | digitUppercase}}</td>
            </tr>
            <tr>
              <td>缴纳状态</td>
              <td colspan="4" style="text-align: right">{{getBillStatusName(detail.paymentStatus)}}</td>
            </tr>
            <tr>
              <td>缴纳方式</td>
              <td colspan="4" style="text-align: right"></td>
            </tr>
            <tr>
              <td>缴纳时间</td>
              <td colspan="4" style="text-align: right"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取消</el-button>
      <el-button type="primary" @click="print">打印账单</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
  >>> .el-dialog__body {
    padding: 0;
  }
</style>

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

<script>
  export default {
    data() {
      return {
        formVisible: this.visible
      }
    },
    watch: {
      visible(val) {
        this.formVisible = val;
      },
      formVisible(val) {
        this.$emit('update:visible', val);
      }
    },
    methods: {
      closeForm() {
        this.formVisible = false;
      },
      print() {

      },
      // 账单状态
      getBillStatusName(status) {
        let names = {
          '0': '未缴费',
          '1': '已缴费'
        };
        return names[status];
      },
    },
    props: ['visible', 'detail'],
    created() {
      console.log(this.detail);
    }
  }
</script>
