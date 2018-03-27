<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="name" class="c-must">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="计费规则：" :label-width="formLabelWidth" prop="chargeType" class="c-must">
              <el-radio-group v-model="form.chargeType">
                <el-radio :label="item.key" :value="item.value" :key="item.value" v-for="(item) in chargeTypesOptions" border>{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="计费单价：" prop="price" :label-width="formLabelWidth" class="c-must">
              <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="适用楼栋：" :label-width="formLabelWidth" prop="floorSer" class="c-must">
              <el-select v-model="form.floorSer" @change="changeFloor" clearable placeholder="选择适用楼栋">
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
import { communityId } from '@/biz/community';
import cityOptions from '@/utils/citys';

export default {
  name: "ChargeAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'新增项目',
      form: {
        price: '',
        name: '',
        chargeType: '1',
        floorSer: ''
      },
      rules: {
        name: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
        code: [{ required: true, message: '请输入社区编号', trigger: 'blur' }],
        cityArr: [{type: 'array', required: true, message: '请输入地区', trigger: 'blur' }],
        address:[{required: true, message: '请输入详细地址', trigger: 'blur'} ]
      },
      floorOptions:[],
      chargeTypesOptions: [],
      cityArr: [],
      current: 1 ,//1 初始 2：添加后 3：编辑后
      cityOptions:cityOptions
    };
  },
  props: ["msg","add"],
  created() {
    if(this.add){//判断此时组件为 编辑
      this.cityArr = [this.add.province,this.add.city,this.add.district || '' ];
      this.form = this.add;
      this.form.cityArr = [this.add.province,this.add.city,this.add.district || '' ];
      this.titleFont = '编辑社区档案';
    }
    this.selectCommunity();
    this.chargeType();
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postData();
          } else {
            return false;
          }
        });
    },
    changeProvince(value) {
      this.form.cityArr = this.cityArr;
    },
    postData() {
      if (this.cityArr[0]) {
        this.form.province = this.form.cityArr[0];
        this.form.city = this.form.cityArr[1];
        this.form.district = this.form.cityArr[2];
        delete this.form.cityArr;
      }
      let msg = this.add ? '编辑' : '添加';
      let uri = this.add ? '/community/edit' : '/community/add';
      this.$xttp
        .post( uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "社区成功",
              type: "success"
            });
            this.current =  2;
            this.handleClose();
          }else {
            this.$message({message:res.data.errorMsg,type:'error'});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectCommunity(num){
      let obj = { communityId:this.$store.getters.communityId };
      this.$xttp.get(`/community/building/list`,{params:obj})
        .then(res => {
          if(res.success){
            this.floorOptions = res.data;
            this.form.floorSer = this.floorOptions[0].id;
          }
          // if(num) {
          //   this.sendAjax(1,this.formInline.floorSer)
          // }
        })
    },
    chargeType(){
      let url = '/fees/rule-types';
      this.$xttp.get(url).then(res => {
        if(res.success){
          this.chargeTypesOptions = res.data.ruleTypes;
          // this.form.chargeType = '1';
        }
      })
    },
    changeFloor(){

    }
  }
};
</script>

<style lang="scss" scoped>

</style>


