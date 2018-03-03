<template>
  <div class="footer">
    <el-container>
      <el-footer>
        <el-row :gutter="20">
          <el-col :span="24"><div class="tlc"><i class="el-icon-phone"></i>&nbsp 欢迎联系本人:<i class="email">allenwei123@163.com</i>     </div></el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  export default {
    name:'Footer',
    data() {
      return {
        data:[]
      }
    }
  }

</script>

<style scoped lang="scss">
  .footer {
    margin-top:40px;
  }
  .tlc {
    text-align: center;
  }
  .email {
    font-size:16px;
    font-weight:bolder;
    color:#000;
    cursor:pointer;
  }
</style>
