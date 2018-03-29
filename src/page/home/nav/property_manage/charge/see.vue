<template>
    <el-dialog title="查看详情" :visible.sync="msg" :before-close="handleClose">
        <el-form ref="ruleForm" :model="form" class="demo-form-inline">
            <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="itemName" class="c-must">
              <el-input v-model="form.itemName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="计费规则：" :label-width="formLabelWidth" prop="itemName" class="c-must">
              <el-input v-model="form.type"></el-input>
            </el-form-item> -->
            <el-table class="c-table" :data="tableData" style="width: 100%" v-loading="loading" stripe>
                <el-table-column v-if="isShow" label="ID" width="120" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="楼栋" width="120" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">{{scope.row.buildingName}}</template>
                </el-table-column>
                <el-table-column label="价格(元)" min-width="80" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">{{ scope.row.unitPrice / 10000 }}</template>
                </el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini"  @keyup="textChange" @click="editPrice(scope.row)">修改价格</el-button>
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
        isShow: false,
        form:{
            itemName: ''
        },
        status:'',
        loading: false,
        arr:[1,2,4,5],
        tableData: [],
        page:1,
        pageSize: 100,
        currentPage: 1
            
    }
  },
  props: ["msg","detail"],
  created(){
    this.getTableList();
  },
  methods:{
      //过虐input
      textChange(){
          console.log(888)
      },
      handleClose() {
        this.$emit("upsee", false );
      },
      getTableList() {
        let feeItemId = this.detail.id;
        let communityId = this.$store.getters.communityId;
        this.form.itemName = this.detail.itemName;
        this.loading = true;
        let url = `/fees/rule/${communityId}/page?page=${this.currentPage}&size=${this.pageSize}&feeItemId=${feeItemId}`
        this.$xttp.get(url).then(res => {
            this.loading = false;
            if (res.success) {
                this.tableData = res.data.records;
                this.loading = false;
            }else{

            }
        }).catch(() => {
            this.loading = false;
        })
      },
      editPrice(row){
          
          let Id = row.id;
          let url = `/fees/rule/${Id}/edit`;

          this.$prompt('请输入价格', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            inputPattern: /^[+|-]?\d*\.?\d*$/,
            inputErrorMessage: '请输入数字类型',
            }).then(({ value }) => {
                let unitPrice = value * 1000;
                console.log(unitPrice);
                this.$xttp.get(url,{params:{unitPrice:unitPrice}}).then(res => {
                    if(res.success){
                        this.getTableList();
                    }
                })
        }).catch(() => {
            // this.$message({
            //     type: 'info',
            //     message: '取消修改价格'
            // });       
        });
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