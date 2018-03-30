<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">

            <el-form-item label="收费标准：" :label-width="formLabelWidth" prop="chargeStandard" class="c-must">
              <el-select v-model="form.chargeStandard">
                <el-option
                  v-for="item in chargeStandardOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="缴费周期(天)：" :label-width="formLabelWidth" prop="payCycle" class="c-must">
              <el-select v-model="form.payCycle" clearable placeholder="选择缴费周期">
                <el-option
                  v-for="item in paySycleOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="账单生成日：" :label-width="formLabelWidth" prop="billDate" class="c-must">
              <el-col :span="10">
                  <el-input type="number" v-model="form.billDate" step="1" max="28" min="1" placeholder="请选择账单生成日" ></el-input>
              </el-col>
              
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
  name: "ChargeAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'周期管理',
      isShow: false,
      form: {
        chargeStandard: '按月收费',
        payCycle: '',
        billDate: ''
      },
      rules: {
        itemName: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
        type: [{ required: true, message: '请选择计费规则', trigger: 'blur'}],
        unitPrice: [{required: true, message: '请输入单价', trigger: 'blur'}]
      },
      chargeStandardOptions:[{id:1,name:'按月收费'}],
      paySycleOptions:[{id:1,name:'30'},{id:2,name:'45'},{id:3,name:'60'},{id:4,name:'90'}]
    };
  },
  props: ["msg","add","projectData"],
  created() {  
      this.getInit(); 
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upcycle", this.current );
    },
    getInit(){
        let communityId = this.$store.getters.communityId;
        let params = {};
        params['communityId'] = communityId;
        // let url = '/property/parameter/page';
        console.log(params);

        this.loading = true;
        this.$xttp.post("/property/parameter/page",params).then(res => {
            if (res.success){
                this.form.payCycle = res.data.records[0].value;
                this.form.billDate = res.data.records[1].value;
                this.loading = false;
            }
        })
    },
    save() {
      let msg = this.add ? '编辑' : '添加';
      let uri = this.add ? '/community/edit' : '/fees/item-rule/addAll';
      let params = {};
      let communityId = this.$store.getters.communityId;
      let propertyId = localStorage.getItem('propertyId');
      let itemName = this.form.itemName;
      let type = this.form.type;
      if(type != 3){  
        let unitPrice = this.form.unitPrice.toFixed(2);
        params['unitPrice'] = parseInt(unitPrice * 10000);
      }else{
        let unitPrice = 0;
        params['unitPrice'] = unitPrice;
      }
      let floorSer = this.form.floorSer;
      params['communityId'] = communityId;
      params['propertyId'] = propertyId;
      params['itemName'] = itemName;
      params['type'] = type;     
      params['floorSer'] = floorSer;
      
      this.$xttp.post(uri,params)
        .then(
          res => {
            if(res.success){
              this.$message({
                message: msg + "项目成功",
                type: "success"
              });
              this.current =  2;
              this.handleClose();
              this.$emit('reload');
            }else{
              this.$message({message:res.data.errorMsg,type:'error'});
            }
          }).catch(err =>{
            console.log(err);
          })

    },
    selectCommunity(num){
      let obj = { communityId:this.$store.getters.communityId };
      this.$xttp.get(`/community/building/list`,{params:obj})
        .then(res => {
          if(res.success){
            this.floorOptions = res.data;
            this.form.floorSer = this.floorOptions[0].id;
          }
        })
    },
    chargeType(){
      let url = '/fees/rule-types';
      this.$xttp.get(url).then(res => {
        if(res.success){
          this.chargeTypesOptions = res.data.ruleTypes;
        }
      })
    },
    changeTypeOptions(item) {
      if(item.key != 3 ){
        this.isShow = true;
      }
      if(item.key == 3 && this.isShow == true){
        this.isShow = false;
        this.form.unitPrice == '0';
      }
    },
    handleChange(value){
      let price = value.toFixed(2);
      this.form.unitPrice = price * 10000;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


