import Vue from 'vue';
import time from './time';

Vue.filter('time', function (value, format) {
  if (!value) return ''
  let _format = format || 'yyyy-MM-dd HH:mm:ss';
  let date = new Date();
  date.setTime(value);
  return time.dateFormat(date, _format);
});

/**
 * 用户关系
 */
Vue.filter('relationship', function (value) {
  if (!value) return '';
  let newValue = '';
  switch (value) {
    case 1:
      newValue = '业主';
      break;
    case 2:
      newValue = '家属';
      break;
    case 3:
      newValue = '租客';
      break;
  }
  return newValue;
});

/**
 * 政治面貌
 */
Vue.filter('politicsStatus', function (value) {
  if (!value) return '';
  let newValue = '';
  switch (value) {
    case 1:
      newValue = '群众';
      break;
    case 2:
      newValue = '中共党员(预备党员)'
      break;
    case 3:
      newValue = '共青团员';
      break;
    case 4:
      newValue = '民主党派';
      break;
    case 0:
      newValue = '其他';
      break;
  }
  return newValue;
});

Vue.filter('sex', function (value) {
  if (!value){
    return '';
  }
  let newValue = '';
  switch (value) {
    case 0:
      newValue = '未知';
      break;
    case 1:
      newValue = '男';
      break;
    case 2:
      newValue = '女';
      break;
    case null:
      newValue = '';
      break;
    // default:
    //   newValue = '未知';
  }
  return newValue;
});
Vue.filter('auditStatus', function (value) {
  if (!value) return '';
  let newValue = '';
  switch (value) {
    case 0:
      newValue = '未审核';
      break;
    case 1:
      newValue = '已审核';
      break;
    case -1:
      newValue = '未通过';
      break;
    case 3:
      newValue = '已解绑';
      break;
  }
  return newValue;
});

Vue.filter('postCode', function (value) {
  if (!value) return '';
  let newValue = '';
  switch (value) {
    case 'MANAGER':
      newValue = '物业管理员';
      break;
    case 'SECURITY':
      newValue = '保安';
      break;
    case 'CLEANER':
      newValue = '保洁';
      break;
    case 'SERVICEMAN':
      newValue = '维修工';
      break;
    case 'SUPPORTSTAFF':
      newValue = '客服人员';
      break;
    case 'CM_ADMIN':
      newValue = '后台管理员';
      break;
  }
  return newValue;
});

Vue.filter('dataStatus',function (value) {
  if (!value) return '';
  let newValue = '';
  switch (value) {
    case 1:
      newValue = '有效'
      break;
    case 0:
      newValue = '无效';
      break;
  }
  return newValue;
});

Vue.filter('serviceType',function (value){
  if (!value) return '';
  let newValue = '';
  switch (value) {
    case 1:
      newValue = '生活服务';
      break;
    case 2:
      newValue = '家政服务';
      break;
  }
  return newValue;
});

Vue.filter('serviceWay',function(value){
  if (!value) return '';
  let newValue = '';
  switch (value) {
    case 1:
      newValue = '热线服务';
      break;
    case 2:
      newValue = '在线服务';
      break;
  }
  return newValue;
});

Vue.filter('digitUppercase', function (n) {
  let i;
  const fraction = ['角', '分'];
  const digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  const head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  let s = '';
  for (i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
});

  Vue.filter('card', function(value) {
    if (!value) return ''
    let newValue = '';
    switch(value) {
      case 1:
        newValue = '手机蓝牙';
        break;
      case 2:
        newValue = '蓝牙卡';
        break;
      case 4:
        newValue = 'IC卡';
        break;
      case 8:
        newValue = '临时通行';
        break;
    }
    return newValue;
  })

/**
 * 用户关系
 */
Vue.filter('relationship', function (value) {
  if (!value) return '';
  let newValue = '';
  switch (value) {
    case 1:
      newValue = '业主';
      break;
    case 2:
      newValue = '家属';
      break;
    case 3:
      newValue = '租客';
      break;
  }
  return newValue;
});

/**
 * 优惠券状态
 * **/
Vue.filter('validStatus', function (value) {
  let newValue = '';
  switch (value) {
    case 0:
      newValue = '无效';
      break;
    case 1:
      newValue = '有效';
      break;
  }
  return newValue;
});
