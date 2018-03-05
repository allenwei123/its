<template>
  <div class="content">


      <el-container style="background: rgba(241, 244, 251, 1)">
      <el-header style="padding-top: 10px;">
      <el-row>

      <el-col :span="6">
      <span>地区：</span>
      <el-select v-model="value" placeholder="请选择">
      <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>
      </el-select>
      </el-col>

      <el-col :span="6">
      <span>所属项目组：</span>
      <el-input
      placeholder="请输入内容"
      suffix-icon="el-icon-date" style="max-width:150px">
      </el-input>
      </el-col>

      <el-col :span="6">
      <span>立项情况：</span>
      <el-input
      placeholder="请输入内容"
      suffix-icon="el-icon-date" style="max-width:150px">
      </el-input>
      </el-col>

      <el-col :span="6">
      <span>项目名称：</span>
      <el-input
      placeholder="请输入内容"
      suffix-icon="el-icon-date" style="max-width:150px">
      </el-input>
      </el-col>

      </el-row>
      </el-header>
      <!--<Con1>  </Con1>-->
      </el-container>
  </div>
</template>

<script>

  export default {
    name: 'Content',
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        as:'affjin',
      };
      return {
        tableData: Array(20).fill(item),
        index:'1-1',
        index1:'1-2',
        options: [
          {
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
        value:''
      }
    },
    components:{
    },
    created() {
    },
    mounted:() => {
    },
    methods:{
    }
  }
</script>

<style scoped lang="scss">

</style>
