<template>
  <el-container>
    <el-main>
      <div class="c-notice-container">
        <div class="c-searchbar">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="class" placeholder="请选择班次">
                <el-option ><el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input placeholder="请输入名称" type="input" v-model.trim="name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>


    </el-main>
  </el-container>
</template>
