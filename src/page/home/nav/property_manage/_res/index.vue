<template>
  <div class="content">
      <label for="file_id" class="c-file-label"></label>
      <input type="file" name="id_file" id="file_id" ref="file" @change="change" v-show="hideFile" >
      <el-button type="success" @click="submit">提交</el-button>
  </div>
</template>

<script>
import { send } from '@/utils/oss';

export default {
  name: "Content",
  data() {
    return {
      titleFont: "打印内容",
      hideFile: false,
      fileData:null,//记录file数据
      suff: '',//记录 文件类型 .jpg
    };
  },
  components: {},
  created() {
    
  },
  mounted: () => {},
  methods: {
    change() {
      let dom = this.$refs.file;
      let fileName = dom.files[0].name;
      this.suff = fileName.substr(fileName.indexOf('.'));
      this.fileData = dom.files[0];
    },
    submit() {
      let fuc = function(){
        console.log(123)
      }
      let formdata = send(this.fileData,fuc);
    }
  }
};
</script>

<style scoped lang="scss">
.content {
  width: 100%;
}
.c-file-label {
  display: block;
  width:200px;
  height: 100px;
  background-image: url('../../../../../assets/upload.jpg');
  background-size: 100% 100%;

}
</style>
