export function Map() {
  let obj = arguments[0];
  var map = window.map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 16,
    icon: true,
    center: obj.local || null
  });
  window.marker = new AMap.Marker({draggable: true});
  marker.setMap(map);

  map.on('click', function (e) {
    map.setCenter([e.lnglat.getLng(), e.lnglat.getLat()]);//设置视图中心

    AMap.service("AMap.Geocoder", function () {
      window.geo = new AMap.Geocoder();
      window.geo.getAddress([e.lnglat.getLng(), e.lnglat.getLat()], function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          var address = result.regeocode.formattedAddress; //返回地址描述
          marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()]);//设置标注
          marker.setTitle(address);//设置标注提示
          if (obj.cb) {
            obj.cb({address: address, lng: e.lnglat.getLng(), lat: e.lnglat.getLat()});
          }
        }
      })
    })
  })

}

Map.prototype.getLocation = function (address, cb) {
  AMap.service("AMap.Geocoder", function () {
    window.geo = new AMap.Geocoder();
    window.geo.getLocation(address, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        if (!cb) return;
        window.map.setCenter([result.geocodes[0].location.lng, result.geocodes[0].location.lat]);//设置视图中心
        window.marker.setPosition([result.geocodes[0].location.lng, result.geocodes[0].location.lat]);//设置标注
        window.marker.setTitle(address);//设置标注提示
        cb({lng: result.geocodes[0].location.lng, lat: result.geocodes[0].location.lat})
      }
    })
  })
}.bind(this);

Map.prototype.searchFont = function ( search ,callback) {

  // map.plugin(["AMap.ToolBar"], function () {
  //   window.map.addControl(new AMap.ToolBar());

  AMap.service("AMap.Autocomplete", function () {
    var auto = new AMap.Autocomplete({
      input: "input1"
    });
    // AMap.event.addListener(auto, "select", function (e) {
    //   console.log(e)
    // });
    auto.search(search, function (status, result) {
      if (callback) {
        callback(result)
      }
    });
  })
  // });


};


