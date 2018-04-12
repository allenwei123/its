<template>
  <el-main>
    <div>
      <ul class="c-navDetail clear">
        <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
      </ul>
      <div class="c-search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="商户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="c-addBtn" @click="onSubmit">新增服务</el-button>
      </div>
    </div>

    <el-table class="c-table" :data="tableData" v-loading="loading" element-loading-text="加载中..." border highlight-current-row ref="multipleTable" style="width: 100%">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">{{( currentPage-1) * pageSize + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column v-if="isSee" label="ID" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope"><el-button type="text">{{ scope.row.id }}</el-button></template>
      </el-table-column>
      <el-table-column v-if="isSee" label="社区ID" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope"><el-button type="text">{{ scope.row.communityId }}</el-button></template>
      </el-table-column>
      <!-- <el-table-column label="便民服务" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope"><el-button type="text">{{ scope.row.icon }}</el-button></template>
      </el-table-column> -->
      <el-table-column label="便民服务" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope"><el-button type="text"><img width="60px" height="60px" :src="scope.row.url"></el-button></template>
      </el-table-column>
      <el-table-column label="服务名称" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="服务类型" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.serviceType | serviceType }}</template>
      </el-table-column>
      <el-table-column label="所属社区" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.communityName }}</template>
      </el-table-column>
      <el-table-column label="服务方式" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.serviceWay | serviceWay }}</template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.createAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
      </el-table-column>
      <!-- <el-table-column prop="st" align="center" label="服务类型"></el-table-column>
      <el-table-column prop="hotTel" align="center" label="热线电话"></el-table-column> -->
      <el-table-column label="热线电话" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.contact}}</template>
      </el-table-column>
      <el-table-column label="外部链接" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope"><el-button type="text">{{ scope.row.url }}</el-button></template>
      </el-table-column>
      <el-table-column label="修改时间" min-width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.updateAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button> -->
          <el-button @click="editHandle(scope.row)" type="warning" size="small">编辑</el-button>
          <!-- <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button> -->
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
    <transition name="add">
      <AddPage v-if="isShow" :msg="isShow" @upup="change" @reload="find(1)" :add.sync="notice"></AddPage>
    </transition>
    <transition name="edit">
      <EditPage v-if="isEdit" :msg="isEdit" @upedit="editChange" @reload="find(1)" :add.sync="notice"></EditPage>
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
import time from '@/utils/time.js';
import { send as ossUpload, getUri } from "@/utils/oss";
import AddPage  from './add';
import EditPage from './edit';
import SeePage from './see';

  export default {
    name: "merchantList",
    data() {
      return {
        isSou: false,
        isSee: false,
        isEdit: false,
        tableData: [],
        uri: '',
        navDetailData: [
          { id: 0, name: "商圈管理" },
          { id: 1, name: "便民服务" },
          { id: 2, name: "便民服务" }
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
        see:false,//控制查看组件弹出
        seeData:null,//查看数据
        visible2:false,
        delData:null
      };
    },
    components: {
      AddPage,
      EditPage,
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
        this.isEdit = true;
        this.notice = row;
      },
      delHandle(row) {
        this.visible2 = true;
        this.delData = row;
      },
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
          this.sendAjax();
          this.isShow = false;
        }
      },
      editChange(msg){
        this.isEdit = false;
      },
      seeChange(msg) {//与查看弹窗交互
        this.see = false;
      },
      find(){
        this.sendAjax(1);
      },
      serviceType(row,column) {
        let st = row[column.property]
        if(st === 1){
          return '生活服务';
        }
        if(st === 2){
          return '家政服务'
        }
      },
      sendAjax(page) {
        let nPage = page || this.$route.query.page || 1;
        let obj = {};
        if(this.formInline.name){
          obj.name = this.formInline.name;
        }else {
          delete obj.name ;
        }
        this.loading = true;
        let url = `/biz/convenience/page?page=${nPage}`;
        this.$xttp.post(url,obj)
          .then(res => {
            if (!res.errorCode) {
              this.tableData = res.data.records;
              this.currentPage = res.data.currentPage;
              this.total = res.data.total;
              console.log(this.tableData);
              this.tableData.forEach(function(item) {
                getUri(item.icon,key => {
                      item.url = key;
                  })
              })
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
  .add-enter-active, .add-leave-active {
    transition: all 0.5s ease;
  }

  .add-enter, .add-leave-active {
    opacity: 0;
    transform: translateX(-500px);
  }

  .edit-enter-active, .edit-leave-active {
    transition: all 0.5s ease;
  }

  .edit-enter, .edit-leave-active {
    opacity: 0;
    transform: translateX(-500px);
  }
</style>
