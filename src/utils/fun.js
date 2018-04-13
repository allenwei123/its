/**
 * 手机正则
 * @param {*} phone 
 */
function isPhoneAvailable(phone) {
  let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 电话号码正则
 */
function isTelAvailable(tel) {
  let telReg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  if(!telReg.test(tel)){
    return false;
  } else {
    return true;
  }
}

/**
 * 手机号码+电话号码正则
 */
function isTelOrPhoneAvailable(telphone){
  // let telphoneReg = /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8})|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;
  let telphoneReg = /^[1][3,4,5,7,8][0-9]{9}|(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  if(!telphoneReg.test(telphone)){
    return false;
  }else{
    return true;
  }
}

const fun = {
  isPhoneAvailable(phone){
    return isPhoneAvailable(phone)
  },
  isTelAvailable(tel) {
    return isTelAvailable(tel)
  },
  isTelOrPhoneAvailable(telphone){
    return isTelOrPhoneAvailable(telphone)
  }
};

export default fun;