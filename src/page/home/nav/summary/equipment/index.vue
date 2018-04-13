<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row type="flex" style="height: 100%;">
        <el-col :span="12">
          <!--  电梯故障汇总 -->
          <el-row class="c-box">
            <el-col :span="12" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">74</p>
              <p class="c-ta-center c-fc-gray">电梯总数</p>
            </el-col>
            <el-col :span="12" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">0</p>
              <p class="c-ta-center c-fc-gray">电梯故障</p>
            </el-col>
          </el-row>
          <el-row class="c-box c-module-6">
            <p class="c-fc-blue c-left-title">使用记录统计
              <el-date-picker
                class="c-selectMonth"
                v-model="selectMonth"
                type="month"
                value-format="timestamp"
                size="mini"
                placeholder="选择月">
              </el-date-picker>
            </p>
            <p class="c-tip c-fc-blue">A1栋电梯 A栋使用频次较高，请注意检查维护</p>
            <div class="c-progress-body" v-loading="!progressData.length">
                <myProgress labelWidth="110" v-for="(item,index) in progressData" :key="index" :percent="(item.num / progressData[0].num) * 100" :data="item" unit="次"></myProgress>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" style="margin-left: 10px;">
          <!--  门禁故障汇总 -->
          <el-row class="c-box">
            <el-col :span="12" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">58</p>
              <p class="c-ta-center c-fc-gray">门禁总数</p>
            </el-col>
            <el-col :span="12"  class="c-summary-num">
              <p class="c-fc-blue c-ta-center">0</p>
              <p class="c-ta-center c-fc-gray">门禁故障</p>
            </el-col>
          </el-row>
          <!-- 使用记录统计 -->
          <el-row class="c-box c-module-6">
            <p class="c-fc-blue c-left-title">使用记录统计
              <el-date-picker
                class="c-selectMonth"
                v-model="selectMonth"
                type="month"
                value-format="timestamp"
                size="mini"
                placeholder="选择月">
              </el-date-picker>
            </p>
            <p class="c-tip c-fc-blue">小区大门/小区南门使用频次较高，请注意保养维护</p>
            <div class="c-progress-body" v-loading="!doorData.length">
              <myProgress labelWidth="100" v-for="(item,index) in doorData" :key="index" :percent="(item.num / doorData[0].num) * 100" :data="item" unit="次"></myProgress>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>

  </el-container>
</template>

<script>
  import myProgress from '@/components/progressBar'

  export default {
    name: "summaryEquipment",
    data() {
      return {
        selectMonth: new Date(),//使用记录
        progressData: [],//使用记录的bar
        doorData: [],//门禁使用记录bar
      }
    },
    components: {
      myProgress
    },
    mounted(){
      this.getProgressData();
      this.getDoorData();
    },
    methods: {
      getProgressData() {
        setTimeout(() => {
          this.progressData = [
            {name: "A区1栋1号梯", num: 10002 },
            {name: "A区1栋2号梯", num: 1123 },
            {name: "A区4栋2号梯", num: 1331 },
            {name: "A区2栋3号梯", num: 2441 },
            {name: "A区2栋5号梯", num: 3342 },
            {name: "A区12栋12号梯", num: 233 },
            {name: "A区1栋3号梯", num: 0 },
            {name: "A区6栋2号梯", num: 0 },
            {name: "A区12栋2号梯", num: 0 },
          ].sort((a, b) => a.num < b.num);
        }, 500)
      },
      getDoorData() {
        setTimeout(() => {
          this.doorData = [
            {name: "A区大门", num: 10002 },
            {name: "A区南门", num: 7789 },
            {name: "A区东门", num: 3331 },
            {name: "A区东北门", num: 2441 },
            {name: "B区南西门", num: 3342 },
            {name: "B区东西门", num: 233 },
            {name: "A区侧门", num: 0 },
            {name: "B区大门", num: 0 },
            {name: "C区大门", num: 0 },
          ].sort((a, b) => a.num < b.num);
          this.loading = false;
        }, 500)
      },
    }
  }


</script>

<style scoped lang="scss">
  .c-selectMonth {
    position: absolute;
    right: 10px;
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
  }

  .c-ml-15 {
    margin-left: 15px;
  }

  .c-ta-center {
    text-align: center;
  }
  .c-tip {
    margin-top: 15px;
    font-size: 12px;
    &:before {
      content: ' * ';
    }
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
  .c-module-6 {
    height:calc( 100vh - 196px );
    margin-top: 10px;
    padding-bottom: 20px;
    overflow-y: scroll;
    .c-progress-body {
      margin-top: 20px;
      padding: 10px 0;
      /*max-height:40%;*/
      /*overflow-y: scroll;*/
    }
  }


  //图表
  #i-alarm {
    width:100%;
    height: calc( 100vh - 607px );
  }
  #fault {
    width:100%;
    height:300px;
  }
</style>
