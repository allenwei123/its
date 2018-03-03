<template>
  <div class="content">

    <el-container style="height: 600px; border: 1px solid #eee">
      <el-aside class="c-aside" style="background-color: rgb(238, 241, 246)">

        <el-menu :default-openeds="['2']">
          <el-submenu  v-for="(itemNemu,index) in arrData" :index="itemNemu.id" v-bind:key="index">
            <template slot="title"><i class="el-icon-message dh"></i>{{ itemNemu.name }}</template>
            <el-menu-item-group v-for="(itemGroup,index) in itemNemu.group" v-bind:key="index">
              <template slot="title">{{ itemGroup.title }}</template>
              <el-menu-item class="test" :index="item.id" v-for="(item,index) in itemGroup.menuItem" v-bind:key="index" @click="alink(item)">{{ item.title }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

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
        <Con1>  </Con1>
        <!--<el-main>-->
          <!--<el-table :data="tableData">-->
            <!--<el-table-column prop="date" label="日期" width="140">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="name" label="姓名" width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="address" label="地址">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="as" label="天然">-->
            <!--</el-table-column>-->
          <!--</el-table>-->

        <!--</el-main>-->
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Con1 from './Con1.vue'
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
        arrData: this.father,
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
    props:['father'],
    components:{
      Con1,
    },
    created() {
    },
    mounted:() => {
    },
    methods:{
      alink(item) {
        this.$router.push('/home/about')
      }
    }
  }
</script>

<style scoped lang="scss">
  el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-aside {
    color: #333;
  }
  .dh {
    color:red;
  }
  .c-aside{
    width:220px;
    overflow: hidden;
  }
  .el-submenu__title:hover {
    background-color: red;
  }
</style>
