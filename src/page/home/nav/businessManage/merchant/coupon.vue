<template>
  <el-main>
    <div>
      <ul class="c-navDetail clear">
        <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
          <!--<el-breadcrumb-item  v-for="(nav, index) in navDetailData" :to="nav.router"  :key="index">{{ nav.name }}</el-breadcrumb-item>-->
        <!--</el-breadcrumb>-->
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
      </ul>
      <div class="c-search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">

          <!--<el-form-item>-->
            <!--<el-select v-model="formInline.status" @change="selStatus" placeholder="全部状态">-->
              <!--<el-option-->
                <!--v-for="item in statusList"-->
                <!--:key="item.id"-->
                <!--:value="item.id"-->
                <!--:label="item.name">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->

          <el-form-item>
            <el-input v-model="formInline.name" placeholder="优惠券名称" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="c-addBtn" @click="onSubmit">新增优惠券</el-button>
      </div>
    </div>

    <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row style="width: 100%">

      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">{{( currentPage-1) * pageSize + scope.$index + 1}}</template>
      </el-table-column>

      <el-table-column label="优惠券" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="优惠金额" min-width="60" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.maxPrice }}</template>
      </el-table-column>

      <el-table-column label="总数" min-width="60" align="center" :show-overflow-tooltip="true">
      <template slot-scope="scope">{{ scope.row.amount }}</template>
    </el-table-column>

      <el-table-column label="生效时间" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.validityBeginAt | time('yyyy-MM-dd') }}</template>
      </el-table-column>

      <el-table-column label="失效时间" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.validityEndAt | time('yyyy-MM-dd') }}</template>
      </el-table-column>

      <el-table-column label="状态" min-width="60" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.useStatus | useStatus }}</template>
      </el-table-column>

      <el-table-column label="已领取数量" min-width="60" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.receiveNum }}</template>
      </el-table-column>

      <el-table-column label="已使用数量" min-width="60" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.useNum || '无' }}</template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button @click="editHandle(scope.row)" type="warning" size="small">编辑</el-button>
          <el-button @click="delHandle(scope.row)" type="danger" size="small" v-if="scope.row.useStatus == -1">删除</el-button>
          <el-button @click="validHandle(scope.row)" type="danger" size="small">{{ isIssue ? '发布' : '撤下' }}</el-button>
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
      <formPage v-if="isShow" @upList="change" :msg="isShow" :shopId="shopId" :edata="notice"></formPage>
    </transition>
    <el-dialog title="温馨提示" :visible.sync="visible2">
      <p>请问您是否确定删除这条数据吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="温馨提示" :visible.sync="visible3">
      <p>请问您是否确定{{ isIssue ? '发布' : '撤下' }}优惠券？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmValid">确定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
  import formPage from './couponForm'

  export default {
    name: "couponList",
    data() {
      return {
        isSou: false,
        tableData: [],
        navDetailData: [
          { id: 0, name: "首页",router:'/home' },
          { id: 1, name: "商圈管理" ,router:'/home/nav/businessManage/merchant' },
          { id: 2, name: "周边商圈",router:'/home/nav/businessManage/merchant' },
          { id: 3, name: "优惠券管理" },
        ],
        formInline: {
          name: ""
        },
        currentPage: 1,
        pageSize: 10,
        loading: false,
        isShow: false, //控制添加页面弹出
        total: 0,//列表总数
        notice:null,//编辑传送的值
        visible2:false,//撤下dialog
        visible3:false,
        ValidId:null,//撤下id
        isIssue:false,// false: 撤下 ； true ： 发布
        delData:null,
        statusList:[],//状态列表
        shopId:this.$route.query.id,//商家id
      };
    },
    components: {
      formPage
    },
    methods: {
      onSubmit() {//添加按钮
        this.notice = null;
        this.isShow = !this.isShow;
      },
      handleCurrentChange(val) {
        if(this.currentPage !== val){
          this.sendAjax(val);
        };
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
      validHandle(row){
        this.isIssue = row.useStatus == 0 ? true : false;
        this.visible3 = true;
        this.ValidId = row.id;
      },
      confirmDel(){
        if(this.delData.id){
          this.$xttp.get(`/biz/coupon/${this.delData.id}/delete`)
            .then(res=> {
              if(!res.errorCode){
                this.visible2 = false;
                this.delData = null;
                this.$message({message:'删除优惠券成功',type:'success'});
                this.find();
              }
            })
        }
      },
      confirmValid() {
          let msg = this.isIssue ? '发布' : '撤下';
          let status = this.isIssue ? 1 : 0;
        if(this.ValidId){
          this.$xttp.post(`/biz/coupon/valid`,{useStatus:status,id:this.ValidId})
            .then(res=> {
              if(!res.errorCode){
                this.visible3 = false;
                this.ValidId = null;
                this.isIssue = !this.isIssue;
                this.$message({message: msg + '优惠券成功',type:'success'});
                this.find();
              }
            })
        }
      },
      change(msg) {//与添加弹窗交互
        if(msg == 1) {
          this.isShow = false;
        }else if(msg == 2 || msg == 3) {
          this.sendAjax();
          this.isShow = false;
        }
      },
      selStatus() {//选择状态

      },
      find(){
        this.sendAjax(1);
      },
      sendAjax(page) {
        let nPage = page || this.$route.query.page || 1;
        let obj = {page:nPage,shopId:this.$route.query.id};
        if(this.formInline.name){
          obj.name = this.formInline.name;
        }else {
          delete obj.name ;
        }
        this.loading = true;
        this.$xttp.post("/biz/coupon/page",obj)
          .then(res => {
            if (!res.errorCode) {
              this.tableData = res.data.records;
              this.currentPage = res.data.currentPage;
              this.total = res.data.total;
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
          cursor: pointer;
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
