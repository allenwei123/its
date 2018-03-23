<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">
            <!-- <el-form-item label="社区名称">
              <el-select v-model="formInline.select" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="查找">
              <el-input v-model="input" placeholder="监控设备名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="序号" width="50" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="监控设备名称" :show-overflow-tooltip="true" width="130" align="center" prop="name">
          <!-- <template slot-scope="scope">{{ scope.row.keyNo }}</template> -->
        </el-table-column>

        <el-table-column label="所属楼栋" :show-overflow-tooltip="true" align="center" prop="buildingId">
          <!-- <template slot-scope="scope">{{scope.row.startTime | time }}</template> -->
        </el-table-column>

        <el-table-column label="设备厂商" :show-overflow-tooltip="true" align="center" prop="brand">
          <!-- <template slot-scope="scope">{{ scope.row.startTime | time }}</template> -->
        </el-table-column>

        <el-table-column label="型号" :show-overflow-tooltip="true" align="center" prop="deviceId">
          <!-- <template slot-scope="scope">{{ scope.row.startTime }}</template> -->
        </el-table-column>

        <el-table-column label="运行状态" :show-overflow-tooltip="true" align="center" prop="cameraStatus">
            <template slot-scope="scope">{{getPublishStatusName(scope.row.cameraStatus)}}</template>
          <!-- <template slot-scope="scope">{{ scope.row.startTime }}</template> -->
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">播放录像</el-button>
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
      options:[],//社区列表
      input: '',
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      delData:null,
      pageSize: 10
    };
  },
  components: {},
  methods: {
    handleCurrentChange(val) {
      this.sendAjax(val);
    },
    getPublishStatusName(status) {
        let names = {
          '0': '未运行',
          '1': '正在运行',
          '2': '故障',
          '3': '未知',
        };
        return names[status];
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
      if(this.currentPage !== 1) {
          this.currentPage = 1;
      }else {
          this.sendAjax(null,this.input);
      }
        
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
      let params = {page:nPage, communityId: this.$store.getters.communityId };
      //监控设备名称
      if(name){
          //输入的搜索字添加params中
          params['name'] = this.input;
        }else {
          delete params.name;
        }
        console.log(params);
      this.loading = true;
      this.$xttp.post("/communityIoT/camera/auth/page",params)
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
