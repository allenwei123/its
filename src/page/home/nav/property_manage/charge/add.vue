<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="社区名称" :label-width="formLabelWidth" prop="name" class="c-must">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="社区编号" prop="code" :label-width="formLabelWidth" class="c-must">
            <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item label="地区" prop="cityArr" :label-width="formLabelWidth" class="c-must c-eascader">
              <el-cascader
                :options="cityOptions"
                v-model="cityArr"
                @change="changeProvince"
              >
              </el-cascader>
            </el-form-item>

            <el-form-item label="详细地址" prop="address" :label-width="formLabelWidth" class="c-must">
            <el-input v-model="form.address"></el-input>
            </el-form-item>
            
            <!-- <el-form-item label="坐标" :label-width="formLabelWidth" class="c-must" >
              <el-input class="c-ip2" v-model="x"></el-input>
              <el-input class="c-ip2" v-model="y"></el-input>
              <el-button @click="geolocation">获取坐标</el-button>
            </el-form-item> -->
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
      titleFont:'添加楼栋档案',
      form: {
        code: "",
        name: "",
        cityArr: [],
        address:''
      },
      rules: {
        name: [{required: true, message: '请输入社区名称', trigger: 'blur'}],
        code: [{ required: true, message: '请输入社区编号', trigger: 'blur' }],
        cityArr: [{type: 'array', required: true, message: '请输入地区', trigger: 'blur' }],
        address:[{required: true, message: '请输入详细地址', trigger: 'blur'} ]
      },
      options:[],
      cityArr: [],
      current: 1 ,//1 初始 2：添加后 3：编辑后
      cityOptions:cityOptions
    };
  },
  props: ["msg","add"],
  created() {
    communityId().then(res => {
      if(res.length){
        this.options = res;
      }
    })
    if(this.add){//判断此时组件为 编辑
      this.cityArr = [this.add.province,this.add.city,this.add.district || '' ];
      this.form = this.add;
      this.titleFont = '编辑楼栋档案';
    }
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
      }
      let msg = this.add ? '编辑' : '添加';
      let uri = this.add ? '/community/building/edit' : '/community/building/add';
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
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


