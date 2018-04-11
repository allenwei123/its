<template>
  <el-dialog title="新增商家" :visible.sync="msg" :before-close="handleClose" class="c-maxbody">
    <el-form :model="data" label-width="120px" ref="ruleForm" :rules="rules" class="c-myForm">

      <el-form-item prop="name" label="店名">
        <el-input auto-complete="false" v-model="data.name" size="small"></el-input>
      </el-form-item>

      <el-form-item label="店标" required>
        <el-upload
          class="avatar-uploader"
          action=""
          :file-list="fileList"
          list-type="picture-card"
          :http-request="httpRequest"
          :on-remove="removeFile"
          :limit=1
        ><i class="el-icon-plus avatar-uploader-icon"></i></el-upload>
      </el-form-item>

      <el-form-item label="图片" required>
        <el-upload
          class="avatar-uploader"
          action=""
          :file-list="pictureList"
          list-type="picture-card"
          :http-request="httpRequest1"
          :on-remove="removeFile1"
        ><i class="el-icon-plus avatar-uploader-icon"></i></el-upload>
      </el-form-item>

      <el-form-item label="商家类型" prop="type">
        <el-select v-model="data.type" placeholder="请选择" clearable size="small" @change="selectType">
          <el-option
            v-for="s in typeList"
            :key="s.id"
            :label="s.name"
            :value="s.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签" prop="tag">
        <el-checkbox-group v-model="data.tag" size="small">
          <el-checkbox v-for="(t,index) in minTag" :label.number="t" :name="t" :key="index"
                       class="c-checkbox"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="运营时间">
        <el-time-select
          placeholder="起始时间"
          v-model="data.serviceBeginAt"
          :picker-options="{
          start: '00:00',
          step: '00:15',
          end: '24:00'
        }"></el-time-select>
        <el-time-select
          placeholder="结束时间"
          v-model="data.serviceEndAt"
          :picker-options="{
          start: '00:00',
          step: '00:15',
          end: '24:00',
          minTime: data.serviceBeginAt
        }">
        </el-time-select>
      </el-form-item>

      <el-form-item label="联系号码" prop="telPhone">
        <el-input type="number" v-model="data.telPhone" size="small"></el-input>
      </el-form-item>

      <el-form-item label="所在地区" prop="ThreeAddress">
        <el-cascader :options="options" v-model="data.ThreeAddress" size="small" @change="checkAdress">
        </el-cascader>
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-select
          v-model="data.address"
          remote
          filterable
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="addressChange"
          :loading="addressLoading"
          @change="onChange"
          size="small">
          <el-option
            v-for="item in options4"
            :key="item.ids"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="c-map">
        <div class="c-map-body" id="container"></div>
      </div>

      <el-form-item prop="communityIds" label="关联社区">
        <el-select
        v-model="data.communityIds"
        multiple
        style="margin-left: 20px;"
        placeholder="请选择">
        <el-option
          v-for="item in communityIdsList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import cityData from "@/utils/citys"
  import {Map as map} from '@/utils/map'
  import {send, getUri} from '@/utils/oss'
  import tagList from '@/mock/tag'

  export default {
    name: "merchantForm",
    data() {
      var checkTag = (rule, value, cb) => {
        if (!value.length) {
          return cb(new Error('请至少选择一个标签'))
        }
        if (value.length > 3) {
          return cb(new Error('标签不能超过三个'));
        }
      }
      return {
        autoUpload: false,
        time: null,
        data: {
          type: null,
          tag: [],
          address: '',
          serviceBeginAt: '',
          serviceEndAt: '',
          picture: [],
          local: [],//经纬度
          communityIds:[]
        },
        typeList: [],
        minTag: null,//标签数组
        pictureList:[],//图片数组
        uploadFile_pic:[],//图片上传数组
        fileList: [],
        uploadFile: [],
        options: cityData,
        mapObj: null,
        options4: [],//地图下拉列表
        addressLoading: false,//地址加载中...
        communityIdsList: [{id:0,name:'allen'}],//社区列表
        timeOutVal: null,//定义延时,
        rules: {
          name: [{required: true, message: '请输入店名', trigger: 'blur'}],
          type: [{required: true, message: '请选择商家类型', trigger: 'blur'}],
          tag: [{validator: checkTag, trigger: 'change'}],
          ThreeAddress: [{type: 'array', required: true, message: '请输入所在地区', trigger: 'change'}],
          telPhone: [{required: true, message: '请选择联系号码', trigger: 'blur'}, {
            min: 11,
            max: 11,
            message: "必须11个字符",
            trigger: 'blur'
          }],
          address: [{required: true, message: '请输入你的详细地址', trigger: 'blur'}],
        },
      }
    },
    props: ['msg', 'edata'],
    created() {
      this.getTag();
      this.getCommunityIds();
      if (this.edata) {//编辑
        this.data = this.edata;
        this.data.ThreeAddress = [this.edata.province, this.edata.city, this.edata.district || null];
        this.data.picture = this.data.picture ?this.data.picture : [];
        let arr = [this.edata.logo,...(this.edata.picture || [])];
        if(arr.length){
            arr.forEach((item,index) => {
                if(!item)return;
              getUri(item, (uri) => {
                let o = {url: uri,key:item};
                if(index == 0){
                  this.fileList.push(o);
                }else {
                  this.pictureList.push(o);
                }
              })
            })
        }
      }
      this.$nextTick(() => {
        this.mapObj = new map({cb: this.getAddress});
        if (this.edata) {
          this.success(this.edata.address);
        }
      })
    },
    methods: {
      handleClose() {
        this.$emit("upList", 1);
      },
      submitForm() {
        let that = this;
        let arr = [...this.uploadFile,...this.uploadFile_pic];
        let length = arr.length;
        if (length) {
          let flag = 0;
          arr.forEach((item) => {
            send(item, (key) => {
              flag++;
              if(flag == 1 && this.uploadFile.length){
                  that.data.logo = key;
              }else {
                  this.data.picture.push(key);
              }
              if(flag == length) {
                that.sendAjax();
              }
            });
          });
        } else {
          that.sendAjax();
        }
      },
      getTag() {
        this.$xttp.get('/biz/shop/type/list')
          .then(res => {
            if (!res.errorCode) {
              this.typeList = res.data;
              if (this.edata) {
                this.selectType(false);
              }
            }
          })
      },
      getCommunityIds() {
        this.$xttp.post('/community/list',{})
          .then(res => {
            if (!res.errorCode) {
              this.communityIdsList = res.data;
              console.log(this.data.communityIds)
            }
          })
      },
      sendAjax(){
//        if (this.data.tag.length > 3)return;
        let msg = this.edata ? '编辑' : '添加';
        let postUrl = this.edata ? '/biz/shop/edit' : '/biz/shop/add';
        this.$xttp.post(postUrl, this.data)
          .then(res => {
            if (!res.errorCode) {
              this.$message({
                message: msg + "商家成功",
                type: "success"
              });
              this.$emit("upList", 2);
              this.$emit('reload');
            }
          })
      },
      removeFile(file) {
        this.uploadFile.splice(0, 1);
      },
      removeFile1(file) {
        let index = this.uploadFile_pic.findIndex(item => item.uid == file.uid);
        this.uploadFile_pic.splice(index, 1);
        if(this.edata) {
          let index = this.data.picture.findIndex(item => item == file.key);
          this.data.picture.splice(index, 1);
        }
      },
      httpRequest(file) {
        this.uploadFile.push(file.file);
      },
      httpRequest1(file) {
        this.uploadFile_pic.push(file.file);
      },
      checkAdress() {//三级联动地址改变
        this.data.province = this.data.ThreeAddress[0];
        this.data.city = this.data.ThreeAddress[1];
        this.data.district = this.data.ThreeAddress[2];
      },
      getAddress(obj) {//点击地图 obj => 有地址，经纬度
        this.data.address = obj.address;
        this.data.local = [obj.lng, obj.lat];
      },
      success(address) {//地图初始化成功
        this.mapObj.getLocation(address, event => {
        })
      },
      addressChange(val) {//地址框发生变化
        clearTimeout(this.timeOutVal);
        if (val !== '') {
          this.addressLoading = true;
          this.timeOutVal = setTimeout(() => {
            this.mapObj.searchFont(val, event => {
              if (event.tips.length) {
                let num = 1;
                event.tips.forEach(item => item.ids = num++);
                this.options4 = event.tips;
                this.addressLoading = false;
              }
            });
          }, 500);
        }
      },
      onChange(val) {//选择地址触发
        let that = this;
        this.mapObj.getLocation(val, event => {
          that.data.local = [event.lng, event.lat];
        })
      },
      selectType(bool){
        if (bool) {
          this.data.tag = [];
        }
        this.minTag = this.typeList.find(item => this.data.type == item.code).tag;
      }
    }
  }
</script>

<style scoped lang="scss">

  .c-myForm {
    .el-form-item {
      margin-bottom: 22px;
    }
    .el-select, .el-cascader {
      width: 100%;
    }
    .el-checkbox-group {
      margin-left: -30px;
    }
    .c-checkbox {
      min-width: 78px;
    }
  }

  .c-map {
    width: 100%;
    display: flex;
    height: 100px;
    padding-left: 120px;
    margin-bottom: 5px;
    .c-map-body {
      border: 1px solid #efefef;
      width: 100%;
    }
  }

</style>
