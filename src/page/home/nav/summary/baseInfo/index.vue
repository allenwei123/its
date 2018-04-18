<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row type="flex">
        <el-col :span="12">
          <!--   房间汇总  -->
          <el-row type="flex" class="c-box c-room-box">
            <el-col :span="12" class="c-summary-item">
              <p class="c-ta-center "><strong class="c-fc-blue">{{ roomData.total }}</strong>套</p>
              <p class="c-ta-center c-room-all">房间总数</p>
            </el-col>
            <el-col :span="12" class="c-summary-item">
              <p class="c-ta-center"><strong class="c-fc-blue">{{ roomData.checkInCount }}</strong>套</p>
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
          <div class="c-person-charts">
            <div id="person"></div>
            <div class="c-person-all">
              <p class="c-fc-blue c-ta-center">{{ this.allPersonData ? this.allPersonData.total : 0 }} <span class="c-fc-gray">人</span> </p>
              <p class="c-fc-gray c-ta-center">住户总计</p>
            </div>
            <div class="c-person-p c-ta-center c-fc-gray">
              <svg width="10" height="10"> <circle stroke="transparent" stroke-width="1" fill="#3d87f5" r="4" cx="5" cy="5"/> </svg>
              <span>租客共计{{ this.allPersonData ? this.allPersonData.tenantCount : 0 }} 人，占{{ this.allPersonData ? this.allPersonData.tenantProportion : 0 }}</span>
            </div>
          </div>
          <div class="c-percent-two">
            <div>
              <div class="c-percent50">
                <div class="c-percent-childLeft" v-bind:style="{ width:tenantAll ? ( allPersonData.tenantSections[0].count / tenantAll )*100 + '%': 0  }"></div>
              </div>
              <div class="c-percent50">
                <div class="c-percent-childRight" v-bind:style="{ width:tenantAll ? ( allPersonData.tenantSections[1].count / tenantAll )*100 + '%': 0  }"></div>
              </div>
            </div>
            <el-row class="c-tenant">
              <el-col :span="12" class="c-tenant-man">
                <div class="c-tenant-manChild">
                  <p class="c-fc-gray">男性租客 {{ allPersonData.tenantSections ? allPersonData.tenantSections[0].count : 0 }}人</p>
                  <p class="c-fc-gray"  style="text-align: right;margin-top: 8px;">占{{ allPersonData.tenantSections ? allPersonData.tenantSections[0].proportion : 0 }}</p>
                </div>
              </el-col>
              <el-col :span="12" class="c-tenant-woman">
                <div class="c-tenant-womanChild">
                  <p class="c-fc-gray">女性租客 {{ allPersonData.tenantSections ? allPersonData.tenantSections[1].count : 0 }}人</p>
                  <p class="c-fc-gray" style="text-align: left;margin-top: 8px;">占{{ allPersonData.tenantSections ? allPersonData.tenantSections[1].proportion : 0 }}</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="c-apply-box">
        <el-col :span="24" class="c-box">
          <p class="c-fc-blue c-left-title">临时访客申请 (次/天)
            <el-date-picker
              class="c-selectMonth"
              v-model="selectMonth"
              type="month"
              value-format="timestamp"
              size="mini"
              @change="getApplicationData"
              placeholder="选择月">
            </el-date-picker>
          </p>
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
      let date=new Date();
      let c =date.setDate(1);
      return {
        roomData: {},
        selectMonth:  c,
        allPersonData: {},//住户数据
        tenantAll: null,//男女比例总数
      }
    },
    mounted(){
      this.getRoomData();
      this.getPersonData();
      this.getApplicationData();
    },
    methods: {
        getRoomData(){// 房间信息统计
            this.$xttp.get(`/statistics/${this.$store.getters.communityId}/room`)
              .then(res => {
                  if(!res.errorCode) {
                      this.roomData = res.data;
                  }
              })
        },
        getPersonData(){// 住户信息统计
            this.$xttp.get(`/statistics/${this.$store.getters.communityId}/household`)
              .then(res => {
                  if(!res.errorCode) {
                      this.allPersonData = res.data;
                      this.tenantAll = this.allPersonData.tenantSections.reduce((pervious,current)=> {
                          return pervious.count + current.count;
                      });
                       let  myChart2 = echarts.init(document.getElementById('person'));
                      let option2 = {
                          color: ['#41a3fc','#1fe057'],
                          tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                          },
                          legend: {
                            orient: 'vertical',
                            x: 'right',
                            y: 'bottom',
                            data:['其它','租客'],
                            formatter: "{name}",
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
                                { value:res.data.total - res.data.tenantCount, name:'其它'},
                                { value:res.data.tenantCount, name:'租客'}
                              ].sort((a,b)=> a > b)
                            }
                          ]
                        };
                      myChart2.setOption(option2); //ageSections

                    let myChart3 = echarts.init(document.getElementById('main'));
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
//                          avoidLabelOverlap: false,
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
                          data:this.allPersonData.ageSections.map(item => {
                            return {
                              value : item.count,
                              name: item.name
                            }
                          })
                        }
                      ]
                    };
                    myChart3.setOption(option);

                  }
              })
        },
        getApplicationData() {
          this.$xttp.post(`/statistics/tenant/application`,{communityId:this.$store.getters.communityId,startAt:this.selectMonth,endAt:this.getCurrentMonthLast(this.selectMonth)})
            .then(res => {
              if(!res.errorCode) {
                var myChart3 = echarts.init(document.getElementById('line'));
                let arr = res.data.daySections;
                let max = 0;
                arr.forEach(item => {
                    max = item.count > max ? item.count : max;
                });
                max = max < 5 ? 5 : max;
                //折线图
                let lineOption = {
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine:{
                      show: true
                    },
                    data: arr.map(item => {
                       return item.name.substring(5,item.name.length)
                      })
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
                    name: '访客统计',
                    data: arr.map(item => item.count),
                    type: 'line',
                    areaStyle: {},
                    itemStyle: {
                      normal: {
                        color: {
                          type: 'linear',
                          x: 1,
                          y: 1,
                          x2: 1,
                          y2: 0,
                          colorStops: [{
                            offset: 0, color: '#fff' // 0% 处的颜色 c1e1fe
                          }, {
                            offset: 1, color: '#c1e1fe' // 100% 处的颜色
                          }],
//                          globalCoord: true // 缺省为 false
                        },
                        shadowBlur: 200,
                        shadowColor: 'rgba(255, 123, 255, 0.5)'
                      }
                    },
                  }]
                };
                myChart3.setOption(lineOption);
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
        }
    }
  }


