// 第一个轮播图版本
// 用的是图片移动实现
// 对应的html轮播图片最后要再克隆第一张图片
// 对应的less代码
// 主体中部盒子
// .slideshow {
//     width: @main-width;
//     position: relative; //开启定位成为轮播图箭头的包含块
//     overflow: hidden;
//     // 左侧导航栏
//     .left-list {
//         // 开启定位成为左侧导航右箭头的包含块
//         position: absolute;
//         z-index: 5;
//         width: 234px;
//         height: 420px;
//         padding: 20px 0;
//         background-color: rgba(105, 101, 101, .6);
//         a {
//             display: block;
//             .text-mid(42px);
//             padding-left: 30px;
//             .text(#fff, 14px);
//             &:hover {
//                 background-color: @mi-color;
//             }

//             &::after {
//                 .iconfont('\e600', 14px, #fff);
//                 position: absolute;
//                 right: 20px;
//             }
//         }
//     }
//     //  轮播图
//     .slideshow-image {
//         display: flex;
//         width: @main-width;
//         height: 460px;
//         position: relative;
//         img {
//             height: 460px;
//             width: @main-width;
//         }
//     }


// 页面加载完毕后再执行
window.addEventListener('load', function () {
    var dots = document.querySelector('.dots');
    var dot = document.querySelectorAll('.dot');
    var images = document.querySelector('.slideshow-image');
    var image = document.querySelectorAll('li');
    var arrow_l = document.querySelector('.left-arrow');
    var arrow_r = document.querySelector('.right-arrow');
    // 记录小圆圈索引号
    for (var i = 0; i < (dot.length - 1); i++) {
        dot[i].setAttribute('index', i);
    }
    // for循环绑定点击事件
    for (var i = 0; i < (dot.length - 1); i++) {
        dot[i].addEventListener('click', function () {
            // 清除其他不点击的样式
            for (var i = 0; i < (dot.length - 1); i++) {
                dot[i].className = 'dot';
            }
            // 给点击的圆圈添加相应样式的类名，注意保留原样式类名
            this.className = 'dot current';
            // 获取点击小圆圈的索引号
            var index = this.getAttribute('index');
            // 点击小圆圈时把对应索引号给右键的索引号
            num = index;
            circle = index;
            animate(images, -index * 1226);

        })
    }
    var num = 0;
    var circle = 0;
    // 右侧按钮
    arrow_r.addEventListener('click', function () {
        num++;
        if (num == dot.length) {
            images.computedStyleMap.left = 0;
            num = 0;
        }
        animate(images, -num * 1226);
        // 获取右键对应小圆圈
        circle++;
        if (circle == dot.length) {
            circle = 0;
        }
        // 点亮对应小圆圈
        circleChange();
    })
    // 左侧按钮
    arrow_l.addEventListener('click', function () {
        num--;
        if (num == 0) {
            num = dot.length;
            images.computedStyleMap.left = -num * 1226 + 'px';
        }
        animate(images, -num * 1226);
        // 获取右键对应小圆圈
        circle--;
        if (circle < 0) {
            circle = dot.length - 1;
        }
        // 点亮对应小圆圈
        circleChange();
    })
    // 点亮对应小圆圈
    function circleChange() {
        for (var i = 0; i < dot.length; i++) {
            dot[i].className = 'dot';
        }
        dot[circle].className = 'dot current';
    }
    // 自动播放轮播图
    var timer = setInterval(function () {
        // 手动调用点击事件
        arrow_r.click();
    }, 2000)
    // 鼠标经过停止定时器
    images.addEventListener('mouseenter',function(){
        clearInterval(timer);
        timer = null;
    })
    // 鼠标离开开启
    images.addEventListener('mouseleave',function(){
        timer = setInterval(function () {
            // 手动调用点击事件
            arrow_r.click();
        }, 2000);
    })


})