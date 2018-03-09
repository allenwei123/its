<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="查找">
              <el-input v-model="formInline.name" placeholder="请输入门禁名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
        </div>
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
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="as"
          align="center"
          label="id">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="小区名称"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time1"
          label="所属分组">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time1"
          label="设备厂商">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time1"
          label="型号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time1"
          label="运行状态">
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
            <el-button @click="editHandle(scope.row)" type="warning" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-main>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "other",
  data() {
    return {
      isSou: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "社区物联" },
        { id: 2, name: "监控设备" }
      ],
      formInline: {
        name: ""
      },
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      delData:null
    };
  },
  computed: mapGetters(["showAside"]),
  components: {},
  methods: {
    handleCurrentChange(val) {
      this.sendAjax(val);
    },
    handleClick(row) {
      //查看
    },
    editHandle(row) {
      //编辑
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    find(){
      this.sendAjax(null,this.formInline.name);
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/community/${this.delData.id}/delete`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:res.data,type:'success'});
            this.find();
          }
        })
      }
    },
    sendAjax(page,name) {
      let nPage = page || this.$route.query.page || 1;
      let obj = {page:nPage};
      this.loading = true;
      this.$xttp.post("/communityIoT/camera/auth/page",obj)
      .then(res => {
        if (!res.errorCode) {
          this.tableData = res.data.records;
          this.currentPage = res.data.currentPage;
          this.total = res.data.total;
          this.$router.push({path:this.$route.path,query:{page: nPage }})
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    }
  },
  created() {
    this.sendAjax();
  },
  mounted() {
  }
};
</script>

<style scoped lang="scss">
.c-body {
  width: 90%;
  &.c-maxWidth {
    max-width: calc(100vw - 200px);
  }
}
.c-navDetail {
  margin-bottom: 10px;
  li {
    float: left;
    margin-right: 10px;
  }
}
.c-block {
  margin-top: 15px;
}
.c-search {
  position: relative;
  width: 100%;
  .c-addBtn {
    position: absolute;
    right: 0px;
    top: 0px;
  }
}
</style>