</script>

<style scoped lang="scss">
  .c-selectMonth {
    position: absolute;
    right: 5px;
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
    color:gray;
    font-size:16px;
  }

  .c-ml-15 {
    margin-left: 15px;
  }

  .c-ta-center {
    text-align: center;
  }

  .c-left-title {
    position: relative;
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
    /*height: calc( 100% - 128px);*/
    position: relative;
    .c-person-all {
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
    .person-p {
      position: absolute;
      bottom: 16px;
    }
  }
  .c-percent-two {
    width:100%;
    overflow: hidden;
    margin-top: 40px;
    .c-percent50 {
      width: 50%;
      float: left;
      background: rgba(0,0,0,0.1);
      border-radius: 10px;
      .c-percent-childLeft {
        float: right;
        width: 80%;
        height: 20px;
        background: #0099ff;
        border-bottom-left-radius: 10px;
        border-top-left-radius: 10px;
      }
      .c-percent-childRight {
        float: left;
        width: 60%;
        height: 20px;
        background: #f0657d;
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
    .c-tenant {
      margin-top: 60px;
      .c-tenant-man {
        padding-right: 10px;
        .c-tenant-manChild {
          text-align: right;
          padding-right: 10px;
          border-right: 5px solid #0099ff;
        }
      }
      .c-tenant-woman {
        padding-left: 10px;
        .c-tenant-womanChild {
          padding-left: 10px;
          border-left: 5px solid #f0657d;
        }
      }
    }
  }
  /* 表 */
  #person {
    width:100%;
    height:200px;
  }
</style>
