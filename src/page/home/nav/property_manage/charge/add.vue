<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="itemName" class="c-must">
              <el-input v-model="form.itemName"></el-input>
            </el-form-item>

            <el-form-item label="计费规则：" :label-width="formLabelWidth" prop="type" class="c-must">
              <el-radio-group v-model="form.type">
                <el-radio :label="item.key" :value="item.value" :key="item.value" @change="changeTypeOptions(item)" v-for="(item) in chargeTypesOptions" border>{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="isShow" label="计费单价：" prop="unitPrice" :label-width="formLabelWidth" class="c-must">
              <!-- <el-input v-model="form.unitPrice"></el-input> -->
              <!-- <el-input-number v-model.trim="form.unitPrice" :step="0.01" :min="0.01" @change="handleChange"></el-input-number>&nbsp;&nbsp;(元) -->
              <el-input-number v-model.trim="form.unitPrice" :step="0.01" :min="0.01"></el-input-number>&nbsp;&nbsp;(元)
            </el-form-item>
            <el-form-item label="适用楼栋：" :label-width="formLabelWidth" prop="floorSer" class="c-must">
              <el-select v-model="form.floorSer" disabled="disabled" clearable placeholder="适用所有楼栋">
                <el-option
                  v-for="item in floorOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                </el-option>
              </el-select>
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
      titleFont:'新增项目',
      isShow: true,
      disabled: true,
      form: {
        unitPrice: '0',
        itemName: '',
        type: '',
        floorSer: ''
      },
      rules: {
        itemName: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
        type: [{ required: true, message: '请选择计费规则', trigger: 'blur'}],
        unitPrice: [{required: true, message: '请输入单价', trigger: 'blur'}]
      },
      floorOptions:[],
      chargeTypesOptions: [],
      current: 1 ,//1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg","add","projectData"],
  created() {
    if(this.add){//判断此时组件为 编辑
      // this.cityArr = [this.add.province,this.add.city,this.add.district || '' ];
      this.form = this.add;
      // this.form.cityArr = [this.add.province,this.add.city,this.add.district || '' ];
      this.titleFont = '编辑项目';
      this.form.unitPrice = this.projectData.unitPrice/10000;
      console.log(this.projectData.unitPrice);
      console.log(this.projectData.type);
      this.form.type = this.projectData.type;
      this.form.floorSer = this.projectData.floorSer;
      this.form.itemName = this.projectData.itemName;
    }else{
      this.selectCommunity();
      this.chargeType();
    }
    
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
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
            // this.form.floorSer = this.floorOptions[0].id;
          }
        })
    },
    chargeType(){
      let url = '/fees/rule-types';
      this.$xttp.get(url).then(res => {
        if(res.success){
          this.chargeTypesOptions = res.data.ruleTypes;
          this.form.type = this.chargeTypesOptions[0].key;
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


