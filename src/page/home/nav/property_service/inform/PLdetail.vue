<template>
  <el-container>
    <el-main>
        <ul class="c-navDetail clear">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
                </el-breadcrumb-item>
          </el-breadcrumb>
          <div>
                <p class="c-title">评论详情</p>
                <div class="c-author-body" v-loading="commentLoading">
                    <div class="c-author-header">
                        <img class="c-user-image" v-if="uri" :src="uri" style="width:45px; height:45px; border-radius:100%">
                        <!-- <div class="c-image" v-if="uri"><img :src="uri" alt="头像加载失败" width="60px" height="60px"></div> -->
                        <div class="c-author-info">
                            <p>{{creatorName}}</p>
                            <p>{{createAt | time }}</p>
                        </div>
                    </div>
                    <div class="c-author-msg">
                        <p class="c-send-msg">{{ content }}</p>
                        <ul class="c-send-msgBody">
                            <li v-for="(item,index) in infoImage" :key="index" style="margin:5px;">
                                <img class="c-msg-image" style="width:150px; height:150px;" :src="item">
                            </li>
                        </ul>

                        <!-- <ul class="c-send-msgBody" v-loading="infoImageLoading">
                            <li v-for="(item, index) in infoImage" :key="index">
                                <img class="c-msg-image" :src="item" alt="图片加载失败">
                            </li>
                        </ul> -->
                    </div>
                </div>
          </div>
      </ul>
    </el-main>
  </el-container>
</template>

<script>
import { getUri } from '@/utils/oss';
import time from '@/utils/time.js';
  export default {
    name:'detailMessage',
    data() {
      return {
            navDetailData: [
                { id: 0, name: "物业服务" ,router:'/home/nav/rpass' },
                { id: 1, name: "社区动态" ,router:'/home/nav/propertyService/message' },
                { id: 2, name: "举报管理" ,router:'/home/nav/propertyService/inform' },
                { id: 3, name: "评论详情" }
            ],
            uri:'',
            commentOptions:[],
            likeOptions: [],
            infoImage: [],
            creatorName: '',
            createAt: '',
            creatorHeadImg: null,
            content: '',
            infoImageLoading: false,
            commentLoading: false
      }
    },
    props: ['msg','seeData'],
    created() {
        let id = this.$route.query.id;
        let url = `mom/moment/${id}/detail`;

        this.$xttp.get(url).then(res => {
            this.creatorName = res.data.creatorName;
            this.content = res.data.content;
            this.createAt = res.data.createAt;
            if(res.data.creatorHeadImg) {
                getUri(res.data.creatorHeadImg,(uri)=> {
                    this.uri = uri;
                });
            }
            if(res.data.photos.length) {
                this.infoImageLoading = true;
                this.getFilesUri(res.data.photos)
                    .then(files => {
                        this.infoImageLoading = false;
                        this.infoImage = files;
                    })
            }
        });
    },
    methods: {
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
        &>p:nth-child(1) {
            font-weight: 600;
        }
        &>p:nth-child(2) {
            color:gray;
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
                // width: 342px;
                width: 100%;
                overflow: hidden;
                li {
                    width:18%;
                    height: 200px;
                    float: left;
                    overflow: hidden;
                    margin: 4px 10px 10px 4px;
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
