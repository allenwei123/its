<template>
  <el-container>
    <el-main>
        <ul class="c-navDetail clear">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
                </el-breadcrumb-item>
          </el-breadcrumb>
          <div>
                <p class="c-title">动态详情</p>
                <div class="c-author-body">
                    <div class="c-author-header">
                        <img class="c-user-image" src="static/image/MANAGER.png" alt="头像加载失败">
                        <div class="c-author-info">
                            <p>刘强东</p>
                            <p>2018-01-01 12:34</p>
                        </div>
                    </div>
                    <div class="c-author-msg">
                        <p class="c-send-msg">小区门口有一条小狗白色的超级萌萌的小区门口有一条小狗，白小区门口有一条小狗，白色的超级萌萌的色的超级萌萌的</p>
                        <ul class="c-send-msgBody">
                            <li v-for="item in infoImage" :key="item.id">
                                <img class="c-msg-image" src="static/image/MANAGER.png" alt="图片加载失败">
                            </li>
                        </ul>
                        <div class="c-send-msgBtn">
                            <el-button type="info">查看举报</el-button>
                            <el-button type="danger">屏蔽动态</el-button>
                        </div>
                    </div>
                </div>
                <div class="c-like-body">
                    <el-collapse accordion>
                        <el-collapse-item>
                            <template slot="title">
                                &nbsp 点赞 ( 66 )
                            </template>
                            <ul>
                                <li v-for="item in likeOptions" :key="item.id">
                                    <img class="c-user-image" src="static/image/MANAGER.png" alt="头像加载失败">
                                    <div class="c-author-info">
                                        <p>刘强东</p>
                                        <p>2018-01-01 12:34</p>
                                    </div>
                                </li>
                            </ul>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div class="c-comment-body">
                    <p class="c-comment-title">&nbsp 评论( 66 )</p>
                    <div class="c-border-bottom" v-for="item in commentOptions" :key="item.id">
                        <div class="c-margin10">
                            <div> 
                                <img class="c-user-image" src="static/image/MANAGER.png" alt="头像加载失败">
                                <div class="c-author-info">
                                    <p>刘强东</p>
                                    <p>2018-01-01 12:34</p>
                                </div>
                            </div>
                            <p class="c-comment-content">小区门口有一条流浪狗，白色的超萌，不知道是不是有主的，想抱走！</p>
                            <div class="c-send-msgBtn">
                                <el-button type="info" size="small">查看举报</el-button>
                                <el-button type="danger" size="small">屏蔽评论</el-button>
                            </div>
                        </div>
                    </div>
                </div>
          </div>
      </ul>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name:'detailMessage',
    data() {
      return {
            navDetailData: [
                { id: 0, name: "物业服务" ,router:'/home/nav/rpass' },
                { id: 1, name: "动态管理" ,router:'/home/nav/propertyService/message' },
                { id: 2, name: "社区动态" ,router:'/home/nav/propertyService/message'},
                { id: 3, name: "动态详情" }
            ],
            infoImage: [{id:0},{id:1},{id:2},{id:3}],
            likeOptions: [{id:0},{id:1},{id:2},{id:3}],//点赞
            commentOptions: [{id:0},{id:1},{id:2},{id:3}],//评论
      }
    },
    props: ['msg'],
    created() {
      
    },
    methods: {
     
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
                width: 342px;
                overflow: hidden;
                li {
                    width:110px;
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
