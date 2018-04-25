<template>
  <el-dialog title="提示" :visible.sync="msg" :before-close="handleClose">
    <h2>审核管理设置</h2>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">

        <el-form-item label-width="120px" label="审核管理设置" prop="a"> 
            <el-switch
                v-model="form.a"
                active-text="开始"
                inactive-text="关闭"
                class="c-isClose">
            </el-switch>
            <p class="c-tip">关闭后住户发布动态将自动通过系统审核</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="动态举报设置"></el-form-item> 

        <el-form-item label-width="120px"  label="提醒举报数:" prop="b"> 
            <el-input type="number" v-model="form.b"  min='0'></el-input>
            <p class="c-tip">当举报数达到该数量后将提醒您</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="屏蔽举报数:" prop="c"> 
            <el-input type="number" v-model="form.c" min='0'></el-input>
            <p class="c-tip">当举报数达到该数量后将自动屏蔽动态</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="评论举报设置" ></el-form-item> 

        <el-form-item label-width="120px"  label="提醒举报数:" prop="d"> 
            <el-input v-model.number="form.d"  min='0'></el-input>
            <p class="c-tip">当举报数达到该数量后将提醒您</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="屏蔽举报数:" prop="e"> 
            <el-input v-model.number="form.e" min='0' auto-complete="off"></el-input>
            <p class="c-tip">当举报数达到该数量后将自动屏蔽评论</p>
        </el-form-item>     



    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name:'editMessage',
    data() {
      return {
        arr: [],
        form: {
          communityId: this.$store.getters.communityId,
          a:false,
          b:null,
          c:null,
          d:null,
          e:null,
        },
        parms: {},
        rules: {
          ad: [{required: true, message: '请输入举报数量'},{ type: 'number', message: '年龄必须为数字值'}],
        },
      }
    },
    props: ['msg'],
    created() {
      this.getInit();
    },
    methods: {
      submitForm(formName) {
        this.postData();
      },
      handleClose() {
        this.$emit("upsee", false );
      },
      postData() {
        let params = {};
        this.arr.forEach((item,index) => {
          switch(index){
            case 0: 
              item.value = this.form.a;
              break;
            case 1: 
              item.value = this.form.b;
              break;
            case 2: 
              item.value = this.form.c;
              break;
            case 3: 
              item.value = this.form.d;
              break;
            case 4: 
              item.value = this.form.e;
              break;
          }
        })
        let uri = '/property/parameter/multi-edit';
        this.$xttp.post(uri,this.arr)
          .then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.handleClose();
            }else {
              this.$message({message:res.data.errorMsg,type:'error'});
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      getInit(){
        let communityId = this.$store.getters.communityId;
        let params = {};
        params['communityId'] = communityId;
        params['type'] = 2;
        this.$xttp.post("/property/parameter/page",params).then(res => {
            if (res.success){
                this.form.a = res.data.records[0].value ==="false" ? false : true;
                this.form.b = +res.data.records[1].value;
                this.form.c = +res.data.records[2].value;
                this.form.d = +res.data.records[3].value;
                this.form.e = +res.data.records[4].value;
                this.arr = res.data.records.map((item,index) => {
                   let o = {};
                   o['key'] = item.key;
                   o['id'] = item.id;
                   o['name'] = item.name;
                   if(index == 0) {
                     o['value'] = item.value ==="false" ? false : true;
                   }else {
                     o['value'] = +item.value;
                   }
                   return o;
                 });
            }
        })
    },
    }
  }
</script>

<style scoped lang="scss">
    h2 {
        text-align: center;
        line-height: 30px;
        height: 30px;;
    }
    .c-isClose {
        position: absolute;
        right: 0px;
        top: 15px;
    }
    .c-tip {
        position: absolute;
        bottom: -32px;
        right: 0px;
        color:gray;
        font-size: 12px;
    }
</style>
