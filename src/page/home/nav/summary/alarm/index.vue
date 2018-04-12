<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row type="flex" style="height: 100%;">
        <el-col :span="12">
          <el-row class="c-box c-alarmBox">
            <p class="c-fc-blue c-left-title c-noLeft"><i class="iconfont icon-jingwuicon_svg- c-fc-blue"></i> 警报数量统计
            </p>
            <el-col :span="24" class="c-alarmNum">
              <p class="c-fc-blue c-ta-center">+74</p>
              <p class="c-ta-center c-fc-gray">本月新增警报</p>
            </el-col>
            <el-col :span="24" class="c-alarm-detail">
              <p class="c-fc-blue c-left-title">警报处理明细</p>
              <div v-loading="loading" class="c-alarm-dm">
                <myProgress v-for="(item,index) in progressData" :key="index" :percent="(item.num / progressData[0].num) * 100" :data="item"></myProgress>
              </div>
            </el-col>
          </el-row>
          <el-row class="c-box" style="margin-top: 10px;">
            <p class="c-fc-blue c-left-title">警报时间统计</p>
            <el-col :span="24">
              
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="c-box c-right-part">
            <p class="c-fc-blue c-left-title c-noLeft"><i class="iconfont icon-wuyebaoxiu c-fc-blue"></i> 故障报修统计</p>
          </el-row>
        </el-col>
      </el-row>
    </div>

  </el-container>
</template>

<script>
  import myProgress from '@/components/progressBar'

  var echarts = require('echarts/lib/echarts');
  // 引入柱状图
  require('echarts/lib/chart/pie');//bar = 柱状图 lin = 折现图
  require("echarts/lib/chart/line");
  // 引入提示框
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/legend');

  export default {
    name: "summaryBaseInfo",
    data() {
      return {
        progressData: [],
        loading: false,//警报处理时间加载中..
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
        this.loading = true;
        setTimeout(() => {
          this.progressData = [
            {name: "陈晓春", num: 233},
            {name: "张三", num: 344},
            {name: "李四", num: 45},
            {name: "老万", num: 555},
            {name: "臣明", num: 220},
            {name: "大傻", num: 0},
            {name: "大傻1", num: 0},
            {name: "大傻2", num: 0},
            {name: "大傻3", num: 0},
          ].sort((a, b) => a.num < b.num);
          this.loading = false;
        }, 500)
      }
    }
  }


</script>

<style scoped lang="scss">
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

  .c-left-title {
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
  .c-right-part {
    height: 100%;
    margin-left: 10px;
  }

  .c-alarmNum {
    height: 100px;
    padding: 15px 0;
    .c-fc-blue {
      font-size: 24px;
    }
  }
  .c-alarm-detail {
    height: 300px;
    box-sizing: border-box;
    .c-alarm-dm {
      height: 270px;
      overflow-y: scroll;
    }
  }
</style>
