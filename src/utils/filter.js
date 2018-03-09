import Vue from 'vue'

Vue.filter('time', function (value) {
    if (!value) return ''
    let newValue = new Date(value)
      .toISOString()
      .split(".")[0]
      .replace("T", " ");
    return newValue;
  })

  Vue.filter('sex', function (value) {
    if (!value) return ''
    let newValue = '';
    switch(value) {
      case 0:
        newValue = '未知';
        break;
      case 1:
        newValue = '男';
        break;
      case 2:
        newValue = '女';
        break;
    }
    return newValue;
  })