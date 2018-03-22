<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <div class="c-search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="">
              <el-date-picker
                v-model="form.date"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="角色：">
              <el-select v-model="form.postCode" @change="changePostCode()" placeholder="角色">
                <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>

            <hr style="height:1px;border:none;border-top:1px dashed #cecece;" />

            <el-form-item label="班次：" prop="class" class="c-must" style="display:block;margin-top:25px;">
              <el-radio-group v-model="form.class">
                <el-radio :label="item.id" :value="item.name" :key="item.name" v-for="(item) in classData">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="员工：" prop="empl" class="c-must" style="display:block;margin-top:20px;">
              <el-select v-model="form.empl" placeholder="请选择员工">
                <el-option v-for="item in emplData" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item :label-width="formLabelWidth" style="margin-top:20px;margin-left:40%;" >
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <hr style="height:1px;border:none;border-top:1px dashed #0066CC;" />
        <div style="margin-top:75px;">
          <el-form ref="form" :rules="rules" :model="form" label-width="200px">
             <el-form-item label="班次" label-width="200px" prop="class" class="c-must">
              <el-radio-group v-model="form.class">
                <el-radio :label="item.id" :value="item.name" :key="item.name" v-for="(item) in classData">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="员工" prop="empl" class="c-must">
              <el-select v-model="form.empl" placeholder="请选择员工">
                <el-option v-for="item in emplData" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item :label-width="formLabelWidth" >
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
          </el-form>
        </div> -->
        
    </el-dialog>
</template>

<script>
import time from '@/utils/time.js';
export default {
  name: "EmplAdd",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'新增排班',
      form: {
        postCode: 'SECURITY',
        date: '',
        empl: '',
        class: ''
      },
      // form: {
      //   empl: '',
      //   class: ''
      // },
      rules: {
        empl: [{ required: true, message: "请选中员工", trigger: "blur" }],
        class: [{ required: true, message: "请选中班次", trigger: "blur" }]
      },
      postOptions: [],
      emplData: [],
      classData: [],
      current: 1 //1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg","add"],
  created() {
    if(this.add) {
      // 判定此时组件为 编辑
      this.form = this.add;
      this.titleFont = "编辑排班";
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
    },
    initPost(){
      let communityId = this.$store.getters.communityId
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    },
    initEmpl() {
      let communityId = this.$store.getters.communityId
      let postCode = this.form.postCode
      this.$xttp.get(`/user/property/${communityId}/user-list`,{params:{postCode:postCode}})
          .then(res => {
            if(!res.errorCode) {
              this.emplData = res.data
            }
          })
    },
    initClass() {
      var postCode = this.form.postCode;
      let communityId = this.$store.getters.communityId;
      let propertyId = localStorage.getItem('propertyId');
      this.$xttp.get(`/task/class/list`,{params:{communityId:communityId,postCode:postCode,propertyId:propertyId}})
      .then(res => {
        if(!res.errorCode) {
          console.log(res);
          this.classData = res.data
        }
      })
    },
    save() {
      if(this.form.empl == ''){
        this.$message({message:'请选择员工',type:'warning'});
        return;
      }
      if(this.form.class == ''){
        this.$message({message:'请选择班次',type:'warning'});
        return;
      }
      this.postData();
      console.log(this.form.empl)
      console.log(this.form.class)
      console.log(this.form.postCode)
      console.log(this.form.date)
    },
    postData() {
      let employeeId = this.form.empl;
      let classId = this.form.class;
      let postCode = this.form.postCode;
      let workDate = this.form.date;
      let userId = this.$store.getters.uid;
      // let userName = this.$store.getters.userInfo[0].name;
      let communityId = this.$store.getters.communityId;
      let propertyId = localStorage.getItem('propertyId');
      let params = {};
      params['employeeId'] = employeeId;
      params['classId'] = classId;
      params['postCode'] = postCode;
      params['workDate'] = workDate;
      params['userId'] = userId;
      // params['userName'] = userName;
      params['communityId'] = communityId;
      params['propertyId'] = propertyId;
      console.log(params);
      
      let msg = this.add ? "编辑" : "添加";
      let uri = this.add
        ? "/task/schedule/edit"
        : "/task/schedule/add";
      this.$xttp
        .post(uri, params)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "排班成功",
              type: "success"
            });
            this.current = 2;
            this.handleClose();
          } else {
            this.$message({ message: res.data.errorMsg, type: "error" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changePostCode(){
      this.initEmpl();
      this.initClass();

    }
  },
  created() {
    this.initPost();
    this.form.date = time.dateFormat(new Date(),'yyyy-MM-dd');
    this.initEmpl();
    this.initClass();
  }
};
</script>

<style lang="scss" scoped>
.el-radio+.el-radio{
  margin-left: 0;
  padding: 10px 5px;
  min-width: 100px;
  display: inline-block;
}
  
</style>


