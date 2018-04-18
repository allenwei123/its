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
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-select v-model="value1" placeholder="品牌" clearable  @change="changeStatus">
              <el-option v-for="item in options" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
            </el-select>
            <!-- <el-select v-model="value2" placeholder="型号" clearable  @change="changeStatus">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select> -->
            <el-select v-model="value3" placeholder="全部楼栋" clearable  @change="changeStatus">
              <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-form-item>
              <el-input placeholder="梯号" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query" v-if="pms['11L1']">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe border>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="梯号" min-width="100" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="社区名称" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.communityName}}</template>
            </el-table-column>
            <el-table-column label="所属楼栋" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.buildingName}}</template>
            </el-table-column>
            <el-table-column label="品牌" min-width="220" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.brandName}}</template>
            </el-table-column>
            <!-- <el-table-column label="电梯类型" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.elevatorTypeName}}</template>
            </el-table-column> -->
            <el-table-column label="状态" min-width="120" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{getStatusName(scope.row.elevatorStatus)}}</template>
            </el-table-column>
            <el-table-column label="操作" width="120" :fixed="tableData.length ? 'right' : '/'" align="left">
              <template slot-scope="scope">
                <!-- <el-button type="primary" size="mini" @click="viewFault(scope.row)">维修记录</el-button> -->
                <el-button type="primary" size="mini" @click="viewRecord(scope.row)" v-if="pms['11L2']">使用记录</el-button>
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
    </el-main>
  </el-container>
</template>
<script>
  export default {
    name: 'message',
    data() {
      return {
        pms: this.$store.getters.pms,//菜单权限
        //电梯品牌
        value1: '',
        options: [],
        //型号
        value2: '',
        options2: [],
        navDetailData: [
          { id: 0, name: "社区物联" },
          { id: 1, name: "电梯管理" },
          { id: 2, name: "电梯档案" }
        ],
        value3:'',//楼栋
        value4:'',//梯号
        loading: false,
        tableData: [],
        communityId:this.$store.getters.communityId,
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null
      }
    },
    methods: {
      query() {
        this.q_input = this.input;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
        }
      },
      getBrandList(){//获取品牌列表
        this.$xttp.get('/communityIoT/elevator/brand-list')
          .then(res => {
            if (res.errorCode === 0) {
              this.options = res.data.records;
            }
          })
      },
      getFloorList() {
        this.$xttp.get('community/building/list',{params:{communityId:this.communityId}})
          .then(res => {
            if(!res.errorCode) {
              this.options2 = res.data;
            }
          })
      },
      changeStatus() {
        this.query();
      },
      getTableList() {
        this.loading = true;
        let url = `/communityIoT/elevator/list?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        // 临时 id
        params['communityId'] = this.$store.getters.communityId;
        if(this.value1) {
          params['brandId'] = this.value1;//品牌查询
        }
        if(this.value2){
          params['elevatorId'] = this.value2;//电梯编号
        }
        if(this.value3) {
          params['buildingIds'] = [this.value3];//楼栋查询
        }
        if(this.input) {
          params['name'] = this.input;//梯号
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
      getStatusName(status) {
        let names = {
          '0': '正常',
          '1': '检修',
          '2': '终端断开',
          '3': '故障'
        };
        return names[status];
      },
      // 查看维修记录
      viewFault(item) {
        this.$router.push({
          path: 'repair',
          query: {
            id: item.id
          }
        })
      },
      // 查看使用记录
      viewRecord(item) {
        this.$router.push({
          path: 'elevatorRecord',
          query: {
            id: item.id
          }
        })
      }
    },
    created() {
      this.getBrandList();
      this.getFloorList();
      this.query();
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
</style>
