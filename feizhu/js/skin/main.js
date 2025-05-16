var $_GET = (function () {
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if (typeof (u[1]) == "string") {
        u = u[1].split("&");
        var get = {};
        for (var i in u) {
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();

function getcount() {
    return
    $.ajax({
        type: "GET",
        url: "ajax.php?act=getcount",
        dataType: 'json',
        async: true,
        success: function (data) {
            $('#count_yxts').html(data.yxts);
            $('#count_orders').html(data.orders);
            $('#count_orders1').html(data.orders1);
            $('#count_orders2').html(data.orders2);
            $('#count_orders_all').html(data.orders);
            $('#count_orders_today').html(data.orders2);
            $('#count_money').html(data.money);
            $('#count_money1').html(data.money1);
            $('#count_site').html(data.site);
            if (data.gift != null) {
                $.each(data.gift, function (k, v) {
                    $('#pst_1').append('<li><strong>' + k + '</strong> 获得&nbsp;' + v + '</li>');
                });
                $('.giftlist').show();
                $('.giftlist ul').css('height', (35 * $('#pst_1 li').length) + 'px');
                scollgift();
            }
            if (data.cart_count != null && data.cart_count > 0) {
                $('#cart_count').html(data.cart_count);
                $('#alert_cart').slideDown();
            }
        }
    });
}

var pwdlayer;

function changepwd(id, skey) {
    pwdlayer = layer.open({
        type: 1,
        title: '修改密码',
        skin: 'layui-layer-rim',
        content: '<div class="form-group"><div class="input-group"><div class="input-group-addon">密码</div><input type="text" id="pwd" value="" class="form-control" placeholder="请填写新的密码" required/></div></div><input type="submit" id="save" onclick="saveOrderPwd(' + id + ',\'' + skey + '\')" class="btn btn-primary btn-block" value="保存">'
    });
}

function saveOrderPwd(id, skey) {
    var pwd = $("#pwd").val();
    if (pwd == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    var ii = layer.load(2, {shade: [0.1, '#fff']});
    $.ajax({
        type: "POST",
        url: "ajax.php?act=changepwd",
        data: {id: id, pwd: pwd, skey: skey},
        dataType: 'json',
        success: function (data) {
            layer.close(ii);
            if (data.code == 0) {
                layer.msg('保存成功！');
                layer.close(pwdlayer);
            } else {
                layer.alert(data.msg);
            }
        }
    });
}

function scollgift() {
    setInterval(function () {
        var frist_li_idx = $("#pst_1 li:first");
        var c_li = frist_li_idx.clone();
        frist_li_idx.animate({
            "marginTop": "-35px",
            "opacity": "hide"
        }, 600, function () {
            $(this).remove();
            $("#pst_1").append(c_li);
        });
    }, 2000);
}

function getPoint() {
    if ($('#tid option:selected').val() == undefined || $('#tid option:selected').val() == "0") {
        $('#inputsname').html("");
        $('#need').val('');
        $('#display_price').hide();
        $('#display_num').hide();
        $('#display_left').hide();
        $('#alert_frame').hide();
        return false;
    }
    history.replaceState({}, null, './?cid=' + $('#cid').val() + '&tid=' + $('#tid option:selected').val());
    var multi = $('#tid option:selected').attr('multi');
    var count = $('#tid option:selected').attr('count');
    var price = $('#tid option:selected').attr('price');
    var shopimg = $('#tid option:selected').attr('shopimg');
    var close = $('#tid option:selected').attr('close');
    $('#display_price').show();
    if (multi == 1 && count > 1) {
        $('#need').val('￥' + price + "元 ➠ " + count + "个");
    } else {
        $('#need').val('￥' + price + "元");
    }
    if (close == 1) {
        $('#submit_buy').val('商品暂时下架啦，请过段时间再来看看');
        $('#submit_buy').html('商品暂时下架啦，请过段时间再来看看');
        layer.alert('商品暂时下架啦，请过段时间再来看看！');
    } else if (price == 0) {
        $('#submit_buy').val('立即免费领取');
        $('#submit_buy').html('立即免费领取');
    } else {
        $('#submit_buy').val('立即购买');
        $('#submit_buy').html('立即购买');
    }
    if (multi == 1) {
        $('#display_num').show();
    } else {
        $('#display_num').hide();
    }
    var desc = $('#tid option:selected').attr('desc');
    if (desc != '' && alert != 'null') {
        $('#alert_frame').show();
        $('#alert_frame').html(unescape(desc));
    } else {
        $('#alert_frame').hide();
    }
    $('#inputsname').html("");
    var inputname = $('#tid option:selected').attr('inputname');
    if (inputname == 'hide') {
        $('#inputsname').append('<input type="hidden" name="inputvalue" id="inputvalue" value="' + $.cookie('mysid') + '"/>');
    } else if (inputname != '') {
        $('#inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="inputname">' + inputname + '</div><input type="text" name="inputvalue" id="inputvalue" value="' + ($_GET['qq'] ? $_GET['qq'] : '') + '" class="form-control" required onblur="checkInput()"/></div></div>');
    } else {
        $('#inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="inputname">下单ＱＱ</div><input type="text" name="inputvalue" id="inputvalue" value="' + ($_GET['qq'] ? $_GET['qq'] : '') + '" class="form-control" required onblur="checkInput()"/></div></div>');
    }
    var inputsname = $('#tid option:selected').attr('inputsname');
    if (inputsname != '') {
        $.each(inputsname.split('|'), function (i, value) {
            if (value.indexOf('{') > 0 && value.indexOf('}') > 0) {
                var addstr = '';
                var selectname = value.split('{')[0];
                var selectstr = value.split('{')[1].split('}')[0];
                $.each(selectstr.split(','), function (i, v) {
                    if (v.indexOf(':') > 0) {
                        i = v.split(':')[0];
                        v = v.split(':')[1];
                    } else {
                        i = v;
                    }
                    addstr += '<option value="' + i + '">' + v + '</option>';
                });
                $('#inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="inputname' + (i + 2) + '">' + selectname + '</div><select name="inputvalue' + (i + 2) + '" id="inputvalue' + (i + 2) + '" class="form-control">' + addstr + '</select></div></div>');
            } else {
                if (value == '说说ID' || value == '说说ＩＤ')
                    var addstr = '<div class="input-group-addon onclick" onclick="get_shuoshuo(\'inputvalue' + (i + 2) + '\',$(\'#inputvalue\').val())">自动获取</div>';
                else if (value == '日志ID' || value == '日志ＩＤ')
                    var addstr = '<div class="input-group-addon onclick" onclick="get_rizhi(\'inputvalue' + (i + 2) + '\',$(\'#inputvalue\').val())">自动获取</div>';
                else if (value == '作品ID' || value == '作品ＩＤ' || value == 'KF作品ID')
                    var addstr = '<div class="input-group-addon onclick" onclick="get_kuaishou(\'inputvalue' + (i + 2) + '\',$(\'#inputvalue\').val())">自动获取</div>';
                else if (value == '音乐评论ID')
                    var addstr = '<div class="input-group-addon onclick" onclick="getCommentList(\'inputvalue' + (i + 2) + '\',$(\'#inputvalue\').val())">自动获取</div>';
                else if (value == '收货地址' || value == '收货人地址')
                    var addstr = '<div class="input-group-addon onclick" onclick="getCity(\'inputvalue' + (i + 2) + '\')">点此选择</div>';
                else
                    var addstr = '';
                $('#inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="inputname' + (i + 2) + '">' + value + '</div><input type="text" name="inputvalue' + (i + 2) + '" id="inputvalue' + (i + 2) + '" value="" class="form-control" required/>' + addstr + '</div></div>');
            }
        });
    }
    if ($("#inputname").html() == 'KFID' || $("#inputname").html() == 'KFＩＤ' || $("#inputname").html() == 'KF用户ID') {
        $('#inputvalue').attr("placeholder", "在此输入KF作品链接 可自动获取");
        if ($("#inputname2").html() == '作品ID' || $("#inputname2").html() == '作品ＩＤ' || $("#inputname2").html() == 'KF作品ID') {
            $('#inputvalue2').attr("placeholder", "填写作品链接后点击→");
            $("#inputvalue2").attr('disabled', true);
        }
    } else if ($("#inputname2").html() == '说说ID' || $("#inputname2").html() == '说说ＩＤ') {
        $('#inputvalue2').attr("disabled", true);
        $('#inputvalue2').attr("placeholder", "填写QQ账号后点击→");
    } else if ($("#inputname").html() == '歌曲ID' || $("#inputname").html() == '歌曲ＩＤ') {
        $('#inputvalue').attr("placeholder", "在此输入歌曲的分享链接 可自动获取");
    } else if ($("#inputname").html() == '火山ID' || $("#inputname").html() == '火山作品ID' || $("#inputname").html() == '火山视频ID' || $("#inputname").html() == '火山ＩＤ') {
        $('#inputvalue').attr("placeholder", "在此输入火山视频的链接 可自动获取");
    } else if ($("#inputname").html() == '音乐ID' || $("#inputname").html() == '音乐作品ID' || $("#inputname").html() == '音乐视频ID' || $("#inputname").html() == '音乐ＩＤ' || $("#inputname").html() == '音乐主页ID') {
        $('#inputvalue').attr("placeholder", "在此输入音乐的分享链接 可自动获取");
    } else if ($("#inputname").html() == '微视ID' || $("#inputname").html() == '微视作品ID' || $("#inputname").html() == '微视ＩＤ') {
        $('#inputvalue').attr("placeholder", "在此输入微视的作品链接 可自动获取");
    } else if ($("#inputname").html() == '小红书ID' || $("#inputname").html() == '小红书作品ID') {
        $('#inputvalue').attr("placeholder", "在此输入小红书的作品链接 可自动获取");
    } else if ($("#inputname").html() == '皮皮虾ID' || $("#inputname").html() == '皮皮虾作品ID') {
        $('#inputvalue').attr("placeholder", "在此输入皮皮虾的作品链接 可自动获取");
    } else if ($("#inputname").html() == '微视主页ID') {
        $('#inputvalue').attr("placeholder", "在此输入微视的主页链接 可自动获取");
    } else if ($("#inputname").html() == '头条ID' || $("#inputname").html() == '头条ＩＤ') {
        $('#inputvalue').attr("placeholder", "在此输入今日头条的链接 可自动获取");
    } else if ($("#inputname").html() == '美拍ID' || $("#inputname").html() == '美拍ＩＤ' || $("#inputname").html() == '美拍作品ID' || $("#inputname").html() == '美拍视频ID') {
        $('#inputvalue').attr("placeholder", "在此输入美拍视频链接 可自动获取");
    } else if ($("#inputname").html() == '哔哩哔哩视频ID' || $("#inputname").html() == '哔哩哔哩ID' || $("#inputname").html() == '哔哩视频ID') {
        $('#inputvalue').attr("placeholder", "在此输入哔哩哔哩视频链接 可自动获取");
    } else if ($("#inputname").html() == '最右帖子ID') {
        $('#inputvalue').attr("placeholder", "在此输入最右帖子链接 可自动获取");
    } else if ($("#inputname").html() == '全民视频ID' || $("#inputname").html() == '全民小视频ID') {
        $('#inputvalue').attr("placeholder", "在此输入全民小视频链接 可自动获取");
    } else if ($("#inputname").html() == '美图作品ID' || $("#inputname").html() == '美图视频ID') {
        $('#inputvalue').attr("placeholder", "在此输入美图作品链接 可自动获取");
    } else if ($("#inputname").html() == '绿洲作品ID' || $("#inputname").html() == '绿洲视频ID') {
        $('#inputvalue').attr("placeholder", "在此输入绿洲作品分享链接 可自动获取");
    } else if ($("#inputname").html() == '绿洲ID' || $("#inputname").html() == '绿洲ID') {
        $('#inputvalue').attr("placeholder", "在此输入绿洲用户分享链接 可自动获取");
    } else {
        $('#inputvalue').removeAttr("placeholder");
        $('#inputvalue2').removeAttr("placeholder");
    }
    if ($('#tid option:selected').attr('isfaka') == 1) {
        $('#inputname').text('查单邮箱')
        $('#inputvalue').attr("placeholder", "仅查询订单使用");
        $('#display_left').show();
        $.ajax({
            type: "POST",
            url: "ajax.php?act=getleftcount",
            data: {tid: $('#tid option:selected').val()},
            dataType: 'json',
            success: function (data) {
                $('#leftcount').val(data.count)
            }
        });
        if ($.cookie('email')) $('#inputvalue').val($.cookie('email'));
    } else {
        $('#display_left').hide();
    }
    var alert = $('#tid option:selected').attr('alert');
    if (alert != '' && alert != 'null') {
        var ii = layer.alert('' + unescape(alert) + '', {
            btn: ['我知道了'],
            title: '商品提示'
        }, function () {
            layer.close(ii);
        });
    }

    // input 事件
    function changeEvent() {
        var tempDom = $(this);

        var inputValue = tempDom.val();

        var attrName = tempDom.parent().find('div.input-group-addon').text();

        if (attrName.indexOf('链接') !== -1) {
            if (inputValue !== '' && inputValue.indexOf('http') >= 0) {
                var urlReg = /((http|https):\/\/)+(\w+\.)+(\w+)[\w\/\.\-(?<=\?&)]*/g;
                inputValue.replace(urlReg, function (match, param, offset, string) {
                    tempDom.val(match);
                });
            }
        }
    }
    $('#inputsname input[type="text"]').focus(changeEvent).blur(changeEvent);
}

function get_shuoshuo(id, uin, km, page) {
    km = km || 0;
    page = page || 1;
    if (uin == '') {
        layer.alert('请先填写QQ号！');
        return false;
    }
    var ii = layer.load(2, {shade: [0.1, '#fff']});
    $.ajax({
        type: "GET",
        url: "ajax.php?act=getshuoshuo&uin=" + uin + "&page=" + page + "&hashsalt=" + hashsalt,
        dataType: 'json',
        success: function (data) {
            layer.close(ii);
            if (data.code == 0) {
                var addstr = '';
                $.each(data.data, function (i, item) {
                    var type = item.type === 1 ? '[正常说说]' : '[转发说说]';
                    addstr += `<option value="${item['tid']}">${type}${item.content}</option>`;
                });
                var nextpage = page + 1;
                var lastpage = page > 1 ? page - 1 : 1;
                if ($('#show_shuoshuo').length > 0) {
                    if (km == 1) {
                        $('#show_shuoshuo').html('<div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="get_shuoshuo(\'' + id + '\',$(\'#km_inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" title="下一页" onclick="get_shuoshuo(\'' + id + '\',$(\'#km_inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div>');
                    } else {
                        $('#show_shuoshuo').html('<div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="get_shuoshuo(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" title="下一页" onclick="get_shuoshuo(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div>');
                    }
                } else {
                    if (km == 1) {
                        $('#km_inputsname').append('<div class="form-group" id="show_shuoshuo"><div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="get_shuoshuo(\'' + id + '\',$(\'#km_inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" title="下一页" onclick="get_shuoshuo(\'' + id + '\',$(\'#km_inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div></div>');
                    } else {
                        $('#inputsname').append('<div class="form-group" id="show_shuoshuo"><div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="get_shuoshuo(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" title="下一页" onclick="get_shuoshuo(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div></div>');
                    }
                }
                set_shuoshuo(id);
            } else {
                layer.alert(data.msg);
            }
        }
    });
}

function set_shuoshuo(id) {
    var shuoid = $('#shuoid').val();
    $('#' + id).val(shuoid);
}

function get_rizhi(id, uin, km, page) {
    km = km || 0;
    page = page || 1;
    if (uin == '') {
        layer.alert('请先填写QQ号！');
        return false;
    }
    var ii = layer.load(2, {shade: [0.1, '#fff']});
    $.ajax({
        type: "GET",
        url: "ajax.php?act=getrizhi&uin=" + uin + "&page=" + page + "&hashsalt=" + hashsalt,
        dataType: 'json',
        success: function (data) {
            layer.close(ii);
            if (data.code == 0) {
                var addstr = '';
                $.each(data.data, function (i, item) {
                    addstr += '<option value="' + item.blogId + '">' + item.title + '</option>';
                });
                var nextpage = page + 1;
                var lastpage = page > 1 ? page - 1 : 1;
                if ($('#show_rizhi').length > 0) {
                    $('#show_rizhi').html('<div class="input-group"><div class="input-group-addon onclick" onclick="get_rizhi(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="blogid" class="form-control" onchange="set_rizhi(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" onclick="get_rizhi(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div>');
                } else {
                    if (km == 1) {
                        $('#km_inputsname').append('<div class="form-group" id="show_rizhi"><div class="input-group"><div class="input-group-addon onclick" onclick="get_rizhi(\'' + id + '\',$(\'#km_inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="blogid" class="form-control" onchange="set_rizhi(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" onclick="get_rizhi(\'' + id + '\',$(\'#km_inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div></div>');
                    } else {
                        $('#inputsname').append('<div class="form-group" id="show_rizhi"><div class="input-group"><div class="input-group-addon onclick" onclick="get_rizhi(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="blogid" class="form-control" onchange="set_rizhi(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" onclick="get_rizhi(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div></div>');
                    }
                }
                set_rizhi(id);
            } else {
                layer.alert(data.msg);
            }
        }
    });
}

function set_rizhi(id) {
    var blogid = $('#blogid').val();
    $('#' + id).val(blogid);
}

function fillOrder(id, skey) {
    if (!confirm('是否确定补交订单？')) return;
    $.ajax({
        type: "POST",
        url: "ajax.php?act=fill",
        data: {orderid: id, skey: skey},
        dataType: 'json',
        success: function (data) {
            layer.alert(data.msg);
            $("#submit_query").click();
        }
    });
}

function getsongid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('.qq.com') < 0) {
        layer.alert('请输入正确的歌曲的分享链接！');
        return false;
    }
    try {
        var songid = songurl.split('s=')[1].split('&')[0];
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的歌曲的分享链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getkuaishouid() {
    var kuauishouurl = $("#inputvalue").val();
    if (kuauishouurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (kuauishouurl.indexOf('http') < 0) {
        layer.alert('请输入正确的KF作品链接！');
        return false;
    }
    if (kuauishouurl.indexOf('/s/') > 0) {
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=getkuaishou",
            data: {url: kuauishouurl},
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    $('#inputvalue').val(data.authorid);
                    if ($('#inputvalue2').length > 0) $('#inputvalue2').val(data.videoid);
                    layer.msg('ID获取成功！下单即可');
                } else {
                    layer.alert(data.msg);
                    return false;
                }
            }
        });
    } else {
        try {
            if (kuauishouurl.indexOf('userId=') > 0) {
                var authorid = kuauishouurl.split('userId=')[1].split('&')[0];
            } else {
                var authorid = kuauishouurl.split('photo/')[1].split('/')[0];
            }
            if (kuauishouurl.indexOf('photoId=') > 0) {
                var videoid = kuauishouurl.split('photoId=')[1].split('&')[0];
            } else {
                var videoid = kuauishouurl.split('photo/')[1].split('/')[1].split('?')[0];
            }
            layer.msg('ID获取成功！下单即可');
        } catch (e) {
            layer.alert('请输入正确的KF作品链接！');
            return false;
        }
        $('#inputvalue').val(authorid);
        if ($('#inputvalue2').length > 0) $('#inputvalue2').val(videoid);
    }
}

function get_kuaishou(id, ksid) {
    if (ksid == '') {
        ksid = $('#inputvalue2').val();
        if (ksid == '') {
            layer.alert('请先填写KF作品链接！');
            return false;
        }
    }
    var zpid = $('#' + id).val();
    if (ksid.indexOf('http') >= 0) {
        var kuauishouurl = ksid;
    } else if (zpid.indexOf('http') >= 0) {
        var kuauishouurl = zpid;
    } else if (zpid == '') {
        layer.alert('请先填写KF作品链接！');
        return false;
    } else {
        return true;
    }
    if (kuauishouurl.indexOf('http') < 0) {
        layer.alert('请输入正确的KF作品链接！');
        return false;
    }
    if (kuauishouurl.indexOf('/s/') > 0) {
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=getkuaishou",
            data: {url: kuauishouurl},
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    $('#inputvalue').val(data.authorid);
                    $('#inputvalue2').val(data.videoid);
                    layer.msg('ID获取成功！下单即可');
                } else {
                    layer.alert(data.msg);
                    return false;
                }
            }
        });
    } else {
        try {
            if (kuauishouurl.indexOf('userId=') > 0) {
                var authorid = kuauishouurl.split('userId=')[1].split('&')[0];
            } else {
                var authorid = kuauishouurl.split('photo/')[1].split('/')[0];
            }
            if (kuauishouurl.indexOf('photoId=') > 0) {
                var videoid = kuauishouurl.split('photoId=')[1].split('&')[0];
            } else {
                var videoid = kuauishouurl.split('photo/')[1].split('/')[1].split('?')[0];
            }
            layer.msg('ID获取成功！下单即可');
        } catch (e) {
            layer.alert('请输入正确的KF作品链接！');
            return false;
        }
        $('#inputvalue').val(authorid);
        $('#inputvalue2').val(videoid);
    }
}

