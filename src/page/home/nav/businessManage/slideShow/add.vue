<template>
  <el-dialog title="新增轮播图" :visible.sync="formVisible">
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

      <el-form-item label="所属社区" label-width="120px" required>
        <el-input v-model.trim="form.title"></el-input>
      </el-form-item>

      <el-form-item label="播放顺序" required>
        <el-select v-model="form.client" placeholder="请选择客户端类型">
          <el-option label="住户端" value="1000"></el-option>
          <el-option label="物业端" value="1001"></el-option>
          <el-option label="WEB后台" value="1002"></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label="跳转类型" label-width="120px" required>
        <el-radio v-model="radio" label="1">商家</el-radio>
        <el-radio v-model="radio" label="2">第三方</el-radio>
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
      formVisible: this.visible,
      communityList: [],
      file: null,
      form: {
        title: "",
        client: "1000",
        href: "",
        materialUrl: null
      },
      fileList2: [],
      radio: '1',
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
    preview() {},
    up() {},
    onExceed() {
      this.$message("只能上传一张图片");
    },
    save() {
      if (!this.form.title.length) {
        this.showInfo("公告标题不能为空");
        return;
      }
      if (!this.form.href.length) {
        this.showInfo("公告内容不能为空");
        return;
      }

      let files = this.$refs.upload.uploadFiles;

      if (files.length) {
        ossUpload(files[0].raw, key => {
          this.form.materialUrl = key;
          this.submitForm();
        });
      } else {
        this.submitForm();
      }
    },
    submitForm() {
      this.loading = true;
      let params = {};
      params["client"] = this.form.client;
    //   params["communityId"] = this.$store.getters.communityId;
      params["title"] = this.form.title;
      params["href"] = this.form.href;
      if (this.form.materialUrl) {
        params["materialUrl"] = this.form.materialUrl;
      }
      let url = "sys/slide/add";
      if (this.isModify) {
        url = "sys/slide/edit";
        params["id"] = this.detail.id;
      }
      this.$xttp.post(url, params).then(res => {
        this.loading = false;
        console.log(res);
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
    if (this.isModify) {
      this.form.title = this.detail.title;
      this.form.client = this.detail.client.toString();
      this.form.materialUrl = this.detail.materialUrl;
      this.form.href = this.detail.href;
      if (this.detail.materialUrl) {
        getUri(this.detail.materialUrl,(uri) => {
          this.fileList2.push({url:uri});
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
