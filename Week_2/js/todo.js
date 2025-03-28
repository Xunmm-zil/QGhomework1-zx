$(function () {
    $(document).ready(function () {
        $(".all").click();
    })
    $(".nowtime").text(getTimer());
    // 显示现在的日期
    setInterval(function(){
        $(".nowtime").text(getTimer());
    },1000)
    // 点击右侧按钮的通用样式
    $(document).ready(function () {
        $(".option").on("click", "li", function () {
            // 清除其他按钮颜色
            $(this).siblings().children().css("background-color", " #fff");
            // 设置点击按钮样式
            $(this).children().css("background-color", " #d5e2f0");
        })
    })
    // 给输入框绑定按下回车键
    $("#title").on("keydown", function (event) {
        if (event.keyCode === 13) {
            // 获取本地存储数据
            var local = getDater();
            //  把最新的数据追加到local里
            local.push({ title: $(this).val(), done: false });
            // 把local保存到本地存储
            saveDate(local);
            // 把数据渲染到页面中
            flagload();
            // 清除输入框内容
            $(this).val("");
        }
    })
    // 给提交按钮绑定事件
    $("#submit").on("click", function () {
        // 获取本地存储数据
        var local = getDater();
        //  把最新的数据追加到local里
        local.push({ title: $("#title").val(), done: false });
        // 把local保存到本地存储
        saveDate(local);
        // 把数据渲染到页面中
        flagload();
        // 清除输入框内容
        $(this).siblings().val("");
    })
    // 搜索对应事项
    $("#search").on("click", function () {
        // 获取本地存储数据
        var local = getDater();
        var result = [];
        // 模糊匹配查找
        for (var i = 0; i < local.length; i++) {
            if (local[i].title.indexOf($("#title").val()) !== -1) {
                result.push(local[i]);
                $(".option").children().children().css("background-color", " #fff");
                // 先清空原来的元素
                $(".tdlt").empty();
                // 获取完成状态添加相应类名
                if (local[i].done == true) {
                    var cla = "fnsh";
                } else {
                    cla = "";
                }
                // 渲染数据
                $(".tdlt").prepend("<li class='td " + cla + "'>" + "<div class='finish' ><img src='./img/打钩.png' alt='打钩'  ></div>" +
                    "<div class='test'><input type='text' value='" + local[i].title + "' class='txt'></div>" +
                    "<div class='day'> " + getDay() + "</div>" +
                    "<div class='delete' id=" + i + " ><img src='./img/打叉.png' alt='打叉'></div>" +
                    "</li>");
            }
        }
        if (result.length == 0) {
            alert("没有找到匹配的事项");
        }
        // 清除输入框内容
        $(this).siblings().val("");
    })
    var flag = 0;
    // 点击全部按钮
    $(".all").on("click", function () {
        flag = 1;
        // 渲染全部
        load();
        $(this).css("background-color", " #d5e2f0");
    })
    // 点击右侧进行中
    $(".onging").on("click", function () {
        flag = 2;
        loado();
    })
    // 点击右侧已完成
    $(".complete").on("click", function () {
        flag = 3;
        // 渲染已完成
        loadf();
    })
    // 点击回收站
    $(".recycle").on("click", function () {
        flag = 4;
        loads();
    })
    // 给删除按钮绑定点击事件，动态创建的元素得通过on事件委托给已存在的祖先元素才能绑定
    $(".tdlt").on("click", ".delete", function () {
        // 读取本地存储
        var date = getDater();
        // 获取点击的对象索引号
        var index = $(this).attr("id");
        // 获取会话存储
        var ssenion = getSdate();
        // 把对象添加进去
        ssenion.push(date[index]);
        // 保存会话存储
        saveSdate(ssenion);
        // 删除本地存储中的
        date.splice(index, 1);
        // 保存本地存储
        saveDate(date);
        // 重新渲染页面
        flagload();
    })
    // 点击恢复按钮
    $(".tdlt").on("click", ".withdraw", function () {
        // 获取会话存储
        var ssenion = getSdate();
        // 获取点击的对象索引号
        var idx = $(this).attr("id");
        // 读取本地存储
        var date = getDater();
        // 把对象添加进本地存储
        date.push(ssenion[idx]);
        // 保存本地存储
        saveDate(date);
        // 删除会话存储中的
        ssenion.splice(idx, 1);
        // 保存会话存储
        saveSdate(ssenion);
        // 重新渲染页面
        flagload();
    })

    // 点击打勾
    $(".tdlt").on("click", ".finish", function () {
        if (flag == 1 || flag == 2 || flag == 3) {
            // 读取本地存储
            var date = getDater();
            // 拿索引号
            var index = $(this).siblings(".delete").attr("id");
            // 修改属性
            if (date[index].done == true) {
                date[index].done = false;
            } else {
                date[index].done = true;
            }
            // 保存本地存储
            saveDate(date);
            // 渲染页面
            flagload();
        } else {
            // 读取会话存储
            var ssenion = getSdate();
            // 拿索引号
            var index = $(this).siblings(".withdraw").attr("id");
            // 修改属性
            if (ssenion[index].done == true) {
                ssenion[index].done = false;
            } else {
                ssenion[index].done = true;
            }
            // 保存会话存储
            saveSdate(ssenion);
            // 渲染页面
            flagload();
        }

    })
    // 两个全部标记为已完成的按钮
    $(".mkcp").on("click", function () {
        // 读取本地存储
        var date = getDater();
        // 遍历数据改为已完成
        $.each(date, function (i, n) {
            date[i].done = true;
        })
        // 保存本地存储
        saveDate(date);
        // 渲染页面
        flagload();
    })
    // 清除已完成
    $(".clcp").on("click", function () {
        // 读取本地存储
        var date = getDater();
        //倒序遍历数组找到已完成删除，正序会因删除元素混乱
        for (var i = date.length - 1; i >= 0; i--) {
            if (date[i].done == true) {
                // 获取会话存储
                var ssenion = getSdate();
                // 把对象添加进去
                ssenion.push(date[i]);
                // 保存会话存储
                saveSdate(ssenion);
                // 清除本地对应数据
                date.splice(i, 1);
            }
        }
        // 保存本地存储
        saveDate(date);
        // 渲染页面
        flagload();
    })
    // 清除全部
    $(".clall").on("click", function () {
        // 读取本地存储
        var date = getDater();
        //倒序遍历数组删除，正序会因删除元素混乱
        for (var i = date.length - 1; i >= 0; i--) {
            // 获取会话存储
            var ssenion = getSdate();
            // 把对象添加进去
            ssenion.push(date[i]);
            // 保存会话存储
            saveSdate(ssenion);
            // 清除本地对应数据
            date.splice(i, 1);
        }
        // 保存本地存储
        saveDate(date);
        // 渲染页面
        flagload();
    })
    // 修改事项内容
    $(".tdlt").on("blur", ".txt", function () {
        if (flag == 1 || flag == 2 || flag == 3) {
            // 读取本地存储
            var date = getDater();
            // 拿索引号
            var index = $(this).parent().siblings(".delete").attr("id");
            // 修改内容
            date[index].title = $(this).val();
            // 保存本地存储
            saveDate(date);
            // 渲染页面
            flagload();
        } else {
            // 读取会话存储
            var ssenion = getSdate();
            // 拿索引号
            var index = $(this).parent().siblings(".withdraw").attr("id");
            // 修改内容
            date[index].title = $(this).val();
            // 保存会话存储
            saveSdate(ssenion);
            // 渲染页面
            flagload();
        }
    })
    //  读取本地存储的数据函数
    function getDater() {
        var date = localStorage.getItem("todolist");
        if (date !== null) {
            // 本地存储是字符串类型，转换为对象
            return JSON.parse(date);
        } else {
            return [];
        }
    }
    // 保存本地存储数据函数
    function saveDate(date) {
        // 把local数组转换为字符串格式再存储
        localStorage.setItem("todolist", JSON.stringify(date));
    }
    // 渲染本地数据函数
    function load() {
        // 读取本地存储数据
        var date = getDater();
        // 先清空原来的元素
        $(".tdlt").empty();
        // 遍历数据
        $.each(date, function (i, n) {
            // 获取完成状态添加相应类名
            if (date[i].done == true) {
                var cla = "fnsh";
            } else {
                cla = "";
            }
            // 渲染数据在最上面
            $(".tdlt").prepend("<li class='td " + cla + "'>" + "<div class='finish' ><img src='./img/打钩.png' alt='打钩'  ></div>" +
                "<div class='test'><input type='text' value='" + n.title + "' class='txt'></div>" +
                "<div class='day'> " + getDay() + "</div>" +
                "<div class='delete' id=" + i + " ><img src='./img/打叉.png' alt='打叉'></div>" +
                "</li>");
        })
    }
    // 渲染会话数据函数
    function loads() {
        // 读取会话数据
        var ssenion = getSdate();
        // 先清空原来的元素
        $(".tdlt").empty();
        // 渲染数据
        $.each(ssenion, function (j, m) {
            // 获取完成状态添加相应类名
            if (ssenion[j].done == true) {
                var cla = "fnsh";
            } else {
                cla = "";
            }
            $(".tdlt").prepend("<li class='td " + cla + "' >" + "<div class='finish' ><img src='./img/打钩.png' alt='打钩'  ></div>" +
                "<div class='test'><input type='text' value='" + m.title + "' class='txt'></div>" +
                "<div class='day'> " + getDay() + "</div>" +
                "<div class='withdraw' id=" + j + "><img src='./img/撤回.png' alt='撤回' ></div>" +
                "</li>");
        })
    }
    // 日期函数
    function getDay() {
        var date = new Date;
        var month = date.getMonth() + 1;
        var dates = date.getDate();
        var day = date.getDay();
        var days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return month + '月' + dates + '日' + "<br>" + days[day];
    }

    // 时间函数
    function getTimer() {
        var time = new Date;
        var h = time.getHours();
        h = h < 10 ? '0' + h : h;
        var m = time.getMinutes();
        m = m < 10 ? '0' + m : m;
        var s = time.getSeconds();
        s = s < 10 ? '0' + s : s;
        var date = new Date;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var dates = date.getDate();
        var day = date.getDay();
        var days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return year + '年' + month + '月' + dates + '日'+ days[day] + h + ':' + m + ':' + s;
    }
    //  读取会话存储的数据函数
    function getSdate() {
        var date = sessionStorage.getItem("delist");
        if (date !== null) {
            // 本地存储是字符串类型，转换为对象
            return JSON.parse(date);
        } else {
            return [];
        }
    }
    // 保存会话存储数据函数
    function saveSdate(dates) {
        // 把local数组转换为字符串格式再存储
        sessionStorage.setItem("delist", JSON.stringify(dates));
    }
    // 渲染已完成的数据函数
    function loadf() {
        // 读取本地存储数据
        var date = getDater();
        // 先清空原来的元素
        $(".tdlt").empty();
        // 遍历数据
        $.each(date, function (i, n) {
            // 获取完成状态
            if (date[i].done == true) {
                // 渲染数据已完成的
                $(".tdlt").prepend("<li class='td fnsh'>" + "<div class='finish' ><img src='./img/打钩.png' alt='打钩'  ></div>" +
                    "<div class='test'><input type='text' value='" + n.title + "' class='txt'></div>" +
                    "<div class='day'> " + getDay() + "</div>" +
                    "<div class='delete' id=" + i + " ><img src='./img/打叉.png' alt='打叉'></div>" +
                    "</li>");
            } else {
                return;
            }
        })
    }
    // 渲染进行中数据函数
    function loado() {
        // 读取本地存储数据
        var date = getDater();
        // 先清空原来的元素
        $(".tdlt").empty();
        // 遍历数据
        $.each(date, function (i, n) {
            // 获取完成状态
            if (date[i].done == false) {
                // 渲染数据已完成的
                $(".tdlt").prepend("<li class='td'>" + "<div class='finish' ><img src='./img/打钩.png' alt='打钩'  ></div>" +
                    "<div class='test'><input type='text' value='" + n.title + "' class='txt'></div>" +
                    "<div class='day'> " + getDay() + "</div>" +
                    "<div class='delete' id=" + i + " ><img src='./img/打叉.png' alt='打叉'></div>" +
                    "</li>");
            } else {
                return;
            }
        })
    }
    // 根据右边按钮渲染页面
    function flagload() {
        if (flag == 1) {
            load();
        } else if (flag == 2) {
            loado();
        } else if (flag == 3) {
            loadf();
        } else if (flag == 4) {
            loads();
        }
    }


})