<template>
  <el-dialog title="新增卡片" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm"  label-width="120px">
      <el-form-item label="卡号" prop="keyNo" required>
        <el-input v-model="form.keyNo" auto-complete="off" placeholder="请输入12位卡号"></el-input>
      </el-form-item>

      <el-form-item label="卡类型" label-width="120px" prop="value1" required>
        <el-select v-model="form.value1"  clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="角色" label-width="120px"  prop="value2" required>
        <el-select v-model="form.value2"  clearable @change="role">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属员工" label-width="120px" prop="value3" required>
        <el-select v-model="form.value3"  clearable>
          <el-option v-for="item in options3" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>
     
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>    
  </el-dialog>
</template>

<script>
import time from "@/utils/time.js";
    export default {
        data() {
          return {
            form: {
              value1: '',
              value2: '',
              value3: '',
              keyNo: ''
            },
            value: '',
            makeAt: '',
            //卡片
            options: [ {
              value: '2',
              label: '蓝牙卡'
            }, {
              value: '4',
              label: 'IC卡'
            }],
            //角色 
            options2: [ {
              value: 'MANAGER',
              label: '物业管理员'
            }, {
              value: 'SECURITY',
              label: '保安'
            } , {
              value: 'CLEANER',
              label: '保洁'
            } , {
              value: 'SERVICEMAN',
              label: '维修工'
            } , {
              value: 'SUPPORTSTAFF',
              label: '客服人员'
            }],
            //员工
            options3: '',
            rules: {
              keyNo: [{required: true, message: '请输入卡号', trigger: 'blur'}],
              value1: [{ required: true, message: '请选择卡类型', trigger: 'blur' }],
              value2: [{ required: true, message: '请输入角色', trigger: 'blur' }],
              value3: [{ required: true, message: '请选择员工', trigger: 'blur' }],
            },
            userToRoomId: '',    
          }
        },
        methods: {
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.postData();
                } else {
                  return false;
                }
            });
          },
          role() {
            let url = `user/property/${this.$store.getters.communityId}/user-list?postCode=${this.form.value2}`;
            this.$xttp.get(url).then(res => {
              if(res.errorCode === 0) {
                this.loading = false;
                this.options3 = res.data;
              }
            }).catch( () => {
              this.loading = false;
            })
          },
          handleClose() {
              this.$emit('change');
          },
          getTime(timestamp, format) {
              if (timestamp == null) return "/";
              return time.timestampToFormat(timestamp, format);
          },
          postData() {
            let url = `room/query-by-user`;
            let obj = {communityId:this.$store.getters.communityId,userId:'5aa733d4e4b0274d66f17e9c'};
            // let url = `user/property/${this.$store.getters.communityId}/user-list?postCode=${this.form.value2}`;
            this.$xttp.post(url, obj).then(res => {
              if(res.errorCode === 0) {
                this.loading = false;
                this.userToRoomId = res.data[0].id;
                
                //获取id后再去申请卡片 卡片控制12位
                let url = `user/card/add/${this.userToRoomId}`;
                let obj = {
                  "keyType": this.form.value1,
                  "communityId": this.$store.getters.communityId,
                  "rooms": [{
                    "expireTime": 3000,
                    "roomId": "5aa63af1e4b090a181f4c628"
                  }],
                  "processTime": 214748368,
                  "userId": "5aa733d4e4b0274d66f17e9c",
                  "keyNo" : this.form.keyNo
                }
                if(obj.keyNo.length !== 12){
                  this.$message({
                    message: "请输入12位卡号",
                    type: "warning"
                  });
                  return;
                }
                console.log(obj.keyNo.length);
                this.$xttp.post(url, obj).then( res=> {
                  if (res.errorCode === 0) {
                    this.$message({
                      message: "新增成功",
                      type: "success"
                    });
                    this.handleClose();
                    this.$emit('addSuccess');
                  }else {
                    this.$message({message:res.data.errorMsg,type:'error'});
                  }
                  
                }).catch( () => {
                  this.loading = false;
                })
              }
            }).catch( () => {
              this.loading = false;
            })
          },

        },
        created() {
          
        },
        props: ['msg'],
    }
    
</script>

<style scoped lang="scss">

</style>
