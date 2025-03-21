function animate(obj, target, callback) {
    clearInterval(obj.timer);  //清除以前的定时器，防止一直点击重复定时器加快速度
    obj.timer = setInterval(function () {  //obj.timer给不同元素设置不同定时器
        var step = (target - obj.offsetLeft) / 10; //步长值=（目标位置-当前位置}/10,使动画实现由快到慢的效果
        step = step > 0 ? Math.ceil(step) : Math.floor(step); //使动画往前往回都能取整
        if (obj.offsetLeft == target) {
            clearInterval(obj.timer);
            if (callback) {
                callback(); //回调函数
            }
        }
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 8)
}