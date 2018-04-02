<template>
  <div class="content c-bigDialog">
    <el-dialog :title="titleFont" :visible.sync="isShow" :before-close="handleClose">
      <div class="c-dBody printOrder-data">
        <p>尊敬的业主:</p>
        <p class="c-t-indent">为了更好的提供优质的服务，办理入住时请携带您的相关资料填写业主概况表，我们将为您提供全面、细致、高效服务，谢谢您的配合！</p>
        <h1 class="c-ta-center">物业服务有限公司</h1>
        <h2 class="c-ta-center">业主（租户）概况登记表</h2>
        <p>项目名称：</p>
        <div class="c-table">
          <ul class="c-dp-fx c-fx-column">
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">业主（租户）姓名</li>
                <li class="c-td">{{ data.userToRoom.name }} </li>
                <li class="c-td">性别</li>
                <li class="c-td">{{ data.userToRoom.sex | sex }}</li>
                <li class="c-td">出生年月</li>
                <li class="c-td">{{ data.userToRoom.birthday }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">房号</li>
                <li class="c-td c-fx-5 c-dp-fx">{{ data.userToRoom.roomLocation }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">电话</li>
                <li class="c-td c-fx-2">{{ data.userToRoom.phone }}</li>
                <li class="c-td">固话</li>
                <li class="c-td c-fx-2">{{ data.userToRoom.telPhone }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">身份证号</li>
                <li class="c-td c-fx-2">{{ data.userToRoom.identityCard }}</li>
                <li class="c-td ">合同编号</li>
                <li class="c-td c-fx-2">{{ data.userToRoom.contract }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">户口所在地</li>
                <li class="c-td c-fx-2">{{ data.userToRoom.householdAddress }}</li>
                <li class="c-td ">工作单位</li>
                <li class="c-td c-fx-2">{{ data.userToRoom.workUnit }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">入户时间</li>
                <li class="c-td c-fx-2">{{ data.userToRoom.checkInTime }}</li>
                <li class="c-td">住房面积</li>
                <li class="c-td">{{ data.userToRoom.area }}</li>
                <li class="c-td">政治面貌</li>
                <li class="c-td">{{ data.userToRoom.politicsStatus | politicsStatus }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">现住址</li>
                <li class="c-td c-fx-5">{{ data.userToRoom.currentAddress }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr" v-for="item in data.carList" :key="item.id">
                <li class="c-td">车牌号码</li>
                <li class="c-td c-fx-2">{{ item.carNo }}</li>
                <li class="c-td">车颜色</li>
                <li class="c-td">{{ item.carColor }}</li>
                <li class="c-td">车型</li>
                <li class="c-td">{{ item.carType }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">经常驾驶此车的人士</li>
                <li class="c-td c-fx-5">{{ data.aa }}</li>
              </ul>
            </li>
            <li>
              <ul class="c-dp-fx c-tr">
                <li class="c-td">其他</li>
                <li class="c-td c-fx-5">{{ data.remake }}</li>
              </ul>
            </li>
          </ul>
        </div>
        <p>入住时间：</p>
        <h3 class="c-ta-center">常住人口（包括业主本人）登记</h3>
        <div class="c-table">
          <div class="c-dp-fl c-fx-column">
            <ul>
              <li>
                <ul class="c-dp-fx c-tr">
                  <li class="c-td c-ta-center">姓名</li>
                  <li class="c-td c-ta-center">性别</li>
                  <li class="c-td c-ta-center">出生年月</li>
                  <li class="c-td c-ta-center">关系</li>
                  <li class="c-td c-ta-center c-flex-200">身份证号</li>
                  <li class="c-td c-ta-center">户口所在地</li>
                  <li class="c-td c-ta-center">职业</li>
                </ul>
              </li>
              <li>
                <ul class="c-dp-fx c-tr" v-for="item in data.inhabitantList" :key="item.id">
                  <li class="c-td c-ta-center">{{ item.name }}</li>
                  <li class="c-td c-ta-center">{{ item.sex | sex }}</li>
                  <li class="c-td c-ta-center">{{ item.birthday }}</li>
                  <li class="c-td c-ta-center">{{ item.filterRelationship }}</li>
                  <li class="c-td c-ta-center c-flex-200">{{ item.identityCard }}</li>
                  <li class="c-td c-ta-center">{{ item.householdAddress }}</li>
                  <li class="c-td c-ta-center">{{ item.profession }}</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="save">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "print",
  data() {
    return {
      titleFont: "打印内容",
      isShow:this.msg
    };
  },
  created() {
    this.data.inhabitantList.forEach(item => {
        switch(item.relationship) {
          case 1:
            item.filterRelationship = '业主';
            break;
          case 2:
            item.filterRelationship = '家属';
            break;
          case 3:
            item.filterRelationship = '租客';
            break;
        }
    });
    if( this.data.carList.length < 3 ) {
      (function f(arr){
        if( arr.length < 3 ) {
          arr.push({id:Math.floor(Math.random()*1000)});
          f(arr);
        }else {
          return ;
        }
      })(this.data.carList);
    }
    if( this.data.inhabitantList.length < 3 ) {
      (function f(arr){
        if( arr.length < 3 ) {
          arr.push({id:Math.floor(Math.random()*1000)});
          f(arr);
        }else {
          return ;
        }
      })(this.data.inhabitantList);
    }
  },
  props: ["data","msg"],
  methods: {
    handleClose() {
      this.isShow = false;
      this.$emit("upup", false );
    },
    save() {
      var newstr = document.getElementsByClassName("printOrder-data")[0]
        .innerHTML;
      var oldstr = document.body.innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      document.body.innerHTML = oldstr;
      window.location.reload()
      return false;
    }
  }
};
</script>

<style scoped lang="scss">
.content {
  width: 100%;
}
.c-body {
  width: 90%;
}
.c-ta-center {
  text-align: center;
}
.c-t-indent {
  text-indent: 2rem;
}
.c-dp-fx {
  display: flex;
}
.c-fx-column {
  flex-direction: column;
  .c-tr {
    & > :nth-child(1) {
      border-left: 1px solid black;
      flex:0 0 150px;
    }
  }
}
.c-table {
  & > :nth-child(1) {
    border-top: 1px solid black;
  }
  .c-fx-5 {
    // flex: 0 0 82.8%;
    flex:0 0 calc(100% - 150px)
  }
  .c-fx-2 {
    flex: 2;
  }
}
.c-td {
  flex: 1;
  padding: 0 5px;
  box-sizing: border-box;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  line-height: 30px;
  min-height: 35px;
}
.c-span {
  flex: 1;
  text-align: right;
}
.c-flex-200 {
  flex: 0 0 200px;
}
</style>
