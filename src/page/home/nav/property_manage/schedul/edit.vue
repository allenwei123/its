<template>
  <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
    <el-form :model="form" ref="ruleForm" class="demo-form-inline">
      <el-form-item v-if="show" label="社区ID:" :label-width="formLabelWidth" prop="communityId" class="c-must">
        <el-input v-model="form.communityId"></el-input>
      </el-form-item>

      <el-form-item v-if="show" label="物业ID:" :label-width="formLabelWidth" prop="propertyId" class="c-must">
        <el-input v-model="form.propertyId"></el-input>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
            <el-select v-model="form.postCode" placeholder="postOptions" :disabled="disabled">
              <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="员工姓名：" :label-width="formLabelWidth" prop="userName" class="c-must">
            <el-select v-model="form.userName" placeholder="员工姓名" :disabled="disabled">
              <el-option v-for="item in emplData" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="值班日期：" :label-width="formLabelWidth" class="c-nomust">
            <el-date-picker
            :disabled="disabled"
              v-model="form.workDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="班次类型：" :label-width="formLabelWidth" prop="type" class="c-must">
            <el-select v-model="form.type" placeholder="请选择" :disabled="disabled">
              <el-option v-for="item in typeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

       <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="班次名称：" :label-width="formLabelWidth" prop="className" class="c-must">
              <el-input v-model.trim="form.className" placeholder="请输入班次名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="执勤任务：" label-width="200px" prop="task">
              <el-input v-model.trim="form.task" placeholder="请输入执勤任务"></el-input>
            </el-form-item>
          </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="出勤时间：" :label-width="formLabelWidth" class="c-nomust">
            <el-time-select placeholder="出勤时间" v-model="form.attendTimeStr"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '24:00'
              }">
            </el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item  label="退勤时间：" :label-width="formLabelWidth">
            <el-time-select placeholder="退勤时间" v-model="form.offTimeStr"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '24:00'
              }">
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="出勤地点：" :label-width="formLabelWidth" prop="attendPlace">
            <el-input v-model.trim="form.attendPlace" placeholder="请输入出勤地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="退勤地点：" :label-width="formLabelWidth" prop="offPlace">
            <el-input v-model.trim="form.offPlace" placeholder="请输入退勤地点"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
        <el-select v-model="form.postCode" placeholder="postOptions" :disabled="disabled">
          <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item> -->

      <!-- <el-form-item label="员工姓名：" :label-width="formLabelWidth" prop="userName" class="c-must">
        <el-select v-model="form.userName" placeholder="员工姓名" :disabled="disabled">
          <el-option v-for="item in emplData" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item> -->

      <!-- <el-form-item label="值班日期：" :label-width="formLabelWidth" class="c-nomust">
        <el-date-picker
         :disabled="disabled"
          v-model="form.date"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item> -->

      <!-- <el-form-item label="名称：" :label-width="formLabelWidth" prop="name" class="c-must">
        <el-col :span="14">
          <el-input v-model.trim="form.name" placeholder="请输入班次名称"></el-input>
        </el-col>
      </el-form-item> -->

      

      <!-- <el-form-item label="值班时间：" :label-width="formLabelWidth" class="c-nomust">
        <el-time-select placeholder="出勤时间" v-model="form.attendTimeStr"
          :picker-options="{
            start: '00:00',
            step: '00:05',
            end: '24:00'
          }">
        </el-time-select> - 
        <el-time-select placeholder="退勤时间" v-model="form.offTimeStr"
          :picker-options="{
            start: '00:00',
            step: '00:05',
            end: '24:00'
          }">
        </el-time-select>
      </el-form-item> -->

      <!-- <el-form-item label="出勤地点：" :label-width="formLabelWidth" prop="attendPlace">
        <el-col :span="14">
          <el-input v-model.trim="form.attendPlace" placeholder="请输入出勤地点"></el-input>
        </el-col>
      </el-form-item> -->

      <!-- <el-form-item label="退勤地点：" :label-width="formLabelWidth" prop="offPlace">
        <el-col :span="14">
          <el-input v-model.trim="form.offPlace" placeholder="请输入退勤地点"></el-input>
        </el-col>
      </el-form-item> -->

      <!-- <el-form-item label="执勤任务：" label-width="200px" prop="task">
        <el-col :span="14">
          <el-input v-model.trim="form.task" placeholder="请输入执勤任务"></el-input>
        </el-col>
      </el-form-item> -->
      <el-form-item :label-width="formLabelWidth" align="center" style="margin-right:200px;">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import time from '@/utils/time.js';
