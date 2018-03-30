<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
      </div>
      
      <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column v-if="show" align="center" prop="id" label=""></el-table-column>
        <el-table-column label="车库名称" width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.carportName}}</template>
        </el-table-column>
        <el-table-column label="车位数量" width="80" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope"><a href="">{{ scope.row.carNum}}</a></template>
        </el-table-column>
        <el-table-column label="具体地址" width="300" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="关联楼栋" width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope"><a href="">{{ scope.row.linkBuild}}</a></template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-block">
        <el-pagination
          :current-page="1"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="2">
        </el-pagination>
      </div>
      <transition name="fade">
        <AddPage v-if="isShow" :msg="isShow" @reload="getTableList" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <transition name="see">
        <SeePage v-if="isSee" :msg="isSee" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>

      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您是否确定注销车辆吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="温馨提示" :visible.sync="visible3">
          <p v-if="pass">请问您确定绑定车辆吗？</p>
          <p v-if="refuse">请问您确定拒绝绑定车辆吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmPR">确定</el-button>
          </div>
      </el-dialog>
    </el-main>
</template>

<script>
// import AddPage from "./add";
import SeePage from "./see";
import { mapGetters } from "vuex";
import time from '@/utils/time.js';

export default {
  name: "schedul",
  data() {
    return {
      show: false,
      postOptions: [],
      isSou: false,
      tableData: [{
        "id": "a03432bc03d45cc232",
        "carportName": "和谐景苑地下车库",
        "address": "广东省广州市海珠区和谐景苑小区332号",
        "carNum": "132",
        "linkBuild": "和谐景苑小区A区1栋"
      },{
        "id": "a03432bc03d45cc231",
        "carportName": "和谐景苑地下车库B",
        "address": "广东省广州市天河区中山大道北223号",
        "carNum": "532",
        "linkBuild": "荷花苑A区1栋"
      }],
      msg: '',
      // communityId:'',
      navDetailData: [
        { id: 0, name: "物业管理" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "车库档案" }
      ],
      formInline: {
        carNo: ''
      },
      pageSize:10,
      total: 0,
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      isSee: false,
      seeData: null,
      notice:null,//编辑传送的值
      add:false,//控制查看组件弹出
      addData:null,//查看数据
      visible2:false,//控制删除框
      delData:null,
      visible3: false, //审核车辆控件
      carId: null,
      refuse: false,
      pass: false
    };
  },
  computed: mapGetters(["showAside"]),
  components: {
    //   AddPage,
      SeePage
  },
  methods: {
    handleClick(row) {
      //查看
      this.isSee = true;
      this.seeData = row;
    },
    editHandle(row) {
      //编辑
      this.isShow = true;
      this.notice = row;
    },
    handleUnbundl(row) {
      this.visible2 = true;
      this.delData = row;
    },
    delHandle(row) {
      this.visible2 = true;
      this.delData = row; 
    },
    seeChange(msg){
      this.isSee = false;
    },
    change(msg) {//与添加弹窗交互
      if(msg == 1) {
        this.isShow = false;
      }else if(msg == 2 || msg == 3) {
        // this.sendAjax();
        this.isShow = false;
      }
    },
    
    handleDone(row,status){
      var id = row.id;
      var status = status;
      if (status == 1) {
        this.visible3 = true;
        this.pass = true;
        this.refuse = false;
        this.carId = id;
        this.status = 1;
      }
      if (status == -1) {
        this.visible3 = true;
        this.refuse = true;
        this.pass = false;
        this.carId = id;
        this.status = -1;
      }
    },
    confirmPR() {
      if(this.carId) {
        this.$xttp.post('/vehicle/auditCar',{
          carId: this.carId,
          verifyCode: this.status
        }).then(res => {
          if(res.success) {
            this.visible3 = false;
            this.carId = null,
            this.status = ''
            this.$message({message: '操作成功',type: 'success'});
            this.getTableList();
          }
        })
      }
    },
    confirmDel(){
      if(this.delData.id){
        this.$xttp.get(`/vehicle/deleteCarNo/${this.delData.id}`)
        .then(res=> {
          if(!res.errorCode){
            this.visible2 = false;
            this.delData = null;
            this.$message({message:'注销成功',type:'success'});
            // this.find();
            this.getTableList();
          }
        })
      }
    }
  },
  created() {
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
.see-enter-active, .see-leave-active {
  transition: all 0.5s ease;
}
       
.see-enter, .see-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}
</style>

