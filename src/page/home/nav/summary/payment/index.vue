<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row style="height: 100%;">
        <el-col :span="24">
          <el-row class="c-box">
            <el-col :span="6" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">74 <span class="c-fc-gray">单</span></p>
              <p class="c-ta-center c-fc-gray">本期已生效</p>
            </el-col>
            <el-col :span="6" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">33674<span class="c-fc-gray">元</span></p>
              <p class="c-ta-center c-fc-gray">本期应收总额</p>
            </el-col>
            <el-col :span="6" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">1097 <span class="c-fc-gray">单</span></p>
              <p class="c-ta-center c-fc-gray">本期已缴费</p>
            </el-col>
            <el-col :span="6" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">1504 <span class="c-fc-gray">单</span></p>
              <p class="c-ta-center c-fc-gray">本期待缴费</p>
            </el-col>
          </el-row>
          <el-date-picker
            class="c-selectMonth"
            v-model="selectMonth"
            type="month"
            value-format="timestamp"
            size="mini"
            placeholder="选择月">
          </el-date-picker>
        </el-col>
        <el-col :span="24" class="c-box c-summary-detail">
          <p class="c-fc-blue c-left-title">超期数据统计</p>
          <div class="c-progress-body" v-loading="!progressData.length">
            <myProgress type="more" labelWidth="150" v-for="(item,index) in progressData" :key="index" :percent="(item.num / progressData[0].num) * 100" :data="item"></myProgress>
          </div>
        </el-col>
      </el-row>
    </div>

  </el-container>
</template>

<script>
  import myProgress from '@/components/progressBar'

  export default {
    name: "summaryPayment",
    data() {
      return {
        selectMonth: new Date(),//使用记录
        progressData: [],//使用记录的bar
      }
    },
    components: {
      myProgress
    },
    mounted(){
      this.getProgressData();
    },
    methods: {
      getProgressData() {
        setTimeout(() => {
          this.progressData = [
            { name: "A区1栋1号梯", num: 5, max: 7 },
            { name: "A区1栋2号梯", num: 6, max: 7 },
            { name: "A区4栋2号梯", num: 4, max: 7  },
            { name: "A区2栋3号梯", num: 3, max: 7 },
            { name: "A区2栋5号梯", num: 2, max: 7 },
            { name: "A区2栋5号梯", num: 2, max: 7 },
            { name: "A区2栋5号梯", num: 2, max: 7 },
            { name: "A区2栋5号梯", num: 2, max: 7 },
            { name: "A区2栋5号梯", num: 2, max: 7 },
            { name: "A区2栋5号梯", num: 2, max: 7 },
            { name: "A区2栋5号梯", num: 2, max: 7 },
            { name: "A区2栋5号梯", num: 2, max: 7 },
            { name: "A区12栋12号梯",num: 1, max: 7 }
          ].sort((a, b) => a.num < b.num);
        }, 500)
      },
    }
  }


</script>

<style scoped lang="scss">
  .c-selectMonth {
    position: absolute;
    right: 0px;
    top:0;
    width: 150px;
  }
  .c-w100 {
    width: 100%;
    background: #efefef;
    position: relative;
  }

  //功能型类
  .c-fc-blue {
    color: #3d87f5;
  }

  .c-fc-gray {
    color: gray;
    font-size: 16px;
  }

  .c-ta-center {
    text-align: center;
  }

  .c-left-title {
    position: relative;
    margin-left: 5px;
    border-left: 3px solid #3988ff;
    text-indent: 0.5rem;
    font-weight: bolder;
    &.c-noLeft {
      border-left: none;
    }
  }

  .c-box {
    background: #fff;
    border-radius: 5px;
    padding: 8px;
    box-sizing: border-box;
  }

  //标注型类
  .c-summary-num {
    height: 100px;
    padding: 15px 0;
    .c-fc-blue {
      font-size: 24px;
    }
  }
  .c-summary-detail {
    height: calc( 100vh - 186px );
    margin-top:10px;
    .c-progress-body {
      height: calc( 100% - 49px );
      overflow-y: scroll;
      margin-top: 20px;
      padding-bottom: 30px;
    }
  }


  //图表
</style>
