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
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-cascader :options="cityData" v-model="formInline.address" class="c-cities" @change="changeAddress" clearable>
            </el-cascader>
          </el-form-item>
          <!--<el-form-item>-->
          <!--<el-select v-model="formInline.community" placeholder="所属社区">-->
          <!--<el-option-->
          <!--v-for="item in communityList"-->
          <!--:key="item.id"-->
          <!--:value="item.id"-->
          <!--:label="item.name">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-input placeholder="商家名称" v-model="formInline.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="find" v-if="pms['11S1']"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="success" class="c-addBtn" @click="onSubmit" v-if="pms['11S2']">新增商户</el-button>
      </div>
    </div>

    <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border
              highlight-current-row ref="multipleTable" style="width: 100%">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">{{( currentPage - 1) * pageSize + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="商家名称" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="商家类型" min-width="60" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.typeName }}</template>
      </el-table-column>
      <el-table-column label="地区" min-width="60" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.province + scope.row.city + scope.row.district}}</template>
      </el-table-column>
      <el-table-column label="详细地址" min-width="60" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <!--<el-table-column label="关联社区" min-width="70" align="center" :show-overflow-tooltip="true">-->
      <!--<template slot-scope="scope">{{ scope.row.}}</template>-->
      <!--</el-table-column>-->
      <el-table-column label="优惠券" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.couponNum }}</template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="350">
        <template slot-scope="scope">
          <el-button @click="routeClick(scope.row,1)" type="primary" size="small" v-if="pms['11S3']">推荐商品</el-button>
          <el-button @click="routeClick(scope.row,2)" type="success" size="small" v-if="pms['11S4']">优惠券管理</el-button>
          <el-button @click="editHandle(scope.row)" type="warning" size="small" v-if="pms['11S5']">编辑</el-button>
          <el-button @click="delHandle(scope.row)" type="danger" size="small" v-if="pms['11S6']">删除</el-button>
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
    <transition name="fade1">
      <formPage v-if="isShow" @upList="change" :msg="isShow" :edata="notice"></formPage>
    </transition>
    <el-dialog title="温馨提示" :visible.sync="visible2">
      <p>请问您是否确定删除这条数据吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
  import cityData from "@/utils/citys"
  import formPage from './form'
  import tagList from '@/mock/tag'

  export default {
    name: "merchantList",
    data() {
      return {
        pms: this.$store.getters.pms,//菜单权限
        isSou: false,
        tableData: [],
        navDetailData: [
          // {id: 0, name: "首页", router: '/home'},
          {id: 1, name: "商圈管理", router: '/home/nav/businessManage/merchant'},
          {id: 2, name: "周边商圈", router: '/home/nav/businessManage/merchant'},
          {id: 3, name: "商户管理", router: '/home/nav/businessManage/merchant'}
        ],
        formInline: {
          name: "",
          address: [],//地址
        },
        currentPage: 1,
        pageSize: 10,
        loading: false,
        isShow: false, //控制添加页面弹出
        total: 0,//列表总数
        notice: null,//编辑传送的值
        visible2: false,//删除页面是否弹出
        delData: null,
        cityData: cityData,//城市列表
        communityList: this.$store.getters.communityList//社区列表
      };
    },
    components: {
      formPage
    },
    created() {
      this.sendAjax();
    },
    methods: {
      onSubmit() {//添加按钮
        this.notice = null;
        this.isShow = !this.isShow;
      },
      handleCurrentChange(val) {
        if (this.currentPage !== val) {
          this.sendAjax(val);
        };
      },
      routeClick(row, num) {//跳转页面
        //row 1:推荐商品 2：优惠卷管理
        if (num == 1) {
          this.$router.push({
            path: 'recommend',
            query: {
              id: row.id
            }
          });
        } else if (num == 2) {
          this.$router.push({
            path: 'coupon',
            query: {
              id: row.id
            }
          });
        }
      },
      editHandle(row) {
        //编辑
        this.isShow = true;
        this.notice = row;
      },
      delHandle(row) {
        this.visible2 = true;
        this.delData = row;
      },
      confirmDel(){
        if (this.delData.id) {
          this.$xttp.get(`/biz/shop/${this.delData.id}/delete`)
            .then(res => {
              if (!res.errorCode) {
                this.visible2 = false;
                this.delData = null;
                this.$message({message: '删除成功', type: 'success'});
                this.find();
              }
            })
        }
      },
      change(msg) {//与添加弹窗交互
        if (msg == 1) {
          this.isShow = false;
        } else if (msg == 2 || msg == 3) {
          this.sendAjax();
          this.isShow = false;
        }
      },
      find(){//查询
        this.sendAjax(1);
      },
      changeAddress(){
        this.find();
      },
      sendAjax(page) {
        let nPage = page || this.$route.query.page || 1;
        let obj = {page: nPage};
        obj['province'] = this.formInline.address[0];
        obj['city'] = this.formInline.address[1];
        obj['district'] = this.formInline.address[2];
        if (this.formInline.name) {
          obj.name = this.formInline.name;
        } else {
          delete obj.name;
        }
        this.loading = true;
        this.$xttp.post(`/biz/shop/page?`, obj)
          .then(res => {
            if (!res.errorCode) {
              this.tableData = res.data.records;
              this.tableData.forEach(item => {
                if(item.district == null){
                  item.district = '';
                }
              });
              this.currentPage = res.data.currentPage;
              this.total = res.data.total;
              this.$router.push({path: this.$route.path, query: {page: nPage}})
            }
            this.loading = false;
          }).catch(err => {
          this.loading = false;
        })
      }
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
      cursor: pointer;
    }
  }

  .c-block {
    margin-top: 15px;
  }

  .el-breadcrumb{
    margin-bottom: 20px;
    font-size: 16px;
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
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s ease;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
    transform: rotateY(180deg);
  }

  .fade1-enter-active, .fade1-leave-active {
    transition: all 0.5s ease;
  }

  .fade1-enter, .fade1-leave-active {
    opacity: 0;
    transform: translateX(-500px);
  }
</style>
