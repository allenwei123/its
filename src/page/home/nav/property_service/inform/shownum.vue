<template>
  <el-dialog title="举报详情" :visible.sync="msg" :before-close="handleClose">
    <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>

        <el-table-column label="序号" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{(currentPage-1) * pageSize + scope.$index + 1}}</template>
        </el-table-column>

        <el-table-column label="举报时间" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.createAt | time }}</template>
        </el-table-column>

        <el-table-column label="举报原因" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.reason }}</template>
        </el-table-column>

    </el-table>
    <el-pagination
        layout="total, prev, pager, next, jumper" @current-change="postData"
        :total="total" :page-size="pageSize" :current-page.sync="currentPage">
    </el-pagination>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        tableData:[],
        loading: false,
        pageSize: 10,
        total: 0,
        currentPage: 1,
      }
    },
    created() {
      this.postData();
    },
    props: ['msg','data','typeNum'],
    methods: {
      handleClose() {
        this.$emit("uppsee", false );
      },
      postData() {
        let url = `/mom/report/list`;
        this.$xttp
          .post(url,{speechId:this.data.id,type:this.typeNum })
          .then(res => {
            if (res.errorCode === 0) {
              this.tableData = res.data.records;
              this.total = res.data.total;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
</script>

<style scoped>

</style>
