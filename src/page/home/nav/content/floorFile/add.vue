<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="form" class="demo-form-inline">
            <el-form-item label="社区名称" :label-width="formLabelWidth" class="c-must">
            <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="社区编号" :label-width="formLabelWidth" class="c-must">
            <el-input v-model="form.code"></el-input>
            </el-form-item>

            <el-form-item label="地区" :label-width="formLabelWidth" class="c-must c-eascader">
              <el-cascader
                :options="cityOptions"
                v-model="cityArr"
                @change="changeProvince"
              >
              </el-cascader>
            </el-form-item>

            <el-form-item label="详细地址" :label-width="formLabelWidth" class="c-must">
            <el-input v-model="form.address"></el-input>
            </el-form-item>
            
            <!-- <el-form-item label="坐标" :label-width="formLabelWidth" class="c-must" >
              <el-input class="c-ip2" v-model="x"></el-input>
              <el-input class="c-ip2" v-model="y"></el-input>
              <el-button @click="geolocation">获取坐标</el-button>
            </el-form-item> -->

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import cityOptions from "../../../../../utils/citys";

export default {
  name: "floorFileForm",
  data() {
    return {
      formLabelWidth: "120px",
      titleFont:'添加社区档案',
      form: {
        city: "",
        code: "",
        district: "",
        name: "",
        province: "",
        address: ""
      },
      x: "", //经度
      y: "", //纬度
      cityOptions: cityOptions,
      cityArr: [],
      current: 1 ,//1 初始 2：添加后 3：编辑后
    };
  },
  props: ["msg","add"],
  created() {
    if(this.add){//判断此时组件为 编辑
      this.cityArr = [this.add.province,this.add.city,this.add.district || '' ];
      this.form = this.add;
      this.titleFont = '编辑社区档案';
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("upup", this.current );
    },
    save() {
      this.postData();
    },
    changeProvince(value) {
      // console.log(value);
    },
    postData() {
      if (this.cityArr[0]) {
        this.form.province = this.cityArr[0];
        this.form.city = this.cityArr[1];
        this.form.district = this.cityArr[2];
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
    geolocation() {
      let that = this;
      let map, geolocation;
      map = new AMap.Map("container", {
        resizeEnable: true
      });
      map.plugin("AMap.Geolocation", function() {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", data => {
          that.$nextTick(() => {
            that.x = data.position.getLng();
            that.y = data.position.getLat();
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


