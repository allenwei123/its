<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">

            <el-form-item>
              <el-input v-model.trim="formInline.name" placeholder="手机号码"></el-input>
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

        <el-table-column label="序号" width="50" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>

        <el-table-column label="昵称"  :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.nickName }}</template>
        </el-table-column>

        <el-table-column label="手机号"  :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>

        <el-table-column label="性别  "  :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.sex | sex }}</template>
        </el-table-column>

        <el-table-column label="出生日期"  :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.birthday }}</template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="handle(scope.row)" type="success" size="small">住房信息</el-button>
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
      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>
    </el-main>
</template>

<script>
import SeePage from "./see";

export default {
  name: "useFile",
  data() {
    return {
      isSou: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "住户档案" }
      ],
      formInline: {
        name: ""
      },
      pageSize:10,
      currentPage: 1,
      loading: false,
      total: 0, //列表总数
      see:false,
      seeData: null, //查看数据
    };
  },
  components: {
    SeePage
  },
  methods: {
    handleCurrentChange(val) {
      this.sendAjax(val, this.formInline.name);
    },
    handle(row) {
      this.see = true;
      this.seeData = row;
    },
    confirmDel() {
      if (this.delData.id) {
        this.$xttp
          .get(`/community/building/${this.delData.id}/delete`)
          .then(res => {
            if (!res.errorCode) {
              this.delData = null;
              this.$message({ message: res.data, type: "success" });
              this.find();
            }
          });
      }
    },
    seeChange(msg) {
      //与查看弹窗交互
      this.see = false;
    },
    find() {
      this.sendAjax(1, this.formInline.name);
    },
    sendAjax(page, name) {
      let nPage = page || this.$route.query.page || 1;
      let obj = { page: nPage ,communityId:this.$store.getters.communityId};
      if (name) {
        obj.name = this.formInline.name;
      } else {
        delete obj.name;
      }
      this.loading = true;
      this.$xttp
        .get(`/user/${obj.communityId}/getByCommunityId`, { params: obj })
        .then(res => {
          if (!res.errorCode) {
            this.tableData = res.data.records;
            this.currentPage = res.data.currentPage;
            this.total = res.data.total;
            this.$router.push({
              path: this.$route.path,
              query: { page: nPage }
            });
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.sendAjax();
  },
  mounted() {}
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
// 切换动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: rotateY(180deg);
}
.fade1-enter-active,
.fade1-leave-active {
  transition: all 0.5s ease;
}

.fade1-enter,
.fade1-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}
</style>
