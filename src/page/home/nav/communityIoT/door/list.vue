<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li> -->
      </ul>
      <div class="c-rpass-container">
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">
            <el-select v-model="value1" placeholder="品牌" clearable  @change="changeStatus">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="value2" placeholder="型号" clearable  @change="changeStatus">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="value3" placeholder="全部楼栋" clearable  @change="changeStatus">
              <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-form-item label="">
              <el-input placeholder="门禁" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query"  v-if="pms['11N1']">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="success" plain class="c-addBtn" @click="add" v-if="pms['11N3']">新增门禁</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe border>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="门禁" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
             <el-table-column label="楼栋名称" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.buildingName}}</template>
            </el-table-column>
            <el-table-column label="厂商" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.brand }}</template>
            </el-table-column>
            <el-table-column label="型号" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.deviceType }}</template>
            </el-table-column>
            <el-table-column label="设备编号" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.deviceCode }}</template>
            </el-table-column>
            <el-table-column label="运行状态" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ onlineStatus(scope.row.onlineStatus) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right" align="left">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="view(scope.row)" v-if="pms['11N2']">使用记录</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="c-pagination">
          <el-pagination
            layout="total, prev, pager, next, jumper" @current-change="getTableList"
            :total="total" :page-size="pageSize" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </div>

      <!-- 新增门禁 -->
      <transition name="fade">
        <AddPage v-if="show" :msg="show" @change=addChange @addSuccess="query"></AddPage>
      </transition>

    </el-main>
  </el-container>
</template>
<script>
import AddPage from "./add";
  export default {
    components: {
      AddPage
    },
    data() {
      return {
        pms: this.$store.getters.pms,//菜单权限
        show: false,
        loading: false,
        communityName: this.$store.getters.communityName,
        communityId:this.$store.getters.communityId,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        //电梯品牌
        value1: '',
        options: [{
          id:1,
          name:'米立'
        },{
          id:2,
          name:'康途'
        },{
          id:3,
          name:'金博'
        }],
        //型号
        value2: '',
        options2: [],
       navDetailData: [
          { id: 0, name: "社区物联" , router:'/home/nav/communityIoT/elevator'},
          { id: 1, name: "门禁管理" , router:'/home/nav/communityIoT/door'},
          { id: 2, name: "门禁档案" }
        ],
        options3: [],
        value3:'',
      }
    },
    methods: {
      query() {
        this.q_input = this.input;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList(1);
        }
      },
      getFloorList() {//获取社区对应的楼栋
        this.$xttp.get('community/building/list',{params:{communityId:this.communityId}})
          .then(res => {
            if(!res.errorCode) {
              this.options3 = res.data;
            }
          })
      },
      changeStatus() {
        this.query();
      },
      add() {
        this.show = true;
      },
      addChange() {
        this.show = false;
      },
      getTableList(pages) {
        this.loading = true;
        let url = `communityIoT/record/door/list?page=${pages}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.communityId;
        if(this.value1) {
          params['brandNo'] = this.value1;//品牌查询
        }
        if(this.value2){
          params['elevatorId'] = this.value2;//电梯编号
        }
        if(this.value3) {
          params['buildingId'] = this.value3;//楼栋查询
        }
        if (this.q_input) {
          params['name'] = this.q_input;
        }
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      onlineStatus(value){
        if(value) {
          return value== 1? '离线' : '在线'
        }
      },
      view(item) {
        this.$router.push({
          path: '/home/nav/communityIoT/doorRecord',
          query: {
            // deviceId: item.deviceId || '' // deviceId = item.id
            deviceId: item.id
          }
        });
      }
    },
    created() {
      this.query();
      this.getFloorList();
    }
  }
</script>
<style scoped lang="scss">
  .c-navDetail {
    margin-bottom: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
  }

  .c-body {
    width: 90%;
    &.c-maxWidth {
      max-width: calc(100vw - 200px);
    }
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
