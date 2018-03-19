<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="社区名称">
              <el-input v-model="formInline.name" placeholder="关键字搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="onSubmit">新增社区</el-button>
        </div>
      </div>
      
      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="社区名称"></el-table-column>
        <el-table-column prop="as" align="center" label="地区"></el-table-column>
        <el-table-column align="center" prop="address" label="地址" width="200"></el-table-column>
        <el-table-column align="center" prop="time1" label="创建时间"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
            <el-button @click="editHandle(scope.row)" type="warning" size="small">编辑</el-button>
            <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
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
import AddPage from "./add";
import SeePage from "./see";
var a = 3423;
export default {
  name: "other",
  data() {
    return {
      isSou: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "社区档案" }
      ],
      formInline: {
        name: ""
      },
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      pageSize:10,
      notice:null,//编辑传送的值
      see:false,//控制查看组件弹出
      seeData:null,//查看数据
      visible2:false,//控制删除框
      delData:null,
    };
  },
  computed: {
  },
  components: {
    AddPage,
    SeePage
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
    handleClick(row) {
      //查看
      this.see = true;
      this.seeData = row;
    },
    editHandle(row) {
      //编辑
      this.isShow = true;
      this.notice = row;
    },
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        this.sendAjax();
        this.isShow = false;
      }
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    find(){
      this.sendAjax(1);
    },
    delHandle(row) {
      this.visible2 = true;
      this.delData = row; 
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/community/${this.delData.id}/delete`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:res.data,type:'success'});
            this.find();
          }
        })
      }
    },
    sendAjax(page) {
      let nPage = page || this.$route.query.page || 1;
      let obj = {page:nPage}
      if(this.formInline.name){
        obj.name = this.formInline.name;
      }else {
        delete obj.name ;
      }
      this.loading = true;
      this.$xttp.get("/community/page",{params:obj})
      .then(res => {
        if (!res.errorCode) {
          this.tableData = res.data.records;
          this.currentPage = res.data.currentPage;
          this.total = res.data.total;
          this.tableData.forEach(item => {
            let isdistrict = item.district || '';
            item.as = item.province + item.city + isdistrict;
            if (item.createAt) {
              item.time1 = new Date(item.createAt)
                .toISOString()
                .split(".")[0]
                .replace("T", " ");
            }
          });
          this.$router.push({path:this.$route.path,query:{page: nPage }})
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
  mounted() {
    
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
