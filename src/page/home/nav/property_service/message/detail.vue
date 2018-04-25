<template>
  <el-container>
    <el-main v-loading="pageLoading">
        <ul class="c-navDetail clear">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
                </el-breadcrumb-item>
          </el-breadcrumb>
          <div>
                <p class="c-title">动态详情</p>
                <div class="c-author-body">
                    <div class="c-author-header">
                        <img class="c-user-image" :src="homeHeadImg" alt="头像加载失败">
                        <div class="c-author-info">
                            <p>{{ detailData.creatorName  }}</p>
                            <p>{{ detailData.createAt | time('yyyy-MM-dd HH:mm')  }}</p>
                        </div>
                    </div>
                    <div class="c-author-msg">
                        <p class="c-send-msg">{{ detailData.content }}</p>
                        <ul class="c-send-msgBody" v-loading="infoImageLoading">
                            <li v-for="(item, index) in infoImage" :key="index">
                                <img class="c-msg-image" :src="item" alt="图片加载失败">
                            </li>
                        </ul>
                        <div class="c-send-msgBtn">
                            <el-button type="info" @click="seeReport(detailData.id,1)" v-if="status !== 0">查看举报({{ detailData.reportNum || 0 }})</el-button>
                            <el-button type="danger" @click="shieldClick(detailData,1)" :disabled="btnStatus" v-if="status !== 0">屏蔽动态</el-button>
                            <el-button type="success" v-if="status == 0" @click="passDone(1)">通过</el-button>
                            <el-button type="warning" v-if="status == 0" @click="passDone(-1)">不通过</el-button>
                        </div>
                    </div>
                </div>
                <div class="c-like-body" v-if="status !== 0">
                    <el-collapse accordion>
                        <el-collapse-item>
                            <template slot="title">
                                &nbsp; 点赞 ( {{ detailData.praiseNum || 0  }} )
                            </template>
                            <ul class="c-like-box">
                                <li v-for="item in likeOptions" :key="item.id">
                                    <img class="c-user-image" :src="item.creatorHeadImg" alt="头像加载失败">
                                    <div class="c-author-info">
                                        <p>{{ item.creatorName }}</p>
                                        <p>{{ item.createAt | time('yyyy-MM-dd HH:mm')  }}</p>
                                    </div>
                                </li>
                                <li>
                                    <div style="width:150px;margin:0 auto;">
                                        <el-button @click="getLike" v-if="likeCurrentNum > 9">点击查看更多...</el-button>
                                        <p  v-if="!(likeCurrentNum > 9)">亲,暂时没有更多数据了</p>
                                    </div>
                                </li>
                            </ul>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div class="c-comment-body" v-if="status !== 0">
                    <p class="c-comment-title">&nbsp; 评论( {{ detailData.commentNum || 0  }} )</p>
                    <div class="c-border-bottom" v-for="item in commentOptions" :key="item.id" v-loading="commentLoading">
                        <div class="c-margin10">
                            <div> 
                                <img class="c-user-image" :src="item.creatorHeadImg" alt="头像加载失败">
                                <div class="c-author-info">
                                    <p>{{ item.creatorName }}</p>
                                    <p>{{ item.createAt | time('yyyy-MM-dd HH:mm')  }}</p>
                                </div>
                            </div>
                            <p class="c-comment-content">{{ item.content }}</p>
                            <div class="c-send-msgBtn">
                                <el-button type="info" size="small" @click="seeReport(item.id,2)">查看举报({{ item.reportNum || 0 }})</el-button>
                                <el-button type="danger" :disabled="btnStatus || (item.status == -3) " @click="shieldClick(item,2)"  size="small">屏蔽评论</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="c-pagination">
                        <el-pagination
                            layout="total, prev, pager, next, jumper" @current-change="getCommentDetail"
                            :total="total" :page-size="pageSize" :current-page.sync="currentPage">
                        </el-pagination>
                    </div>
                </div>
          </div>
      </ul>
      <seeDetail v-if="isSee" :msg="isSee" :id="seeDetailId" :type="seeDetailType" @upsee="seeExport" ></seeDetail>
      <el-dialog title="屏蔽动态" :visible.sync="visible" :before-close="shieldClose">
        <p>屏蔽后该动态将不再出现在社区动态内！</p>
        <p style="margin-top:15px;">屏蔽原因:</p>
        <div>
            <el-select v-model="shieldReason" clearable placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.value"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="text-align: right; marigin: 0">
          <el-button type="primary" size="mini" @click="comfirmShield">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="审核" :visible.sync="visible2">
        <p v-if="pass == 1">确定审核通过此条动态?</p>
        <p v-if="pass == -1">确定拒绝通过此条动态?</p>
        <div style="text-align: right; margin: 0">
          <el-button type="primary" size="mini" @click="confirmPR">确定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
    import { getUri } from '@/utils/oss.js'
    import seeDetail from './exportDetail'

  export default {
    name:'detailMessage',
    data() {
      return {
            status: null ,//详情状态 0：待审核,1：审核通过,2:自动通过,-1：未通过,-2:系统自动屏蔽,-3：管理员屏蔽
            pageLoading: false,
            infoImageLoading: false,//内容信息加载进度。。。
            commentLoading: false,//评论进度加载...
            homeHeadImg:'',//发布者头像
            momentId:'',//当前发布者id
            detailData: {},
            navDetailData: [
                { id: 0, name: "物业服务" ,router:'/home/nav/rpass' },
                { id: 1, name: "动态管理" ,router:'/home/nav/propertyService/message' },
                { id: 2, name: "社区动态" ,router:'/home/nav/propertyService/message'},
                { id: 3, name: "动态详情" }
            ],
            infoImage: [],
            likeOptions: [],//点赞
            commentOptions: [],//评论
            pageSize: 5,//评论分页
            currentPage: 1 ,//评论分页
            total: 0,//评论总条数
            likeCurrentNum: 10,//点赞 当前页总数
            likeNewTime: null ,//点赞 最新时间
            isSee: false,//查看举报
            seeDetailId: '',//查看举报 id
            seeDetailType:'',//查看举报 类型 1 为动态 2：评论
            shieldId: '',//屏蔽 id
            shieldType: '',//屏蔽类型
            visible:false,//屏蔽动态
            shieldReason:'',//屏蔽原因
            visible2: false,//审核弹窗
            pass: 1,//审核通过
            auditId:'',//审核 id
            btnStatus: false,//按钮状态
            options:[{value: '违反法律法规',label:'违反法律法规'},{value: '欺诈信息',label:'欺诈信息'},{value: '色情/淫秽内容',label:'色情/淫秽内容'},{value: '低俗辱骂内容',label:'低俗辱骂内容'},{value: '暴力血腥内容',label:'暴力血腥内容'}],//屏蔽原因下拉接口
      }
    },
    components:{ seeDetail },
    created() {
        this.getMonmentDetail();
    },
    methods: {
     getMonmentDetail() {
        this.pageLoading = true;
        let url = `/mom/moment/${this.$route.query.id}/detail`;
        this.$xttp.get(url).then(res => {
            this.pageLoading = false;
            if(!res.errorCode){
                this.detailData = res.data;
                if(Array.isArray(this.detailData.photos)) {
                    if(this.detailData.photos.length){
                        this.infoImageLoading = true;
                        this.getFilesUri(this.detailData.photos)
                        .then(files => {
                            this.infoImageLoading = false;
                            this.infoImage = files;
                        })
                    };
                }
                if(this.detailData.creatorHeadImg.indexOf('http:') < 0) {
                    getUri(this.detailData.creatorHeadImg,url => this.homeHeadImg = url );
                }else {
                    this.homeHeadImg = this.detailData.creatorHeadImg;
                }
                this.status = this.detailData.status;
                this.momentId = this.detailData.id;
                this.btnStatus = this.status == -3 || this.status == -2 ? true :false;
                if(this.detailData.status !== 0){
                    //获取评论列表
                    this.getCommentDetail();
                    //获取点赞
                    this.getLike();
                }
            }
        })
     },
     confirmPR(){
        let url = `mom/moment/${this.momentId}/audit?status=${this.pass}`;
        this.$xttp.get(url).then(res => {
          if(res.success){
            this.visible2 = false;
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.$router.push({path:'/home/nav/propertyService/message'})
          }
        })
      },
    passDone(status) {
        this.visible2 = true;
        this.pass = status;
    },
     getFilesUri(){
         return new Promise((resolve,reject)=> {
             let arr = arguments[0];
             let newArr = [];
             arr.forEach((item, index) => {
                 getUri(item,url => {
                    newArr.push(url);
                    if(index == (arr.length - 1)){
                        resolve(newArr);
                    }
                 })
             });
         })
     },
     getCommentDetail() {
        this.commentLoading = true;
        let url = `/mom/comment/${this.momentId}/detail?page=${this.currentPage}&size=${this.pageSize}`;
        this.$xttp.get(url).then(res => {
            this.commentLoading = false;
            if(!res.errorCode){
               this.commentOptions = res.data.records;
               this.total = res.data.total;
               this.commentOptions.forEach(item => {
                   if(item.creatorHeadImg.indexOf('http:') < 0) {
                        getUri(item.creatorHeadImg,url => item.creatorHeadImg = url )
                    }else {
                         item.creatorHeadImg = url
                    }
                   
               })
            }
        })
     },
     getLike() {
        let url = `/mom/praise/incremental-list`;
        this.$xttp.post(url, {momentId:this.momentId,sort: 0,startAt:this.likeNewTime }).then(res => {
            if(!res.errorCode){
               this.likeCurrentNum = res.data.length;
               if(res.data.length) {
                   this.likeNewTime = res.data[res.data.length - 1].createAt;
                   res.data.forEach(item => {
                        if(item.creatorHeadImg.indexOf('http:') < 0) {
                                getUri(item.creatorHeadImg,url => item.creatorHeadImg = url )
                            }else {
                                item.creatorHeadImg = url
                            }
                        this.likeOptions.push(item);
                    })
               }
            }
        })
     },
     seeExport(msg) {
         this.isSee = false;
         this.seeDetailId = '';
     },
     comfirmShield() {
         let a = this.commentOptions.find(item => item.id == this.shieldId);
         if(this.shieldReason) {
             this.$xttp.post('mom/shielding/speech',{reason:this.shieldReason,speechId:this.shieldId,type:this.shieldType})
                .then(res => {
                    if(!res.errorCode) {   
                        this.visible = false;
                        this.$message('屏蔽成功');
                        if(this.shieldType == 1) {
                            this.btnStatus = true;
                        }else if(this.shieldType == 2) {
                            this.commentOptions.find(item => item.id == this.shieldId).status = -3;
                        }
                    }
                })
         }
     },
     shieldClose() {
         this.visible = false;
         this.shieldReason = '';
     },
     shieldClick(data,type ) {
         this.visible = true;
         this.shieldId = data.id;
         this.shieldType = type;
     },
     seeReport(id,type) {
         this.isSee = true;
         this.seeDetailId = id;
         this.seeDetailType = type;
     }
    }
  }
