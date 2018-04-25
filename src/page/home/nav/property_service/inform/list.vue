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
            <span slot="label"><i class="iconfont icon-duihuakuang"></i> 举报动态</span>
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
                        <el-form-item v-if="pms['11yA']">
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
                        <el-table-column label="详情" align="left" min-width="300" :show-overflow-tooltip="true">
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
                            <!-- <template slot-scope="scope">{{ scope.row.reportNum }}</template> -->
                            <template slot-scope="scope" v-if="scope.row.reportNum > 0"><el-button type="text" @click="showJBNum(scope.row,1)">{{scope.row.reportNum}}</el-button></template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ statusFormat(scope.row.status) }}</template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="300" align="left" :fixed="tableData.length ? 'right' : '/'">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="detailDT(scope.row)"  v-if="pms['11yB']">动态详情</el-button>
                                <el-button  v-if="(scope.row.status == 1 || scope.row.status == 2) && pms['11yC']" type="danger" @click="PBDT(scope.row)" size="mini">屏蔽</el-button>
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
            <el-tab-pane>
                <span slot="label"><i class="iconfont icon-pinglun"></i> 举报评论</span>
                <div class="c-searchbar">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-select v-model="type1" placeholder="全部类型" clearable @change="changeTypesComment">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input placeholder="住户姓名" v-model.trim="input1"></el-input>
                            </el-form-item>
                        <el-form-item v-if="pms['11yA']">
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
                        <el-table-column label="详情" align="left" min-width="300" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.content }}</template>
                        </el-table-column>
                        <el-table-column label="住户姓名" align="center" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.creatorName }}</template>
                        </el-table-column>
                        <el-table-column label="发布时间" align="center" min-width="160" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ scope.row.createAt | time('yyyy-MM-dd HH:mm:ss') }}</template>
                        </el-table-column>
                        <el-table-column label="举报数量" align="center" min-width="200" :show-overflow-tooltip="true">
                            <template slot-scope="scope" v-if="scope.row.reportNum > 0"><el-button type="text" @click="showJBNum(scope.row,2)">{{scope.row.reportNum}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">{{ statusFormat(scope.row.status) }}</template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="300" align="left" :fixed="tableData.length ? 'right' : '/'">
                            <template slot-scope="scope">
                                <!-- <el-button type="primary" size="mini" @click="detailPL(scope.row)">评论详情</el-button> -->
                                <el-button  v-if="(scope.row.status == 1 || scope.row.status == 2) && pms['11yF']" type="danger" @click="commentNO(scope.row)" size="mini">屏蔽</el-button>
                                <!-- <el-button type="danger" size="mini" @click="commentNO(scope.row)">屏蔽</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="c-pagination">
                    <el-pagination
                        layout="total, prev, pager, next, jumper" @current-change="getTableList"
                        :total="total1" :page-size="pageSize" :current-page.sync="currentPage1">
                    </el-pagination>
                </div>
            </el-tab-pane>
          </el-tabs>
      </div>
      
      <el-dialog title="屏蔽动态" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <p style="margin-bottom:40px;">屏蔽后该动态将不再出现在社区动态内！</p>
        <p style="margin-bottom:10px;">屏蔽原因：</p>
        <el-select v-model="PBReason" placeholder="请选择" label="屏蔽原因："  style="width:300px;">
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

      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>

      <transition name="fadePL">
        <PLPage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></PLPage>
      </transition>

      <transition name="shownum">
        <showNumPage v-if="isSee" :msg="isSee" :data="showNum" :typeNum="typeNum" @uppsee="seeExport" ></showNumPage>
      </transition>
      
      
    </el-main>
  </el-container>
</template>

<script>
  import time from '@/utils/time.js';
  import SeePage from './DTdetail';
  import showNumPage from './shownum'

  export default {
    name: 'inform',
    data () {
      return {
        pms: this.$store.getters.pms,//菜单权限
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
        total1: 0,
        currentPage: 1,
        currentPage1: 1,
        input: '',//住户
        times: '',//开始结束时间
        input1: '',
        typeOptions: [{label: '待审核',value: '0'},{label: '审核通过',value: '1'},{label: '自动通过',value: '2'},{label: '未通过',value: '-1'},{label: '系统自动屏蔽',value: '-2'},{label: '管理员屏蔽',value: '-3'}],//类型选择数据
        type:'',//类型
        type1: '',
        shielding: false,  //社区动态屏蔽
        shieldingData: null,  //社区动态屏蔽内容
        dialogVisible: false,
        value:'5',
        options:[{value: '垃圾广告信息',label:'垃圾广告信息'},{value: '色情淫秽信息',label:'色情淫秽信息'},{value: '暴力血腥信息',label:'暴力血腥信息'},{value: '违规违法内容',label:'违规违法内容'},{value: '人身攻击',label:'人身攻击'},{value: '其他',label: '其他'}],
        speechId: '',
        PBReason: '',
        type: '',
        see:false,
        seeData: null, //查看数据
        isSee: false, //查看举报数据
        showNum: null,
        typeNum: '',
        text: ''
      }
    },
    components: {
      SeePage,
      showNumPage
    },
    created() {
      this.query();
      this.query1();
    },
    methods: {
        handleClose(done){
          this.dialogVisible = false;
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
      seeChange(){
          this.see = false;
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
        let url = `mom/comment/page-with-report?page=${this.currentPage1}&size=${this.pageSize}`;
        let params = {};
        //输入的搜索字添加params中
        if(this.type1){
          params['status'] = this.type1;
        }
        if(this.input1){
          params['creatorName'] = this.input1;
        }
        params['communityId'] = this.$store.getters.communityId;
        this.$xttp.post(url, params).then(res => {
          this.loading = false;
          if (res.errorCode === 0) {
            this.tableData1 = res.data.records;
            this.total1 = res.data.total;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      statusFormat(status) {
        let names = {
          '0': '待审核',
          '1': '审核通过',
          '2': '自动通过',
          '-1': '未通过',
          '-2': '自动屏蔽',
          '-3': '管理员屏蔽'
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
        this.query();
      },
      changeTypesComment(){
        this.query1();
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
      showInfo(text) {
        this.$message({
            message: text,
            type: "warning"
        });
      },
      detailDT(row) {
        this.$router.push({path: '/home/nav/propertyService/DTinformDetail',query: {id:row.id}});
      },
      commentNO(row){
          this.speechId = row.id;
          this.dialogVisible = true;
          this.type = 2;
      },
      PBDT(row){
          this.speechId = row.id;
          this.dialogVisible = true;
          this.type = 1;
      },
      PBConfirm(){
          let url = `mom/shielding/speech`;
          let obj = {};
          if(this.PBReason != ''){
              obj['reason'] = this.PBReason;
          }else{
             this.showInfo('请选择屏蔽原因');
             return;
          }
          
          obj['speechId'] = this.speechId;
          obj['type'] = this.type;
          this.$xttp.post(url, obj).then(res => {
          this.loading = false;
          if (res.success) {
            this.dialogVisible = false;
            this.speechId = '';
            this.type = '';
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
      showJBNum(row,type){
        this.isSee = true;
        this.showNum = row;
        this.typeNum = type;
      },
      seeExport(msg) {
        this.isSee = false;
        this.typeNum = '';
      },
    }
  }
</script>

<style scoped lang="scss">
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: rotateY(180deg);
}

.fadePL-enter-active,
.fadePL-leave-active {
  transition: all 0.5s ease;
}

.fadePL-enter,
.fadePL-leave-active {
  opacity: 0;
  transform: rotateY(180deg);
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
