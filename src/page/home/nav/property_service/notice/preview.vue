<template>
  <el-dialog title="公告预览" :visible.sync="previewVisible">
    <div class="c-preview-container" v-if="noticeInfo">
      <h1>{{noticeInfo.title}}</h1>
      <p>
        <span>{{publishTime}}</span>
        <span style="margin-left: 20px">{{noticeInfo.communityName}}</span>
      </p>
      <div>
        <pre>{{noticeInfo.body}}</pre>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import time from '@/utils/time.js';

  export default {
    data() {
      return {
        previewVisible: this.visible
      }
    },
    watch: {
      visible(val) {
        this.previewVisible = val;
      },
      previewVisible(val) {
        this.$emit('update:visible', val);
      }
    },
    props: ['visible', 'noticeInfo'],
    computed: {
      publishTime() {
        return time.timestampToFormat(this.noticeInfo.publishAt, 'yyyy-MM-dd hh:mm');
      }
    }
  }
</script>

<style scoped lang="scss">
  .c-preview-container {
    pre {
      margin: 0;
      padding: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: transparent;
      font-size: 14px;
      min-width: 280px;
      font-family: inherit;
    }
  }
</style>
