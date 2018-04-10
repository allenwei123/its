<template>
<<<<<<< HEAD
  <el-dialog :title="text" :visible.sync="formVisible">
=======
  <el-dialog :title="titleName" :visible.sync="formVisible">
>>>>>>> 8b1ea5b6a8285dd20f960747fb459ae223f3cf19
    <el-form :model="form" label-width="120px">
      <el-form-item label="公告标题" label-width="120px" required>
        <el-input v-model.trim="form.title"></el-input>
      </el-form-item>
      <el-form-item label="公告类型" required>
        <el-select v-model="form.type" placeholder="请选择公告类型">
          <el-option label="公告" value="1"></el-option>
          <el-option label="新闻" value="2"></el-option>
          <el-option label="活动" value="3"></el-option>
          <el-option label="提醒" value="4"></el-option>
          <el-option label="其他" value="99"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="发布对象" required>-->
        <!--<el-select v-model="form.obj" placeholder="发布对象">-->
          <!--<el-option label="全部" value=""></el-option>-->
          <!--<el-option label="住户" value="1"></el-option>-->
          <!--<el-option label="员工" value="2"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="配图" required>
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
      <el-form-item label="公告内容" required>
        <el-input type="textarea" v-model.trim="form.body" :rows="5"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取消</el-button>
      <!--<el-button type="primary" @click="preview">预览</el-button>-->
      <el-button type="primary" @click="save">保存</el-button>
      <!--<el-button type="primary" @click="publish">发布</el-button>-->
    </div>
  </el-dialog>
</template>

<script>
import { send as ossUpload, getUri } from "@/utils/oss";
export default {
  data() {
    return {
      titleName: '新增公告',
      formVisible: this.visible,
      communityList: [],
      file: null,
      form: {
        title: "",
        type: "1",
        obj: "",
        body: "",
        thumbnailUrl: null
      },
      text: '新增公告',
      fileList2: []
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
      if (!this.form.body.length) {
        this.showInfo("公告内容不能为空");
        return;
      }

      let files = this.$refs.upload.uploadFiles;
      if (files.length) {
        ossUpload(files[0].raw, key => {
          this.form.thumbnailUrl = key;
          this.submitForm();
        });
      } else if (files.length === 0) {
        this.showInfo("图片内容不能为空");
        return;
      } else {
        this.submitForm();
      }
      
    },
    submitForm() {
      this.loading = true;
      let params = {};
      params["noticeType"] = this.form.type;
      params["communityId"] = this.$store.getters.communityId;
      params["title"] = this.form.title;
      params["body"] = this.form.body;
      if (this.form.thumbnailUrl) {
        params["thumbnailUrl"] = this.form.thumbnailUrl;
      }
      let url = "property/notice/add";
      if (this.isModify) {
        url = "property/notice/edit";
        params["id"] = this.detail.id;
      }
      this.$xttp.post(url, params).then(res => {
        this.loading = false;
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
<<<<<<< HEAD
      this.text = "修改公告";
=======
      this.titleName = '编辑公告';
>>>>>>> 8b1ea5b6a8285dd20f960747fb459ae223f3cf19
      this.form.title = this.detail.title;
      this.form.type = this.detail.noticeType.toString();
      this.form.thumbnailUrl = this.detail.thumbnailUrl;
      this.form.body = this.detail.body;
      if (this.detail.thumbnailUrl) {
        getUri(this.detail.thumbnailUrl,(uri) => {
          this.fileList2.push({url:uri});
        });
      }
    }

    console.log(this.fileList2);
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
