<template>
    <el-dialog title="故障详情" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="data" label-width="120px">
            <el-form-item label="申报人名" label-width="120px" prop="userName" required>
                <span>{{data.userName}}</span>
            </el-form-item>
            <el-form-item label="联系方式" label-width="120px" required>
                <span>{{data.contact}}</span>
            </el-form-item>
            <el-form-item label="申报时间" label-width="120px" required>
                <span>{{time}}</span>
            </el-form-item>
            <el-form-item label="申报类型" label-width="120px" required>
                <span>{{faultType}}</span>
            </el-form-item>
            <el-form-item label="申报地址" label-width="120px" required>
                <span>{{data.faultAddress}}</span>
            </el-form-item>
            <el-form-item label="故障描述" label-width="120px" required>
                <span>{{data.faultContent}}</span>
                <div class="c-image" v-if="uri"><img :src="uri"></div>
            </el-form-item>
            <el-form-item label="故障状态" label-width="120px" required>
                <span>{{faultStatus}}</span>
            </el-form-item>

            <template v-if="faultStatus === '已指派' || faultStatus === '已完成' || faultStatus === '待评价'">
                <el-form-item label="维修人员" label-width="120px" required>
                    <span>{{data.repairName}}</span>
                </el-form-item>
                <el-form-item label="维修联系方式" label-width="120px" required>
                    <span>{{data.repairContact}}</span>
                </el-form-item>
                <el-form-item label="受理时间" label-width="120px" required>
                    <span>{{acceptTime}}</span>
                </el-form-item>
            </template>

            <template v-if="faultStatus === '已驳回'">
                <el-form-item label="驳回理由" label-width="120px" required>
                    <span>{{data.rejectReason}}</span>
                </el-form-item>
                <el-form-item label="驳回时间" label-width="120px" required>
                    <span>{{rejectTime}}</span>
                </el-form-item>
            </template>

            <template v-if="faultStatus === '待评价'">
                <!--后台没有完成时间 -->
                <el-form-item label="完成时间" label-width="120px" required>
                    <span>{{data.finishTime}}</span>
                </el-form-item>
            </template>

            <template v-if="faultStatus === '已完成'">
                <el-form-item label="完成时间" label-width="120px" required>
                    <span>{{data.finishTime}}</span>
                </el-form-item>
                <el-form-item label="评价等级" label-width="120px" required>
                    <span>{{data.evaluationGrade}}</span>
                </el-form-item>
                <el-form-item label="服务评价" label-width="120px" required>
                    <span>{{data.evaluation}}</span>
                </el-form-item>
            </template>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="faultStatus === '已提交'">
            <!-- <el-button type="primary" @click="accept">受理故障</el-button>
            <el-button @click="del">驳回申报</el-button> -->
        </div>
  </el-dialog>
</template>

<script>
import time from '@/utils/time.js';
import { getUri } from '@/utils/oss';
    export default {
        data() {
            return {
                time: '',
                faultType: '',
                faultStatus: '',
                acceptTime: '',
                rejectTime: '',
                uri:'',
            }
        },
        methods:{
            // onExceed() {
            //     this.$message('只能上传三张图片')
            // },
            // accept() {
            //     this.$emit('accept');
            // },
            // del() {
            //     this.$emit('del');
            // },
            handleClose() {
                this.$emit("upsee", false );
            },
            getTime(timestamp, format) {
                if (timestamp == null) return '/';
                return time.timestampToFormat(timestamp, format);
            }
        },
        props: ["msg","data"],
        created() {
            console.log(11,this.data);
            let that = this.data;
            this.time = this.getTime(that.playTime, 'yyyy-MM-dd HH:mm'); 
            this.acceptTime = this.getTime(that.acceptTime, 'yyyy-MM-dd HH:mm'); 
            this.rejectTime = this.getTime(that.rejectTime, 'yyyy-MM-dd HH:mm'); 
            this.faultType = that.faultType == 1 ? '住户' : that.faultType == 2 ? '公共' : '其它';
            this.faultStatus = that.faultStatus == 0 ? '已取消' : that.faultStatus == 1 ? '已提交' : 
            that.faultStatus == 2 ? '已受理' : that.faultStatus == 3 ? '已指派' : that.faultStatus == 4 ? '已完成' : '已驳回'
            console.log(34,this.data);
            //图片
            this.uri = that.faultAccessory;
            // console.log(121,this.uri);
        }

    }
</script>

<style scoped lang="scss">
    .c-image {
        width:100px;
        height: auto;
        overflow: hidden;
        img {
        width:100%;
        vertical-align: middle;
        }
    }
</style>
