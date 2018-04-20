<template>
  <el-container>
    <el-main>
      <ul class="c-navDetail clear">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
      </ul>
      <div class="c-rpass-container">
          <el-tabs type="border-card">
            <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i> 举报动态</span>
                <div class="c-searchbar">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-select v-model="type" placeholder="全部类型" clearable @change="changeTypes">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input placeholder="住户姓名" v-model.trim="input"></el-input>
                            </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="query">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="c-list">
                    <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
                        <el-table-column label="序号" width="80" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
                        </el-table-column>
                        <el-table-column v-if="isShow" align="center" label="ID" min-width="10" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.id }}</template>
                        </el-table-column>
                        <el-table-column label="详情" align="center" min-width="300" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.content }}</template>
                        </el-table-column>
                        <!-- <el-table-column label="动态类型" align="center" min-width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">{{ typeFormat(scope.row.type) }}</template>
                        </el-table-column> -->
                        <el-table-column label="住户姓名" align="center" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.creatorName }}</template>
                        </el-table-column>
                        <el-table-column label="发布时间" align="center" min-width="160" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.createAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
                        </el-table-column>
                        <el-table-column label="举报数量" align="center" min-width="200" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.reportNum }}</template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ statusFormat(scope.row.status) }}</template>
                        </el-table-column>
                        <!-- <el-table-column label="操作" min-width="300" :fixed="tableData.length ? 'right' : '/'">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="detail(scope.row)">动态详情</el-button>
                                <el-button type="primary" size="mini">屏蔽</el-button>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="操作" min-width="300" align="center" :fixed="tableData.length ? 'right' : '/'">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="detail(scope.row)">动态详情</el-button>
                                <el-button type="primary" @click="dialogVisible = true" size="mini">屏蔽</el-button>
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
            </el-tab-pane>
            <el-tab-pane label="举报评论">
                <div class="c-searchbar">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-select v-model="type1" placeholder="全部类型" clearable @change="changeTypes">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input placeholder="住户姓名" v-model.trim="input1"></el-input>
                            </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="query1">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="c-list">
                    <el-table :data="tableData1" style="width: 100%" v-loading="loading" stripe>
                        <el-table-column label="序号" width="80" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
                        </el-table-column>
                        <el-table-column v-if="isShow" align="center" label="ID" min-width="10" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.id }}</template>
                        </el-table-column>
                        <el-table-column label="详情" align="center" min-width="300" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.content }}</template>
                        </el-table-column>
                        <!-- <el-table-column label="动态类型" align="center" min-width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">{{ typeFormat(scope.row.type) }}</template>
                        </el-table-column> -->
                        <el-table-column label="住户姓名" align="center" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.creatorName }}</template>
                        </el-table-column>
                        <el-table-column label="发布时间" align="center" min-width="160" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.createAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
                        </el-table-column>
                        <el-table-column label="举报数量" align="center" min-width="200" :show-overflow-tooltip="true">
                            <template slot-scope="scope" v-if="scope.row.reportNum > 0"><el-button type="text">{{scope.row.reportNum}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ statusFormat(scope.row.status) }}</template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="300" align="center" :fixed="tableData.length ? 'right' : '/'">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="detail(scope.row)">评论详情</el-button>
                                <el-button type="primary" size="mini" @click="commentNO(scope.row)">屏蔽</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="c-pagination">
                    <el-pagination
                        layout="total, prev, pager, next, jumper" @current-change="getTableList"
                        :total="total" :page-size="pageSize" :current-page.sync="currentPage1">
                    </el-pagination>
                </div>
            </el-tab-pane>
          </el-tabs>
      </div>
      <el-dialog title="屏蔽动态" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <p style="margin-bottom:40px;">屏蔽后该动态将不再出现在社区动态内！</p>
        <p style="margin-bottom:10px;">屏蔽原因：</p>
        <el-select v-model="value" placeholder="请选择" label="屏蔽原因："  style="width:300px;">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- <transition name="fade">
        <editPage v-if="isManage" :msg="isManage" @upsee="manageEmit" ></editPage>
      </transition> -->
      <transition name="shielding">
        <SeePage v-if="shielding" :msg="shielding" @upsee="shieldingChange"  :data="shieldingData"></SeePage>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
  import time from '@/utils/time.js';
