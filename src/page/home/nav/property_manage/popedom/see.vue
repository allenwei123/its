<template>
      <el-dialog :title="titleFont" :visible.sync="msg" :before-close="handleClose" width="645px">
        <p> 辖区名称：{{ this.data.name }}</p>
        <p v-for="(item,index) in floorData" :key="index">已选楼栋{{ index+ 1 }}: {{ item.buildingName }}</p>
    </el-dialog>
</template>

<script>
export default {
  name: "PopedomDetail",
  data() {
    return {
      formLabelWidth: "100px",
      titleFont: "辖区详情",
      floorData: []
    };
  },
  props: ["msg", "data"],
  created() {
    this.getFloor();
  },
  mounted() {},
  methods: {
    getFloor() {
      let communityId = this.$store.getters.communityId;
      let obj = { communityId };
      obj["districtId"] = this.data.id;
      this.$xttp.post(`/district/available-buildings`, obj).then(res => {
        if (res.errorCode === 0) {
          this.floorData = res.data.filter(item => item.availableType === 1);
        }
      });
    },
    handleClose() {
      this.$emit("upsee");
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