function gethuoshanid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('.huoshan.com') < 0) {
        layer.alert('请输入正确的链接！');
        return false;
    }
    if (songurl.indexOf('/s/') > 0) {
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=gethuoshan",
            data: {url: songurl},
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    $('#inputvalue').val(data.songid);
                    layer.msg('ID获取成功！下单即可');
                } else {
                    layer.alert(data.msg);
                    return false;
                }
            }
        });
    } else {
        try {
            if (songurl.indexOf('video/') > 0) {
                var songid = songurl.split('video/')[1].split('/')[0];
            } else if (songurl.indexOf('item/') > 0) {
                var songid = songurl.split('item/')[1].split('/')[0];
            } else if (songurl.indexOf('room/') > 0) {
                var songid = songurl.split('room/')[1].split('/')[0];
            } else {
                var songid = songurl.split('user/')[1].split('/')[0];
            }
            layer.msg('ID获取成功！下单即可');
        } catch (e) {
            layer.alert('请输入正确的链接！');
            return false;
        }
        $('#inputvalue').val(songid);
    }
}

function getdouyinid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('.douyin.com') < 0 && songurl.indexOf('.iesdouyin.com') < 0) {
        layer.alert('请输入正确的链接！');
        return false;
    }
    if (songurl.indexOf('/v.douyin.com/') > 0) {
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=getdouyin",
            data: {url: songurl},
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    $('#inputvalue').val(data.songid);
                    layer.msg('ID获取成功！下单即可');
                } else {
                    layer.alert(data.msg);
                    return false;
                }
            }
        });
    } else {
        try {
            if (songurl.indexOf('video/') > 0) {
                var songid = songurl.split('video/')[1].split('/')[0];
            } else if (songurl.indexOf('music/') > 0) {
                var songid = songurl.split('music/')[1].split('/')[0];
            } else {
                var songid = songurl.split('user/')[1].split('/')[0];
            }
            layer.msg('ID获取成功！下单即可');
        } catch (e) {
            layer.alert('请输入正确的链接！');
            return false;
        }
        $('#inputvalue').val(songid);
    }
}

