<template>
  <el-container class="box">
    <el-header>
        <div>
          <el-button >列表</el-button>
          <el-button type="primary" >设置节点</el-button>
          <el-button >编辑</el-button>
          <el-button>删除</el-button>
          <el-button>查看详情</el-button>
          <el-button>发起任务</el-button>
          <el-button>编辑节点状态</el-button>
          <el-button>导入节点</el-button>
          <el-button>导出节点</el-button>
        </div>
    </el-header>
    <el-main>
        <el-row :gutter="15">
          <el-col :span="8" class="marTop">
            <span>所属项目组：</span>
            <el-input
              placeholder="请输入内容" class="eCol">
            </el-input>
          </el-col>
          <el-col :span="8" class="marTop">
            <span>功能模块：</span>
            <el-input
              placeholder="请输入内容" class="eCol">
            </el-input>
          </el-col>
          <el-col :span="8" class="marTop">
            <span>功能优先级：</span>
            <el-input
              placeholder="请输入内容" class="eCol">
            </el-input>
          </el-col>
          <el-col :span="8" class="marTop">
            <span>执行人：</span>
            <el-input
              placeholder="请输入内容" class="eCol">
            </el-input>
          </el-col>
          <el-col :span="8" class="marTop">
            <span>任务类型：</span>
            <el-input
              placeholder="请输入内容" class="eCol">
            </el-input>
          </el-col>

        </el-row>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>

  export default {
    name: 'Con1',
    data() {
      return {
        a:''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    background: #fff;
    padding-top:10px;
  }
  .eCol {
    max-width:200px;
  }
  .marTop {
    margin-top:10px;
    span {
      display: inline-block;
      text-align: right;
      min-width:90px;
    }
  }
</style>
