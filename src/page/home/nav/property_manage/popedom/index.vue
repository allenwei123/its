<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </ul>
        <div class="c-search">
          <el-button type="success" plain class="c-addBtn" @click="onSubmit" v-if="pms['1172']">新增辖区</el-button>
        </div>
      </div>

      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%" :default-sort = "{prop: 'createAt', order: 'descending'}">
        <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
        <!-- <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column> -->
        
        <el-table-column label="辖区名称" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

        <el-table-column label="开放状态" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ filterStatus(scope.row.open) }}</template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="340">
          <template slot-scope="scope">
            <el-button @click="seeClick(scope.row)" type="success" size="small" v-if="pms['1174']">查看详情</el-button>
            <el-button @click="delHandle(scope.row,true)" type="danger" size="small" v-if="!scope.row.open">开放辖区</el-button>
            <el-button @click="editHandle(scope.row)" type="warning" size="small"  v-if="!scope.row.open && pms['1173']">编辑</el-button>
            <el-button @click="delHandle(scope.row)" type="danger" size="small" v-if="!scope.row.open && pms['1175']">删除</el-button>
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

      <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @reload="getTableList" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>

      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您是否删除这条记录吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="温馨提示" :visible.sync="visible3">
          <p>请问您是否确认开放辖区？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmOpen">确定</el-button>
          </div>
      </el-dialog>
    </el-main>
</template>

<script>
import AddPage from "./add";
import SeePage from "./see";

export default {
  name: "empl",
  data() {
    return {
      show: false,
      tableData: [],
      pms: this.$store.getters.pms, //菜单权限
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "员工管理", router: "/home/nav/side/popedom" },
        { id: 2, name: "辖区管理" }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0, //列表总数
      q_input: null,
      loading: false,
      isShow: false, //控制添加页面弹出
      notice: null, //编辑传送的值
      see: false, //控制查看组件弹出
      seeData: null, //查看数据
      visible2: false, //控制删除框
      delData: null,
      visible3: false //是否开发
    };
  },
  components: {
    AddPage,
    SeePage
    // PowerPage
  },
  methods: {
    onSubmit() {
      //添加按钮
      this.notice = null;
      this.isShow = !this.isShow;
    },
    filterStatus(val) {
      let v;
      if (val) {
        v = "已开放";
      } else {
        v = "未开放";
      }
      return v;
    },
    seeClick(row) {
      //查看
      this.see = true;
      this.seeData = row;
    },
    editHandle(row) {
      //编辑
      this.isShow = true;
      this.notice = row;
    },
    change(msg) {
      //与添加弹窗交互
      if (msg == 1) {
        this.isShow = false;
      } else if (msg == 2 || msg == 3) {
        // this.sendAjax();
        this.isShow = false;
      }
    },
    seeChange(msg) {
      //与查看弹窗交互
      this.see = false;
    },
    delHandle(row, bool) {
      if (bool) {
        this.visible3 = true;
      } else {
        this.visible2 = true;
      }
      this.delData = row;
    },
    confirmDel() {
      if (this.delData.id) {
        this.$xttp
          .get(`district/${this.delData.id}/delete`)
          .then(res => {
            if (!res.errorCode) {
              this.visible2 = false;
              this.delData = null;
              this.$message({ message: "删除成功", type: "success" });
              this.getTableList();
            }
          })
          .catch(() => {
            console.log(err);
          });
      }
    },
    confirmOpen() {
      if (this.delData.id) {
        this.$xttp
          .get(`district/${this.delData.id}/open`)
          .then(res => {
            if (!res.errorCode) {
              this.visible3 = false;
              this.delData = null;
              this.$message({ message: "成功开放辖区", type: "success" });
              this.tableData.find(item => item.id == this.delData.id ).open = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getTableList() {
      this.loading = true;
      let communityId = this.$store.getters.communityId;
      let url = `district/page?page=${this.currentPage}&size=${this.pageSize}`;
      this.$xttp
        .post(url, { communityId })
        .then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.currentPage = res.data.currentPage;
            this.total = res.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getTableList();
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
  height: 47px;
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
