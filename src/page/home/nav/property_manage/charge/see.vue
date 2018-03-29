<template>
    <el-dialog title="查看详情" :visible.sync="msg" :before-close="handleClose">
        <el-form ref="ruleForm" :model="form" class="demo-form-inline">
            <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="itemName" class="c-must">
              <el-input v-model="form.itemName"></el-input>
            </el-form-item>
            <el-form-item label="计费规则：" :label-width="formLabelWidth" prop="itemName" class="c-must">
              <el-input v-model="form.type"></el-input>
            </el-form-item>
            <el-table class="c-table" :data="tableData" style="width: 100%" v-loading="loading" stripe>
                <el-table-column label="楼栋" width="120" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope"></template>
                </el-table-column>
                <el-table-column label="价格" min-width="80" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">{{ scope.row.unitePrice }}</template>
                </el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini">查看</el-button>
                        <!-- <el-button @click="delHandle(scope.row)" type="danger" size="small">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
  name: "ChargeSee",
  data() {
    return {
        formLabelWidth: "120px",
        form:{
            itemName: '',
            type: '',
        },
        status:'',
        loading: false,
        arr:[1,2,4,5],
        tableData: [],
        page:1,
        pageSize: 20,
        currentPage: 1
            
    }
  },
  props: ["msg","detail"],
  created(){
      let feeItemId = this.detail.id;
      console.log(feeItemId);
      let communityId = this.$store.getters.communityId;
      
      this.loading = true;
    //     let propertyId = localStorage.getItem('propertyId');
        // let url = `/fees/rule/${communityId}/page?page=${this.currentPage}&size=${this.pageSize}`
        let url = `/fees/rule/${communityId}/page?page=${this.currentPage}&size=${this.pageSize}&feeItemId=${feeItemId}`
        this.$xttp.get(url).then(res => {
            this.loading = false;
            console.log(res);
            if (res.success) {
            this.tableData = res.data.records;
            this.status = res.data.records[0].type;
            if(this.status == 1){
                this.form.type == '固定单价';
            }
            if(this.status == 1){
                this.form.type == '固定收费';
            }
            if(this.status == 3){
                this.form.type == '自定义';
            }

            // this.total = res.data.total;
            }
        }).catch(() => {
            this.loading = false;
        })

    //   let itemName = this.detail.itemName;
    //   this.itemName = itemName;
    //   this.type = this.
  },
  methods:{
      handleClose() {
        this.$emit("upsee", false );
      },
      getTableList() {

      }
  }
}
</script>

<style lang="scss" scoped>
    .cell-edit-color{
        color:#2db7f5;
        font-weight: bold;
    }
    .c-list {
        margin-bottom: 15px;
        .c-label {
            display: inline-block;
            width: 100px;
            text-align:right;
        }
        .c-content {
            display: inline-block;
            margin-left: 15px;
            font-weight: bold;
        }
    }
</style>