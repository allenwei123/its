<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row type="flex" style="height: 100%;">
        <el-col :span="12">
          <el-row class="c-box c-alarmBox">
            <p class="c-fc-blue c-left-title c-noLeft"><i class="iconfont icon-jingwuicon_svg- c-fc-blue"></i> 警报数量统计
              <el-date-picker
                class="c-selectMonth"
              v-model="value4"
              type="month"
              value-format="timestamp"
              size="mini"
              align="right"
              placeholder="选择月">
            </el-date-picker>
            </p>
            <el-col :span="24" class="c-alarmNum">
              <p class="c-fc-blue c-ta-center">+74</p>
              <p class="c-ta-center c-fc-gray">本月新增警报</p>
            </el-col>
            <!--  警报处理明细 -->
            <el-col :span="24" class="c-alarm-detail">
              <p class="c-fc-blue c-left-title">警报处理明细</p>
              <p class="c-tip c-fc-blue">社区共有2名保安，人均处理报警事故2起</p>
              <div v-loading="!progressData.length" class="c-alarm-dm">
                <myProgress v-for="(item,index) in progressData" :key="index" :percent="(item.num / progressData[0].num) * 100" :data="item"></myProgress>
              </div>
            </el-col>
          </el-row>
          <!--  警报时间统计 -->
          <el-row class="c-box" style="margin-top: 10px;">
            <p class="c-fc-blue c-left-title">警报时间统计</p>
              <div id="i-alarm">

              </div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="c-box c-right-part">
            <div class="c-fault-box">
              <p class="c-fc-blue c-left-title c-noLeft"><i class="iconfont icon-wuyebaoxiu c-fc-blue"></i> 故障报修统计
                <el-date-picker
                  class="c-selectMonth"
                  v-model="value3"
                  type="month"
                  value-format="timestamp"
                  size="mini"
                  align="right"
                  placeholder="选择月">
                </el-date-picker>
              </p>

              <div class="c-fault-detail">
                <div id="fault"></div>
                <div class="c-fault-all">
                  <p class="c-fc-blue c-ta-center">+327</p>
                  <p class="c-fc-gray c-ta-center">本月新增故障</p>
                </div>
              </div>
              <!-- 故障维修统计  -->
              <el-row class="c-maintain">
                <p class="c-fc-blue c-left-title" @click="aa">故障维修统计</p>
                <p class="c-tip c-fc-blue">社区共有4名维修工人，人均处理故障89起</p>
                <ul class="c-maintain-detail" v-loading="!maintainData.length">
                  <li class="c-maintain-item" v-for="(item,index) in maintainData" :key="index">
                    <myProgress :data="item" :percent="item.percent"></myProgress>
                    <div class="c-maintain-tip c-fc-gray"> 服务评价：<div> <el-rate v-model="item.rate"></el-rate></div></div>
                  </li>
                </ul>
              </el-row>
            </div>
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
    name: "summaryAlarm",
    data() {
      return {
        progressData: [],
        maintainData:[],//故障维修统计
        value4: new Date(),
        value3: new Date()
      }
    },
    components: {
      myProgress
    },
    mounted(){
      this.getProgressData();
      this.createdLine();
      this.createdFault();
      this.getMaintainData();
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
      },
      createdLine() {
        let dom = echarts.init(document.getElementById('i-alarm'));
        let lineOption = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [{
            name: '门禁统计',
            data: [820, 932, 901, 934, 1290, 800, 1320],
            type: 'line',
            areaStyle: {},
            itemStyle: {
              normal: {
//              color: '#badeff',
                color: {
                  type: 'linear',
                  x: 1,
                  y: 1,
                  x2: 1,
                  y2: 0,
                  colorStops: [{
                    offset: 0, color: '#fff' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#c1e1fe' // 100% 处的颜色
                  }],
                  globalCoord: true // 缺省为 false
                },
                shadowBlur: 200,
                shadowColor: 'rgba(255, 123, 255, 0.5)'
              }
            },
          }]
        };
        dom.setOption(lineOption);
      },
      createdFault() {
        let dom = echarts.init(document.getElementById('fault'));
        let option = {
          color: ['#41a3fc','#1fe057'],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [
            {
              name:'故障统计',
              type:'pie',
              radius: ['60%', '80%'],
              avoidLabelOverlap: false,
              label: {//内测文字
                normal: {
                  show: true,
                  position: 'outside',
                  textStyle:{
                    color: '#000'
                  },
                  formatter: " {b} 占({d}%)"
                },
              },
              labelLine: {//折线样式
                normal: {
                  lineStyle: {
                    color: 'rgba(65, 163, 252, 0.9)'
                  },
                  smooth: 0.1,
                  length: 10,
                  length2: 20
                }
              },
              data:[
                {value:137, name:'住户故障'},
                {value:200, name:'公众故障'},
              ].sort((a,b)=> a > b)
            }
          ]
        };
        dom.setOption(option);
      },
      getMaintainData() {
          setTimeout(()=> {
              this.maintainData = [
                {name:'陈晓春',num:113, percent:70 ,rate:3 },
                {name:'陈法春',num:34, percent:40 ,rate:4 },
                {name:'陈法春1',num:34, percent:20 ,rate:4 },
                {name:'张三',num:34, percent:50 ,rate:4 },
                {name:'李四',num:34, percent:50 ,rate:4 },
                {name:'王五',num:66, percent:90 ,rate:4 },
                {name:'万晓春',num:223, percent:30 ,rate:5 },
                {name:'凑晓春',num:45, percent:50 ,rate:2 },
              ];
          },1500)
      },
      getCurrentMonthLast(value) {
        var aa = new Date(value);
        var currentMonth=aa.getMonth();
        var nextMonth=++currentMonth;
        var nextMonthFirstDay=new Date(aa.getFullYear(),nextMonth,1);
        var oneDay=1000*60*60*24;
        return (new Date(nextMonthFirstDay-oneDay)).getTime();
      },
      aa(){
        console.log(this.getCurrentMonthLast(this.value4));
      }
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
    height: 350px;
    box-sizing: border-box;
    .c-alarm-dm {
      height: 290px;
      overflow-y: scroll;
    }
  }
  .c-fault-detail {
    position: relative;
    .c-fault-all {
      position: absolute;
      top: 50%;
      width: 100%;
      height: 67px;
      margin-top: -33.5px;
      .c-fc-blue {
        font-size: 24px;
        font-weight: bolder;
        margin-bottom: 15px;
      }
    }
  }
  .c-maintain{
    .c-maintain-detail {
      margin-top: 20px;
      height: calc(100vh - 500px);
      overflow-y: scroll;
      .c-maintain-item {
        margin-top: 15px;
      }
      .c-maintain-tip {
        padding-left: 80px;
        margin-top: 10px;
        div {
          display: inline-block;
        }
      }
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
