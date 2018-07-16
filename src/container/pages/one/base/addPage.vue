<template>
  <el-main class="c-form">
      <div class="c-navDetail clear">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(nav, index) in navDetailData" :to="nav.router" :key="index">{{ nav.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="c-new-body">
          <div class="c-form-body">
              <div class="c-steps-box">
                <el-steps :active="1" simple align-center style="background: #fff">
                    <el-step title="填写基础信息" ></el-step>
                    <el-step title="关联物业账号" ></el-step>
                    <el-step title="完善楼栋详情" ></el-step>
                    <el-step title="完成项目新增" ></el-step>
                </el-steps>
            </div>
          </div>
      </div>
  </el-main>
</template>

<script>
  export default {
    name: 'addPage',
    data() {
      return {
        navDetailData: [ {id: 0, name: "项目管理" }, {id: 1, name: '新增'}],
        data:''
      }
    },
    methods: {
      
    },
    created() {

    }
  }
</script>

<style scoped>
  .c-steps-box {
      border-bottom: 1px solid #e8e8e8;
      padding: 15px;
  }
</style>
