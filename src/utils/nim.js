export function NimObj() {
  let dataObj = arguments[0];
  let myAccount = '5ab10f6be4b0404a403f57bf';
  localStorage.setItem('nim_token', myAccount);
  this.nim = SDK.NIM.getInstance({
    debug: false,
    appKey: '911e01a0d6e89fef4caa86df82dd9b24',
    account:  myAccount,
    token: '2bb77f865bee408a8d19f6c5333efd97',
    onconnect: onconnect.bind(this),
    ondisconnect: ondisconnect.bind(this),
    onerror: onerror.bind(this),
    onwillreconnect: onwillreconnect.bind(this),
    onmsg: onmsg.bind(this),//接受消息
  });

  function onconnect(event) {
    dataObj.onconnect(event);
  }

  function ondisconnect(event) {
    console.log(event + '</br>')
  }

  function onerror(event) {
    console.log(event + '</br>')
  }

  function onwillreconnect(event) {
    console.log('错误提示' + event + '</br>')
  }

  function onmsg(evnet) {
    if(dataObj.onmsg) {
      dataObj.onmsg(evnet);
    }
  }
}

NimObj.prototype.getHistoryMsgs = function (id , callback) {
  this.nim.getHistoryMsgs({
    scene: 'p2p',
    to: id ,
    done: callback,
    limit:20,
    asc : true
  });
}

NimObj.prototype.sendTextMessage = function (scene, to, text, isLocal, callback) {
  isLocal = !!isLocal;
  this.nim.sendText({
    scene: scene || 'p2p',
    to: to,
    text: text,
    isLocal: isLocal,
    done: callback
  });
};

NimObj.prototype.markMsgRead = function (lastMsg, callback) {
  this.nim.markMsgRead({
    msg:lastMsg,
    done:callback
  })
}

NimObj.prototype.deleteLocalSession = function (id ,callback) {
  this.nim.deleteLocalSession({
    id: 'p2p-' + id,
    done: callback
  });
}

NimObj.prototype.getLocalSessions = function (callback) {//获取会话列表
  this.nim.getLocalSessions({
    limit: 50,
    done: getLocalSessionsDone
  });

  function getLocalSessionsDone(error, obj) {
    if(callback) {
      callback(error, obj)
    }
  }
};
NimObj.prototype.updateLocalSession = function (id, callback) {
  this.nim.updateLocalSession({
    id: 'p2p' + id,
    done: callback
  });
}

NimObj.prototype.getLocalMsgs = function (id,callback) {//通过用户id去查找对应本地缓存的信息
  this.nim.getLocalMsgs({
    sessionId: 'p2p-' + id ,
    limit: 50,
    desc:false,
    done: callback
  });
};
NimObj.prototype.getUser = function (id,callback) {
  this.nim.getUser({
    account: id,
    done: getUserDone
  });
  function getUserDone(error, user) {
      if(error)return;
      if(callback) {
        callback(user);
      }
  }
};

