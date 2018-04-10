<template>
  <el-dialog :title="title" :visible.sync="formVisible">
    <el-form :model="form" label-width="120px">
      <el-form-item label="轮播图" required>
        <template>
          <el-upload
            ref="upload"
            action=""
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :on-exceed="onExceed"
            :file-list="fileList2"
            list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>
      </el-form-item>

      <el-form-item label="所属社区" label-width="120px" prop="value3" required>
        <el-select v-model="form.value3"  clearable>
          <el-option v-for="item in communityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="播放顺序" required>
        <el-select v-model="form.label" placeholder="请选择播放顺序" clearable>
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label="跳转类型" label-width="120px" required>
        <el-radio-group v-model="radio">
          <el-radio  :label="1">商家</el-radio>
          <el-radio  :label="2">第三方</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="关联社区" label-width="120px" required>
        <el-input v-model.trim="form.href"></el-input>
      </el-form-item>
     
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { send as ossUpload, getUri } from "@/utils/oss";
export default {
  data() {
    return {
      formVisible: true,
      communityList: [],
      file: null,
      form: {
        title: "",
        client: "1000",
        href: "",
        materialUrl: null,
        value3: '',
      },
      fileList2: [],
      radio: 1,
      title: '新增轮播图',
      communityList: '',
    };
  },
  watch: {
    visible(val) {
      this.formVisible = val;
    },
    formVisible(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    showInfo(text) {
      this.$message({
        message: text,
        type: "warning"
      });
    },
    closeForm() {
      this.formVisible = false;
    },
    onExceed() {
      this.$message("只能上传一张图片");
    },

    community() {
      this.loading = true;
      let url = `community/page`;
      this.$xttp.get(url).then( res => {
        if(!res.errorCode) {
          this.loading = false;
          this.communityList = res.data.records;
        }
      }).catch( () => {
        this.loading = false;
      })
    },

    save() {
      if (!this.form.label) {
        this.showInfo("播放顺序不能为空");
        return;
      }
      if (!this.form.value3) {
        this.showInfo("请选择社区");
        return;
      }
      if (!this.radio) {
        this.showInfo("跳转类型不能为空");
        return;
      }
      if (!this.form.href.length) {
        this.showInfo("关联社区不能为空");
        return;
      }

      let files = this.$refs.upload.uploadFiles;
      if (files.length) {
        ossUpload(files[0].raw, key => {
          this.form.materialUrl = key;
          this.submitForm();
        });
      } else if (files.length === 0) {
        this.showInfo("请上传图片");
        return;
      } else {
        this.submitForm();
      }
     
    },
    submitForm() {
      this.loading = true;
      let params = {};
      params["rank"] = this.form.label;
      params["communityId"] = this.form.value3;
      params["gotoType"] = this.radio;
      params["href"] = this.form.href;
      params['title'] = this.title;
      params["photo"] =this.form.materialUrl;
      let url = "biz/slide/add";
      if (this.isModify) {
        url = "biz/slide/edit";
        params["id"] = this.detail.id;
      }
      this.$xttp.post(url, params).then(res => {
        this.loading = false;
        console.log(params);
        if (res.errorCode === 0) {
          this.formVisible = false;
          this.$emit('saveSuccess');
        }
      }).catch(() => {
        this.loading = false;
      });
    }
  },
  props: ["visible", "detail", "isModify"],
  created() {
    this.community();
    if (this.isModify) {
      this.title = "修改轮播图";
      this.form.value3 = this.detail.communityName;
      // this.form.label = this.detail.rank;
      this.form.href = this.detail.communityName;
      this.radio = this.detail.gotoType;
      console.log(this.radio)
      if (this.detail.photo) {
        getUri(this.detail.photo,(uri) => {
          this.fileList2.unshift({url:uri});
        });
      }
    }
  }
};
</script>

<style scoped>
.el-upload {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style>

