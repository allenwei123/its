<template>
  <div class="c-login-container">
    <div class="bg"></div>
    <div class="login-area">
      <div class="header"><h2>后台登录</h2></div>
      <div class="form">
        <div class="form-item">
          <input type="text" placeholder="用户名" v-model.trim="phone" autofocus />
        </div>
        <div class="form-item">
          <input type="password" placeholder="密码" v-model.trim="pwd" />
        </div>
      </div>
      <div class="footer">
        <button type="button" @click="login">登 录</button>
      </div>
    </div>
    <el-dialog
      title="请选择社区"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-select v-model="value" placeholder="请选择" @change="change">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { Loading } from 'element-ui';
  export default {
    name: 'login',
    data() {
      return {
        phone: '',
        pwd: '',
        dialogVisible: false,
        options:[] ,//社区列表
        // value: null ,//当前 社区
        value: localStorage.getItem('communityId') ? localStorage.getItem('communityId') : null
      }
    },
    methods: {
      login() {
        if (!this.phone.length || !this.pwd.length) {
          this.$message({
            message: '账号和密码不能为空',
            type: 'warning'
          });
          return;
        }

        let loadingInstance = Loading.service();

        this.$xttp.post('user/signIn', {
          phone: this.phone,
          pwd: this.pwd
        }).then((res) => {
          this.$store.dispatch('changeToken', res.data);
          if (res.errorCode === 0) {
            const userId = res.data.id;
            //获取用户对应的社区id列表
            this.$xttp.get(`community/${userId}/queryByUserId`)
              .then(res => {
                if(!res.errorCode) {
                  res.data.forEach(item => {
                    let obj = {
                      name: item.name,
                      id: item.id,
                      propertyId: item.propertyId
                    };
                    this.options.push(obj);
                  });
                  this.dialogVisible = true;
                  this.$store.dispatch('cgCommunityList', this.options);
                  // console.log(this.options);
                }
              })
          }
          this.pwd = '';
          loadingInstance.close();
        }).catch(() => {
          loadingInstance.close();
        });
      },
      change(value){
        let name = this.options.find(item => item.id === this.value)['name'];
        let propertyId = this.options.find(item => item.id === this.value)['propertyId'];
        localStorage.setItem('communityName',name);
        localStorage.setItem('propertyId',propertyId);
      },
      handleClose() {
        this.dialogVisible = false;
      },
      comfirm() {
        if(this.value) {
          console.log(this.value);
          this.$store.dispatch('addCommunityId',this.value);
          this.dialogVisible = false;
          this.$router.push('/home');
        }else {
          this.$message('请选择社区');
        }
      }
    }
  }
</script>

<style scoped>
  .c-login-container {
    width: 450px;
  }
  .bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/login-bg.jpg');
    background-size: cover;
    background-position: center;
    filter: brightness(25%);
    z-index: -1;
  }
  .login-area {
    width: 420px;
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -126px;
    margin-left: -210px;
  }

  .login-area .header h2 {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    background-color: #eee;
    font-size: 18px;
    font-weight: bold;
  }

  .login-area .form {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
  }
  .login-area .form .form-item input {
    border: none;
    border-bottom: 1px solid #ddd;
    height: 44px;
    width: 100%;
    font-size: 14px;
  }

  .login-area .footer {
    padding: 30px 20px;
  }
  .login-area .footer button {
    background-color: #f71e43;
    width: 100%;
    height: 44px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
</style>
