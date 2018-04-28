<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" ref="ruleForm" class="demo-form-inline">
            <el-form-item v-if="show" label="社区ID:" :label-width="formLabelWidth" prop="communityId" class="c-must">
              <el-input v-model="form.communityId"></el-input>
            </el-form-item>
            <el-form-item v-if="show" label="物业ID:" :label-width="formLabelWidth" prop="propertyId" class="c-must">
              <el-input v-model="form.propertyId"></el-input>
            </el-form-item>

            <el-form-item label="名称：" :label-width="formLabelWidth" prop="name" class="c-must">
              <el-col :span="14">
                <el-input v-model.trim="form.name" placeholder="请输入班次名称" disabled></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="岗位：" :label-width="formLabelWidth" prop="postCode" class="c-must">
              <el-select v-model="form.postCode" placeholder="postOptions" disabled>
                <el-option v-for="item in postOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="班次类型：" disabled :label-width="formLabelWidth" prop="type" class="c-must">
              <el-select v-model="form.type" disabled placeholder="请选择" @change="changType">
                <el-option v-for="item in typeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="出勤时间：" :label-width="formLabelWidth" class="c-nomust">
              <el-time-select placeholder="出勤时间" v-model="form.attendTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00'
                }">
              </el-time-select> - 
              <el-time-select placeholder="退勤时间" v-model="form.offTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00'
                }">
              </el-time-select>
            </el-form-item>

            <el-form-item label="出勤地点：" :label-width="formLabelWidth" prop="attendPlace">
              <el-col :span="14">
                <el-input v-model.trim="form.attendPlace" placeholder="请输入出勤地点"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="退勤地点：" :label-width="formLabelWidth" prop="offPlace">
              <el-col :span="14">
                <el-input v-model.trim="form.offPlace" placeholder="请输入退勤地点"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="执勤任务：" :label-width="formLabelWidth" prop="task">
              <el-col :span="14">
                <el-input v-model.trim="form.task" placeholder="请输入执勤任务"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item v-if="isSee" label="休息日：" :label-width="formLabelWidth" prop="restWeeks">
              <template>
                <el-checkbox-group v-model="form.restWeeks">
                  <el-checkbox label=2 key="2" @change="changeList">星期一</el-checkbox>
                  <el-checkbox label=3 key="3" @change="changeList">星期二</el-checkbox>
                  <el-checkbox label=4 key="4" @change="changeList">星期三</el-checkbox>
                  <el-checkbox label=5 key="5" @change="changeList">星期四</el-checkbox>
                  <el-checkbox label=6 key="6" @change="changeList">星期五</el-checkbox>
                  <el-checkbox label=7 key="7" @change="changeList">星期六</el-checkbox>
                  <el-checkbox label=1 key="1" @change="changeList">星期日</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>

            <el-form-item v-if="isNoSee" label="轮班顺序：" :label-width="formLabelWidth" class="c-must">
              <el-select v-model="form.shiftOrder" placeholder="请选择">
                <el-option v-for="item in shiftOrderOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if="isNoSee" label="值班人数：" :label-width="formLabelWidth" prop="number" class="c-must">
              <el-col :span="14">
                <el-input-number v-model="form.number" placeholder="请输入值班人数" controls-position="right" :min="1" :max="20"></el-input-number>
              </el-col>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="save()">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
const typeOptions = [
  { key: '1', value: '轮班' },
  { key: '2', value: '常班' }
];
export default {
  name: "ClassAdd",
  isShow: false,
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'编辑班次',
      show: false,
      isSee: true,
      isNoSee: false,
      form: {
        postCode: 'SECURITY',
        name: '',
        type: '2',
        attendPlace: '',
        attendTime: '',
        offPlace: '',
        offTime: '',
        task: '',
        remark: '',
        restWeeks: [],
        shiftOrder:'1',
        number:'1',
        communityId: this.$store.getters.communityId,
        propertyId : localStorage.getItem('propertyId')
      },
      restWeeks: [],
      number: '',
      shiftOrder: '',
      postOptions: [],
      current: 1, //1 初始 2：添加后 3：编辑后
      typeOptions: typeOptions,
      shiftOrderOptions:[{key:'1',value:'1'},{key:'2',value:'2'},{key:'3',value:'3'},{key:'4',value:'4'},{key:'5',value:'5'},{key:'6',value:'6'},{key:'7',value:'7'}],
    };
  },
  props: ["msg","add"],
  created() {
    this.initRole()
    let id = this.add.id;
    let url = `/task/class/${id}/detail`;
    this.$xttp.get(url).then(res => {
      if(res.success){
        this.form.id = res.data.id;
        this.form.postCode = res.data.postCode.toString();
        this.form.type = res.data.type.toString();
        this.form.name = res.data.name;
        this.form.attendTime = res.data.attendTime;
        this.form.attendPlace = res.data.attendPlace;
        this.form.offPlace = res.data.offPlace;
        this.form.offTime = res.data.offTime;
        this.form.task = res.data.task;
        if(res.data.type == 2){
          this.isNoSee = false;
          this.isSee = true;
          this.form.restWeeks = res.data.restWeeks.map(item => item.toString());
        }
        if(res.data.type == 1){
          this.isNoSee = true;
          this.isSee = false;
          this.form.restWeeks = [];
          this.form.shiftOrder = res.data.shiftOrder;
          this.form.number = res.data.number;
        }
      }
    })
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
    },
     showInfo(text) {
      this.$message({
        message: text,
        type: "warning"
      });
    },
    save() {
      if(this.form.name == ''){
        this.showInfo('请输入班次');
        return;
      }
      if(this.form.postCode == ''){
        this.showInfo('请选择岗位');
        return;
      }

      if(this.form.type == 2){
        this.form.shiftOrder = '';
        this.form.number = '';
        // let arr = JSON.parse('[' + String(this.form.restWeeks) + ']');

        // this.form.restWeeks = arr;
      }
      if(this.form.type == 1){
        this.form.restWeeks = [];
      }
      this.postData();
    },
    find(){
      var postCode = this.formInline.role;
      let communityId = this.$store.getters.communityId
      this.$xttp.post('http://dev.apismcm.bitiot.com.cn/v1/task/class/page',{params:{communityId:communityId,postCode:postCode}})
                .then(res => {
                  if(!res.errorCode) {
                    this.tableData = res.data.records;
                  }
                  this.loading = false;
                }).catch(err =>{
                  this.loading = false;
                })
      
    },
    postData() {
      let msg = '编辑';
      let uri = 'http://dev.apismcm.bitiot.com.cn/v1/task/class/edit';
      this.$xttp
        .post( uri, this.form)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: msg + "班次成功",
              type: "success"
            });
            this.current =  2;
            this.handleClose();
            this.$emit('reload');
          }else {
            this.$message({message:res.data.errorMsg,type:'error'});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initRole(){
      let communityId = this.$store.getters.communityId;
      this.$xttp.get(`/user/property/${communityId}/post-list`).then(res => {
        if(!res.errorCode) {
          this.postOptions = res.data;
        }
      })
    },
    changeList(){
    },
    changType(){
      if(this.form.type == 2){
        this.isNoSee = false;
        this.isSee = true;
        this.form.restWeeks = this.restWeeks;
        this.form.shiftOrder = '';
        this.form.number = '';
      }
      if(this.form.type == 1){
        this.isNoSee = true;
        this.isSee = false;
        this.form.shiftOrder = this.shiftOrder;
        this.form.number = this.number;
        this.form.restWeeks = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


