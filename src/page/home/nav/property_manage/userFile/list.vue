<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
             
            <el-form-item label="社区名称">
              <el-select v-model="formInline.select" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.name" placeholder="楼栋搜索"></el-input>
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
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="identityCard"
          align="center"
          label="身份证"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sex"
          label="性别">
        </el-table-column>
        <el-table-column
          align="center"
          prop="code"
          label="楼房号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          width="120"
          label="手机号码">
        </el-table-column>
        <el-table-column
          align="center"
          prop="contract"
          label="合同编号"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time1"
          label="入住时间"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="filterRelationship"
          label="用户关系">
        </el-table-column>
        <el-table-column
          align="center"
          prop="filterStatus"
          label="审核状态">
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="printHandle(scope.row)" v-if="scope.row.auditStatus == 1" type="primary" size="small">打印</el-button>
            <el-button @click="handle(scope.row,1)" v-if="scope.row.auditStatus == 0" type="success" size="small">审核</el-button>
            <el-button @click="handle(scope.row,2)" v-if="scope.row.auditStatus == 0" type="warning" size="small">驳回</el-button>
            <el-button @click="handle(scope.row,3)" v-if="scope.row.auditStatus == 1" type="danger" size="small">注销</el-button>
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
      <printPage v-if="boolDialog" :data.sync="printData" @upup="change" :msg="boolDialog"></printPage>
    </el-main>
</template>

<script>
import axios from "axios";
import printPage from "./print";
import { mapGetters } from "vuex";
import { communityId } from "@/biz/community";

export default {
  name: "floorFileList",
  data() {
    return {
      isSou: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "人员档案" }
      ],
      formInline: {
        name: "",
        select: ""
      },
      currentPage: 1,
      loading: false,
      total: 0, //列表总数
      seeData: null, //查看数据
      options: [], //下拉框数据
      visible2: false,
      boolDialog: false, //控制打印窗口
      printData: null
    };
  },
  computed: mapGetters(["showAside"]),
  components: {
    printPage
  },
  methods: {
    handleCurrentChange(val) {
      this.sendAjax(val, this.formInline.select, this.formInline.name);
    },
    printHandle(row) {
      //打印
      if (row.auditStatus == 1) {
        this.$xttp.get(`/user/${row.id}/contract-info`).then(res => {
          if (!res.errorCode) {
            this.boolDialog = true;
            this.printData = res.data;
          }
        });
      }
    },
    handle(row, num) {
      let status,msg;
      if (num == 1 || num == 2) {
        //1 审核  2 驳回
        status = num == 1 ? 1 : -1;
        msg = num == 1 ? '审核' : '驳回';
        this.$xttp
        .post(`/user/property/audit`, { id: row.id, auditStatus: status })
        .then(res => {
          if (!res.errorCode) {
            this.$message({
              message: `温馨提示，该次${msg}成功！`,
              type: "success"
            });
          }
        });
      }else if (num == 3) {
        //注销 
        this.$xttp
        .get(`/user/property/${row.id}/relieve`)
        .then(res => {
          if (!res.errorCode) {
            this.$message({
              message: `温馨提示，该次注销成功！`,
              type: "success"
            });
          }
        });
      }
    },
    change(msg) {
      //与打印交互
      this.boolDialog = false;
    },
    confirmDel() {
      if (this.delData.id) {
        this.$xttp
          .get(`/community/building/${this.delData.id}/delete`)
          .then(res => {
            if (!res.errorCode) {
              this.visible2 = false;
              this.delData = null;
              this.$message({ message: res.data, type: "success" });
              this.find();
            }
          });
      }
    },
    change(msg) {
      //与添加弹窗交互
      this.boolDialog = msg;
    },
    seeChange(msg) {
      //与查看弹窗交互
      this.see = false;
    },
    find() {
      this.sendAjax(null, this.formInline.select, this.formInline.name);
    },
    sendAjax(page, communityId, name) {
      let nPage = page || this.$route.query.page || 1;
      let obj = { page: nPage ,relationship:1 };
      if (communityId) {
        obj.communityId = this.formInline.select;
      } else {
        delete obj.communityId;
      }
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
            this.tableData.forEach(item => {
              if (item.checkInTime) {
                item.time1 = new Date(item.checkInTime)
                  .toISOString()
                  .split(".")[0]
                  .replace("T", " ");
              }
              switch (item.auditStatus) {
                case 0:
                  item.filterStatus = "未审核";
                  break;
                case 1:
                  item.filterStatus = "审核通过";
                  break;
                case -1:
                  item.filterStatus = "驳回";
                  break;
                case -2:
                  item.filterStatus = "违规";
                  break;
              }
              switch (item.relationship) {
                case 1:
                  item.filterRelationship = "业主";
                  break;
                case 2:
                  item.filterRelationship = "家属";
                  break;
                case 3:
                  item.filterRelationship = "租客";
                  break;
              }
            });
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
    // this.sendAjax();
    communityId().then(res => {
      if (res.length) {
        this.options = res;
        this.formInline.select = this.options[0].id;
        this.sendAjax(1, this.options[0].id);
      }
    });
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
