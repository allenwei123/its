<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row type="flex" style="height: 100%;">
        <el-col :span="12">
          <el-row class="c-box c-alarmBox">
            <p class="c-fc-blue c-left-title c-noLeft"><i class="iconfont icon-jingwuicon_svg- c-fc-blue"></i> 警报数量统计
              <el-date-picker
                class="c-selectMonth"
              v-model="selectMonth"
              type="month"
              value-format="timestamp"
              size="mini"
              align="right" @change="getAlarmData"
              placeholder="选择月">
            </el-date-picker>
            </p>
            <el-col :span="24" class="c-alarmNum">
              <p class="c-fc-blue c-ta-center">+{{ alarmData ? alarmData.total : 0 }}</p>
              <p class="c-ta-center c-fc-gray">本月新增警报</p>
            </el-col>
            <!--  警报处理明细 -->
            <el-col :span="24" class="c-alarm-detail">
              <p class="c-fc-blue c-left-title">警报处理明细</p>
              <!--<p class="c-tip c-fc-blue">社区共有 {{ progressData.length ? progressData.length : 0 }}名保安，人均处理报警事故起</p>-->
              <div v-loading="!progressData.length" class="c-alarm-dm">
                <myProgress v-for="(item,index) in progressData" :key="index" :percent="(item.num / progressData[0].num) * 100" :data="item"></myProgress>
              </div>
            </el-col>
          </el-row>
          <!--  警报时间统计 -->
          <el-row class="c-box" style="margin-top: 10px;">
            <p class="c-fc-blue c-left-title">警报时间统计 (次/小时)</p>
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
                  v-model="selectFault"
                  type="month"
                  value-format="timestamp"
                  size="mini"
                  align="right"
                  @change="getFaultData"
                  placeholder="选择月">
                </el-date-picker>
              </p>

              <div class="c-fault-detail">
                <div id="fault"></div>
                <div class="c-fault-all">
                  <p class="c-fc-blue c-ta-center">+{{ allFaultNum }}</p>
                  <p class="c-fc-gray c-ta-center">本月新增故障</p>
                </div>
              </div>
              <!-- 故障维修统计  -->
              <el-row class="c-maintain">
                <p class="c-fc-blue c-left-title">故障维修统计</p>
                <!--<p class="c-tip c-fc-blue">社区共有4名维修工人，人均处理故障89起</p>-->
                <ul class="c-maintain-detail" v-loading="!maintainData.length">
                  <li class="c-maintain-item" v-for="(item,index) in maintainData" :key="index">
                    <myProgress :data="item" :percent="(item.num / maintainData[0].num) * 100"></myProgress>
                    <div class="c-maintain-tip c-fc-gray"> 服务评价：<div>
                      <el-rate
                        v-model="item.rate"
                        show-score
                        disabled
                        text-color="#ff9900"
                        score-template="{value}">
                      </el-rate>
                      <!--<el-rate v-model="item.rate"  show-score ></el-rate>-->
                    </div></div>
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
      let date=new Date();
      let c =date.setDate(1);
      return {
        selectMonth: c ,
        progressData: [],
        maintainData:[],//故障维修统计
        selectFault: c ,
        communityId:this.$store.getters.communityId,
        alarmData:{},//警报数据
        allFaultNum: 0,//故障数据总数
      }
    },
    components: {
      myProgress
    },
    mounted(){
      this.getAlarmData();
      this.getFaultData();
    },
    methods: {
      getAlarmData() {
        let data = {communityId:this.communityId,startAt:this.selectMonth,endAt:this.getCurrentMonthLast(this.selectMonth)};
        this.$xttp.post('/statistics/alarm',data)
          .then(res => {
            if(!res.errorCode) {
                this.alarmData = res.data;
                console.log(res.data);
                if(res.data.securitySections.length) {
                    this.progressData = res.data.securitySections.map(item => {
                        return {
                            num: item.count,
                            name:item .name
                        }
                    });
                }
                //警报时间
                if(res.data.hourSections.length) {
                    this.createdLine();
                }
            }
          })
      },
      createdLine() {
        let dom = echarts.init(document.getElementById('i-alarm'));
        let max = 0;
        this.alarmData.hourSections.forEach(item => {
          max = item.count > max ? item.count : max;
        });
        max = max < 5 ? 5 : max;
        let lineOption = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.alarmData.hourSections.map(item => item.name )
          },
          yAxis: {
            type: 'value',
            max: max
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
          series: [{
            name: '门禁统计',
            data: this.alarmData.hourSections.map(item => item.count ),
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
      getFaultData() {
        let data = {communityId:this.communityId,startAt:this.selectFault,endAt:this.getCurrentMonthLast(this.selectFault)};
        this.$xttp.post('/statistics/fault',data)
          .then(res => {
            if(!res.errorCode) {
                this.allFaultNum = res.data.total;
                if(res.data.typeSections.length) {
                    this.createdFault(res.data.typeSections);
                };
                if(res.data.repairSections.length) {
                    this.maintainData = res.data.repairSections.map(item => {
                        return {
                            name:item.name,
                            num: item.count || 0,
                            rate: item.avgScore ? (+ item.avgScore) : 0
                        }
                    })
                }
            }
          })
      },
      createdFault( arr ) {
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
              data:arr.map(item => {
                  return {
                      name: item.name,
                      value: item.count
                  }
              })
            }
          ]
        };
        dom.setOption(option);
      },
      getCurrentMonthLast(value) {
        var aa = new Date(value);
        var currentMonth=aa.getMonth();
        var nextMonth=++currentMonth;
        var nextMonthFirstDay=new Date(aa.getFullYear(),nextMonth,1);
        var oneDay=1000*60*60*24;
        return (new Date(nextMonthFirstDay-oneDay)).getTime();
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
