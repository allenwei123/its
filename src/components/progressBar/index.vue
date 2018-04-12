<template>
  <div class="c-progress-box" ref="progress">
    <div class="c-progress-span c-name" ref="name">{{ data.name }}</div>
    <div class="c-progress-span c-bar" ref="bar"></div>
    <div class="c-progress-span c-null" v-if="!data.num"></div>
    <div class="c-progress-span c-number">{{ data.num ? (data.num + ( unit || '起')): '无' }}</div>
  </div>
</template>

<script>
  export default {
    name: 'progressBar',
    data() {
        return {

        }
    },
    props:['percent','data','unit','labelWidth'],
    mounted() {
      /**
       * labelWidth default 80
       * **/
       /**
       * unit default '起' 表示单位获取数据的描述
       * **/
      if(this.labelWidth) {
          this.$refs.name.style.width = this.labelWidth + 'px';
      }
      this.$refs.bar.style.width = this.percent/100 * (this.$refs.progress.clientWidth - this.$refs.name.clientWidth - 86 ) + 'px';
    }
  }

</script>

<style scoped lang="scss">
  .c-progress-box {
    width:100%;
    box-sizing: border-box;
    overflow: hidden;
    margin-top: 10px;
    .c-progress-span {
      float: left;
      height: 20px;
    }
    .c-name {
      width: 80px;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color:gray;
      font-size: 13px;
    }
    .c-bar {
      border-radius: 10px;
      background: #3d87f5;
    }
    .c-null {
      width:20px;
      height:20px;
      border-radius: 50%;
      border:2px solid #3d87f5;
    }
    .c-number {
      color:#3d87f5;
      font-size: 13px;
      width:75px;
      text-align: center;
    }
  }
</style>
