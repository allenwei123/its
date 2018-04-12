<template>
    <el-dialog title="服务详情" :visible.sync="msg" :before-close="handleClose">
        <ul>
            <li class="c-list"><span class="c-label">服务名称:</span> <span class="c-content"> {{ data.name }} </span></li>
            <li class="c-list"><span class="c-label">社区名称:</span> <span class="c-content"> {{ data.communityName }} </span></li>
            <li class="c-list"><span class="c-label">分类:</span> <span class="c-content"> {{ data.serviceType | serviceType }} </span></li>
            <li class="c-list"><span class="c-label">服务类型:</span> <span class="c-content"> {{ data.serviceWay | serviceWay}} </span></li>
            <li class="c-list" v-if="data.serviceWay == 1"><span class="c-label">热线电话:</span> <span class="c-content"> {{ data.contact }} </span></li>
            <li class="c-list" v-if="data.serviceWay == 2"><span class="c-label">外部链接:</span> <span class="c-content"> {{ data.url }} </span></li>
            <li class="c-list"><span class="c-label">创建时间:</span> <span class="c-content"> {{ data.createAt | time('yyyy-MM-dd HH:mm:ss')}} </span></li>
            <!-- <li class="c-list"><span class="c-label">图片:</span> <span class="c-content"> {{ data.picture }} </span></li> -->
            <li class="c-list"><span class="c-label">图片:</span> <div class="c-image" v-if="uri"><img :src="uri"></div></li>
            
        </ul>  
    </el-dialog>
</template>

<script>
import time from '@/utils/time.js';
import { getUri } from '@/utils/oss';
export default {
  name: "amenitySee",
  data() {
    return {
        uri:'',
        arr:[1,2,4,5]
    }
  },
  props: ["msg","data"],
  created(){
    if(this.data.icon) {
          getUri(this.uri,(uri)=> {
            this.uri = uri;
          });
      }
    
  },
  methods:{
      handleClose() {
        this.$emit("upsee", false );
      }
  }
}
</script>

<style lang="scss" scoped>
    .c-list {
        margin-bottom: 15px;
        .c-label {
            display: inline-block;
            width: 100px;
            text-align:right;
        }
        .c-content {
            display: inline-block;
            margin-left: 15px;
            font-weight: bold;
        }
    }
</style>