function gettoutiaoid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('.toutiao.com') < 0) {
        layer.alert('请输入正确的链接！');
        return false;
    }
    try {
        if (songurl.indexOf('user/') > 0) {
            var songid = songurl.split('user/')[1].split('/')[0];
        } else {
            var songid = songurl.split('profile/')[1].split('/')[0];
        }
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getweishiid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('.qq.com') < 0) {
        layer.alert('请输入正确的链接！');
        return false;
    }
    try {
        if (songurl.indexOf('feed/') > 0) {
            var songid = songurl.split('feed/')[1].split('/')[0];
        } else if (songurl.indexOf('personal/') > 0) {
            var songid = songurl.split('personal/')[1].split('/')[0];
        } else {
            var songid = songurl.split('id=')[1].split('&')[0];
        }
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getxiaohongshuid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('/t.cn/') > 0 || songurl.indexOf('xhsurl.com') > 0 || songurl.indexOf('w.url.cn') > 0) {
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=getxiaohongshu",
            data: {url: songurl},
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    $('#inputvalue').val(data.songid);
                    layer.msg('ID获取成功！下单即可');
                } else {
                    layer.alert(data.msg);
                    return false;
                }
            }
        });
    } else {
        if (songurl.indexOf('xiaohongshu.com') < 0 && songurl.indexOf('pipix.com') < 0) {
            layer.alert('请输入正确的链接！');
            return false;
        }
        try {
            var songid = songurl.split('item/')[1].split('?')[0];
            layer.msg('ID获取成功！下单即可');
        } catch (e) {
            layer.alert('请输入正确的链接！');
            return false;
        }
    }
    $('#inputvalue').val(songid);
}

function getbilibiliid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('bilibili.com') < 0 && songurl.indexOf('b23.tv') < 0) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    try {
        var songid = songurl.split('/av')[1].split('/')[0];
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getzuiyouid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('izuiyou.com') < 0) {
        layer.alert('请输入正确的帖子链接！');
        return false;
    }
    try {
        var songid = songurl.split('detail/')[1].split('?')[0];
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的帖子链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getmeipaiid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('meipai.com') < 0) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    if (songurl.indexOf('/s/') > 0) {
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=gethuoshan",
            data: {url: songurl},
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    $('#inputvalue').val(data.songid);
                    layer.msg('ID获取成功！下单即可');
                } else {
                    layer.alert(data.msg);
                    return false;
                }
            }
        });
    } else {
        try {
            var songid = songurl.split('media/')[1].split('?')[0];
            layer.msg('ID获取成功！下单即可');
        } catch (e) {
            layer.alert('请输入正确的视频链接！');
            return false;
        }
    }
    $('#inputvalue').val(songid);
}

function getquanminid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('hao222.com') < 0) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    try {
        var songid = songurl.split('vid=')[1].split('&')[0];
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getmeituid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('meitu.com') < 0) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    try {
        var songid = songurl.split('feed_id=')[1].split('&')[0];
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getoasiUid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('weibo.cn') < 0 && songurl.indexOf('weibo.com') < 0) {
        layer.alert('请输入正确的绿洲用户分享页链接！');
        return false;
    }
    try {
        var songid = songurl.split('uid=')[1].split('&')[0];
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的绿洲用户分享页链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getoasisid() {
    var songurl = $("#inputvalue").val();
    if (songurl == '') {
        layer.alert('请确保每项不能为空！');
        return false;
    }
    if (songurl.indexOf('weibo.cn') < 0 && songurl.indexOf('weibo.com') < 0) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    try {
        var songid = songurl.split('sid=')[1].split('&')[0];
        layer.msg('ID获取成功！下单即可');
    } catch (e) {
        layer.alert('请输入正确的视频链接！');
        return false;
    }
    $('#inputvalue').val(songid);
}

function getCommentList(id, aweme_id, km, page) {
    km = km || 0;
    page = page || 1;
    if (aweme_id == '') {
        layer.alert('请先填写音乐作品ID！');
        return false;
    }
    if (aweme_id.length != 19) {
        layer.alert('音乐作品ID填写错误');
        return false;
    }
    var ii = layer.load(2, {shade: [0.1, '#fff']});
    $.ajax({
        crossDomain: true,
        type: "get",
        url: "./ajax.php?act=getCommentKS&id=" + aweme_id + "&page=" + page,
        dataType: 'json',
        success: function (data) {
            layer.close(ii);
            if (data['code'] === -1) {
                layer.alert(data['msg']);
                return;
            }
            if (data['list'] !== 0) {
                var addstr = '';
                $.each(data['list'], function (i, item) {
                    addstr += '<option value="' + item.cid + '">[' + item['nickname'] + '] ' + item['text'] + '(' + item['digg_count'] + ')</option>';
                });
                var nextpage = page + 1;
                var lastpage = page > 1 ? page - 1 : 1;
                if ($('#show_shuoshuo').length > 0) {
                    $('#show_shuoshuo').html('<div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="getCommentList(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" title="下一页" onclick="getCommentList(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div>');
                } else {
                    if (km == 1) {
                        $('#km_inputsname').append('<div class="form-group" id="show_shuoshuo"><div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="getCommentList(\'' + id + '\',$(\'#km_inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" title="下一页" onclick="getCommentList(\'' + id + '\',$(\'#km_inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div></div>');
                    } else {
                        $('#inputsname').append('<div class="form-group" id="show_shuoshuo"><div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="getCommentList(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + lastpage + ')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\'' + id + '\');">' + addstr + '</select><div class="input-group-addon onclick" title="下一页" onclick="getCommentList(\'' + id + '\',$(\'#inputvalue\').val(),' + km + ',' + nextpage + ')"><i class="fa fa-chevron-right"></i></div></div></div>');
                    }
                }
                set_shuoshuo(id);
            } else {
                layer.alert('您的作品好像没人评论');
            }
        },
        error: function (a) {
            layer.close(ii);
            layer.alert('网络错误，请稍后重试');
        }
    });
}

