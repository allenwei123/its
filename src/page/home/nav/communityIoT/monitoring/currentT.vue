<template>
    <div id="vedioComponent" style="width:100%">
        <object type='application/x-vlc-plugin' id='vlc' events='True' width="33%" height="250" pluginspage="http://www.videolan.org" codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz"> 
            <param name='mrl' value='rtsp://admin:bit@123456@bitddns.ticp.net:25138/unicast/c1/s0/live' /> 
            <param name='volume' value='50' /> 
            <param name='autoplay' value='false' /> 
            <param name='loop' value='false' /> 
            <param name='fullscreen' value='true' /> 
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
      reciveVideoUrl: "rtsp://admin:bit@123456@bitddns.ticp.net:25138/unicast/c1/s0/live"
    };
  },
  components: {},
  methods: {
    play: function() {
      this.reciveVideoUrl = this.videoUrl; //  获取视频url
      var vdo = document.getElementById("vdo");
      console.log(vdo)
      vdo.play();
      this.isLoadingShow = true;
      this.isPlayBtnShow = false;
    }
  },
  created() {},
  mounted() {
    // var screenW = window.screen.width;
    // document.getElementById("vedioComponent").style.height = screenW + "px";
    // //  添加可播放事件
    // var vdo = document.getElementById("vdo");
    // vdo.addEventListener("canplay", function() {
    //   this.isVdoShow = true;
    //   this.isLoadingShow = false;
    //   this.isPosterShow = false;
    // });
  }
};
</script>

<style scoped lang="scss">

</style>
