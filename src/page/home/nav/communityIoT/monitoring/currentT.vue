<template>
  <el-main>
    <ul class="c-navDetail clear">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li> -->
    </ul>
    <div class="c-camera-list">
      <h4 class="c-camera-header">实时监控</h4>
      <div class="c-camera-body">
        <ul class="c-camera-ul">
          <li v-for="item in tabList" :key="item.id" class="c-id">
            <p class="c-describe">大门内侧1号监控</p>
            <div :id="item.id"></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="c-block">
      <el-pagination
        @current-change="getData"
        :current-page.sync="currentPage"
        :page-size="3"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-main>
</template>

<script>

  export default {
    name: "devices",
    data() {
      return {
//      pms: this.$store.getters.pms,//菜单权限
        navDetailData: [
          {id: 0, name: "社区物联"},
          {id: 1, name: "监控管理"},
          {id: 2, name: "监控设备"}
        ],
        tabList: [],
        currentPage: 1,
        total: 1,
        vObj: null,
        reciveVideoUrl: "rtsp://admin:bit@123456@bitddns.ticp.net:25194/unicast/c1/s0/live"
      };
    },
    components: {},
    methods: {
      getData() {
        this.$xttp.post(`/communityIoT/camera/page?size=${3}&page=${this.currentPage}`,{communityId:this.$store.getters.communityId})
          .then(res => {
            if(!res.errorCode ) {
              this.currentPage = res.data.currentPage;
              this.total = res.data.total;
              this.tabList = res.data.records;
              this.tabList.forEach((item,index) => {
                  this.$nextTick(() => {
                    let d = document.getElementsByClassName('c-id');
                    let w = d[0].clientWidth;
                    this.play(item.id,item.callURL,w);
                  })
              })
            }
          })
      },
      play(id,url,w) {
        var player4 = cyberplayer(id).setup({
          width: w,
          height: 450,
          file: url,
          autostart: true,
          stretching: "uniform",
          volume: 100,
          controls: true,
          rtmp: {
            reconnecttime: 100, // rtmp直播的重连次数
            bufferlength: 15 // 缓冲多少秒之后开始播放 默认1秒
          },
          ak: "15771882d494482196274ed1ad6240d2"
        });
      },
      handleCurrentChange(val) {

      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        this.getData();
//        this.tabList.forEach(item => {
//          this.play( item.id, item.url)
//        })
      })
    },
  };
</script>

<style scoped lang="scss">
  .c-camera-header {
    padding-left: 5px;
    color: white;
    background: #23262b;
  }

  .c-navDetail {
    margin-bottom: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
  }

  .c-camera-body {
    padding: 5px;
    .c-camera-ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        height: 450px;
        flex: 0 0 33%;
        background: rgba($color: #000, $alpha: 0.2);
        box-sizing: border-box;
        margin-bottom: 10px;
        position: relative;
        cursor: pointer;
        .c-describe {
          position: absolute;
          bottom: 0;
          color: white;
          width: 100%;
          line-height: 30px;
          text-indent: 1rem;
          background: rgba(0, 0, 0, 0.7);
        }
      }
    }
  }
</style>