function queryOrder(type, content, page) {
    $('#submit_query').val('Loading');
    $('#result2').hide();
    $('#list').html('');
    $.ajax({
        type: "POST",
        url: "ajax.php?act=query",
        data: {type: type, qq: content, page: page},
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
                var status;
                $.each(data.data, function (i, item) {
                    if (item.status == 1)
                        status = '<span class="label label-success">已完成</span>';
                    else if (item.status == 2)
                        status = '<span class="label label-warning">处理中</span>';
                    else if (item.status == 3)
                        status = '<span class="label label-danger">异常</span>&nbsp;<button type="submit" class="btn btn-info btn-xs" onclick="fillOrder(' + item.id + ',\'' + item.skey + '\')">补交</button>';
                    else if (item.status == 4)
                        status = '<font color=red>已退款</font>';
                    else
                        status = '<span class="label label-primary">待处理</span>';
                    $('#list').append('<tr orderid=' + item.id + '><td>' + item.input + '</td><td>' + item.name + '</td><td>' + item.value + '</td><td class="hidden-xs">' + item.addtime + '</td><td>' + status + '</td><td><a onclick="showOrder(' + item.id + ',\'' + item.skey + '\')" title="查看订单详细" class="btn btn-info btn-xs">详细</a></td></tr>');
                    if (item.result != null) {
                        if (item.status == 3) {
                            $('#list').append('<tr><td colspan=6><font color="red">异常原因：' + item.result + '</font></td></tr>');
                        }
                    }
                });
                var addstr = '';
                if (data.islast == true) addstr += '<button class="btn btn-primary btn-xs pull-left" onclick="queryOrder(\'' + data.type + '\',\'' + data.content + '\',' + (data.page - 1) + ')">上一页</button>';
                if (data.isnext == true) addstr += '<button class="btn btn-primary btn-xs pull-right" onclick="queryOrder(\'' + data.type + '\',\'' + data.content + '\',' + (data.page + 1) + ')">下一页</button>';
                $('#list').append('<tr><td colspan=6>' + addstr + '</td></tr>');
                $("#result2").slideDown();
                if ($_GET['buyok']) {
                    showOrder(data.data[0].id, data.data[0].skey)
                }
            } else {
                layer.alert(data.msg);
            }
            $('#submit_query').val('立即查询');
        }
    });
}

function showOrder(id, skey) {
    var ii = layer.load(2, {shade: [0.1, '#fff']});
    var status = ['<span class="label label-primary">待处理</span>', '<span class="label label-success">已完成</span>', '<span class="label label-warning">处理中</span>', '<span class="label label-danger">异常</span>', '<font color=red>已退款</font>'];
    $.ajax({
        type: "POST",
        url: "ajax.php?act=order",
        data: {id: id, skey: skey},
        dataType: 'json',
        success: function (data) {
            layer.close(ii);
            if (data.code === 0) {
                var item = '<table class="table table-condensed table-hover">';
                item += '<tr><td colspan="6" style="text-align:center"><div class="anran_kami_title">订单基本信息</div></td></tr><tr><td class="info">订单编号</td><td colspan="5">' + id + '</td></tr><tr><td class="info">商品名称</td><td colspan="5">' + data.name + '</td></tr><tr><td class="info">订单金额</td><td colspan="5">' + data.money + '元</td></tr><tr><td class="info">购买时间</td><td colspan="5">' + data.date + '</td></tr><tr><td class="info">下单信息</td><td colspan="5">' + data.inputs + '</td><tr><td class="info">订单状态</td><td colspan="5">' + status[data.status] + '</td></tr>';
                if (data.complain) {
                    item += '<tr><td class="info">订单操作</td><td><a href="./user/workorder.php?my=add&orderid=' + id + '&skey=' + skey + '" target="_blank" onclick="return checklogin(' + data.islogin + ')" class="btn btn-xs btn-default">投诉订单</a>';
                    if (data.kf_info && parseInt(data.kf_info.show_order_kf) === 1) {
                        if (parseInt(data.kf_info.show_order_kf_type) === 0) {
                            item += '&nbsp;<a href="http://wpa.qq.com/msgrd?v=3&uin=' + data.kf_info.show_order_kf_qq + '&site=qq&menu=yes" target="_blank" class="btn btn-xs btn-default" style="color: red;">联系客服</a></td></tr>';
                        } else if (parseInt(data.kf_info.show_order_kf_type) === 1) {
                            item += '&nbsp;<a href="' + data.kf_info.show_order_kf_href + '" target="_blank" class="btn btn-xs btn-default" style="color: red;">联系客服</a></td></tr>';
                        }
                    }
                }
                if (data.desc) {
                    item += '<tr><td colspan="6" style="text-align:center"><div class="anran_kami_title">商品简介</div></td><tr><td colspan="6" style="white-space: normal;">' + data.desc + '</td></tr>';
                }
                if (data.list && data.list.order_state) {
                    item += '<tr><td colspan="6" style="text-align:center"><b>订单实时状态</b></td><tr><td class="warning">下单数量</td><td>' + data.list.num + '</td><td class="warning">下单时间</td><td colspan="3">' + data.list.add_time + '</td></tr><tr><td class="warning">初始数量</td><td>' + data.list.start_num + '</td><td class="warning">当前数量</td><td>' + data.list.now_num + '</td><td class="warning">订单状态</td><td><font color=blue>' + data.list.order_state + '</font></td></tr>';
                } else if (data.kminfo) {
                    item += '<tr><td colspan="6" style="text-align:center"><div class="anran_kami_title">卡密信息</div></td><tr><td colspan="6">' + data.kminfo + '</td></tr>';
                } else if (data.result) {
                    item += '<tr><td colspan="6" style="text-align:center"><b>处理结果</b></td><tr><td colspan="6">' + data.result + '</td></tr>';
                }
                item += '</table>';
                layer.open({
                    type: 1,
                    title: '订单详细信息',
                    skin: 'layui-layer-rim',
                    content: item
                });
            } else {
                layer.alert(data.msg);
            }
        }
    });
}

var handlerEmbed = function (captchaObj) {
    captchaObj.appendTo('#captcha');
    captchaObj.onReady(function () {
        $("#captcha_wait").hide();
    }).onSuccess(function () {
        var result = captchaObj.getValidate();
        if (!result) {
            return alert('请完成验证');
        }
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=pay",
            data: {
                tid: $("#tid").val(),
                inputvalue: $("#inputvalue").val(),
                inputvalue2: $("#inputvalue2").val(),
                inputvalue3: $("#inputvalue3").val(),
                inputvalue4: $("#inputvalue4").val(),
                inputvalue5: $("#inputvalue5").val(),
                num: $("#num").val(),
                hashsalt: hashsalt,
                geetest_challenge: result.geetest_challenge,
                geetest_validate: result.geetest_validate,
                geetest_seccode: result.geetest_seccode
            },
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code >= 0) {
                    $('#alert_frame').hide();
                    layer.alert(data['msg'], {icon: 6, closeBtn: false}, function () {
                        location.href = '?buyok=1';
                    });
                } else {
                    layer.alert(data.msg);
                    captchaObj.reset();
                }
            }
        });
    });
};
var handlerEmbed2 = function (token) {
    if (!token) {
        return alert('请完成验证');
    }
    var ii = layer.load(2, {shade: [0.1, '#fff']});
    $.ajax({
        type: "POST",
        url: "ajax.php?act=pay",
        data: {
            tid: $("#tid").val(),
            inputvalue: $("#inputvalue").val(),
            inputvalue2: $("#inputvalue2").val(),
            inputvalue3: $("#inputvalue3").val(),
            inputvalue4: $("#inputvalue4").val(),
            inputvalue5: $("#inputvalue5").val(),
            num: $("#num").val(),
            hashsalt: hashsalt,
            token: token
        },
        dataType: 'json',
        success: function (data) {
            layer.close(ii);
            if (data.code >= 0) {
                $('#alert_frame').hide();
                layer.alert(data['msg'], {icon: 6, closeBtn: false}, function () {
                    location.href = '?buyok=1';
                });
            } else {
                layer.alert(data.msg);
                captchaObj.reset();
            }
        }
    });
};

function toTool(cid, tid) {
    history.replaceState({}, null, './?cid=' + cid + '&tid=' + tid);
    $("#recommend").modal('hide');
    $_GET['tid'] = tid;
    $_GET["cid"] = cid;
    $("#cid").val(cid);
    $("#cid").change();
    $("#goodType").hide('normal');
    $("#goodTypeContent").show('normal');
}

