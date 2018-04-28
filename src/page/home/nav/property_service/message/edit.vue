<template>
  <el-dialog title="提示" :visible.sync="msg" :before-close="handleClose">
    <h2>审核管理设置</h2>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">

        <el-form-item label-width="120px" label="审核管理设置" prop="a"> 
            <el-switch
                v-model="form.AUTOAUDITMOMENT"
                active-text="关闭"
                inactive-text="开启"
                class="c-isClose">
            </el-switch>
            <p class="c-tip">请严格管理社区住户发言，不建议关闭审核设置</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="动态举报设置"></el-form-item> 

        <el-form-item label-width="120px"  label="提醒举报数:" prop="MOMENTWARNINGREPORTNUM"> 
            <el-input type="number" v-model="form.MOMENTWARNINGREPORTNUM"  min='1' max='100'></el-input>
            <p class="c-tip">当举报数达到该数量后将提醒您</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="屏蔽举报数:" prop="MOMENTSHIELDINGREPORTNUM"> 
            <el-input type="number" v-model="form.MOMENTSHIELDINGREPORTNUM" min='1' max='100'></el-input>
            <p class="c-tip">当举报数达到该数量后将自动屏蔽动态</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="评论举报设置" ></el-form-item> 

        <el-form-item label-width="120px"  label="提醒举报数:" prop="COMMENTWARNINGREPORTNUM"> 
            <el-input v-model.number="form.COMMENTWARNINGREPORTNUM"  min='1' max='100'></el-input>
            <p class="c-tip">当举报数达到该数量后将提醒您</p>
        </el-form-item> 

        <el-form-item label-width="120px"  label="屏蔽举报数:" prop="COMMENTSHIELDINGREPORTNUM"> 
            <el-input v-model.number="form.COMMENTSHIELDINGREPORTNUM" min='1' max='100'></el-input>
            <p class="c-tip">当举报数达到该数量后将自动屏蔽评论</p>
        </el-form-item>     



    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="save('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name:'editMessage',
    data() {
      var validatA = (rule, value, callback) => {
        if (value < this.form.MOMENTWARNINGREPORTNUM) {
          callback(new Error('动态提醒举报数必须小于屏蔽举报数!'));
        } else {
          callback();
        }
      };
      var validatB = (rule, value, callback) => {
        if (value < this.form.COMMENTWARNINGREPORTNUM) {
          callback(new Error('评论提醒举报数必须小于屏蔽举报数!'));
        } else {
          callback();
        }
      };
      return {
        arr: [],
        form: {
          communityId: this.$store.getters.communityId,
          AUTOAUDITMOMENT:false,
          MOMENTWARNINGREPORTNUM:null,
          MOMENTSHIELDINGREPORTNUM:null,
          COMMENTSHIELDINGREPORTNUM:null,
          COMMENTWARNINGREPORTNUM:null,
        },
        parms: {},
        rules: {
          MOMENTSHIELDINGREPORTNUM: [
            { validator: validatA, trigger: 'blur' }
          ],
          COMMENTSHIELDINGREPORTNUM: [
            { validator: validatB, trigger: 'blur' }
          ],
        },
      }
    },
    props: ['msg'],
    created() {
      this.getInit();
    },
    methods: {
      handleClose() {
        this.$emit("upsee", false );
      },
      save(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.postData();
          } else {
            return false;
          }
        });
      },
      postData() {
        this.arr.forEach((item,index) => {
          item.value = this.form[item.key];
        });
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
                this.form.c = +res.data.records[1].value;
                res.data.records.forEach(item => {
                  this.form[item.key] = item.value;
                });
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
