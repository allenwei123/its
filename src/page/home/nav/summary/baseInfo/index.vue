<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row type="flex">
        <el-col :span="12">
          <!--   房间汇总  -->
          <el-row type="flex" class="c-box c-room-box">
            <el-col :span="12" class="c-summary-item">
              <p class="c-ta-center "><strong class="c-fc-blue">2633</strong>套</p>
              <p class="c-ta-center c-room-all">房间总数</p>
            </el-col>
            <el-col :span="12" class="c-summary-item">
              <p class="c-ta-center"><strong class="c-fc-blue">2633</strong>套</p>
              <p class="c-ta-center c-room-all">认证房间数</p>
            </el-col>
          </el-row>
          <!--  住户年龄  -->
          <el-row class="c-box c-age-box">
            <p class="c-fc-blue c-left-title">住户年龄</p>
            <div class="c-age-charts" id="main">

            </div>
          </el-row>
        </el-col>
        <el-col :span="12" class="c-ml-15 c-box">
          <el-row>
            <el-col :span="12" class="c-summary-item">
              <p class="c-ta-center "><strong class="c-fc-blue">333234</strong>人</p>
              <p class="c-ta-center c-summary-all">住户总数</p>
            </el-col>
            <el-col :span="12" class="c-summary-item">
              <p class="c-ta-center"><strong class="c-fc-blue">2633</strong>人</p>
              <p class="c-ta-center c-room-all">租客总数</p>
            </el-col>
          </el-row>
          <el-row>
            <div style="margin-top:30px;padding: 0 30px;"><el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress></div>

          </el-row>
          <div class="c-person-charts" id="person">

          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="c-apply-box">
        <el-col :span="24" class="c-box">
          <p class="c-fc-blue c-left-title">临时访客申请</p>
          <div class="c-age-charts" id="line">

          </div>
        </el-col>
      </el-row>
    </div>

  </el-container>
</template>

<script>
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
      return {}
    },
    mounted(){
      var myChart = echarts.init(document.getElementById('main'));
      var myChart3 = echarts.init(document.getElementById('line'));
      var myChart2 = echarts.init(document.getElementById('person'));

      //环形图
      let option = {
        color: ['#41a3fc','#1fe057','#fad348','#f0657d'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name:'租客情况',
            type:'pie',
            radius: ['30%', '70%'],
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
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            data:[
              {value:100, name:'65岁以上'},
              {value:200, name:'18岁以下'},
              {value:300, name:'18-40岁之间'},
              {value:400, name:'40-46岁之间'},
            ].sort((a,b)=> a > b)
          }
        ]
      };

      myChart.setOption(option);

      let option2 = {
        color: ['#41a3fc','#1fe057','#fad348','#f0657d'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'bottom',
          data:['男性租客','女性租客'],
          formatter: "{name}占",
        },
        series: [
          {
            name:'租客情况',
            type:'pie',
            radius: ['70%', '90%'],
            avoidLabelOverlap: false,
            label: {//内测文字
              normal: {
                show: false,
              },
            },
            data:[
              {value:100, name:'男性租客'},
              {value:200, name:'女性租客'}
            ].sort((a,b)=> a > b)
          }
        ]
      };
      myChart2.setOption(option2);

      //折线图
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
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {},
          itemStyle: {
            normal: {
              color: '#badeff',
              shadowBlur: 200,
              shadowColor: 'rgba(255, 0, 255, 0.5)'
            }
          },
        }]
      };
      myChart3.setOption(lineOption);


    },
    methods: {}
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
  }

  .c-box {
    background: #fff;
    border-radius: 5px;
    padding: 8px;
    box-sizing: border-box;
  }

  //标注型类
  .c-room-box {
    height: 120px;
    .c-room-all {
      margin-top: 6px;
      font-size: 14px;
    }
  }

  .c-summary-item {
    padding-top: 20px;
    .c-fc-blue {
      font-size: 20px;
    }
    .c-ta-center {
      color: #747272;
    }
  }

  .c-age-box {
    margin-top: 15px;
    height: 300px;
  }

  .c-apply-box {
    margin-top: 15px;
    height: calc(100vh - 520px);
  }

  /*住户统计*/
  .c-age-charts {
    width: 100%;
    height: calc(100% - 21px);
  }
  .c-person-charts {
    width:100%;
    height: calc( 100% - 128px);
  }
</style>
