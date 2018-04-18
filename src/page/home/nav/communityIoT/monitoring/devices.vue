<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li> -->
        </ul>
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">
            <el-select v-model="value1" placeholder="品牌" clearable  @change="changeStatus">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="value2" placeholder="型号" clearable  @change="changeStatus">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="value3" placeholder="全部楼栋" clearable @change="changeStatus">
              <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-form-item>
              <el-input v-model="input" placeholder="监控设备名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query" v-if="pms['11O1']"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="success" @click="add" v-if="pms['11O2']">新增监控</el-button>
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

        <!-- <el-table-column label="所属楼栋" :show-overflow-tooltip="true" align="center" prop="buildingId">
          <template slot-scope="scope">{{scope.row.startTime | time }}</template>
        </el-table-column> -->

        <el-table-column label="设备厂商" :show-overflow-tooltip="true" align="center" prop="brand">
          <!-- <template slot-scope="scope">{{ scope.row.startTime | time }}</template> -->
        </el-table-column>

        <el-table-column label="型号" :show-overflow-tooltip="true" align="center" prop="brandNo">
          <!-- <template slot-scope="scope">{{ scope.row.startTime }}</template> -->
        </el-table-column>

        <el-table-column label="设备编号" :show-overflow-tooltip="true" align="center" prop="deviceId">
          <!-- <template slot-scope="scope">{{ scope.row.startTime }}</template> -->
        </el-table-column>

        <el-table-column label="运行状态" :show-overflow-tooltip="true" align="center" prop="cameraStatus">
            <template slot-scope="scope">{{getPublishStatusName(scope.row.cameraStatus)}}</template>
          <!-- <template slot-scope="scope">{{ scope.row.startTime }}</template> -->
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right" align="left">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small" v-if="pms['11O3']">查看录像</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="c-block">
        <el-pagination
          @current-change="getTableList"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <!-- 新增监控 -->
      <transition name="fade">
        <AddPage v-if="show" :msg="show" @change=addChange></AddPage>
      </transition>

    </el-main>
</template>

<script>
import AddPage from "./add";
export default {
  components: {
    AddPage
  },
  name: "other",
  data() {
    return {
      pms: this.$store.getters.pms,//菜单权限
      show: false,
      isSou: false,
      tableData: [],
       //电梯品牌
        value1: '',
        options: [ {
          value: '0',
          label: '戈尔'
        }, {
          value: '1',
          label: '格尔马'
        }, {
          value: '-1',
          label: 'taiger'
        }],
        //型号
        value2: '',
        options2: [ {
          value: '0',
          label: 'l'
        }, {
          value: '1',
          label: 's'
        }, {
          value: '-1',
          label: 'sss'
        }],
      navDetailData: [
        { id: 1, name: "社区物联" },
        { id: 0, name: "监控管理" },
        { id: 2, name: "监控档案" }
      ],
      input: '',
      q_input: '',
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      delData:null,
      pageSize: 10,
      value3: '',
      options3: '',
    };
  },
  methods: {
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
    add() {
        this.show = true;
    },
    addChange() {
      this.show = false;
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    query() {
      this.q_input = this.input;
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      else {
        this.getTableList(1);
      }
    },
    changeStatus() {
      this.query();
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/community/${this.delData.id}/delete`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:res.data,type:'success'});
            this.query();
          }
        })
      }
    },
    build() {
      let url = `community/building/page?communityId=${this.$store.getters.communityId}`;
      this.$xttp.get(url).then(res => {
        if(res.errorCode === 0) {
          this.loading = false;
          this.options3 = res.data.records;
        }
      }).catch( () => {
        this.loading = false;
      })
    },
    getTableList(pages) {
      let url = `communityIoT/camera/page?page=${pages}&size=${this.pageSize}`;
      let params = {};
      let communityId = this.$store.getters.communityId;
      params.communityId = communityId;
      //监控设备名称
      if(name){
          //输入的搜索字添加params中
        params['name'] = this.input;
      }else {
        delete params.name;
      }
      this.loading = true;
      this.$xttp.post(url, params)
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
     this.query();
     this.build();
  },

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

  .fade-enter-active, .fade-leave-active {
        transition: all 0.5s ease;
    }

    .fade-enter, .fade-leave-active {
      opacity: 0;
      transform: rotateY(180deg);
    }
</style>
