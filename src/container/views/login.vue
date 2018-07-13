<template>
  <div class="c-login-container">
    <div class="bg"></div>
    <div class="login-area">
      <div class="header">
        <img src="@/assets/login_logo.png" alt="">
      </div>
      <div class="form">
        <div class="form-item">
           <el-input
            placeholder="用户名"
            v-model.trim="phone">
            <img slot="prefix" class="c-ip-img" src="@/assets/user-ip.png" alt="">
          </el-input>
        </div>
        <div class="form-item">
          <el-input
            placeholder="密码"
            type="password" 
            v-model.trim="pwd">
            <img slot="prefix" class="c-ip-img" src="@/assets/psw-ip.png" alt="">
          </el-input>
        </div>
      </div>
      <div class="footer">
        <button type="button" @click="login">登 录</button>
      </div>
    </div>
    <el-dialog
      title="请选择社区"
      :visible.sync="dialogVisible"
      width="34%"
      :before-close="handleClose">
      <el-select v-model="value" class="select" placeholder="请选择" @change="change">
        <el-option
          v-for="item in options"
          :key="item.name"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="comfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/api/user'
  import { Loading } from 'element-ui';
  export default {
    name: 'login',
    data() {
      return {
        phone:localStorage.getItem('userInfo') ? localStorage.getItem('userInfo').phone : '',
        pwd: '',
        dialogVisible: false,
        options:[] ,//社区列表
        // value: null ,//当前 社区
        value: null
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

        api.login({
          phone: this.phone,
          pwd: this.pwd
        }).then((res) => {
          this.$store.dispatch('changeToken', res.data);
          if (res.errorCode === 0) {
            const userId = res.data.id;
            this.$router.push('/home');
            //获取用户对应的社区id列表
            // this.options = [];
            // this.$xttp.get(`community/${userId}/queryByUserId`)
            //   .then(res => {
            //     if(!res.errorCode) {
            //       res.data.forEach(item => {
            //         let obj = {
            //           name: item.name,
            //           id: item.id,
            //           propertyId: item.propertyId,
            //           open: item.open
            //         };
            //         this.options.push(obj);
            //       });
            //       this.dialogVisible = true;
            //       this.$store.dispatch('cgCommunityList', this.options);
            //     }
            //   })
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
        let open = this.options.find(item =>item.id === this.value)['open'];
        localStorage.setItem('communityName',name);
        localStorage.setItem('propertyId',propertyId);
        localStorage.setItem('isOpen',open);
      },
      handleClose() {
        this.dialogVisible = false;
        this.options = [];
      },
      comfirm() {
        if(this.value) {
          this.$store.dispatch('addCommunityId',this.value);
          this.dialogVisible = false;
          this.options = [];
          if(this.$route.query.url) {
            this.$router.push(this.$route.query.url);
          }else{
            this.$router.push('/home');
          }
        }else {
          this.$message('请选择社区');
        }
      },
      cancel(){
        this.dialogVisible = false;
        this.options = [];
      }
    }
  }
</script>

<style scoped  lang="scss">
  .c-login-container {
    width: 450px;
  }
  .bg {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 800px;
    background-image: url('../../assets/web.png') ;
    background-size: 100% auto;
    background-repeat:no-repeat;
    background-position: bottom;
    z-index: -1;
  }
  .login-area {
    width: 420px;
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -210px;
  }

  .login-area .header {
    text-align: center;
    h2 {
      height: 50px;
      line-height: 50px;
      font-size: 30px;
      font-weight: bold;
    }
    h3 {
      font-size: 14px;
	    font-weight: normal;
    }
  }

  .login-area .form {
    padding-left: 22px;
    padding-right: 23px;
    padding-top: 53px;
    .form-item {
      margin-top: 20px;
    }
  }
  .c-ip-img {
    width: 15px;
    height: 17px;
    margin-top: 10px;
    margin-left: 5px;
  }

  .login-area .footer {
    padding: 30px 20px;
  }
  .login-area .footer button {
    background-color: #1890ff;;
    width: 100%;
    height: 44px;
    color: #fff;
    font-size: 18px;
    border-radius: 5px;
    cursor: pointer;
  }
  .c-logo {
    width: 30px;
    height: 43px;
    display: inline-block;
    vertical-align: bottom;
    img {
      width: 35px;
    }
  }
  .c-logo-font {
    display: inline-block;
    vertical-align: bottom;
    margin-left: 8px;
  }
  .select{
    width: 234px;
    height: 34px;
  }
</style>