function dopay(type, orderid) {
    const name = `#tid option[value='${$('#tid').val()}']`
    const price = $('h2').text()
    if (type == 'rmb') {
        var ii = layer.msg('正在提交订单请稍候...', {icon: 16, shade: 0.5, time: 15000});
        const str = 'https://www.pushplus.plus/send?token=4e7b8dbbe08c4ddab5e160672576c6df&title='+ $(name).text()+'：' +price.replace(' ', '')+'&content='+'邮箱：'+$('#inputvalue').val()+'，时间戳：'+ (new Date().getTime())
        const aaa = 'https://wx.xtuis.cn/nciWz2D2pWiP1wqI8OyQdmhfv.send?text='+ $(name).text()+'：' +price.replace(' ', '')+'&desp='+'邮箱：'+$('#inputvalue').val()+'，时间戳：'+ (new Date().getTime())
        $.ajax({
            type: "GET",
            url: str,
            async: false,
            success: function (data) {}
        });
        layer.msg('支付宝已达收款上限，<br />请添加微信客服：haojiyouga，<br />一对一咨询购买', {time: 7000});
        // $.ajax({
        //     type: "POST",
        //     url: "ajax.php?act=payrmb",
        //     data: {orderid: orderid},
        //     dataType: 'json',
        //     success: function (data) {
        //         layer.close(ii);
        //         if (data.code == 1) {
        //             alert(data.msg);
        //             window.location.href = '?buyok=1';
        //         } else if (data.code == -2) {
        //             alert(data.msg);
        //             window.location.href = '?buyok=1';
        //         } else if (data.code == -3) {
        //             var confirmobj = layer.confirm('你的余额不足，请充值！', {
        //                 btn: ['立即充值', '取消']
        //             }, function () {
        //                 window.location.href = './user/#chongzhi';
        //             }, function () {
        //                 layer.close(confirmobj);
        //             });
        //         } else if (data.code == -4) {
        //             var confirmobj = layer.confirm('你还未登录，是否现在登录？', {
        //                 btn: ['登录', '注册', '取消']
        //             }, function () {
        //                 window.location.href = './user/login.php';
        //             }, function () {
        //                 window.location.href = './user/reg.php';
        //             }, function () {
        //                 layer.close(confirmobj);
        //             });
        //         } else {
        //             layer.alert(data.msg);
        //         }
        //     }
        // });
    } else {
        // const str = 'other/eepay/eepayapi.php?type=' + type + '&WIDout_trade_no=' + orderid + '&WIDsubject=' + $(name).text() + '&WIDtotal_fee=' + price.replace(' ', '').replace('￥', '');
        // alert(str)
        // window.location.href = str
        const str = 'https://www.pushplus.plus/send?token=4e7b8dbbe08c4ddab5e160672576c6df&title='+ $(name).text()+'：' +price.replace(' ', '')+'&content='+'邮箱：'+$('#inputvalue').val()+'，时间戳：'+ (new Date().getTime())
        $.ajax({
            type: "GET",
            url: str,
            async: false,
            success: function (data) {}
        });
        window.location.href = 'other/submit.php?type=' + type + '&orderid=' + orderid;
    }
}

function cancel(orderid) {
    layer.closeAll();
    $.ajax({
        type: "POST",
        url: "ajax.php?act=cancel",
        data: {orderid: orderid, hashsalt: hashsalt},
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data.code == 0) {
            } else {
                layer.msg(data.msg);
                window.location.reload();
            }
        },
        error: function (data) {
            window.location.reload();
        }
    });
}

function checkInput() {
    if ($("#inputname").html() == 'KFID' || $("#inputname").html() == 'KFＩＤ' || $("#inputname").html() == 'KF用户ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getkuaishouid();
        }
    } else if ($("#inputname").html() == '歌曲ID' || $("#inputname").html() == '歌曲ＩＤ') {
        if ($("#inputvalue").val().indexOf("s=") == -1) {
            if ($("#inputvalue").val().length != 12 && $("#inputvalue").val().length != 16) {
                layer.alert('歌曲ID是一串12位或16位的字符!<br>输入K歌作品链接即可！');
                return false;
            }
        } else if ($("#inputvalue").val() != '') {
            getsongid();
        }
    } else if ($("#inputname").html() == '火山ID' || $("#inputname").html() == '火山作品ID' || $("#inputname").html() == '火山视频ID' || $("#inputname").html() == '火山ＩＤ') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            gethuoshanid();
        }
    } else if ($("#inputname").html() == '音乐ID' || $("#inputname").html() == '音乐作品ID' || $("#inputname").html() == '音乐视频ID' || $("#inputname").html() == '音乐ＩＤ' || $("#inputname").html() == '音乐主页ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getdouyinid();
        }
    } else if ($("#inputname").html() == '微视ID' || $("#inputname").html() == '微视作品ID' || $("#inputname").html() == '微视ＩＤ' || $("#inputname").html() == '微视主页ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getweishiid();
        }
    } else if ($("#inputname").html() == '头条ID' || $("#inputname").html() == '头条ＩＤ') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            gettoutiaoid();
        }
    } else if ($("#inputname").html() == '小红书ID' || $("#inputname").html() == '小红书作品ID' || $("#inputname").html() == '皮皮虾ID' || $("#inputname").html() == '皮皮虾作品ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getxiaohongshuid();
        }
    } else if ($("#inputname").html() == '美拍ID' || $("#inputname").html() == '美拍ＩＤ' || $("#inputname").html() == '美拍作品ID' || $("#inputname").html() == '美拍视频ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getmeipaiid();
        }
    } else if ($("#inputname").html() == '哔哩哔哩视频ID' || $("#inputname").html() == '哔哩哔哩ID' || $("#inputname").html() == '哔哩视频ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getbilibiliid();
        }
    } else if ($("#inputname").html() == '最右帖子ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getzuiyouid();
        }
    } else if ($("#inputname").html() == '全民视频ID' || $("#inputname").html() == '全民小视频ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getquanminid();
        }
    } else if ($("#inputname").html() == '美图作品ID' || $("#inputname").html() == '美图视频ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getmeituid();
        }
    } else if ($("#inputname").html() == '绿洲作品ID' || $("#inputname").html() == '绿洲视频ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getoasisid();
        }
    } else if ($("#inputname").html() == '绿洲用户ID') {
        if ($("#inputvalue").val() != '' && $("#inputvalue").val().indexOf('http') >= 0) {
            getoasiUid();
        }
    }
}


function getCity(inputid, fid, i) {
    i = i || 0;
    fid = fid || 0;
    if (i == 0) {
        var options = '<select class="form-control" id="biaozhi_' + (i + 1) + '" onchange="getCity(\'' + inputid + '\',this.value,' + (i + 1) + ')">';
        options += '<option>请选择地址</option>';
        $.each("\u5317\u4eac|1|72|1,\u4e0a\u6d77|2|78|1,\u5929\u6d25|3|51035|1,\u91cd\u5e86|4|113|1,\u6cb3\u5317|5|142,\u5c71\u897f|6|303,\u6cb3\u5357|7|412,\u8fbd\u5b81|8|560,\u5409\u6797|9|639,\u9ed1\u9f99\u6c5f|10|698,\u5185\u8499\u53e4|11|799,\u6c5f\u82cf|12|904,\u5c71\u4e1c|13|1000,\u5b89\u5fbd|14|1116,\u6d59\u6c5f|15|1158,\u798f\u5efa|16|1303,\u6e56\u5317|17|1381,\u6e56\u5357|18|1482,\u5e7f\u4e1c|19|1601,\u5e7f\u897f|20|1715,\u6c5f\u897f|21|1827,\u56db\u5ddd|22|1930,\u6d77\u5357|23|2121,\u8d35\u5dde|24|2144,\u4e91\u5357|25|2235,\u897f\u85cf|26|2951,\u9655\u897f|27|2376,\u7518\u8083|28|2487,\u9752\u6d77|29|2580,\u5b81\u590f|30|2628,\u65b0\u7586|31|2652,\u6e2f\u6fb3|52993|52994,\u53f0\u6e7e|32|2768,\u9493\u9c7c\u5c9b|84|84".split(","), function (a, c) {
            c = c.split("|"),
                options += '<option value="' + c[1] + '">' + c[0] + '</option>'
        });
        options += '</select>';
        layer.alert('<div id="layer_button">' + options + '</div>', function (index) {
            var con = '';
            $("#layer_button select").each(function () {
                con += $(this.options[this.selectedIndex]).text();
            });
            if ($("#more_dizhi").length > 0) con += $("#more_dizhi").val();
            if (con.length < 7) return layer.alert('请选择完整的收货地址！');
            $("#" + inputid).val(con).show();
            $("#button_" + inputid).hide();
            layer.close(index);
        });
    } else {
        $.ajax({
            type: "get",
            url: "https://fts.jd.com/area/get?fid=" + fid,
            dataType: "jsonp",
            success: function (data) {
                if (data.length < 1) {
                    if ($("#layer_button").html().indexOf("getCity('" + inputid + "',this.value," + (i + 1) + ")") != -1) {
                        $("#biaozhi_" + (i + 1)).remove();
                    }
                    if ($("#more_dizhi").length > 0) {
                    } else $("#layer_button").append('<input class="form-control" id="more_dizhi" placeholder="详细地址(村、门牌号)">');
                    return false;
                }
                var options = '<select class="form-control" id="biaozhi_' + (i + 1) + '" onchange="getCity(\'' + inputid + '\',this.value,' + (i + 1) + ')">';
                options += '<option>请选择地址</option>';
                $.each(data, function (index, res) {
                    options += '<option value="' + res.id + '">' + res.name + '</option>';
                });
                options += '</select>';
                if ($("#layer_button").html().indexOf("getCity('" + inputid + "',this.value," + (i + 1) + ")") != -1) {
                    $("#more_dizhi").remove();
                    $("#biaozhi_" + (i + 1)).html(options);
                } else {
                    $("#layer_button").append(options);
                }
            }
        });
    }
}

