<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
             <el-form-item>
               <el-select v-model="formInline.keyType" placeholder="全部卡类型" clearable  @change="changeStatus">
                 <el-option v-for="item in cardList" :key="item.id" :value="item.id" :label="item.name"></el-option>
               </el-select>
             </el-form-item>
            <el-form-item label="">
              <el-input v-model="input" placeholder="卡号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="onSubmit">新增卡片</el-button>
        </div>
      </div>
      
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="序号" width="50" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="卡号" :show-overflow-tooltip="true" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.keyNo }}</template>
        </el-table-column>

        <el-table-column label="卡片类型" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.keyType | card }}</template>
        </el-table-column>

        <el-table-column label="用户" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{scope.row.name }}</template>
        </el-table-column>

        <!-- <el-table-column label="身份" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.phone }}</template>
        </el-table-column> -->

        <el-table-column label="手机号码" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.phone }}</template>
        </el-table-column>

        <el-table-column label="住房信息" :show-overflow-tooltip="true" align="center"  width="200">
          <template slot-scope="scope">{{scope.row.roomName }}</template>
        </el-table-column>

        <el-table-column label="有效期" :show-overflow-tooltip="true" align="center"  width="170">
          <template slot-scope="scope">{{scope.row.startDate | time }} ~ {{scope.row.endDate | time }}</template>
        </el-table-column>

        <!-- <el-table-column label="截止时间" :show-overflow-tooltip="true" align="center"  width="170">
          <template slot-scope="scope">{{scope.row.endDate | time }}</template>
        </el-table-column> -->

        <!-- <el-table-column label="状态" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ getdataStatus(scope.row.dataStatus) }}</template>
        </el-table-column> -->
      
        <!-- <el-table-column label="操作" width="80" fixed="right" align="left">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
          </template>
        </el-table-column> -->
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
      <!-- 新增卡片 -->
      <transition name="fade1">
        <AddPage v-if="show" :msg="show" @change=addChange @addSuccess="handleCurrentChange"></AddPage>
      </transition>

      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>
    </el-main>
</template>

<script>
import axios from "axios";
import AddPage from "./add";
import SeePage from "./see";

export default {
  name: "onePass",
  data() {
    return {
      tableData: [],
      navDetailData: [
        { id: 0, name: "社区物联" },
        { id: 1, name: "一卡通管理" },
        { id: 2, name: "一卡通档案" }
      ],
      cardList:[ {name:'手机蓝牙',id:1},{name:'蓝牙卡',id:2},{name:'IC卡',id:4},{name:'二维码',id:8} ],
      formInline: {
        keyType: ""
      },
      pageSize: 10,
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      notice:null,//编辑传送的值
      see:false,//控制查看组件弹出
      seeData:null,//查看数据
      visible2:false,
      delData:null,
      input: '',
      show:false,
    };
  },
  components: {
    AddPage,
    SeePage
  },
  methods: {
    onSubmit() {
      this.show= true;
    },
    handleCurrentChange(val) {
      console.log(val)
      this.sendAjax(val, this.formInline.keyType, this.input);
    },
    getdataStatus(status) {
      let names = {
        '1': '有效',
        '0': '失效'
      };
      return names[status];
    },
    // handleClick(row) {
    //   //查看
    //   this.see = true;
    //   this.seeData = row;
    // },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/community/building/${this.delData.id}/delete`)
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
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        this.isShow = false;
      }
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    find(){
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      } else {
        this.sendAjax(null, this.formInline.keyType, this.input);
      }
      // this.sendAjax(1, this.formInline.keyType);
    },
    changeStatus() {
      this.find();
    },
    addChange() {
      this.show = false;
    },
    sendAjax(page, keyType, keyNo) {
      let nPage = page || this.$route.query.page || 1;
      let obj = {page:nPage,communityId:this.$store.getters.communityId}
      if(keyType){
        obj.keyType = this.formInline.keyType;
      }else {
        delete obj.keyType ;
      }
      obj['keyNo'] = this.input;
      console.log('obj',obj);
      this.loading = true;
      this.$xttp.post(`/user/card/get/list`,obj)
      .then(res => {
        if (!res.errorCode) {
          console.log('res',res);
          this.tableData = res.data.records;
          // this.currentPage = res.data.currentPage;
          this.total = res.data.total;
          this.tableData.forEach(item => {
            if (item.startDate) {
              item.time1 = new Date(item.startDate)//开始时间
                .toISOString()
                .split(".")[0]
                .replace("T", " ");
            }
            if (item.endDate) {
              item.time2 = new Date(item.endDate)//过期时间
                .toISOString()
                .split(".")[0]
                .replace("T", " ");
            }
          });
          // this.$router.push({path:this.$route.path,query:{page: nPage }})
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    }
  },
  created() {
    this.find();
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
