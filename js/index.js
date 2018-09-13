var curPage = 1 //第一次获取数据
var perPageCount = 10 //每次获取10个数据
var colSumHeight = []
var nodeWidth = $('.item').outerWidth(true)
var colNum = parseInt($('#pic-ct').width() / nodeWidth) //计算得到一排放置item的个数
for (var i = 0; i < colNum.length; i++) {
    colSumHeight[i] = 0
}

var isDataArrive = true

start()

function start() {
    //获取数据，变成DOM结构，使用瀑布流方式
    getData(function (newsList) {
        console.log(newsList)
        isDataArrive = true
        $.each(newsList, function (idx, news) {
            var $node = getNode(news)
            $node.find('img').on('load', function () {
                $('#pic-ct').append($node)
                console.log($node, 'loaded...')
                waterFallPlace($node)
            })
        })
    })
    isDataArrive = false
}

//页面滚动至底部，重新加载数据
$(window).scroll(function () {
    if (!isDataArrive) return

    if (isVisible($('#load'))) {
        start()
    }
})

function isVisible($el) {
    var scrollH = $(window).scrollTop(), //滚动距离
        winH = $(window).height(), //窗口高度
        top = $el.offset().top; //页面顶部至目标的高度

    if (top < winH + scrollH) {
        return true;
    } else {
        return false;
    }
}

//获取数据
function getData(callback) {
    $.ajax({
        url: 'http://platform.sina.com.cn/slide/album_tech',
        dataType: 'jsonp',
        jsonp: "jsoncallback",
        data: {
            app_key: '1271687855',
            num: perPageCount,
            page: curPage
        }
    }).done(function (ret) {
        if (ret && ret.status && ret.status.code === "0") {
            callback(ret.data); //如果数据没问题，那么生成节点并摆放好位置
            curPage++
        } else {
            console.log('get error data');
        }
    });
}

//将数据变成DOM结构
function getNode(item) {
    var tpl = ''
    tpl += '<li class="item">';
    tpl += ' <a href="' + item.url + '" class="link"><img src="' + item.img_url + '" alt=""></a>';
    tpl += ' <h4 class="header">' + item.short_name + '</h4>';
    tpl += '<p class="desp">' + item.short_intro + '</p>';
    tpl += '</li>';

    return $(tpl)
}

// 瀑布流布局
var colSumHeight = [],
    nodeWidth = $('.item').outerWidth(true),
    colNum = parseInt($('#pic-ct').width() / nodeWidth);

for (var i = 0; i < colNum; i++) {
    colSumHeight.push(0)
}

function waterFallPlace($nodes) {
    $nodes.each(function () {
        var $cur = $(this);
        var idx = 0,
            minSumHeight = colSumHeight[0];

        for (var i = 0; i < colSumHeight.length; i++) {
            if (colSumHeight[i] < minSumHeight) {
                idx = i;
                minSumHeight = colSumHeight[i];
            }
        }

        $cur.css({
            left: nodeWidth * idx,
            top: minSumHeight,
            opacity: 1
        });

        colSumHeight[idx] = $cur.outerHeight(true) + colSumHeight[idx];
        $('#pic-ct').height(Math.max.apply(null, colSumHeight));
    });

}