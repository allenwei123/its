<template>
  <el-dialog title="编辑账单" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="data"   label-width="120px">

      <el-form-item label="账单日期" prop="faultItem" required>
        <span>{{makeAt}}</span>
      </el-form-item>

      <el-form-item label="楼栋房号" label-width="120px"  required>
        <span>{{data.roomLocation}}</span>
      </el-form-item>

      <el-form-item label="住房面积" label-width="120px"  required>
        <span>{{area/100 + '平方'}}</span>
      </el-form-item>

      <el-form-item :label="item.feeItemName"  v-if="item.type !==3 " label-width="120px" v-for="(item, idx) in options" :key="idx" required>
        <span class="fee1">{{(item.currentFee/10000).toFixed(2)}}</span>
        <span class="fee2">{{(item.unitPrice/10000).toFixed(2)+ "元" + "/平方"}}</span>
      </el-form-item>

      <el-form-item :label="item.feeItemName"  v-if="item.type ===3 " label-width="120px" v-for="(item, idx) in options" :key="idx" required>
        <!-- <span class="fee1">{{(item.currentFee/10000).toFixed(2)}}</span>
        <span class="fee2">{{(item.unitPrice/10000).toFixed(2)+ "元" + "/平方"}}</span> -->
        <el-input auto-complete="off">{{(item.currentFee/10000).toFixed(2)}}</el-input>
        <el-input auto-complete="off">{{(item.unitPrice/10000).toFixed(2)+ "元" + "/平方"}}</el-input>
      </el-form-item>

      <el-form-item label="账单总额" label-width="120px" prop="contact" required>
        <span>{{(totalPrice/10000).toFixed(2)}}</span>
      </el-form-item>
      
      <el-form-item label="备注" prop="faultContent">
        <el-input type="textarea"  :rows="5"></el-input>
      </el-form-item> 

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>    
  </el-dialog>
</template>

<script>
import time from "@/utils/time.js";
    export default {
        data() {
            return {
                value: '',
                makeAt: '',
                area: '',
                totalPrice: '',
                options: '',
            }
        },
        methods: {
            handleClose() {
                this.$emit('change');
            },
            submitForm() {
                
            },
            getTime(timestamp, format) {
                if (timestamp == null) return "/";
                return time.timestampToFormat(timestamp, format);
            },
            postData() {
              let url = `fees/property-bill/${this.data.id}/details/list`;
              this.$xttp.get(url).then(res => {
                if(res.errorCode === 0) {
                  this.loading = false;
                  this.totalPrice = res.data.propertyBill.totalPrice;
                  this.options = res.data.billDetailList;
                  console.log('res', this.options);
                }
              }).catch( () => {
                this.loading = false;
              })
            },
            roomArea() {
              let url = `community/room/${this.data.roomId}/detail`;
              this.$xttp.get(url).then(res => {
                if(res.errorCode === 0) {
                  this.loading = false;
                  this.area = res.data.area;
                }
              }).catch( () => {
                this.loading = false;
              })
            },

        },
        created() {
            // console.log(this.data);
            this.makeAt = this.getTime(this.data.makeAt, 'yyyy-MM-dd HH:mm');
            this.postData();
            this.roomArea();
        },
        props: ['msg', 'data'],
    }
    
</script>

<style scoped lang="scss">
  .fee1 {
    margin-left: 7px;
  }

  .fee2 {
    margin-left: 30px;
  }

</style>