//   import editPage from './edit'

  export default {
    name: 'message',
    data () {
      return {
        navDetailData: [
          { id: 0, name: "物业服务" ,router:'/home/nav/rpass' },
          { id: 1, name: "社区动态" ,router:'/home/nav/propertyService/message' },
          { id: 2, name: "举报管理" }
        ],
        isShow: false,
        isManage:false,//审核管理设置
        loading: false,
        tableData: [],
        tableData1: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        currentPage1: 1,
        input: '',//住户
        times: '',//开始结束时间
        input1: '',
        typeOptions: [{label: '系统自动通过',value: '1'},{label: '系统自动屏蔽',value: '2'},{label: '管理员屏蔽',value: '3'}],//类型选择数据
        type:'',//类型
        type1: '',
        shielding: false,  //社区动态屏蔽
        shieldingData: null,  //社区动态屏蔽内容
        dialogVisible: false,
        value:'5',
        options:[{value: '1',label:'欺诈信息'},{value: '2',label:'色情/淫秽内容'},{value: '3',label:'低俗辱骂内容'},{value: '4',label:'暴力血腥内容'},{value: '5',label:'违反法律法规'},]
      }
    },
    components: {
    //   editPage
    },
    created() {
      this.query1();
      this.query();
    },
    methods: {
        handleClose(done){
            this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
        },
      query() {
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        else {
          this.getTableList();
        }
      },
      query1() {
        if (this.currentPage1 !== 1) {
          this.currentPage1 = 1;
        }
        else {
          this.getTableList1();
        }
      },
      handle(row) {
        this.shielding = true;
        this.shieldingData = row;
      },
      shieldingChange(msg) {
        //与查看弹窗交互
        this.shielding = false;
      },
      format(){
        return {
          a: ''
        }
      },
      getTableList() {
        this.loading = true;
        let url = `mom/moment/page-with-report?page=${this.currentPage}&size=${this.pageSize}`;
        let params = {};
        //输入的搜索字添加params中
        if(this.type){
          params['status'] = this.type;
        }
        if(this.input){
          params['creatorName'] = this.input;
        }
        this.$xttp.post(url, params).then(res => {
          console.log(res);
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getTableList1() {
        this.loading = true;
        let url = `mom/moment/community/detail?page=${this.currentPage1}&size=${this.pageSize}`;
        let params = {};
        //输入的搜索字添加params中
        if(this.type1){
          params['status'] = this.type1;
        }
        if(this.input1){
          params['creatorName'] = this.input1;
        }
        this.$xttp.post(url, params).then(res => {
          console.log(res);
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData1 = res.data.records;
            this.total = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      statusFormat(status) {
        let names = {
          '0': '待审核',
          '1': '手动通过',
          '2': '自动通过',
          '-1': '未通过',
          '-2': '自动屏蔽',
          '-3': '手动屏蔽'
        };
        return names[status];
      },
      typeFormat(type){
        let names = {
          '1': '邻里社交',
          '2': '悬赏求助',
          '3': '二手交易'
        };
        return names[type];
      },
      changeTimes(time) {
          console.log(time)
      },
      changeTypes(type) {
        console.log('type:'+ type);
      },
      changeStatus(status) {
        console.log('status:'+ status);
      },
      manageEmit(msg) {
        this.isManage = false;
      },
      manageClick() {
        this.isManage = true;
      },
      detail(row) {
        this.$router.push('/home/nav/propertyService/messageDetail')
      },
      commentNO(row){
          alert(row.id);
      }
    }
  }
</script>

<style scoped lang="scss">
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }

    .shielding-enter-active, .shielding-leave-active {
        transition: all 0.5s ease;
    }

    .shielding-enter, .shielding-leave-active {
        opacity: 0;
        transform: rotateY(180deg);
    }
</style>
