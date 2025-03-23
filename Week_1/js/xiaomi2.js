window.addEventListener('load', function () {
    var dots = document.querySelector('.dots');
    var dot = dots.querySelectorAll('span');
    var images = document.querySelector('.slideshow-image');
    var lis = images.querySelectorAll('li');
    var arrow_l = document.querySelector('.left-arrow');
    var arrow_r = document.querySelector('.right-arrow');
    var index = 0;
    var num = 0;
    // 清除其他图片透明度
    function clearOp() {
        for (var i = 0; i < lis.length; i++) {
            lis[i].style.opacity = 0;
        }
        lis[index].style.opacity = 1;
    }
    // 轮播函数
    function slideshow() {
        // 图片索引号
        index = (++index > (lis.length - 1)) ? 0 : index;
        // 调用显示对应照片函数
        clearOp();
        // 对应小圆圈点亮
        num = index;
        dotcurrent();
    }
    // 定时轮播
    var timer = setInterval(slideshow, 3000);
    // 左按钮
    arrow_l.addEventListener('click', function () {
        // 图片索引号
        index = (--index < 0 ? (lis.length - 1) : index);
        // 显示对应照片
        clearOp();
        // 对应小圆圈点亮
        num = index;
        dotcurrent();
        // 清除定时器
        clearInterval(timer);
    })
    // 右按钮
    arrow_r.addEventListener('click', function () {
        // 与自动轮播一致
        slideshow();
        // 清除定时器
        clearInterval(timer);
    })
    // 鼠标经过停止定时器
    images.addEventListener('mouseenter', function () {
        clearInterval(timer);
        timer = null;
    })
    // 鼠标离开开启定时器
    images.addEventListener('mouseleave', function () {
        timer = setInterval(slideshow, 3000);
    })
    // 小圆圈
    function dotcurrent() {
        // 清除其他不点击小圆圈的样式
        for (var i = 0; i < dot.length; i++) {
            dot[i].className = 'dot';
        }
        // 给点击的圆圈添加相应样式的类名，注意保留原样式类名
        dot[num].className = 'dot current';
    }
    // 记录小圆圈索引号
    for (var i = 0; i < dot.length; i++) {
        dot[i].setAttribute('num', i);
    }
    // for循环绑定点击事件
    for (var i = 0; i < dot.length; i++) {
        dot[i].addEventListener('click', function () {
            // 获取点击小圆圈的索引号
            num = this.getAttribute('num');
            dotcurrent();
            // 点击小圆圈时把对应索引号给右键的索引号
            index = num;
            // 显示对应图片
            clearOp();
        })
    }

    // 主体悬浮菜单
    var block = document.querySelectorAll('.block');
    var leftlist = document.querySelector('.left-list');
    var llis = leftlist.querySelectorAll('li');
    var numm = 0;
    // 隐藏所有方块函数
    function hide() {
        for (var i = 0; i < llis.length; i++) {
            block[i].style.display = 'none';
        }
    }
    // 记录导航栏索引号
    for (var i = 0; i < llis.length; i++) {
        llis[i].setAttribute('numm', i);
    }
    // 绑定鼠标移入事件
    for (var i = 0; i < llis.length; i++) {
        llis[i].addEventListener('mouseenter', function () {
            // 隐藏所有方块
            hide();
            // 获取鼠标移入导航的索引号
            numm = this.getAttribute('numm');
            // 显示相应的导航方块
            block[numm].style.display = 'flex';
            block[numm].style.zIndex = 3;
        })
    }
    // 绑定鼠标移出事件
    for (var i = 0; i < llis.length; i++) {
        llis[i].addEventListener('mouseleave', function () {
            // 所有方块隐藏
            hide();
        })
    }
    // 导航中的导航绑定鼠标移入事件
    for (var i = 0; i < block.length; i++) {
        block[i].addEventListener('mouseenter', function () {
            hide();
            this.style.display = 'flex';
            this.style.zIndex = 3;
        })
    }
    // 导航中的导航绑定鼠标移出事件
    for (var i = 0; i < block.length; i++) {
        block[i].addEventListener('mouseleave', function () {
            hide();
        })
    }

    // 下拉框
    var drop = document.querySelector('.drop');
    var nav = document.querySelector('.nav');
    function animate(obj, target, callback) {
        clearInterval(obj.timer);  //清除以前的定时器，防止一直点击重复定时器加快速度
        obj.timer = setInterval(function () {  //obj.timer给不同元素设置不同定时器
            var step = (target - obj.offsetTop) / 10; //步长值=（目标位置-当前位置}/10,使动画实现由快到慢的效果
            step = step > 0 ? Math.ceil(step) : Math.floor(step); //使动画往前往回都能取整
            if (obj.offsetTop == target) {
                clearInterval(obj.timer);
                if (callback) {
                    callback(); //回调函数
                }
            }
            obj.style.top = obj.offsetTop + step + 'px';
        }, 8)
    }
    nav.children[0].addEventListener('mouseenter', function () {
        animate(drop, 100);
        drop.style.borderTOP=''
    })
    nav.children[0].addEventListener('mouseleave', function () {
        animate(drop, -130);
    })


})