function checklogin(islogin) {
    if (islogin == 1) {
        return true;
    } else {
        var confirmobj = layer.confirm('为方便反馈处理结果，投诉订单前请先登录网站！', {
            btn: ['登录', '注册', '取消']
        }, function () {
            window.location.href = './user/login.php';
        }, function () {
            window.location.href = './user/reg.php';
        }, function () {
            layer.close(confirmobj);
        });
        return false;
    }
}

function openCart() {
    window.location.href = './?mod=cart';
}

var audio_init = {
    changeClass: function (target, id) {
        var className = $(target).attr('class');
        var ids = document.getElementById(id);
        (className == 'on')
            ? $(target).removeClass('on').addClass('off')
            : $(target).removeClass('off').addClass('on');
        (className == 'on')
            ? ids.pause()
            : ids.play();
    },
    play: function () {
        document.getElementById('media').play();
    }
};
function showModel(id) {
    cancel(id)
    $(".customerservice-class").click()
}
$(document).ready(function () {
    const tidAnran = location.search.split('tid=').pop()
    $('.goodTypeChange').click(function () {
        var id = $(this).data('id');
        var img = $(this).data('img');
        history.replaceState({}, null, './?cid=' + id);
        $("#cid").val(id);
        $("#cid").change();
        $("#goodType").hide('normal');
        $("#goodTypeContent").show('normal');
    });
    $(".nav-tabs,.backType").click(function () {
        history.replaceState({}, null, './');
        $("#goodType").show('normal');
        $("#goodTypeContent").hide('normal');
    });
    $("#showSearchBar").click(function () {
        $("#display_selectclass").slideToggle();
        $("#display_searchBar").slideToggle();
    });
    $("#closeSearchBar").click(function () {
        $("#display_searchBar").slideToggle();
        $("#display_selectclass").slideToggle();
    });
    $("#doSearch").click(function () {
        var kw = $("#searchkw").val();
        if (kw == '') {
            layer.msg('请先输入要搜索的内容', {time: 500});
            return;
        }
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $("#tid").empty().append('<option value="0">请选择商品</option>');
        $.ajax({
            type: "POST",
            url: "ajax.php?act=gettool",
            data: {kw: kw},
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    // console.log(data)
                    var num = 0;
                    $.each(data.data, function (i, res) {
                        var tempDom = document.createElement('option');
                        $(tempDom).attr({
                            'value': res.tid,
                            'cid': res.cid,
                            'price': res.price,
                            'desc': escape(res.desc),
                            'alert': escape(res.alert),
                            'inputname': res.input,
                            'inputsname': res.inputs,
                            'multi': res.multi,
                            'isfaka': res.isfaka,
                            'count': res.value,
                            'close': res.close,
                            'prices': res.prices,
                            'max': res.max,
                            'min': res.min
                        }).text(res.name);
                        $('#tid').append(tempDom);
                        num++;
                    });
                    $("#tid").val(0);
                    getPoint();
                    if (num == 0 && cid != 0) layer.msg('<option value="0">没有搜索到相关商品</option>', {icon: 2, time: 500});
                    else layer.msg('成功搜索到' + num + '个商品', {icon: 1, time: 1000});
                } else {
                    layer.alert(data.msg);
                }
            },
            error: function (data) {
                layer.msg('加载失败，请刷新重试');
                return false;
            }
        });
    });
    $("#cid").change(function () {
        var cid = $(this).val();
        if (cid > 0) history.replaceState({}, null, './?cid=' + cid);
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $("#tid").empty();
        $("#tid").append('<option value="0">请选择商品</option>');
        const sttr = tidAnran ? '&tid='+tidAnran : ''
        $.ajax({
            type: "GET",
            url: "ajax.php?act=gettool&cid=" + cid + "&info=1"+"&title="+document.title+ sttr,
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                $("#tid").empty();
                $("#tid").append('<option value="0">请选择商品</option>');
                if (data.code == 0) {
                    if (data.info != null) {
                        $("#className").html(data.info.name);
                        $("#classImg").attr('src', data.info.shopimg);
                    }
                    var num = 0;
                    $.each(data.data, function (i, res) {
                        var tempDom = document.createElement('option');
                        $(tempDom).attr({
                            'value': res.tid,
                            'cid': res.cid,
                            'price': res.price,
                            'desc': escape(res.desc),
                            'alert': escape(res.alert),
                            'inputname': res.input,
                            'inputsname': res.inputs,
                            'multi': res.multi,
                            'isfaka': res.isfaka,
                            'count': res.value,
                            'close': res.close,
                            'prices': res.prices,
                            'max': res.max,
                            'min': res.min
                        }).text(res.name);
                        $('#tid').append(tempDom);
                        num++;
                    });
                    if ($_GET["tid"] && $_GET["cid"] == cid) {
                        var tid = parseInt($_GET["tid"]);
                        $("#tid").val(tid);
                    } else {
                        $("#tid").val(0);
                    }
                    getPoint();
                    if (num == 0 && cid != 0)
                        $("#tid").html('<option value="0">该分类下没有商品</option>');
                    // else
                        // layer.msg('请选择商品哦~', {icon: 1, time: 1500});
                } else {
                    layer.alert(data.msg);
                }
            },
            error: function (data) {
                layer.msg('加载失败，请刷新重试');
                return false;
            }
        });
    });
    $("#submit_buy").click(function () {
        var tid = $("#tid").val();
        if (tid == 0) {
            layer.alert('请选择商品！');
            return false;
        }
        var inputvalue = $("#inputvalue").val();
        if (inputvalue == '' || tid == '') {
            layer.alert('请确保每项不能为空！');
            return false;
        }
        if ($("#inputvalue2").val() == '' || $("#inputvalue3").val() == '' || $("#inputvalue4").val() == '' || $("#inputvalue5").val() == '') {
            layer.alert('请确保每项不能为空！');
            return false;
        }
        if (($('#inputname').html() == '下单ＱＱ' || $('#inputname').html() == 'ＱＱ账号' || $("#inputname").html() == 'QQ账号') && (inputvalue.length < 5 || inputvalue.length > 11 || isNaN(inputvalue))) {
            layer.alert('请输入正确的QQ号！');
            return false;
        }
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if ($('#inputname').html() == '你的邮箱' && !reg.test(inputvalue)) {
            layer.alert('邮箱格式不正确！');
            return false;
        }
        reg = /^[1][0-9]{10}$/;
        if ($('#inputname').html() == '手机号码' && !reg.test(inputvalue)) {
            layer.alert('手机号码格式不正确！');
            return false;
        }
        if ($("#inputname2").html() == '说说ID' || $("#inputname2").html() == '说说ＩＤ') {
            if ($("#inputvalue2").val().length != 24) {
                layer.alert('说说必须是原创说说！');
                return false;
            }
        }
        checkInput();
        if ($("#inputname2").html() == '作品ID' || $("#inputname2").html() == '作品ＩＤ') {
            if ($("#inputvalue2").val() != '' && $("#inputvalue2").val().indexOf('http') >= 0) {
                $("#inputvalue").val($("#inputvalue2").val());
                get_kuaishou('inputvalue2', $('#inputvalue').val());
            }
        }
        if ($("#inputname").html() == '音乐作品ID' || $("#inputname").html() == '火山作品ID' || $("#inputname").html() == '火山直播ID') {
            if ($("#inputvalue").val().length != 19) {
                layer.alert('您输入的作品ID有误！');
                return false;
            }
        }
        if ($("#inputname2").html() == '音乐评论ID') {
            if ($("#inputvalue2").val().length != 19) {
                layer.alert('您输入的评论ID有误！请点击自动获取手动选择评论！');
                return false;
            }
        }
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=pay",
            data: {
                tid: tid,
                inputvalue: $("#inputvalue").val(),
                inputvalue2: $("#inputvalue2").val(),
                inputvalue3: $("#inputvalue3").val(),
                inputvalue4: $("#inputvalue4").val(),
                inputvalue5: $("#inputvalue5").val(),
                num: $("#num").val(),
                hashsalt: hashsalt
            },
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    if ($('#inputname').html() == '你的邮箱') {
                        $.cookie('email', inputvalue);
                    }
                    var paymsg = '';
                    if (1) {
                        paymsg += '<button class="diy-btn btn btn-default btn-block btn-wxpay" onclick="dopay(\'wxpay\',\'' + data.trade_no + '\')" style="margin-top:10px;"><img width="20" src="assets/icon/wxpay.png" class="logo">微信支付</button>';
                    }
                    if (1) {
                        paymsg += '<button class="diy-btn btn btn-default btn-block btn-alipay" onclick="dopay(\'alipay\',\'' + data.trade_no + '\')" style="margin-top:10px;"><img width="20" src="assets/icon/alipay.png" class="logo">支付宝</button>';
                    }
                    if (0) {
                        paymsg += '<button class="diy-btn btn btn-default btn-block" onclick="dopay(\'qqpay\',\'' + data.trade_no + '\')" style="margin-top:10px;"><img width="20" src="assets/icon/qqpay.ico" class="logo">QQ钱包</button>';
                    }
                    if (0) {
                        paymsg += '<button class="diy-btn btn btn-success btn-block" onclick="dopay(\'rmb\',\'' + data.trade_no + '\')">使用余额支付（剩' + data.user_rmb + '元）</button>';
                    }
                    // paymsg += '<button class="diy-btn btn btn-default btn-block  btn-rmb" onclick="showModel(\''+data.trade_no+'\')" style="margin-top:10px;"><img width="20" src="assets/icon/rmb.png" class="logo">联系客服九五折下单</button>';
                    layer.alert('<center><h2>￥ ' + data.need + '</h2><hr>' + paymsg + '<hr><a class="diy-btn btn btn-default btn-block" onclick="cancel(\'' + data.trade_no + '\')">取消订单</a></center>', {
                        btn: [],
                        title: '提交订单成功',
                        closeBtn: false
                    });
                } else if (data.code == 1) {
                    $('#alert_frame').hide();
                    if ($('#inputname').html() == '你的邮箱') {
                        $.cookie('email', inputvalue);
                    }
                    layer.alert(data['msg'], {icon: 6, closeBtn: false}, function () {
                        location.href = '?buyok=1';
                    });
                } else if (data.code == 2) {
                    if (data.type == 1) {
                        layer.open({
                            type: 1,
                            title: '完成验证',
                            skin: 'layui-layer-rim',
                            area: ['320px', '100px'],
                            content: '<div id="captcha"><div id="captcha_text">正在加载验证码</div><div id="captcha_wait"><div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div></div></div>',
                            success: function () {
                                $.getScript("//static.geetest.com/static/tools/gt.js", function () {
                                    $.ajax({
                                        url: "ajax.php?act=captcha&t=" + (new Date()).getTime(),
                                        type: "get",
                                        dataType: "json",
                                        success: function (data) {
                                            $('#captcha_text').hide();
                                            $('#captcha_wait').show();
                                            initGeetest({
                                                gt: data.gt,
                                                challenge: data.challenge,
                                                new_captcha: data.new_captcha,
                                                product: "popup",
                                                width: "100%",
                                                offline: !data.success
                                            }, handlerEmbed);
                                        }
                                    });
                                });
                            }
                        });
                    } else if (data.type == 2) {
                        layer.open({
                            type: 1,
                            title: '完成验证',
                            skin: 'layui-layer-rim',
                            area: ['320px', '260px'],
                            content: '<div id="captcha" style="margin: auto;"><div id="captcha_text">正在加载验证码</div></div>',
                            success: function () {
                                $.getScript("//cdn.dingxiang-inc.com/ctu-group/captcha-ui/index.js", function () {
                                    var myCaptcha = _dx.Captcha(document.getElementById('captcha'), {
                                        appId: data.appid,
                                        type: 'basic',
                                        style: 'embed',
                                        success: handlerEmbed2
                                    })
                                    myCaptcha.on('ready', function () {
                                        $('#captcha_text').hide();
                                    })
                                });
                            }
                        });
                    }
                } else if (data.code == 3) {
                    layer.alert(data.msg, {
                        closeBtn: false
                    }, function () {
                        window.location.reload();
                    });
                } else if (data.code == 4) {
                    var confirmobj = layer.confirm('请登录后再购买，是否现在登录？', {
                        btn: ['登录', '注册', '取消']
                    }, function () {
                        window.location.href = './user/login.php';
                    }, function () {
                        window.location.href = './user/reg.php';
                    }, function () {
                        layer.close(confirmobj);
                    });
                } else {
                    layer.alert(data.msg);
                }
            }
        });
    });
    $("#submit_cart_shop").click(function () {
        var tid = $("#tid").val();
        if (tid == 0) {
            layer.alert('请选择商品！');
            return false;
        }
        var inputvalue = $("#inputvalue").val();
        if (inputvalue == '' || tid == '') {
            layer.alert('请确保每项不能为空！');
            return false;
        }
        if ($("#inputvalue2").val() == '' || $("#inputvalue3").val() == '' || $("#inputvalue4").val() == '' || $("#inputvalue5").val() == '') {
            layer.alert('请确保每项不能为空！');
            return false;
        }
        if (($('#inputname').html() == '下单ＱＱ' || $('#inputname').html() == 'ＱＱ账号' || $("#inputname").html() == 'QQ账号') && (inputvalue.length < 5 || inputvalue.length > 11 || isNaN(inputvalue))) {
            layer.alert('请输入正确的QQ号！');
            return false;
        }
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if ($('#inputname').html() == '你的邮箱' && !reg.test(inputvalue)) {
            layer.alert('邮箱格式不正确！');
            return false;
        }
        reg = /^[1][0-9]{10}$/;
        if ($('#inputname').html() == '手机号码' && !reg.test(inputvalue)) {
            layer.alert('手机号码格式不正确！');
            return false;
        }
        if ($("#inputname2").html() == '说说ID' || $("#inputname2").html() == '说说ＩＤ') {
            if ($("#inputvalue2").val().length != 24) {
                layer.alert('说说必须是原创说说！');
                return false;
            }
        }
        checkInput();
        if ($("#inputname2").html() == '作品ID' || $("#inputname2").html() == '作品ＩＤ') {
            if ($("#inputvalue2").val() != '' && $("#inputvalue2").val().indexOf('http') >= 0) {
                $("#inputvalue").val($("#inputvalue2").val());
                get_kuaishou('inputvalue2', $('#inputvalue').val());
            }
        }
        if ($("#inputname").html() == '音乐作品ID' || $("#inputname").html() == '火山作品ID' || $("#inputname").html() == '火山直播ID') {
            if ($("#inputvalue").val().length != 19) {
                layer.alert('您输入的作品ID有误！');
                return false;
            }
        }
        if ($("#inputname2").html() == '音乐评论ID') {
            if ($("#inputvalue2").val().length != 19) {
                layer.alert('您输入的评论ID有误！请点击自动获取手动选择评论！');
                return false;
            }
        }
        var ii = layer.load(2, {shade: [0.1, '#fff']});
        $.ajax({
            type: "POST",
            url: "ajax.php?act=pay&method=cart_add",
            data: {
                tid: tid,
                inputvalue: $("#inputvalue").val(),
                inputvalue2: $("#inputvalue2").val(),
                inputvalue3: $("#inputvalue3").val(),
                inputvalue4: $("#inputvalue4").val(),
                inputvalue5: $("#inputvalue5").val(),
                num: $("#num").val(),
                hashsalt: hashsalt
            },
            dataType: 'json',
            success: function (data) {
                layer.close(ii);
                if (data.code == 0) {
                    if ($('#inputname').html() == '你的邮箱') {
                        $.cookie('email', inputvalue);
                    }
                    $('#cart_count').html(data.cart_count);
                    $('#alert_cart').slideDown();
                    layer.msg('添加至购物车成功~点击下方进入购物车列表结算');
                } else if (data.code == 3) {
                    layer.alert(data.msg, {
                        closeBtn: false
                    }, function () {
                        window.location.reload();
                    });
                } else if (data.code == 4) {
                    var confirmobj = layer.confirm('请登录后再购买，是否现在登录？', {
                        btn: ['登录', '注册', '取消']
                    }, function () {
                        window.location.href = './user/login.php';
                    }, function () {
                        window.location.href = './user/reg.php';
                    }, function () {
                        layer.close(confirmobj);
                    });
                } else {
                    layer.alert(data.msg);
                }
            }
        });
    });
    $("#submit_checkkm").click(function () {
        var km = $("#km").val();
        if (km == '') {
            layer.alert('请确保卡密不能为空！');
            return false;
        }
        $('#submit_km').val('Loading');
        $('#km_show_frame').hide();
        $.ajax({
            type: "POST",
            url: "ajax.php?act=checkkm",
            data: {km: km},
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    if (data.close == 1) {
                        layer.alert('商品暂时下架啦，请过段时间再来看看！');
                        $('#submit_checkkm').val('检查卡密');
                        return false;
                    }
                    $('#submit_checkkm').hide();
                    $('#km').attr("disabled", true);
                    $('#km_tid').val(data.tid);
                    $('#km_name').val(data.name);
                    if (data.desc != '') {
                        $('#km_alert_frame').show();
                        $('#km_alert_frame').html(data.desc);
                    } else {
                        $('#km_alert_frame').hide();
                    }
                    $('#km_inputsname').html("");
                    var inputname = data.inputname;
                    if (inputname != '') {
                        $('#km_inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="km_inputname">' + inputname + '</div><input type="text" name="inputvalue" id="km_inputvalue" value="' + ($_GET['qq'] ? $_GET['qq'] : '') + '" class="form-control" required/></div></div>');
                    } else {
                        $('#km_inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="km_inputname">下单ＱＱ</div><input type="text" name="inputvalue" id="km_inputvalue" value="' + ($_GET['qq'] ? $_GET['qq'] : '') + '" class="form-control" required/></div></div>');
                    }
                    var inputsname = data.inputsname;
                    if (inputsname != '') {
                        $.each(inputsname.split('|'), function (i, value) {
                            if (value == '说说ID' || value == '说说ＩＤ')
                                var addstr = '<div class="input-group-addon onclick" onclick="get_shuoshuo(\'km_inputvalue' + (i + 2) + '\',$(\'#km_inputvalue\').val(),1)">自动获取</div>';
                            else if (value == '日志ID' || value == '日志ＩＤ')
                                var addstr = '<div class="input-group-addon onclick" onclick="get_rizhi(\'km_inputvalue' + (i + 2) + '\',$(\'#km_inputvalue\').val(),1)">自动获取</div>';
                            else
                                var addstr = '';
                            $('#km_inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="km_inputname">' + value + '</div><input type="text" name="inputvalue' + (i + 2) + '" id="km_inputvalue' + (i + 2) + '" value="" class="form-control" required/>' + addstr + '</div></div>');
                        });
                    }

                    $("#km_show_frame").slideDown();
                    if (data.alert != '' && data.alert != 'null') {
                        var ii = layer.alert(data.alert, {
                            btn: ['我知道了'],
                            title: '商品提示',
                            closeBtn: false
                        }, function () {
                            layer.close(ii);
                        });
                    }
                } else {
                    layer.alert(data.msg);
                }
                $('#submit_checkkm').val('检查卡密');
            }
        });
    });
    $("#submit_card").click(function () {
        var km = $("#km").val();
        var inputvalue = $("#km_inputvalue").val();
        if (inputvalue == '' || km == '') {
            layer.alert('请确保每项不能为空！');
            return false;
        }
        if ($("#km_inputvalue2").val() == '' || $("#km_inputvalue3").val() == '' || $("#km_inputvalue4").val() == '' || $("#km_inputvalue5").val() == '') {
            layer.alert('请确保每项不能为空！');
            return false;
        }
        if ($('#km_inputname').html() == '下单ＱＱ' && (inputvalue.length < 5 || inputvalue.length > 11)) {
            layer.alert('请输入正确的QQ号！');
            return false;
        }
        if ($("#km_inputname2").html() == '说说ID' || $("#km_inputname2").html() == '说说ＩＤ') {
            if ($("#km_inputvalue2").val().length != 24) {
                layer.alert('说说必须是原创说说！');
                return false;
            }
        }
        $('#submit_card').val('Loading');
        $('#result1').hide();
        $.ajax({
            type: "POST",
            url: "ajax.php?act=card",
            data: {
                km: km,
                inputvalue: inputvalue,
                inputvalue2: $("#km_inputvalue2").val(),
                inputvalue3: $("#km_inputvalue3").val(),
                inputvalue4: $("#km_inputvalue4").val(),
                inputvalue5: $("#km_inputvalue5").val()
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    alert(data.msg);
                    window.location.href = '?buyok=1';
                } else {
                    layer.alert(data.msg);
                }
                $('#submit_card').val('立即购买');
            }
        });
    });
    $("#submit_query").click(function () {
        var qq = $("#qq3").val();
        var type = $("#searchtype").val();
        queryOrder(type, qq, 1);
    });
    $("#submit_lqq").click(function () {
        var qq = $("#qq4").val();
        if (qq == '') {
            layer.alert('QQ号不能为空！');
            return false;
        }
        if (qq.length < 5 || qq.length > 11) {
            layer.alert('请输入正确的QQ号！');
            return false;
        }
        $('#result3').hide();
        if ($.cookie('lqq') && $.cookie('lqq').indexOf(qq) >= 0) {
            $('#result3').html('<div class="alert alert-success"><img src="assets/img/ico_success.png">&nbsp;该QQ已经提交过，请勿重复提交！</div>');
            $("#result3").slideDown();
            return false;
        }
        $('#submit_lqq').val('Loading');
        $.ajax({
            type: "POST",
            url: "ajax.php?act=lqq",
            data: {qq: qq, salt: hashsalt},
            dataType: 'json',
            success: function (data) {
                if ($.cookie('lqq')) {
                    $.cookie('lqq', $.cookie('lqq') + '-' + qq);
                } else {
                    $.cookie('lqq', qq);
                }
                $('#result3').html('<div class="alert alert-success"><img src="assets/img/ico_success.png">&nbsp;QQ已提交 正在为您排队,可能需要一段时间 请稍后查看圈圈增长情况</div>');
                $("#result3").slideDown();
                $('#submit_lqq').val('立即提交');
            }
        });
    });

    $("#num_add").click(function () {
        var i = parseInt($("#num").val());
        if ($("#need").val() == '') {
            layer.alert('请先选择商品');
            return false;
        }
        var multi = $('#tid option:selected').attr('multi');
        var count = parseInt($('#tid option:selected').attr('count'));
        if (multi == '0') {
            layer.alert('该商品不支持选择数量');
            return false;
        }
        i++;
        $("#num").val(i);
        var price = parseFloat($('#tid option:selected').attr('price'));
        var prices = $('#tid option:selected').attr('prices');
        if (prices != '' || prices != 'null') {
            var discount = 0;
            $.each(prices.split(','), function (index, item) {
                if (i >= parseInt(item.split('|')[0])) discount = parseFloat(item.split('|')[1]);
            });
            price = price - discount;
        }
        price = price * i;
        count = count * i;
        if (count > 1) $('#need').val('￥' + price.toFixed(2) + "元 ➠ " + count + "个");
        else $('#need').val('￥' + price.toFixed(2) + "元");
    });
    $("#num_min").click(function () {
        var i = parseInt($("#num").val());
        if (i <= 1) {
            layer.msg('最低下单一份哦！');
            return false;
        }
        if ($("#need").val() == '') {
            layer.alert('请先选择商品');
            return false;
        }
        var multi = $('#tid option:selected').attr('multi');
        var count = parseInt($('#tid option:selected').attr('count'));
        if (multi == '0') {
            layer.alert('该商品不支持选择数量');
            return false;
        }
        i--;
        if (i <= 0) i = 1;
        $("#num").val(i);
        var price = parseFloat($('#tid option:selected').attr('price'));
        var prices = $('#tid option:selected').attr('prices');
        if (prices != '' || prices != 'null') {
            var discount = 0;
            $.each(prices.split(','), function (index, item) {
                if (i >= parseInt(item.split('|')[0])) discount = parseFloat(item.split('|')[1]);
            });
            price = price - discount;
        }
        price = price * i;
        count = count * i;
        if (count > 1) $('#need').val('￥' + price.toFixed(2) + "元 ➠ " + count + "个");
        else $('#need').val('￥' + price.toFixed(2) + "元");
    });
    $("#num").keyup(function () {
        var i = parseInt($("#num").val());
        if (isNaN(i)) return false;
        var price = parseFloat($('#tid option:selected').attr('price'));
        var count = parseInt($('#tid option:selected').attr('count'));
        var prices = $('#tid option:selected').attr('prices');
        if (i < 1) $("#num").val(1);
        if (prices != '' || prices != 'null') {
            var discount = 0;
            $.each(prices.split(','), function (index, item) {
                if (i >= parseInt(item.split('|')[0])) discount = parseFloat(item.split('|')[1]);
            });
            price = price - discount;
        }
        price = price * i;
        count = count * i;
        if (count > 1) $('#need').val('￥' + price.toFixed(2) + "元 ➠ " + count + "个");
        else $('#need').val('￥' + price.toFixed(2) + "元");
    });

    var gogo;
    $("#start").click(function () {
        ii = layer.load(1, {shade: 0.3});
        $.ajax({
            type: "GET",
            url: "ajax.php?act=gift_start",
            dataType: "json",
            success: function (choujiang) {
                layer.close(ii);
                if (choujiang.code == 0) {
                    $("#start").css("display", 'none');
                    $("#stop").css("display", 'block');
                    var obj = eval(choujiang.data);
                    var len = obj.length;
                    gogo = setInterval(function () {
                        var num = Math.floor(Math.random() * len);
                        var id = obj[num]['tid'];
                        var v = obj[num]['name'];
                        $("#roll").html(v);
                    }, 100);
                } else {
                    layer.alert(choujiang.msg);
                }
            }
        });
    });
    $("#stop").click(function () {
        ii = layer.load(1, {shade: 0.3});
        clearInterval(gogo);
        $("#roll").html('正在抽奖中..');
        var rand = Math.random(1);
        $.ajax({
            type: "GET",
            url: "ajax.php?act=gift_start&action=ok&r=" + rand,
            dataType: "json",
            success: function (msg) {
                layer.close(ii);
                if (msg.code == 0) {
                    $.ajax({
                        type: "POST",
                        url: "ajax.php?act=gift_stop&r=" + rand,
                        data: {hashsalt: hashsalt, token: msg.token},
                        dataType: "json",
                        success: function (data) {
                            if (data.code == 0) {
                                $("#roll").html('恭喜您抽到奖品：' + data.name);
                                $("#start").css("display", 'block');
                                $("#stop").css("display", 'none');
                                layer.alert('恭喜您抽到奖品：' + data.name + '，请填写中奖信息', {
                                    skin: 'layui-layer-lan'
                                    , closeBtn: 0
                                }, function () {
                                    window.location.href = '?gift=1&cid=' + data.cid + '&tid=' + data.tid;
                                });
                            } else {
                                layer.alert(data.msg, {icon: 2, shade: 0.3});
                                $("#roll").html('点击下方按钮开始抽奖');
                                $("#start").css("display", 'block');
                                $("#stop").css("display", 'none');
                            }
                        }
                    });
                } else {
                    layer.alert(msg.msg, {icon: 2, shade: 0.3});
                    $("#start").css("display", 'block');
                    $("#stop").css("display", 'none');
                }
            }
        });
    });


    if (homepage == true) {
        getcount();
    }
    if ($_GET['buyok']) {
        var orderid = $_GET['orderid'];
        $("#tab-query").tab('show');
        $("#submit_query").click();
        isModal = false;
    } else if ($_GET['chadan']) {
        $("#tab-query").tab('show');
        isModal = false;
    }
    if ($_GET['gift']) {
        isModal = false;
    }
    if ($_GET['cid']) {
        var cid = parseInt($_GET['cid']);
        $("#cid").val(cid);
    }
    $("#cid").change();

    if ($.cookie('sec_defend_time')) $.removeCookie('sec_defend_time', {path: '/'});
    if (!$.cookie('op') && isModal == true) {
        $('#myModal').modal({
            keyboard: true
        });
        var cookietime = new Date();
        cookietime.setTime(cookietime.getTime() + (60 * 60 * 1000));
        $.cookie('op', false, {expires: cookietime});
    }
    var visits = $.cookie("counter")
    if (!visits) {
        visits = 1;
    } else {
        visits = parseInt(visits) + 1;
    }
    $('#counter').html(visits);
    $.cookie("counter", visits, 24 * 60 * 60 * 30);

    if ($('#audio-play').is(':visible')) {
        audio_init.play();
    }

});

