<template>
  <div class="c-progress-box" ref="progress">
    <div v-if="!type">
      <div class="c-progress-span c-name" ref="name">{{ data.name }}</div>
      <div class="c-progress-span c-bar" ref="bar"></div>
      <div class="c-progress-span" v-if="!data.num">
        <svg width="20" height="20"> <circle stroke="#3d87f5" stroke-width="2" fill="transparent" r="8" cx="10" cy="10"/> </svg>
      </div>
      <div class="c-progress-span c-number">{{ data.num ? (data.num + ( unit || '起')): '无' }}</div>
    </div>
    <div v-if="type == 'more'" class="c-bar-max">
      <div class="c-progress-maxSpan c-name" ref="name">
        <span class="c-f-title">{{ data.name }}</span>
        <p class="c-fw-min">13839072903</p>
      </div>
      <div class="c-progress-maxSpan c-bar" ref="bar">
        <p class="c-fc-white c-tip" ref="innerBar">当前欠费{{ data.num }}次</p>
      </div>
      <div class="c-progress-span c-number">共 {{ data.max }} 期</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'progressBar',
    data() {
        return {

        }
    },
    props:['percent','data','unit','labelWidth','type'],
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

      /**
       * type 默认无，如果为more 则 如下
       * **/
      if(this.type) {
        this.$refs.bar.style.width = (this.$refs.progress.clientWidth - this.$refs.name.clientWidth - 86 ) + 'px';
        this.$refs.innerBar.style.width = (this.data.num / this.data.max)*100 + '%' ;
      }else {
        this.$refs.bar.style.width = this.percent/100 * (this.$refs.progress.clientWidth - this.$refs.name.clientWidth - 86 ) + 'px';
      }
    }
  }

</script>

<style scoped lang="scss">
  .c-fc-white {
    color: #fff;
  }
  .c-f-title {
    font-size: 16px;
    color: #000;
  }
  .c-fw-min {
    font-size:12px;
    color:gray;
  }
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
      padding: 0 5px;
    }
    .c-bar {
      border-radius: 10px;
      background: #3d87f5;
    }
    .c-number {
      color:#3d87f5;
      font-size: 13px;
      width:75px;
      text-align: center;
    }
    .c-bar-max {
      margin-top: 20px;
      .c-bar {
        background: #99d6ff;
      }
    }
    .c-progress-maxSpan {
      float: left;
      height: 35px;
      border-radius: 18px;
    }
    .c-tip {
      width: 60%;
      background: #3d87f5;
      padding-left: 18px;
      margin: 0px;
      border-radius: 17px;
      line-height: 35px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>