export default {
  name: "SchedulEdit",
  data() {
    return {
      formLabelWidth: "200px",
      titleFont:'编辑排班',
      checked: false,
      disabledPost: true,
      disabled: true,
      editDate: true,
      show: false,
      form: {
          id: '',
        userName: '',
        postCode: 'SECURITY',
        date: '',
        empl: '',
        class: '',
        className: '',
        attendTime: '',
        offTime: '',
        task:'',
        attendPlace: '',
        offPlace: '',
        classId: '',
        workDate: ''
      },
      rules: {
        empl: [{ required: true, message: "请选中员工", trigger: "blur" }],
        class: [{ required: true, message: "请选中班次", trigger: "blur" }]
      },
      postOptions: [],
      emplData: [],
      classData: [],
      typeOptions: [{ key: '1', value: '轮班' },{ key: '2', value: '常班' }]
    };
  },
  props: ["msg","edit",'editData'],
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upedit", false);
    },
    changEmpl(value){
      this.form.empl = value;
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
            if(res.success) {
              this.emplData = res.data
            }
          })
    },
    initClass() {
      let postCode = this.form.postCode;
      let communityId = this.$store.getters.communityId;
      let params = {};
      params['communityId'] = communityId;
      params['postCode'] = postCode;
      this.$xttp.post(`/task/class/page`,params)
      .then(res => {
        if(res.success) {
            this.classData = res.data.records;
        }
      })
    },
    changeRadio() {
      let obj = this.classData.find(item => this.form.class == item.name);
      let id = obj.id;
      this.$xttp.get(`task/class/${id}/detail`)
          .then(res => {
            if( res.success) {
              this.form.name = res.data.name;
              this.form.attendTime = res.data.attendTime;
              this.form.attendPlace = res.data.attendPlace;
              this.form.offPlace = res.data.offPlace;
              this.form.offTime = res.data.offTime;
              this.form.task = res.data.task;
              this.form.classId = id;
            //   this.form.postCode = res.data.postCode;
            }
          }).catch(err => {
            console.log(err)
          })
      
    },
    save() {
      if(this.form.className == ''){
        this.$message({message:'请输入班次名称',type:'warning'});
        return;
      }
      this.postData();
    },
    postData() {
      let id = this.form.id;
      // let postCode = this.form.postCode;
      // let objPost = this.postOptions.find(item => this.form.postCode == item.name);
      // postCode = objPost.key;
      let workDate = time.timestampToFormat(this.form.workDate,'yyyy-MM-dd');
      // let userId = this.form.userId;
      // let communityId = this.$store.getters.communityId;
      // let propertyId = localStorage.getItem('propertyId');
      let className = this.form.className;
      // let objClass = this.classData.find(item => this.form.class == item.name);
      // let classId = objClass.id;
      let attendTimeStr = this.form.attendTimeStr;
      let attendPlace = this.form.attendPlace;
      let offTimeStr = this.form.offTimeStr;
      let offPlace = this.form.offPlace;
      let task = this.form.task;
      let params = {};
      params['id'] = id;
      // params['classId'] = classId;
      params['className'] = className;
      // params['postCode'] = postCode;
      params['workDate'] = workDate;
      // params['userId'] = userId;
      // params['communityId'] = communityId;
      // params['propertyId'] = propertyId;
      params['attendTimeStr'] = attendTimeStr;
      params['attendPlace'] = attendPlace;
      params['offTimeStr'] = offTimeStr;
      params['offPlace'] = offPlace;
      params['task'] = task;
      
      let uri = "/task/schedule/edit"
      this.$xttp
        .post(uri, params)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: "修改排班成功",
              type: "success"
            });
            this.handleClose();
            this.$emit('reload');
          } else {
            this.$message({ message: res.data.errorMsg, type: "error" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
      let id = this.edit.id;
      let url = `/task/schedule/${id}/detail`;

      this.$xttp.get(url).then(res => {
        if(res.success) {
          let records = res.data;
          this.form.id = records.id;
          this.form.workDate = time.timestampToTime(records.workDate);
          // this.form.workDate = records.workDate;

          this.form.postCode = records.postCode;
          this.form.className = records.className;
          this.form.userId = records.userId;
          this.form.userName = records.userName;
          this.form.type = records.classType.toString();
          
          this.form.offPlace = records.offPlace;
          this.form.offTimeStr = records.offTimeStr;
          this.form.attendTimeStr = records.attendTimeStr;
          this.form.attendPlace = records.attendPlace;
          this.form.task = records.task;
          this.form.remark = records.remark;
          this.initClass();
          this.initPost();
          this.form.empl = records.userName;
          this.form.class = records.className;
          this.form.classId = records.classId;
          if(this.form.postCode == 'CLEANER'){
            this.form.postCode = '保洁'
          } 
          if(this.form.postCode == 'SECURITY'){
            this.form.postCode = '保安';
          }
          if(this.form.postCode == 'MANAGER'){
            this.form.postCode = '物业管理员'
          } 
          if(this.form.postCode == 'SERVICEMAN'){
            this.form.postCode = '维修工'
          }
          if(this.form.postCode == 'SUPPORTSTAFF'){
            this.form.postCode = '客服人员'
          }
          
        }
        this.loading = false;
      }).catch(err => {
          this.loading = false;
        });
    }
};
</script>

<style lang="scss" scoped>
.el-radio+.el-radio{
  margin-left: 0;
  padding: 10px 5px;
  min-width: 100px;
  display: inline-block;
  margin-top: 20px;
}
.el-input{
  width: 200px;
}
.el-radio-group{
  height: 40px;
  line-height: 40px;
  margin-top: -39px;
}
.el-radio.is-bordered+.el-radio.is-bordered{
  margin-right: 10px;
}
.el-radio.is-bordered{
  height: 40px;
}
.el-radio.is-bordered[data-v-e77d2842]{
  margin-right: 10px;
  margin-top: 0px;
  margin-bottom: 10px;
}
  
</style>
