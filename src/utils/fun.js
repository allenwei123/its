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

const fun = {
  isPhoneAvailable(phone){
    return isPhoneAvailable(phone)
  },
  isTelAvailable(tel) {
    return isTelAvailable(tel)
  }
};

export default fun;