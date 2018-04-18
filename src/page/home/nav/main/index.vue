<template>
    <el-container class="c-home">
      <el-main>
        <div class="c-header">
          <i class="iconfont icon-house c-fs-24"></i>
          <span>和谐警苑</span>
        </div>
        <el-container class="c-main">
          <el-main>
            <div class="c-title-info">
              <ul class="c-three">
                <li class="c-three-li" v-if="pms['11a1']">
                  <h5 class="c-three-title c-tl-center">业主认可</h5>
                  <div class="c-three-detail">
                    <div>
                      <p class="c-color-white c-fs-24 c-tl-center">{{ alarmData.unReviewedNum || 0 }}</p>
                      <span class="c-color-white ">待审核</span>
                    </div>
                    <div>
                      <p class="c-color-white c-fs-24 c-tl-center">{{ alarmData.reviewedNum || 0 }}</p>
                      <span class="c-color-white ">已审核</span></div>
                  </div>
                </li>
                <li class="c-three-li" v-if="pms['11a2']">
                  <h5 class="c-three-title c-tl-center">物业缴费</h5>
                  <div class="c-three-detail">
                    <div>
                      <p class="c-color-white c-fs-24 c-tl-center">{{ alarmData.unPaymentNum || 0 }}</p>
                      <span class="c-color-white ">待缴费</span>
                    </div>
                    <div>
                      <p class="c-color-white c-fs-24 c-tl-center">{{ alarmData.overdueNum || 0 }}</p>
                      <span class="c-color-white ">超额未缴</span></div>
                  </div>
                </li>
                <li class="c-three-li" v-if="pms['11a3']">
                  <h5 class="c-three-title c-tl-center">警报消息</h5>
                  <div class="c-three-detail">
                    <div>
                      <p class="c-color-white c-fs-24 c-tl-center">{{ alarmData.unCheckedNum || 0 }}</p>
                      <span class="c-color-white ">待处理</span>
                    </div>
                    <div>

                      <p class="c-color-white c-fs-24 c-tl-center">{{ alarmData.receivedNum || 0 }}</p>
                      <span class="c-color-white ">待排查</span></div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="c-title-info">
              <ul class="c-three">
                <li class="c-three-one c-three-bottomLi" v-if="pms['11a4']">
                  <p class="c-left-title">任务待办</p>
                  <div class="c-wait-box">
                    <ul>
                      <li class="c-wait-item" v-for="item in taskList" :key="item.id">
                        <div class="c-wait-time"><i class="iconfont icon-shijian c-time"></i><span class="c-time"> {{ item.createAt | time}}</span></div>
                        <a href="javascript:void(0)" class="c-task-detail">{{ item.title }}。<b> 请尽快处理!</b></a>
                      </li>
                      <li class="c-loading" v-if="isLoading">
                        <div><img src="static/image/loading.png" alt=""></div>
                      </li>
                    </ul>
                  </div>
                </li>
                <li class="c-three-two c-three-bottomLi" v-if="pms['11a5']">
                  <p class="c-left-title">常用功能</p>
                  <div class="c-common-use">
                    <ul>
                      <li class="c-common-li">
                        <a href="javascript:void(0)" class="c-common-a">
                          <span class="c-tl-center"><i class="iconfont icon-yonghu c-common-font"></i></span>
                          <span class="c-color-gray">用户档案</span>
                        </a>
                      </li>
                      <li class="c-common-li">
                        <a href="javascript:void(0)" class="c-common-a">
                          <span class="c-tl-center"><i class="iconfont icon-faults-statistics c-common-font"></i></span>
                          <span class="c-color-gray">故障申报</span>
                        </a>
                      </li>
                      <li class="c-common-li">
                        <a href="javascript:void(0)" class="c-common-a">
                          <span class="c-tl-center"><i class="iconfont icon-jingwuicon_svg- c-common-font"></i></span>
                          <span class="c-color-gray">警报管理</span>
                        </a>
                      </li>
                      <li class="c-common-li">
                        <a href="javascript:void(0)" class="c-common-a">
                          <span class="c-tl-center"><i class="iconfont icon-paibanguanli c-common-font"></i></span>
                          <span class="c-color-gray">排班管理</span>
                        </a>
                      </li>
                      <li class="c-common-li">
                        <a href="javascript:void(0)" class="c-common-a">
                          <span class="c-tl-center"><i class="iconfont icon-bulletin c-common-font"></i></span>
                          <span class="c-color-gray">社区公告</span>
                        </a>
                      </li>
                      <li class="c-common-li">
                        <a href="javascript:void(0)" class="c-common-a">
                          <span class="c-tl-center"><i class="iconfont icon-cheliang c-common-font"></i></span>
                          <span class="c-color-gray">车辆档案</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </el-main>
          <el-aside class="c-aside" v-if="pms['11a6']">
            <p class="c-left-title">通讯录</p>
            <div class="c-user-list">
              <ul>
                <li class="c-user-item" v-for="item in userList" :key="item.id">
                  <img :src="'static/image/' + ( item.postCode || 'DEFAUL' ) + '.png'" class="c-user-image" alt="">
                  <div class="c-user-detail">
                      <p class="c-user-name">{{ item.nickName || '无' }} <span class="c-color-gray"> {{ item.postCode | postCode }}</span></p>
                      <p>{{ item.phone || '无'}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </el-aside>
        </el-container>
      </el-main>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      communityId: this.$store.getters.communityId,
      userList: [],
      taskList: [], //任务
      alarmData: { unReviewedNum: "" }, //警报
      isLoading: false, //加载中
      door: false,
      currentPage: 1,//記錄任務列表
      pms: this.$store.getters.pms,//菜单权限
    };
  },
  mounted() {
    this.getUser();
    this.getTask();
    this.getAlarm();
    let that = this;
    this.$nextTick(function() {
      var scrollDom = document.getElementsByClassName("c-wait-box")[0];
      let first = 1;
      scrollDom.addEventListener("scroll", function() {
        let scrollTop = scrollDom.clientHeight + scrollDom.scrollTop;
        let scrollH = scrollDom.scrollHeight;
        if (scrollTop > scrollH - 40) {
          if (!that.door) {
            that.isLoading = true;
            that.getTask(true);
          } else {
            //此时说明没有更多数据
            if (first < 2) {
              //再次不能再激活 loading...
              that.isLoading = true;
              first++;
              setTimeout(() => {
                that.isLoading = false;
              }, 2000);
            }
          }
        }
      });
    });
  },
  methods: {
    getUser() {
      this.$xttp
        .get(`/user/property/${this.communityId}/user-list`)
        .then(res => {
          if (!res.errorCode) {
            this.userList = res.data;
          }
        });
    },
    getTask(bool) {
      this.$xttp
        .post(`/property/gtasks/queryGtasksPage`, {
          communityId: this.communityId,
          page:this.currentPage++
        })
        .then(res => {
          if (!res.errorCode) {
            if (res.data.records == 10) {
              this.door = false;
            } else {
              this.door = true;
            }
            if (bool) {
              this.isLoading = false;
              res.data.records.forEach(item => {
                this.taskList.push(item);
              });
            } else {
              this.taskList = res.data.records;
            }
          }
        });
    },
    getAlarm() {
      //获取数据
      this.$xttp
        .get(`/statistics/manager/${this.communityId}/todo`)
        .then(res => {
          if (!res.errorCode) {
            this.alarmData = res.data;
          }
        });
    }
  }
};
</script>

