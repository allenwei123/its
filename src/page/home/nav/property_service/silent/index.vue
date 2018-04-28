<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </ul>
      <div class="c-notice-container">
        <div class="c-search">
          <el-form :inline="true" class="demo-form-inline">

            <el-select v-model="status" placeholder="全部状态" clearable @change="changeStatus">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>

            <el-form-item label="">
              <el-input placeholder="住户姓名" v-model.trim="silentUserName"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="query" v-if="pms['11K1']">查询</el-button>
            </el-form-item>

          </el-form>
        </div>
        <div class="c-list">
          <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>

            <el-table-column label="序号" width="80" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
            </el-table-column>

            <el-table-column label="住户姓名" min-width="180" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{scope.row.silentUserName }}</template>
            </el-table-column>

            <el-table-column label="禁言时长" min-width="100" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.silentMinutes  }}/分钟</template>
            </el-table-column>

            <el-table-column label="剩余时长" width="200">
              <template slot-scope="scope">{{ scope.row.silentEndAt | time }}</template>
            </el-table-column>

            <el-table-column label="状态" min-width="200" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.status == 0 ? '已解禁' :'禁言中' }}</template>
            </el-table-column>

            <el-table-column label="被屏蔽动态" min-width="160" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope" @click="showJBNum(scope.row,1)">{{ scope.row.publishAt }}</template>
            </el-table-column>

            <el-table-column label="被屏蔽评论" min-width="160" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope" @click="showJBNum(scope.row,2)">{{ scope.row.publishAt }}</template>
            </el-table-column>

            <el-table-column label="操作" width="300" :fixed="tableData.length ? 'right' : '/'" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="del(scope.row)" v-if="pms['11K3']">解除禁言</el-button>
                <el-button type="danger" size="mini" @click="commentNO(scope.row)" v-if="pms['11K6']">禁言</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="c-pagination">
          <el-pagination
            layout="total, prev, pager, next, jumper" @current-change="getTableList"
            :total="total" :page-size="pageSize" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </div>

      <el-dialog title="禁言" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <p style="margin-bottom:10px;">禁言时长</p>
        <el-select v-model="silentMinutes" placeholder="请选择" label="屏蔽原因："  style="width:300px;">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="PBConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <transition name="shownum">
        <showNumPage v-if="isSee" :msg="isSee" :data="showNum" :typeNum="typeNum" @uppsee="seeExport" ></showNumPage>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
  import showNumPage from './shownum'

  export default {
    name: 'notice',
    data () {
      return {
        pms: this.$store.getters.pms,//菜单权限
        status: '',
        silentUserName:'',//用户名称
        statusOptions: [{label: '已解禁',value: '0'},{label: '禁言中',value: '1'}],//状态选择数据
        navDetailData: [
          { id: 0, name: "物业服务" ,router:'/home/nav/rpass' },
          { id: 1, name: "社区动态", router: '/home/nav/propertyService/notice' },
          { id: 2, name: "禁言管理" }
        ],
        loading: false,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        q_input: null,
        showNum: null,
        typeNum: '',
        isSee: false,
        silentUserId: '',
        dialogVisible : false,
        type: '',
        silentMinutes: '',
        silentUserId: '',
        options:[{value: '60',label:'1小时'},{value: '120',label:'2小时'},{value: '240',label:'4小时'},{value: '720',label:'12小时'},{value: '1440',label:'1天'},{value: '4320',label: '3天'},{value: '43200',label: '30天'}]
      }
    },
    components:{
      showNumPage
    },
    methods: {
      query() {
        this.silentUserName = this.silentUserName;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList(1);
        }
      },
      showInfo(text) {
        this.$message({
            message: text,
            type: "warning"
        });
      },
      changeStatus() {
        this.query();
        this.tableData = [];
      },
      preview(row,type){
        this.isSee = true;
        this.showNum = row;
        this.typeNum = type;
      },
      handleClose(done){
        this.dialogVisible = false;
      },
      // 禁言
      commentNO(row){
        this.silentUserId = row.silentUserId;
        this.dialogVisible = true;
        this.type = 2;
      },
      // 解除禁言
      del(item) {
        this.$confirm('确认解除禁言？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$xttp.get(`mom/silent/${item.id}/relieve`).then(res => {
            this.loading = false;
            if (res.errorCode === 0) {
              this.getTableList(1);
            }
          }).catch(() => {
            this.loading = false;
          })
        }).catch(() => {});
      },
      deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      // 撤销
      revoke(item) {
        this.loading = true;
        let params = {
          id: item.id,
          publishStatus: -1,
          body: item.body
        };
        this.$xttp.post('property/notice/edit', params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = this.tableData.map(it => {
              if (it === item) {
                it = res.data;
              }
              return it;
            });
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      getTableList(pages) {
        this.loading = true;
        let url = `/mom/silent/page?page=${pages}&size=${this.pageSize}`;
        let params = {};
        params['communityId'] = this.$store.getters.communityId;
        if(this.status){
          params['status'] = this.status;
        }
        if(this.silentUserName){
          params['silentUserName'] = this.silentUserName;
        }
        console.log(params);
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          console.log(res)
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      PBConfirm(){
          let url = `mom/silent/user`;
          let obj = {};
          if(this.silentMinutes != ''){
              obj['silentMinutes'] = this.silentMinutes;
          }else{
             this.showInfo('请选择禁言时长');
             return;
          }
          
          obj['silentUserId'] = this.silentUserId;
          console.log(obj);
          return;
          this.$xttp.post(url, obj).then(res => {
          this.loading = false;
          if (res.success) {
            this.dialogVisible = false;
            this.silentUserId = '';
            this.$message({message:'屏蔽成功!',type:'success'});
            this.query();
          }else{
            this.dialogVisible = false;
            this.$message({message:res.errorMsg,type:'error'});
          }
        }).catch(() => {
          this.loading = false;
        })
      },
    },
    created() {
      this.query();
    }
  }
</script>

<style scoped lang="scss">
  .c-navDetail {
    margin-bottom: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
  }

  .c-body {
    width: 90%;
    &.c-maxWidth {
      max-width: calc(100vw - 200px);
    }
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

  .shownum-enter-active,
  .shownum-leave-active {
    transition: all 0.5s ease;
  }

  .shownum-enter,
  .shownum-leave-active {
    opacity: 0;
    transform: rotateY(180deg);
  }

</style>
