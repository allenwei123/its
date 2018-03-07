const time = {
    timestampToTime(ts) {
      let date = new Date();
      date.setTime(ts);
      return date;
    },
    timestampToFormat(ts, format) {
      const t = new Date();
      t.setTime(ts);
      const date = {
        "M+": t.getMonth() + 1,
        "d+": t.getDate(),
        "h+": t.getHours(),
        "m+": t.getMinutes(),
        "s+": t.getSeconds(),
        "q+": Math.floor((t.getMonth() + 3) / 3),
        "S+": t.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (const k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1
            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
      }
      return format;
    }
  };
  
  export default time;
