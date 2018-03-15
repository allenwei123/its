<template>
    <el-dialog title="故障详情" :visible.sync="msg" :before-close="handleClose">
        <el-form :model="data" label-width="120px">
            <el-form-item label="申报人" label-width="120px" prop="userName" required>
                <el-input v-model="data.userName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" label-width="120px" required>
                <el-input v-model="data.contact" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="申报时间" label-width="120px" required>
                <el-input v-model="time" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="申报类型" label-width="120px" required>
                <el-input v-model="faultType" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="申报地址" label-width="120px" required>
                <el-input v-model="data.faultAddress" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="故障描述" label-width="120px" required>
                <el-input v-model="data.faultContent" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="故障状态" label-width="120px" required>
                <el-select v-model="faultStatus" placeholder="故障状态">
                    <el-option label="待受理" value="1"></el-option>
                    <el-option label="待分派" value="2"></el-option>
                    <el-option label="待检修" value="3"></el-option>
                    <el-option label="待评价" value="4"></el-option>
                    <el-option label="已完成" value="5"></el-option>
                    <el-option label="已取消" value="6"></el-option>
                    <el-option label="被驳回" value="7"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="驳回原因" required>
                <el-input type="textarea" v-model="data.rejectReason" :rows="5"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="accept">受理故障</el-button>
            <el-button @click="del">驳回申报</el-button>
        </div>
  </el-dialog>
</template>

<script>
    import time from '@/utils/time.js';
    export default {
        data() {
            return {
                time: '',
                faultType: '',
                faultStatus: '',
            }
        },
        methods:{
            accept() {
                this.$emit('accept');
            },
            del() {
                this.$emit('del');
            },
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
            let that = this.data;
            this.time = this.getTime(that.playTime, 'yyyy-MM-dd hh:mm'); 
            this.faultType = that.faultType == 1 ? '住户' : that.faultType == 2 ? '公共' : '其它';
            this.faultStatus = that.faultStatus == 0 ? '已取消' : that.faultStatus == 1 ? '待接受' : 
            that.faultStatus == 2 ? '待分派' : that.faultStatus == 3 ? '待检修' : that.faultStatus == 4 ? '已完成' : '已驳回'
            console.log(34,this.data);
        }

    }
</script>
