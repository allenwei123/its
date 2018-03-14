<template>
    <div id="vedioComponent" style="width:100%">
        <object type='application/x-vlc-plugin' id='vlc' events='True' width="33%" height="250" pluginspage="http://www.videolan.org" codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz"> 
            <param name='mrl' value='rtsp://admin:bit@123456@bitddns.ticp.net:25194/unicast/c1/s0/live' /> 
            <param name='volume' value='50' /> 
            <param name='autoplay' value='true' /> 
            <param name='loop' value='false' /> 
            <param name='fullscreen' value='true' />
            <param name='controls' value='true' /> 
        </object> 
    </div>
</template>

<script>
import { communityId } from "@/biz/community";

export default {
  name: "devices",
  data() {
    return {
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
    }
  },
  created() {},
  mounted() {
    let  vlc = document.getElementById('vlc');
    // vlc.video.fullscreen = true true:为设置全屏
    // vlc.video.count = 数目
    
    if(vlc.versionInfo) {
      vlc.addEventListener('MediaPlayerTimeChanged',() => {
        
      })
    }
  }
};
</script>

<style scoped lang="scss">

</style>