<style scoped lang="scss">
$headerHight: 50px;
$bg-green: #6ccba5;
$bg-orange: #f3c95d;
.c-home {
  margin-top: $headerHight;
  background: #efefef;
  height: calc(100vh - 50px);
}
.c-time {
  font-size: 12px;
  color: #ccc;
}
.c-fs-24 {
  font-size: 24px;
}
.c-tl-center {
  text-align: center;
}
.c-color-gray {
  color: darkgray;
}
.c-color-white {
  color: #ffffff;
}
.c-header {
  background-color: #d7e7ff;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
}
.c-main {
  background-color: #ecf6fc;
  .c-title-info {
    display: flex;
    width: 100%;
    .c-three {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-left: -15px;
      position: relative;
      .c-three-li {
        flex: 1;
        background: #49c5d0;
        box-sizing: border-box;
        margin-left: 15px;
        border-radius: 5px;
        padding: 10px 0 20px;
        &:nth-child(2) {
          background: $bg-green;
        }
        &:nth-child(3) {
          background: $bg-orange;
        }
        .c-three-title {
          width: 100px;
          line-height: 30px;
          font-weight: 300;
          margin: 0 auto;
          color: #ffffff;
          border-bottom: 0.6px solid #ccd6d8;
        }
        .c-three-detail {
          width: 100%;
          margin-top: 20px;
          display: flex;
          justify-content: space-around;
        }
      }
      .c-three-bottomLi {
        margin-left: 10px;
        background-color: #ffffff;
        padding: 10px 5px;
        margin-top: 15px;
        border-radius: 5px;
      }
      .c-three-one {
        flex: 1;
        background-color: #ffffff;
        .c-wait-box {
          margin-top: 5px;
          overflow-y: scroll;
          height: calc(100vh - 364px);
          .c-wait-item {
            margin-top: 8px;
            .c-task-detail {
              display: block;
              padding: 10px 8px;
              font-size: 14px;
              color: #959391;
              background-color: #fff9f3;
              border-radius: 4px;
              b {
                color: #3988ff;
              }
            }
          }
        }
      }
      .c-three-two {
        flex: 2;
      }
    }
    .c-common-use {
      width: 100%;
      margin-top: 20px;
      ul {
        display: flex;
        width: 100%;
        justify-content: space-around;
        flex-wrap: wrap;
        li {
          margin: 30px 0;
          flex: 0 0 33.333%;
          display: flex;
          justify-content: center;
        }
        .c-common-a {
          display: block;
          span {
            display: block;
            margin-bottom: 10px;
          }
          .c-common-font {
            font-size: 30px;
            color: #3988ff;
          }
        }
      }
    }
  }
}
.c-aside {
  padding: 10px 8px;
  margin-top: 20px;
  background-color: #ffffff;
  margin-right: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  height: calc(100vh - 170px);
  overflow-y: hidden;
  .c-user-list {
    margin-top: 15px;
    overflow-y: scroll;
    max-height: calc(100% - 40px);
    .c-user-item {
      position: relative;
      width: 100%;
      padding: 8px 0;
      border-top: 1px solid #ccc;
      cursor: pointer;
      .c-user-image {
        float: left;
        width: 45px;
        border-radius: 50%;
      }
      .c-user-detail {
        margin-left: 50px;
        .c-user-name {
          font-size: 14px;
        }
      }
    }
  }
}
.c-left-title {
  margin-left: 5px;
  color: #3988ff;
  border-left: 3px solid #3988ff;
  text-indent: 0.5rem;
}
.c-loading {
  height: 40px;
  margin-top: 5px;
  div {
    width: 40px;
    margin: 0 auto;
  }
  img {
    width: 100%;
    animation: loading 2s alternate infinite;
  }
}
@keyframes loading {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(-720deg);
  }
}
</style>

