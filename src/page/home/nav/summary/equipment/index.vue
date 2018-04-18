<template>
  <el-container class="c-baseInfo">
    <div class="c-w100">
      <el-row type="flex" style="height: 100%;">
        <el-col :span="12">
          <!--  电梯故障汇总 -->
          <el-row class="c-box">
            <el-col :span="12" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">{{ elevatorTotal }}</p>
              <p class="c-ta-center c-fc-gray">电梯总数</p>
            </el-col>
            <el-col :span="12" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">{{ faultCount }}</p>
              <p class="c-ta-center c-fc-gray">电梯故障</p>
            </el-col>
          </el-row>
          <el-row class="c-box c-module-6">
            <p class="c-fc-blue c-left-title">使用记录统计
              <el-date-picker
                class="c-selectMonth"
                v-model="selectElevator"
                type="month"
                value-format="timestamp"
                size="mini"
                @change="getElevatorUseData"
                placeholder="选择月">
              </el-date-picker>
            </p>
            <p class="c-tip c-fc-blue" v-if="progressData.length" >{{ progressData[0].name }} 使用频次较高，请注意检查维护</p>
            <div class="c-progress-body" v-loading="elevatorLoading">
                <myProgress labelWidth="110" v-for="(item,index) in progressData" :key="index" :percent="(item.num / progressData[0].num) * 100" :data="item" unit="次"></myProgress>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" style="margin-left: 10px;">
          <!--  门禁故障汇总 -->
          <el-row class="c-box">
            <el-col :span="12" class="c-summary-num">
              <p class="c-fc-blue c-ta-center">{{ doorTotal }}</p>
              <p class="c-ta-center c-fc-gray">门禁总数</p>
            </el-col>
            <el-col :span="12"  class="c-summary-num">
              <p class="c-fc-blue c-ta-center">{{ doorFaultCount }}</p>
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
                @change="getDoorUseData"
                placeholder="选择月">
              </el-date-picker>
            </p>
            <p class="c-tip c-fc-blue" v-if="doorData.length" >{{ doorData[0].name }}使用频次较高，请注意保养维护</p>
            <div class="c-progress-body" v-loading="doorLoading">
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
      let date = new Date();
      let c =date.setDate(1);
      return {
        selectElevator: c ,//电梯使用记录
        selectMonth: c,//门禁使用记录
        progressData: [],//使用记录的bar
        doorData: [],//门禁使用记录bar
        communityId: this.$store.getters.communityId,
        faultCount: 0,//电梯故障数
        elevatorTotal: 0,//电梯总数
        doorFaultCount: 0 ,//门禁故障
        doorTotal: 0,//门禁总数
        doorLoading: false,
        elevatorLoading: false
      }
    },
    components: {
      myProgress
    },
    mounted(){
      this.getElevatorUseData();
      this.getDoorUseData();
      this.getAllElevator();
      this.getAllDoor();
    },
    methods: {
      getAllElevator() {
        this.$xttp.get(`/statistics/${this.communityId}/elevator/summary`)
          .then(res => {
            if(!res.errorCode) {
             this.faultCount = res.data.faultCount;
             this.elevatorTotal = res.data.total;
            }
          });
      },
      getAllDoor() {
        this.$xttp.get(`/statistics/${this.communityId}/door/summary`)
          .then(res => {
            if(!res.errorCode) {
              this.doorFaultCount = res.data.faultCount;
              this.doorTotal = res.data.total;
            }
          });
      },
      getDoorUseData() {
        this.doorLoading = true;
        let data = {communityId:this.communityId,startAt:this.selectMonth,endAt:this.getCurrentMonthLast(this.selectMonth)};
        this.$xttp.post('/statistics/door/record',data )
          .then(res => {
              this.doorLoading = false;
              if(!res.errorCode && res.data.doorSections.length) {
                this.doorData = res.data.doorSections.map(item => {
                    return {
                        name: item.name,
                        num:  item.count
                    }
                })
              }
          });
      },
      getElevatorUseData() {
        this.elevatorLoading = true;
        let data = {communityId:this.communityId,startAt:this.selectElevator,endAt:this.getCurrentMonthLast(this.selectElevator)};
        this.$xttp.post('/statistics/elevator/record',data )
          .then(res => {
            this.elevatorLoading = false;
            if(!res.errorCode && res.data.elevatorSections.length) {
              this.progressData = res.data.elevatorSections.map(item => {
                return {
                  name: item.name,
                  num:  item.count
                }
              })
            }
          });
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
