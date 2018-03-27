<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="岗位">
              <el-select v-model="postCode" placeholder="岗位" @change="changPostCode">
                <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="name" placeholder="姓名/工号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="onSubmit">新增员工</el-button>
        </div>
      </div>
      
      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%" :default-sort = "{prop: 'createAt', order: 'descending'}">
        <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
        <!-- <el-table-column label="序号" width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column> -->
        <el-table-column v-if="show" label="id" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column v-if="show" label="社区ID" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.communityId}}</template>
        </el-table-column>
        <el-table-column label="社区名称" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.communityName}}</template>
        </el-table-column>
        <el-table-column v-if="show" label="物业公司ID" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.propertyId}}</template>
        </el-table-column>
        <el-table-column label="物业公司名称" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.propertyName}}</template>
        </el-table-column>
        <!-- <el-table-column label="岗位" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{getPost(scope.row.postCode)}}</template>
        </el-table-column> -->
        <el-table-column label="岗位" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.postCode | postCode }}</template>
        </el-table-column>
        <el-table-column v-if="show" label="员工ID" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.userId}}</template>
        </el-table-column>
        <el-table-column label="员工姓名" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="手机号" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150" align="center" :show-overflow-tooltip="true" sortable>
          <template slot-scope="scope">{{scope.row.createAt | time('yyyy-MM-dd HH:mm')}}</template>
        </el-table-column>
        <el-table-column v-if="show" label="创建人" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.creatorId}}</template>
        </el-table-column>
        <el-table-column label="状态" min-width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{getStatus(scope.row.dataStatus)}}</template>
        </el-table-column>
        <el-table-column align="left" fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
            <el-button v-if="scope.row.dataStatus ==0 && scope.row.postCode != 'MANAGER'" @click="handleDiabled(scope.row,'1')" type="warning" size="small">启用</el-button>
            <el-button v-if="scope.row.dataStatus ==1 && scope.row.postCode != 'MANAGER'" @click="handleWriteoff(scope.row)" type="danger" size="small">注销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div> -->
      <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @reload="getTableList" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>

      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您是否确定注销员工吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
          </div>
      </el-dialog>
    </el-main>
</template>

<script>
import AddPage from "./empl_add";
import SeePage from "./empl_see";
import { mapGetters } from "vuex";

export default {
  name: "empl",
  data() {
    return {
      show: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "员工管理" },
        { id: 2, name: "员工管理" }
      ],
      postCode: 'SECURITY',
      postOptions: [],
      name: '',
      q_input: null,
      loading: false,
      isShow: false, //控制添加页面弹出
      notice:null,//编辑传送的值
      see:false,//控制查看组件弹出
      seeData:null,//查看数据
      visible2:false,//控制注销框
      delData:null
    };
  },
  computed: mapGetters(["showAside"]),
  components: {
    AddPage,
    SeePage
  },
  methods: {
    onSubmit() {//添加按钮
      this.notice = null;
      this.isShow = !this.isShow;
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
        // this.sendAjax();
        this.isShow = false;
      }
    },
    seeChange(msg) {//与查看弹窗交互
      this.see = false;
    },
    getPost(code) {
      let codes = {
        'MANAGER': '物业管理员',
        'SECURITY': '保安',
        'CLEANER': '保洁',
        'SERVICEMAN': '维修工',
        'SUPPORTSTAFF': '客服人员'
      };
      return codes[code];
    },
    getStatus(status) {
      let names = {
        '0': '无效',
        '1': '有效'
      };
      return names[status];
    },
    delHandle(row) {
      this.visible2 = true;
      this.delData = row; 
    },
    handleDiabled(row, usestate){
      this.$message({
        message: '启用成功',
        type: 'success'
      })
      row.usestate = usestate
    },
    handleWriteoff(row){
      this.visible2 = true;
      this.delData = row; 
    },
    confirmDel(){
      console.log(this.delData);
      if(this.delData.id){
        this.$xttp.get(`/user/property/${this.delData.id}/delete`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:'注销员工成功',type:'success'});
            this.find();
          } else {
            this.visible2 = false;
            this.delData = null;
            this.$message({message:'注销员工失败',type: 'warning'});
          }
        }).catch(()=> {
          console.log(err)
        })
      }
    },
    initPost(){
      let communityId = this.$store.getters.communityId;
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    },
    changPostCode(){
      this.getTableList(this.postCode);
    },
    find(){
      this.getTableList(this.postCode);
    },
    getTableList(postCode) {
      let obj = {};
      obj['postCode'] = this.postCode;
      // if(this.name){
      //   obj['name'] = this.name;
      // } else {
      //   delete obj.name;
      // }
      this.loading = true;
      
      let communityId = this.$store.getters.communityId;
      let url = `user/property/${communityId}/user-list`;
      this.$xttp.get(url, {params:obj}).then(res => {
        this.loading = false;
        if (res.errorCode === 0) {
          this.tableData = res.data;
        }
      }).catch(() => {
        this.loading = false;
      })
    },
  },
  created() {
    this.initPost();
    this.getTableList();
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
