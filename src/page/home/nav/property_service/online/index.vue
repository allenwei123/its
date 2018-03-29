<template>
    <el-container>
      <el-main>
        <el-card class="c-box-online c-only">
          <div slot="header" class="c-card-header" >
            <span>客服聊天记录</span>
          </div>
          <div v-for="item in personList" :key="item.id"  @click="toggleChat(item)" >
            <chatItem :item="item" v-if="item" @delItem="delSession"></chatItem>
          </div>
        </el-card>
        <keep-alive><chatDail :detail="detailObj" @sendText="sendMsg" > </chatDail></keep-alive>
      </el-main>
    </el-container>
</template>

<script>
    import { NimObj as Im } from "@/utils/nim"
    import chatItem from './chat_item'
    import  chatDail from './chat_detail'
    let emoji1 ={"[大笑]":{file:"emoji_0.png"},"[可爱]":{file:"emoji_01.png"},"[色]":{file:"emoji_02.png"},"[嘘]":{file:"emoji_03.png"},"[亲]":{file:"emoji_04.png"},"[呆]":{file:"emoji_05.png"},"[口水]":{file:"emoji_06.png"},"[汗]":{file:"emoji_145.png"},"[呲牙]":{file:"emoji_07.png"},"[鬼脸]":{file:"emoji_08.png"},"[害羞]":{file:"emoji_09.png"},"[偷笑]":{file:"emoji_10.png"},"[调皮]":{file:"emoji_11.png"},"[可怜]":{file:"emoji_12.png"},"[敲]":{file:"emoji_13.png"},"[惊讶]":{file:"emoji_14.png"},"[流感]":{file:"emoji_15.png"},"[委屈]":{file:"emoji_16.png"},"[流泪]":{file:"emoji_17.png"},"[嚎哭]":{file:"emoji_18.png"},"[惊恐]":{file:"emoji_19.png"},"[怒]":{file:"emoji_20.png"},"[酷]":{file:"emoji_21.png"},"[不说]":{file:"emoji_22.png"},"[鄙视]":{file:"emoji_23.png"},"[阿弥陀佛]":{file:"emoji_24.png"},"[奸笑]":{file:"emoji_25.png"},"[睡着]":{file:"emoji_26.png"},"[口罩]":{file:"emoji_27.png"},"[努力]":{file:"emoji_28.png"},"[抠鼻孔]":{file:"emoji_29.png"},"[疑问]":{file:"emoji_30.png"},"[怒骂]":{file:"emoji_31.png"},"[晕]":{file:"emoji_32.png"},"[呕吐]":{file:"emoji_33.png"},"[拜一拜]":{file:"emoji_160.png"},"[惊喜]":{file:"emoji_161.png"},"[流汗]":{file:"emoji_162.png"},"[卖萌]":{file:"emoji_163.png"},"[默契眨眼]":{file:"emoji_164.png"},"[烧香拜佛]":{file:"emoji_165.png"},"[晚安]":{file:"emoji_166.png"},"[强]":{file:"emoji_34.png"},"[弱]":{file:"emoji_35.png"},"[OK]":{file:"emoji_36.png"},"[拳头]":{file:"emoji_37.png"},"[胜利]":{file:"emoji_38.png"},"[鼓掌]":{file:"emoji_39.png"},"[握手]":{file:"emoji_200.png"},"[发怒]":{file:"emoji_40.png"},"[骷髅]":{file:"emoji_41.png"},"[便便]":{file:"emoji_42.png"},"[火]":{file:"emoji_43.png"},"[溜]":{file:"emoji_44.png"},"[爱心]":{file:"emoji_45.png"},"[心碎]":{file:"emoji_46.png"},"[钟情]":{file:"emoji_47.png"},"[唇]":{file:"emoji_48.png"},"[戒指]":{file:"emoji_49.png"},"[钻石]":{file:"emoji_50.png"},"[太阳]":{file:"emoji_51.png"},"[有时晴]":{file:"emoji_52.png"},"[多云]":{file:"emoji_53.png"},"[雷]":{file:"emoji_54.png"},"[雨]":{file:"emoji_55.png"},"[雪花]":{file:"emoji_56.png"},"[爱人]":{file:"emoji_57.png"},"[帽子]":{file:"emoji_58.png"},"[皇冠]":{file:"emoji_59.png"},"[篮球]":{file:"emoji_60.png"},"[足球]":{file:"emoji_61.png"},"[垒球]":{file:"emoji_62.png"},"[网球]":{file:"emoji_63.png"},"[台球]":{file:"emoji_64.png"},"[咖啡]":{file:"emoji_65.png"},"[啤酒]":{file:"emoji_66.png"},"[干杯]":{file:"emoji_67.png"},"[柠檬汁]":{file:"emoji_68.png"},"[餐具]":{file:"emoji_69.png"},"[汉堡]":{file:"emoji_70.png"},"[鸡腿]":{file:"emoji_71.png"},"[面条]":{file:"emoji_72.png"},"[冰淇淋]":{file:"emoji_73.png"},"[沙冰]":{file:"emoji_74.png"},"[生日蛋糕]":{file:"emoji_75.png"},"[蛋糕]":{file:"emoji_76.png"},"[糖果]":{file:"emoji_77.png"},"[葡萄]":{file:"emoji_78.png"},"[西瓜]":{file:"emoji_79.png"},"[光碟]":{file:"emoji_80.png"},"[手机]":{file:"emoji_81.png"},"[电话]":{file:"emoji_82.png"},"[电视]":{file:"emoji_83.png"},"[声音开启]":{file:"emoji_84.png"},"[声音关闭]":{file:"emoji_85.png"},"[铃铛]":{file:"emoji_86.png"},"[锁头]":{file:"emoji_87.png"},"[放大镜]":{file:"emoji_88.png"},"[灯泡]":{file:"emoji_89.png"},"[锤头]":{file:"emoji_90.png"},"[烟]":{file:"emoji_91.png"},"[炸弹]":{file:"emoji_92.png"},"[枪]":{file:"emoji_93.png"},"[刀]":{file:"emoji_94.png"},"[药]":{file:"emoji_95.png"},"[打针]":{file:"emoji_96.png"},"[钱袋]":{file:"emoji_97.png"},"[钞票]":{file:"emoji_98.png"},"[银行卡]":{file:"emoji_99.png"},"[手柄]":{file:"emoji_100.png"},"[麻将]":{file:"emoji_101.png"},"[调色板]":{file:"emoji_102.png"},"[电影]":{file:"emoji_103.png"},"[麦克风]":{file:"emoji_104.png"},"[耳机]":{file:"emoji_105.png"},"[音乐]":{file:"emoji_106.png"},"[吉他]":{file:"emoji_107.png"},"[火箭]":{file:"emoji_108.png"},"[飞机]":{file:"emoji_109.png"},"[火车]":{file:"emoji_110.png"},"[公交]":{file:"emoji_111.png"},"[轿车]":{file:"emoji_112.png"},"[出租车]":{file:"emoji_113.png"},"[警车]":{file:"emoji_114.png"},"[自行车]":{file:"emoji_115.png"}};
    export default {
        name: "onlineVue",
        data() {
          return {
            personList: [],
            detailObj: null,
            im:null,
            currentId: localStorage.getItem('nim_token'),
            currentChatObj: null,//记录当前聊天对象
          }
        },
      components: {
        chatItem,
        chatDail
      },
      mounted() {

        let that = this;
        let obj = {onmsg:this.onmsg,onconnect:fn};
        this.im = new Im(obj);
        function fn(res) {//链接成功的回调
          that.getLocalsesseions();
        }
        this.getLocalsesseions();
      },
      methods: {
        toggleChat(item){//切换聊天
          this.matches(item.chatObj.list);//转义表情
          this.detailObj = item.chatObj;
          item.unread = 0;
          this.currentChatObj = item.to;
        },
        getLocalsesseions() {
          this.im.getLocalSessions((error, obj) => {
            if(error)return;
            let sessions = obj.sessions; // 获取所有会话记录 最后一次聊天
            let s1 = sessions.filter(item => item.to !== localStorage.getItem('nim_token'));//过滤非自己所发的消息
            s1.forEach(item => {
              this.im.getUser(item.to ,(user)=> {//获取相关的用户信息
                this.im.getHistoryMsgs(item.to,(err,res)=> {
                  if(err)return;
                  let itemObj = [...res.msgs];
                  let newObj = {//初始化格式
                    to: item.to,
                    nick: user.nick,
                    unread: 0,
                    chatObj: {
                      to: item.to,
                      nick: user.nick,
                      list: itemObj
                    }
                  };
                  this.personList.push(newObj);
                });
              });
            });
          });
        },
        sendMsg( msg ){//发送消息
          this.im.sendTextMessage('p2p',msg.id, msg.text, false,(err,event)=> {
              if(err)return;
              let current = this.personList.find(item =>  item.to == msg.id );//找到当前发送对象，更新
              current.chatObj.list.push(event);
              this.matches(current.chatObj.list);//转义表情
          } )
        },
        onmsg(event) {//接收消息
          if(event) {
            this.im.getUser(event.from,(obj)=> {
              event.name = obj.nick;
              if(this.personList.length){
                for (let i = 0,len = this.personList.length; i < len; i++) {
                  if( this.personList[i].to == event.from){
                    let arr = [...this.personList[i].chatObj.list,Object.assign({},event)];
                    this.personList[i].chatObj.list = arr;
                    if(this.currentChatObj == event.from ){
                      this.matches(this.personList[i].chatObj.list);//转义表情
                      this.detailObj = this.personList[i].chatObj;
                    }else {
                      this.personList[i].unread += 1 ;
                    }
                    this.personList.splice(i,1,this.personList[i]);//更新聊天列表
                    return;
                  }
                };
              };
              let newObj = {//初始化格式
                to: event.from,
                nick: event.fromNick,
                unread: 1,
                chatObj: {
                  to: event.from,
                  nick: event.fromNick,
                  list: [event]
                }
              };
              this.personList.push(newObj);

            })
          }
        },
        matches(arr){
          arr.forEach(item => {
            if(item.text) {
              let value = item.text;
              var re = /\[([^\]\[]*)\]/g;
              var matches = value.match(re) || [];
              for (var j = 0, len = matches.length; j < len; ++j) {
                if(emoji1[matches[j]]){
                  value = value.replace(matches[j], '<img class="emoji" src="./static/emoji/' + emoji1[matches[j]].file + '" />');
                }
              }
              item.text1 = value;
            }
          });
          return arr;
        },
        delSession(id) {
          this.im.deleteLocalSession(id,(err, obj)=> {
            let index = this.personList.findIndex(item => id == item.to);
            this.personList.splice(index,1,'');
            this.detailObj = null;
            this.currentChatObj = null;
          })
        }
      }
    }
</script>

<style scoped lang="scss">
  .c-box-online {
    display: inline-block;
    width:280px;
  }
  .c-card-header {
    color: white;
    text-align: center;
  }
  .c-info-detail {
    display: inline-block;
    width: calc(100% - 290px);
    vertical-align: top;
  }
</style>
