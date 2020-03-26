# JD-Address
基于layui，防京东地址联动效果

 ```
layui.use(['hqAddress'],function () {
    var HqAddress = layui.hqAddress;
    // 调用
    var a = new HqAddress({
        el: '#j-address',
        province: 360000,
        // province: null,
        // city: 360800,
        // city: null,
        // district:360826,
        // district: null,
        callback: function(result) {
            console.log('已选择：', result)
        }
    });
})
 ```
