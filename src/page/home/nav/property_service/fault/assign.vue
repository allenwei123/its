<template>
    <el-dialog title="故障详情" :visible.sync="msg" :before-close="handleClose" v-if="show">
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
                    <template>
                        <el-upload
                            ref="upload"
                            action=""
                            :auto-upload="false"
                            :limit="3"
                            accept="image/*"
                            :on-exceed="onExceed"
                            list-type="picture-card">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </template>
            </el-form-item>
            <el-form-item label="故障状态" label-width="120px" required>
                <el-input v-model="faultStatus" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="分派人员" label-width="120px" required>
                <el-select v-model="repairName" placeholder="维修工人1">
                    <el-option label="维修工人1" value="1"></el-option>
                    <el-option label="维修工人2" value="2"></el-option>
                    <el-option label="维修工人3" value="3"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="assignConfirm(data)">确定分派</el-button>
        </div>
  </el-dialog>
</template>

<script>
    import time from '@/utils/time.js';
    export default {
        data() {
            return {
                show: true,
                time: '',
                faultType: '',
                faultStatus: '待分派',
                repairName: '',
                form: {
                    type: '1',
                },
                current: 1
            }
        },
        methods:{
            onExceed() {
                this.$message('只能上传三张图片')
            },
            handleClose() {
                this.$emit("upsee", false );
            },
            getTime(timestamp, format) {
                if (timestamp == null) return '/';
                return time.timestampToFormat(timestamp, format);
            },
            assignConfirm(data) {
                this.$emit("upsee", this.current);
                let url = `property/fault/allocation`;
                let params = {
                id: data.id,
                repairId: data.repairId,
                repairName: data.repairName,
                repairContact: data.repairContact
                }
                params['faultStatus'] = 3;
                this.$xttp.post(url, params).then(res => {
                    if(res.errorCode === 0) {
                        this.loading = false;
                        this.assignConfirmData = res.data;
                        this.current = 2;
                        this.show = false;
                        this.$message({
                            message: '分派成功',
                            type: 'success'
                        });
                    }
                }).catch( () => {
                this.loading = false;
                })    
            },
        },
        props: ["msg","data"],
        created() {
            let that = this.data;
            this.time = this.getTime(that.playTime, 'yyyy-MM-dd hh:mm'); 
            this.faultType = that.faultType == 1 ? '住户' : that.faultType == 2 ? '公共' : '其它';
            this.repairName = that.repairName;
        }

    }
</script>
