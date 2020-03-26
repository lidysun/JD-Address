layui.define(['jquery', 'addressData'], function(exports) {
    var $ = layui.jquery;
    var data = layui.addressData;
    var HqAddress = function(opt) {
        this.$el = $(opt.el);
        this.province = opt.province || 440000; //不传默认广东省
        this.city = opt.city;
        this.district = this.city ? opt.district : null;
        this.callback = opt.callback; //更改选择回调函数
        this.close = true; //滑出时是否关闭下拉
        this.init();
    }

    HqAddress.prototype.getPid = function(pid, cid, did) {
        var result = {
            provinceName: '', //省名称
            provinceArr: [], //全部省
            provinceId: pid, // 省id

            cityName: '', //市名称
            cityArr: [], //全部市
            cityId: cid, //市id

            districtName: '', //区名称
            districtArr: [], //全部区
            districtId: did //区id
        };
        for (var p in data) {
            result.provinceArr.push({
                "name": p,
                "id": data[p].val
            })
            if (data[p].val == pid + '') {
                result.provinceName = p;
                for (var c in data[p].items) {
                    result.cityArr.push({
                        "name": c,
                        "id": data[p].items[c].val
                    })
                    if ((data[p].items)[c].val == cid + '') {
                        result.cityName = c;
                        for (var d in data[p].items[c].items) {
                            result.districtArr.push({
                                "name": d,
                                "id": data[p].items[c].items[d]
                            })
                            if (data[p].items[c].items[d] == did + '') {
                                result.districtName = d;
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    HqAddress.prototype.render = function(d) {
        var _this = this;
        _this.$el.find('.text>div').text(d.provinceName + d.cityName + d.districtName);
        var html = '';
        // 省
        d.provinceArr.forEach(function(item, index, arr) {
            html += '<li class="area-province"><a data-type="province" data-id="' + item.id + '">' + item.name + '</a></li>';
        });
        // 市
        if (d.cityArr.length) {
            d.cityArr.forEach(function(item, index, arr) {
                html += '<li class="area-city" style="display:' + (d.cityId ? "list-item" : "none") + ';"><a data-type="city" data-id="' + item.id + '">' + item.name + '</a></li>';
            });
            html += '<li class="area-city" style="display:' + (d.cityId ? "list-item" : "none") + ';"><a class="btn-area-none" data-type="city" data-id="none" style="color:#f10215;">稍后再说</a></li>';
        }
        // 区
        if (d.districtId && d.districtArr.length) {
            d.districtArr.forEach(function(item, index, arr) {
                html += '<li class="area-district"><a data-type="district" data-id="' + item.id + '">' + item.name + '</a></li>';
            });
            html += '<li class="area-district"><a class="btn-area-none" data-type="district" data-id="none" style="color:#f10215;">稍后再说</a></li>';
        }
        // 结构
        var contentHtml = '<div class="content">' +
            '    <ul class="tab clearfix">' +
            '        <li data-type="province" class="tab-province curr"><a><em>' + (d.provinceName ? d.provinceName : "请选择") + '</em><i class="ui-address-triangle"></i></a></li>' +
            '        <li data-type="city" class="tab-city"><a><em>' + (d.cityName ? d.cityName : "请选择") + '</em><i class="ui-address-triangle"></i></a></li>' +
            '        <li data-type="district" class="tab-district" style="display:' + (d.districtId ? "list-item" : "none") + ';"><a><em>' + (d.districtName ? d.districtName : "请选择") + '</em><i class="ui-address-triangle"></i></a></li>' +
            '    </ul>' +
            '    <ul class="area-list clearfix">' + html + '</ul>' +
            '</div>';
        _this.$el.find('.text').after(contentHtml);
        _this.$el.find('.tab li').removeClass('curr');
        _this.$el.find('.tab-' + (d.districtId ? 'district' : (d.cityId ? 'city' : 'province'))).addClass('curr');
        if (d.cityId) {
            _this.$el.find('.area-list .area-province').hide();
        }
        // if (d.cityId && !d.districtId) {
        //     _this.$el.find('.area-list .area-district').hide();
        // }
        if (d.districtId) {
            _this.$el.find('.area-list .area-city').hide();
        }
    }

    HqAddress.prototype.handle = function() {
        var _this = this;
        var $el = _this.$el;
        $content = $el.find('.content');
        if (!$el.hasClass('ui-address-disabled')) {
            var index = $el.css('zIndex');
            $el.on('mouseenter', function(e) {
                $content = $el.find('.content');
                $el.css('zIndex', 99999);
                $('.ui-address .content').hide();
                $content.show()
            }).on('mouseleave', function(e) {
                if (_this.close) {
                    $content.hide();
                    $el.find('.text').css('borderBottomWidth', '1px');
                } else {
                    $el.find('.text').css('borderBottomWidth', '0px');
                }
                $el.css('zIndex', index);
            })
        }
        $el.on('click', '.area-list a', function(e) {
            var $me = $(this);
            var id = $me.attr('data-id');
            var type = $me.attr('data-type');
            var districtHtml = '';
            _this[type] = id;
            $el.find('.tab-' + type + ' em').text(id === 'none' ? '请选择' : $me.text());
            $el.find('.tab-' + type).nextAll('li').find('em').text('请选择');
            _this.close = false;
            if (type === 'province') {
                var newHtml = '';
                $el.find('.tab li').removeClass('curr');
                $el.find('.tab-city').addClass('curr');
                var pid = _this.getPid(id);
                if (pid.cityArr.length) {
                    pid.cityArr.forEach(function(item, index, arr) {
                        newHtml += '<li class="area-city" style="display:block;"><a data-type="city" data-id="' + item.id + '">' + item.name + '</a></li>'
                    })
                    newHtml += '<li class="area-city"><a class="btn-area-none" data-type="city" data-id="none" style="color:#f10215;">稍后再说</a></li>';
                }
                $el.find('.area-list .area-city').remove();
                $el.find('.area-list').append(newHtml);
                $el.find('.area-province').hide();
                _this.city = _this.district = null;
            } else if (type === 'city') {
                if (id === 'none') {
                    _this.city = _this.district = null;
                    var d = _this.getPid(_this.province);
                    _this.$el.find('.text>div').text(d.provinceName);
                    $el.find('.tab-district').hide();
                    _this.close = true;
                    $content.hide();
                } else {
                    var newHtml = '';
                    $el.find('.tab li').removeClass('curr');
                    $el.find('.tab-district').addClass('curr');
                    var pid = _this.getPid(_this.province, id);
                    if (pid.districtArr.length) {
                        pid.districtArr.forEach(function(item, index, arr) {
                            newHtml += '<li class="area-district" style="display:block;"><a data-type="district" data-id="' + item.id + '">' + item.name + '</a></li>'
                        })
                        newHtml += '<li class="area-district"><a class="btn-area-none" data-type="district" data-id="none" style="color:#f10215;">稍后再说</a></li>';
                    }
                    $el.find('.area-list .area-district').remove();
                    $el.find('.tab-district').show();
                    $el.find('.area-list').append(newHtml);
                    $el.find('.area-city').hide();
                    _this.district = null;
                }
            } else {
                if (id === 'none') {
                    _this.district = null;
                    var d = _this.getPid(_this.province, _this.city);
                    _this.$el.find('.text>div').text(d.provinceName + d.cityName);
                } else {
                    var d = _this.getPid(_this.province, _this.city, _this.district);
                    _this.$el.find('.text>div').text(d.provinceName + d.cityName + d.districtName);
                }
                _this.close = true;
                $content.hide();
            }
            _this.callback && _this.callback({
                el: $el,
                provinceId: _this.province,
                cityId: _this.city,
                districtId: _this.district
            });
        })
        $el.on('click', '.tab li', function(e) {
            var $me = $(this);
            var $el = _this.$el;
            var type = $me.attr('data-type');
            $me.addClass('curr').siblings('li').removeClass('curr');
            $el.find('.area-list li').hide();
            $el.find('.area-list .area-' + type).show();
        });
        $(document).on('click', function(e) {
            var $me = $(this);
            var $el = _this.$el;
            var $target = $(e.target);
            if (!$target.closest('.ui-address').length) {
                $el.find('.content').hide();
                $el.find('.text').css('borderBottomWidth', '1px');
            }
        })
    }

    HqAddress.prototype.init = function() {
        var _this = this;
        var d = this.getPid(this.province, this.city, this.district);
        this.render(d);
        this.handle();
    };
    //初始结构
    /*<div class="ui-address ui-address-disabled" id="j-address">
        <div class="ui-address-label">请选择地址：</div>
        <div class="ui-address-content">
            <div class="text"><div>请选择</div><i class="ui-address-triangle"></i></div>
        </div>
    </div>*/

    // 调用参考
    /*var a = new HqAddress({
        el: '#j-address', //挂载元素选择器
        province: 360000, //省id
        city: 360800, //市id
        district: 360826, //区id
        callback: function(result) { //更改地址后的回调
            console.log('已选择：', result)
        }
    });*/
    exports('hqAddress', HqAddress);
})