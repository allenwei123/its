<template>
    <el-main>
      <div>
        <ul class="c-navDetail clear">
          <li v-for="(nav, index) in navDetailData" :key="index">{{ nav.name }} <span v-if="index !== navDetailData.length -  1"> > </span></li>
        </ul>
        <div class="c-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
             
            <el-form-item label="社区名称">
              <el-select v-model="formInline.select" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.name" placeholder="楼栋搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="c-addBtn" @click="onSubmit">新增楼栋</el-button>
        </div>
      </div>
      
      <el-table
        class="c-table"
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
        highlight-current-row 
        ref="multipleTable"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="楼栋名称">
        </el-table-column>
        <el-table-column
          prop="code"
          align="center"
          label="楼栋编号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time1"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="220">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
            <el-button @click="editHandle(scope.row)" type="warning" size="small">编辑</el-button>
            <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <transition name="fade1">
        <AddPage v-if="isShow" :msg="isShow" @upup="change" :add.sync="notice"></AddPage>
      </transition>
      <transition name="fade">
        <SeePage v-if="see" :msg="see" @upsee="seeChange"  :data="seeData"></SeePage>
      </transition>
      <el-dialog title="温馨提示" :visible.sync="visible2">
          <p>请问您是否确定删除这条数据吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDel">确定</el-button>
          </div>
      </el-dialog>
    </el-main>
</template>

<script>
import axios from "axios";
import AddPage from "./add";
import SeePage from "./see";
import { mapGetters } from "vuex";
import { communityId } from '@/biz/community';

export default {
  name: "floorFileList",
  data() {
    return {
      isSou: false,
      tableData: [],
      navDetailData: [
        { id: 0, name: "首页" },
        { id: 1, name: "基础管理" },
        { id: 2, name: "楼栋档案" }
      ],
      formInline: {
        name: "",
        select:''
      },
      currentPage: 1,
      loading: false,
      isShow: false, //控制添加页面弹出
      total: 0,//列表总数
      notice:null,//编辑传送的值
      see:false,//控制查看组件弹出
      seeData:null,//查看数据
      options:[],//下拉框数据
      visible2:false,
      delData:null
    };
  },
  computed: mapGetters(["showAside"]),
  components: {
    AddPage,
    SeePage
  },
  methods: {
      
  },
  created() {},
  mounted() {}
};
</script>

<style scoped lang="scss">

</style>
