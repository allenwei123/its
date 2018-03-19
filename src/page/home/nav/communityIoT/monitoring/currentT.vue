<template>
    <!-- <div id="vedioComponent" style="width:100%">
        <object type='application/x-vlc-plugin' id='vlc' events='True' width="33%" height="250" pluginspage="http://www.videolan.org" codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz"> 
            <param name='mrl' value='rtsp://admin:bit@123456@bitddns.ticp.net:25194/unicast/c1/s0/live' /> 
            <param name='volume' value='50' /> 
            <param name='autoplay' value='true' /> 
            <param name='loop' value='false' /> 
            <param name='fullscreen' value='true' />
            <param name='controls' value='true' /> 
        </object> 
    </div> -->
    <el-main>
      <ul class="c-navDetail clear">
        <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
      </ul>
      <div class="c-camera-list">
        <h4 class="c-camera-header">实时监控</h4>
        <div class="c-camera-body">
          <ul class="c-camera-ul">
            <li v-for="item in tabList" :key="item.id">
              <p class="c-describe">大门内侧1号监控</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
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
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "社区物联" },
        { id: 2, name: "监控设备" }
      ],
      tabList:[{id:111},{id:222},{id:333},{id:444},{id:555},{id:666}],
      currentPage: 1 ,
      total: 1,
      isVdoShow: false,
      isPosterShow: true,
      isLoadingShow: false,
      isPlayBtnShow: true,
      reciveVideoUrl: "rtsp://admin:bit@123456@bitddns.ticp.net:25194/unicast/c1/s0/live"
    };
  },
  components: {},
  methods: {
    play: function() {
      // this.reciveVideoUrl = this.videoUrl; //  获取视频url
      // var vdo = document.getElementById("vdo");
      // vdo.play();
      // this.isLoadingShow = true;
      // this.isPlayBtnShow = false;
    },
    handleCurrentChange(val) {

    }
  },
  created() {},
  mounted() {
    // let  vlc = document.getElementById('vlc');
    // vlc.video.fullscreen = true true:为设置全屏
    // vlc.video.count = 数目
    
    // if(vlc.versionInfo) {
    //   vlc.addEventListener('MediaPlayerTimeChanged',() => {
        
    //   })
    // }
  }
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
      justify-content:space-between;
      li {
        height: 200px;
        flex: 0 0 33%;
        background: rgba($color: #000, $alpha: 0.2);
        box-sizing: border-box;
        margin-bottom: 10px;
        position: relative;
        cursor: pointer;
        .c-describe {
          position: absolute;
          bottom: 0;
          color:white;
          width: 100%;
          line-height: 30px;
          text-indent: 1rem;
          background: rgba(0,0,0,0.7);
        }
      }
    }
  }
</style>
