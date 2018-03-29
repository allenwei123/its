<template>
    <div class="c-online-item">
      <div class="c-float-left"><img class="c-user-img" src="@/assets/logo.png" alt=""></div>
      <div class="c-user-info">
        <p><span class="c-msg-font">{{ item.nick  }}</span> <b class="c-time" @click="visible2 = true">删除</b></p>
        <p><span class="c-msg-font c-font-12">{{ item.chatObj.list.length ? item.chatObj.list[item.chatObj.list.length-1].text : '' }} </span> <b class="c-tip" v-if="item.unread">{{ item.unread }}</b></p>
      </div>
      <el-dialog title="温馨提示" :visible.sync="visible2">
        <p>请问您是否确定删除这条数据吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
          <el-button type="primary" size="mini" @click="del(item.to)">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  export default {
        data(){
          return {
            visible2:false,
          }
        },
        props:[ 'item' ],
        updated () {
        },
      methods: {
          del(id){
            this.$emit('delItem',id);
          }
      }
    }
</script>

<style scoped lang="scss">
  .c-font-12 {
    font-size: 12px;
  }
  .c-online-item {
    border-bottom: 1px solid #eaeeef;
    overflow: hidden;
    height: 60px;
    padding: 8px 10px;
    box-sizing: border-box;
    cursor: pointer;
    .c-msg-font {
      display: inline-block;
      width: 60%;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .c-time {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    color: #999;
  }
  .c-tip {
    position: absolute;
    background-color: #f24c3d;
    display: inline-block;
    font-size: 12px;
    color: #fff;
    border-radius: 10px;
    right: 0;
    top: 21px;
    text-align: center;
    padding: 0 5px;
    width: 30px;
    line-height: 18px;
  }
  .c-float-left {
    float: left;
    .c-user-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      vertical-align: top;
    }
  }

  .c-user-info {
    margin: 0 0 0 60px;
    box-sizing: border-box;
    position: relative;
    height: 100%;
    overflow: hidden;
  }
</style>
