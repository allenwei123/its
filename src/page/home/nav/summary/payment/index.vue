<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row style="height: 100%;">
        <el-col :span="24">
          <el-row class="c-box">
            <el-col :span="6" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">{{ billData.validCount }} <span class="c-fc-gray">单</span></p>
              <p class="c-ta-center c-fc-gray">本期已生效</p>
            </el-col>
            <el-col :span="6" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">{{ billData.validAmount }}<span class="c-fc-gray">元</span></p>
              <p class="c-ta-center c-fc-gray">本期应收总额</p>
            </el-col>
            <el-col :span="6" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">{{ billData.paidCount }}  <span class="c-fc-gray">单</span></p>
              <p class="c-ta-center c-fc-gray">本期已缴费</p>
            </el-col>
            <el-col :span="6" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">{{ billData.unpaidCount }}  <span class="c-fc-gray">单</span></p>
              <p class="c-ta-center c-fc-gray">本期待缴费</p>
            </el-col>
          </el-row>
          <el-date-picker
            class="c-selectMonth"
            v-model="selectMonth"
            type="month"
            value-format="timestamp"
            size="mini"
            @change="getData"
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
      let date = new Date();
      let c =date.setDate(1);
      return {
        selectMonth: c ,//使用记录
        progressData: [],//使用记录的bar
        billData:{ },
        communityId: this.$store.getters.communityId,
      }
    },
    components: {
      myProgress
    },
    mounted(){
      this.getProgressData();
      this.getData();
    },
    methods: {
      getProgressData() {
          this.$xttp.get(`/statistics/${this.communityId}/property-bill/expire`)
            .then(res => {
              if(!res.errorCode && res.data.proprietorSections.length) {
                this.progressData = res.data.proprietorSections.map(item => {
                  return {
                    name: item.name,
                    num: item.count,
                    max: item.total
                  }
                });
              }
            });
      },
      getData() {
        let data = {communityId:this.communityId,startAt:this.selectMonth,endAt:this.getCurrentMonthLast(this.selectMonth)};
        this.$xttp.post('/statistics/property-bill/summary',data)
          .then(res => {
            if(!res.errorCode) {
              this.billData = res.data;
            }
          })
      },
      getCurrentMonthLast(value) {
        var aa = new Date(value);
        var currentMonth=aa.getMonth();
        var nextMonth=++currentMonth;
        var nextMonthFirstDay=new Date(aa.getFullYear(),nextMonth,1);
        var oneDay=1000*60*60*24;
        return (new Date(nextMonthFirstDay-oneDay)).getTime();
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
