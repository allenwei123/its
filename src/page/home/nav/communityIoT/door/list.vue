<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
      </ul>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-select v-model="value1" placeholder="品牌" clearable  @change="changeStatus">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="value2" placeholder="型号" clearable  @change="changeStatus">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="value2" placeholder="全部楼栋" clearable  @change="changeStatus">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-form-item label="">
              <el-input placeholder="门禁" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="add">新增门禁</el-button>
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
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="型号" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{communityName}}</template>
            </el-table-column>
            <el-table-column label="设备编号" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{communityName}}</template>
            </el-table-column>
            <el-table-column label="运行状态" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{communityName}}</template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right" align="left">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="view(scope.row)">使用记录</el-button>
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
        <AddPage v-if="show" :msg="show" @change=addChange></AddPage>
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
        show: false,
        loading: false,
        communityName: this.$store.getters.communityName,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
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
          { id: 0, name: "社区物联" },
          { id: 1, name: "门禁管理" },
          { id: 2, name: "门禁档案" }
        ],
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
      changeStatus() {
        this.query();
      },
      add() {
        this.show = true;
      },
      addChange() {
        this.show = false;
      },
      getTableList() {
        this.loading = true;
        let url = `communityIoT/record/door/list?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if (this.q_input) {
          params['deviceName'] = this.q_input;
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
      view(item) {
        this.$router.push({
          path: '/home/nav/communityIoT/doorRecord',
          query: {
            deviceId: item.id
          }
        });
      }
    },
    created() {
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

  .fade-enter-active, .fade-leave-active {
        transition: all 0.5s ease;
    }

    .fade-enter, .fade-leave-active {
      opacity: 0;
      transform: rotateY(180deg);
    }
</style>
