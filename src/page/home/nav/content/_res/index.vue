<template>
  <el-main>
    <div class="c-content">
      <ul class="c-navDetail clear">
        <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span
          v-if="index !== navDetailData.length -  1"> > </span></li>
      </ul>
      <div class="c-search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="社区名称">
            <el-select v-model="formInline.name">
              <el-option
                v-for="item in options"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查找</el-button>
            <el-button type="primary" @click="sbm">提交权限</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="c-addBtn" @click="addBtn" size="small">新增</el-button>
      </div>
      <el-table
        class="c-table"
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
        highlight-current-row
        ref="multipleTable"
        style="width: 100%">

        <el-table-column label="序号" width="50" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>

        <el-table-column label="模块名" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

        <el-table-column label="排序" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.rank }}</template>
        </el-table-column>

        <el-table-column label="创建时间  " :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.createAt | time }}</template>
        </el-table-column>

        <el-table-column label="是否展示" align="center" width="">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.on"
              active-color="#00A854"
              active-value='1'
              inactive-color="#F04134"
              inactive-value='0' >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="deleteHandle(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <el-dialog title="温馨提示" :visible.sync="visible2">
        <p>请问您是否确定删除这条数据吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-main>
</template>

<script>
  import AddPage from "./form"

  export default {
    name: 'Content',
    data() {
      return {
        formInline: {
          name:null,
        },
        navDetailData: [
          {id: 0, name: "首页"},
          {id: 1, name: "菜单管理"}
        ],
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        loading: false,
        isShow: false,
        notice: null,
        visible2: false,//删除
        delData:null,
        options:[]
      }
    },
    components: {
      AddPage
    },
    mounted () {
      this.getTableList();
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.$xttp.post('/community/list',{})
          .then(res => {
            if (!res.errorCode) {
              this.options = res.data;
              this.options.splice(0,0,{id:0,name:'不选'})
            }
          })
      },
      sbm(){//提交权限
        let arr = [];
        this.tableData.forEach((item, i) => arr.push(item.on));
        let requestData = {
          outerKey:this.formInline.name,
          // outerKey: 1,
          menuType: 1,
          spread: arr.join('')
        }
        this.$xttp.post('/sys/menu/edit-menu-key',requestData)
          .then(res => {
            console.log(res)
          })
      },
      addBtn() {//添加
        this.isShow = true
      },
      getTableList() {
        this.$xttp.get('/sys/menu/1/list')
          .then(res => {
            if (!res.errorCode) {
              this.tableData = res.data;
              for(var i = 0; i< this.tableData.length; i++) {
                this.$set(this.tableData[i],'on','1' )
              }
            }
          })
      },
      change() {
        this.isShow = false;
        this.getTableList();
      },
      deleteHandle(row){
        this.visible2 = true;
        this.delData = row;
      },
      confirmDel() {
        this.$xttp.get(`/sys/menu/${this.delData.id}/delete`)
          .then(res => {
              if(!res.errorCode){
                this.$message.success('删除成功');
                this.visible2 = false;
                this.getTableList();
              }
          })
      },
      find() {//查看权限配置
        if(this.formInline.name){
          this.$xttp.get(`/sys/menu/${this.formInline.name}/getByOuterKey`)
            .then(res => {
              if(!res.errorCode && res.data) {
                let data = res.data.spread.split('');
                data.forEach((item,i) =>
                {
                  this.tableData[i].on = item;
                })
              }else {
                this.tableData.forEach(item => item.on = '1');
              }
            })
        }else {
          this.tableData.forEach(item => {item.on = '1'});
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .c-content {
    width: 100%;
    max-height: calc(100vh - 80px);
    overflow-y: scroll;
  }

  .c-search {
    position: relative;
    width: 100%;
    height: 50px;
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }

  .c-navDetail {
    position: relative;
    margin-bottom: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
  }

  .c-block {
    margin-top: 15px;
  }
</style>
