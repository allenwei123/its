import request from '@/utils/request.js'

export default {
    //房间档案 列表 分页
    list: params => request.get('/community/building/page', { params }),

    // 房间档案 删除
    delete: id => request.get(`/community/building/${id}/delete`),

    
}