</script>

<style scoped lang="scss">
.c-title {
  background: #8dd2e2;
  line-height: 30px;
  text-indent: 1rem;
  font-weight: 800;
}
.c-user-image {
  width: 50px;
  height: 50px;
}
.c-margin10 {
  margin: 10px 10px 15px;
}
.c-border-bottom {
  border-bottom: 1px solid blanchedalmond;
}
.c-user-image {
  float: left;
  margin-right: 10px;
}
.c-send-msgBtn {
  margin-top: 15px;
  text-align: right;
}
.c-author-info {
  padding: 6px 0;
  & > p:nth-child(1) {
    font-weight: 600;
  }
  & > p:nth-child(2) {
    color: gray;
    font-size: 13px;
  }
}
.c-send-msg {
  font-size: 15px;
  font-weight: 500;
}
.c-author-body {
  padding: 10px;
  border: 1px solid blanchedalmond;
  .c-author-header {
  }
  .c-author-msg {
    margin-top: 15px;
    padding-left: 50px;
    .c-send-msg {
      margin-bottom: 15px;
    }
    .c-send-msgBody {
      margin: -4px 0 0 -4px;
      width: 342px;
      overflow: hidden;
      li {
        width: 110px;
        height: 110px;
        float: left;
        overflow: hidden;
        margin: 4px 0 0 4px;
        img {
          width: 100%;
          height: 100%;
          display: inline-block;
          vertical-align: top;
        }
      }
    }
  }
  .c-like-body {
    margin-top: 10px;
  }
}
.c-like-box {
  max-height: 300px;
  overflow-y: scroll;
}
.c-comment-body {
  margin-top: 10px;
  border: 1px solid blanchedalmond;
  .c-comment-title {
    height: 48px;
    line-height: 48px;
    color: #303133;
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
    font-size: 13px;
    font-weight: 500;
  }
  .c-comment-content {
    margin-left: 60px;
    font-weight: 500;
  }
}
</style>
