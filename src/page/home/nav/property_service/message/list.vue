<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
      </ul>
      <div class="c-rpass-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">

            <el-form-item>
              <el-select v-model="type" placeholder="全部类型" clearable @change="changeTypes">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item>
              <el-select v-model="status" placeholder="全部状态" clearable @change="changeStatus">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-date-picker
                v-model="times"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" clearable @change="changeTimes">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-input placeholder="住户姓名" v-model.trim="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>

            <el-form-item style="float: right">
              <el-button type="primary" class="c-addBtn" @click="manageClick">审核管理设置</el-button>
            </el-form-item>

          </el-form>

        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
            <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="详情" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="住户姓名" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="发布时间" min-width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="举报数量" min-width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="状态" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">???</template>
            </el-table-column>
            <el-table-column label="操作" width="200" :fixed="tableData.length ? 'right' : '/'">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="detail(scope.row)">详情</el-button>
                <el-button type="primary" size="mini">屏蔽</el-button>
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
      <transition name="fade">
        <editPage v-if="isManage" :msg="isManage" @upsee="manageEmit" ></editPage>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
  import editPage from './edit'

  export default {
    name: 'message',
    data () {
      return {
        navDetailData: [
          { id: 0, name: "物业服务" ,router:'/home/nav/rpass' },
          { id: 1, name: "社区动态" ,router:'/home/nav/propertyService/message' },
          { id: 2, name: "社区动态" }
        ],
        isManage:false,//审核管理设置
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',//住户
        times:' ',//开始结束时间
        typeOptions: [],//类型选择数据
        type:'',//类型
        statusOptions: [],//状态选择数据
        status:''//状态
      }
    },
    components: {
      editPage
    },
    created() {
      this.query();
    },
    methods: {
      query() {
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
        }
      },
      format(){
        return {
          a: ''
        }
      },
      getTableList() {
        this.loading = true;
        let url = `property/rpass/page?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;

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
      changeTimes(time) {
          console.log(time)
      },
      changeTypes(type) {
        console.log('type:'+ type);
      },
      changeStatus(status) {
        console.log('status:'+ status);
      },
      manageEmit(msg) {
        this.isManage = false;
      },
      manageClick() {
        this.isManage = true;
      },
      detail(row) {
        this.$router.push('/home/nav/propertyService/messageDetail')
      }
    }
  }
</script>

<style scoped lang="scss">
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
</style>
