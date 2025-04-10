window.addEventListener('load', function () {
    // 获取元素
    const upMdlBtn = document.getElementById('upload');
    const upMdlForm = document.getElementById('upmoform');
    const overlay = document.getElementById('overlay');
    const moform = document.getElementById('moform');
    const cfmweigth = document.querySelector('#moform #confirm-button');
    const cfmMdlBtn = document.querySelector('#upmoform #confirm-button');
    const modelLibrary = document.getElementById('model-library');
    const addLevelBtn = document.getElementById('addlevel');
    const addPjtBtn = document.getElementById('add');
    const runForm = document.getElementById('run');
    const itemname = document.getElementById('itemname');
    const content = document.getElementById('content');
    const runBtn = document.querySelector('#run #confirm-button');
    const projectList = document.getElementById('item-list');
    const cancelBtn = document.getElementById('cancel-button');
    const modeldetails = document.getElementById('modeldetails');
    const levels = document.getElementById('levels');
    const deletemodel = document.getElementById('deletemodel');
    const weight = document.getElementById('weight');
    const question = document.getElementById('question');
    const image = document.getElementById('image');
    const puls = document.getElementById('puls');




    // 打开页面渲染模型库
    const models = getitemDate('modelList');
    saveDate(models, 'modelList');
    renderModelData();
    // 渲染层级
    renderLevelData();

    const moinput = document.querySelectorAll('.model input');
    // 拖拽模型进入层级
    var modelinfor = null;
    // 拖拽时
    moinput.forEach((mdl, index) => {
        mdl.addEventListener('drag', (event) => {
            event.preventDefault();
            var data = getitemDate('modelList');
            modelinfor = data[index];
        })
    })
    // 拖拽结束
    moinput.forEach((mdl) => {
        mdl.addEventListener('dragend', (event) => {
            event.preventDefault();
            modelinfor = null;
        })
    })
    levels.addEventListener('dragover', (event) => {
        event.preventDefault();
    })
    // 放置
    levels.addEventListener('drop', (event) => {
        event.preventDefault();
        var target = event.target;
        // 判断元素是否是 level 元素
        while (target && !target.classList.contains('level')) {
            target = target.parentElement;
        }
        if (target.classList.contains('level') && modelinfor) {
            var index = target.getAttribute('num');
            var data = getitemDate('levellist');
            data[index].models.push({ "modelName": modelinfor.modelName, "modelUrl": modelinfor.modelUrl, "weight": '', "question": '' });
            if (data[index].models.length > 1) {
                data[index].parallel = 1;
            }else{
                data[index].parallel = 0;
            }
            saveDate(data, 'levellist');
            renderLevelData();
        }
    })


    // 拖拽删除层级中模型
    var num1 = null;
    var num2 = null;
    // 获取拖拽元素信息传递给后面放置事件
    levels.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('lemo')) {
            var dataToTransfer = `${event.target.classList.contains('lemo')}`;
            event.dataTransfer.setData('text/plain', dataToTransfer);
        }

    })
    // 记录拖拽的模型和层级序号方便后面删除数据
    levels.addEventListener('drag', (event) => {
        if (event.target.classList.contains('lemo')) {
            num2 = event.target.getAttribute('numm');
            num1 = event.target.parentElement.parentElement.getAttribute('num');
        }
    })
    // 清除默认样式才可设置放置
    deletemodel.addEventListener('dragover', (event) => {
        event.preventDefault();
    })
    // 设置放置
    deletemodel.addEventListener('drop', () => {
        if (event.dataTransfer.getData('text/plain')) {
            const data = getitemDate('levellist');
            data[num1].models.splice(num2, 1);
            if (data[num1].models.length > 1) {
                data[num1].parallel = 1;
            }else{
                data[num1].parallel = 0;
            }
            saveDate(data, 'levellist');
            renderLevelData();
        }

    })
    levels.addEventListener('dragend', (event) => {
        if (event.target.classList.contains('lemo')) {
            num2 = null;
            num1 = null;
        }
    })


    var weightmodel = null;
    var weightlevel = null;
    // 输入模型权重和问题信息
    levels.addEventListener('click', (event) => {
        if (event.target.classList.contains('lemo')) {
            moform.classList.add('show');
            overlay.classList.add('show');
            weightmodel = event.target.getAttribute('numm');
            weightlevel = event.target.parentElement.parentElement.getAttribute('num');
        }
    })
    // 点击确认保存权重信息
    cfmweigth.addEventListener('click', () => {
        var data = getitemDate('levellist');
        data[weightlevel].models[weightmodel].weight = weight.value;
        data[weightlevel].models[weightmodel].question = question.value;
        saveDate(data, 'levellist')
        weight.value = '';
        question.value = '';
    })



    // 新增项目
    addPjtBtn.addEventListener('click', () => {
        runForm.classList.add('show');
        overlay.classList.add('show');
    })

    // 上传图片
    var base64String = null;
    image.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                base64String = e.target.result;
                // 将 Base64 编码的图片设置为按钮的背景图
                event.target.parentElement.style.backgroundImage = `url(${base64String})`;
                puls.style.display = 'none';
            };
            // 把图片转化为base64
            reader.readAsDataURL(file);
        }
    });
    
    // 运行项目按钮
    runBtn.addEventListener('click', (event) => {
        // 阻止表单默认提交行为
        event.preventDefault();
        const itemName = itemname.value;
        const contentdata = content.value;
        const leveldata = getitemDate('levellist');
        const data = {
            "itemName": itemName,
            "content": contentdata,
            "image": base64String,
            "modelList": leveldata
        }
        fetch('/submitData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
       .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
       .then(result => {
            console.log('后台响应:', result);
        })
       .catch(error => {
            console.error('点击运行按钮时出错:', error);
        });
        base64String = null;
    })

    // 模型详情左拉框
    const detail = document.querySelectorAll('.detail');
    const model = document.querySelectorAll('.model');
    var left = 0;
    var actdetail = -1;
    // 动画函数
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
    // 记录模型索引号
    for (var i = 0; i < model.length; i++) {
        model[i].setAttribute('num', i);
    }
    // 模型绑定鼠标移入事件
    for (var i = 0; i < detail.length; i++) {
        model[i].addEventListener('click', function () {
            // 获取鼠标移入的模型的索引号
            var num = this.getAttribute('num');
            if (actdetail == num || actdetail == -1) {
                if (left == 0) {
                    animate(detail[num], 0);
                    actdetail = num;
                    left = 1;
                } else {
                    animate(detail[num], -300);
                    actdetail = -1;
                    left = 0;
                }
            } else {
                animate(detail[actdetail], -300);
                actdetail = num;
                animate(detail[num], 0);
            }
        })
    }



    //点击上传模型按钮
    upMdlBtn.addEventListener('click', function () {
        upMdlForm.classList.add('show');
        overlay.classList.add('show');
    })

    // 点击取消按钮
    cancelBtn.addEventListener('click', function () {
        upMdlForm.classList.remove('show');
        runForm.classList.remove('show');
        overlay.classList.remove('show');
        moform.classList.remove('show');
        puls.style.display = 'block';
    })
    //点击添加层级按钮
    addLevelBtn.addEventListener('click', function () {
        const data = getitemDate('levellist');
        var level = data.length + 1;
        data.push({ "layer": level, "parallel": 0, "models": [] });
        saveDate(data, 'levellist')
        renderLevelData();
    })


    //  读取本地存储的数据函数
    function getitemDate(dataname) {
        var date = localStorage.getItem(dataname);
        if (date !== null) {
            // 本地存储是字符串类型，转换为对象
            return JSON.parse(date);
        } else {
            if (dataname == 'modelList') {
                return [{
                    "modelName": "OpenAI",
                    "modelUrl": "https://chat.openai.com/",
                    "introduce": '由OpenAI开发,以强⼤的⾃然语⾔处理能⼒著称,⽀持多任务处理,⼴泛应⽤于对话、创作和代码⽣成,代表作为GPT系列模型。'
                },
                {
                    "modelName": "deepseek",
                    "modelUrl": "https://chat.deepseek.com/",
                    "introduce": '深度求索公司推出的开源⼤模型，专注⾼效推理与⻓⽂本处理,⽀持128K上下⽂,适合代码、数学及复杂逻辑任务。'
                },
                {
                    "modelName": "腾讯元宝",
                    "modelUrl": "https://yuanbao.tencent.com/",
                    "introduce": '腾讯推出的企业级⼤模型，强调安全与落地应⽤，⽀持多模态交互，适⽤于⾦融、医疗等⾏业场景优化。'
                }];
            } else {
                return [];
            }

        }

    }
    // 保存本地存储数据函数
    function saveDate(date, dataname) {
        // 把local数组转换为字符串格式再存储
        localStorage.setItem(dataname, JSON.stringify(date));
    }
    // 渲染模型数据到页面
    function renderModelData() {
        const models = getitemDate('modelList');

        models.forEach(model => {
            // 增加模型节点
            const modelDiv = document.createElement('div');
            modelDiv.classList.add('model');
            modelDiv.dataset.name = model.modelName;

            const modelButton = document.createElement('input');
            modelButton.type = 'button';
            modelButton.value = model.modelName;
            modelButton.draggable = true;

            modelDiv.appendChild(modelButton);
            modelLibrary.appendChild(modelDiv);
            // 增加详情节点
            const detailDiv = document.createElement('div');
            detailDiv.classList.add('detail');

            const modelName = document.createElement('h2');
            modelName.classList.add('modelName');
            modelName.textContent = model.modelName;

            const modelUrl = document.createElement('a');
            modelUrl.href = model.modelUrl;
            modelUrl.textContent = model.modelUrl;

            const introduce = document.createElement('div');
            introduce.classList.add('introduce');
            introduce.textContent = model.introduce;

            detailDiv.appendChild(modelName);
            detailDiv.appendChild(modelUrl);
            detailDiv.appendChild(introduce);

            modeldetails.appendChild(detailDiv);
        });
    }

    // 渲染层级到页面
    function renderLevelData() {
        levels.innerHTML = '';

        const data = getitemDate('levellist');
        data.forEach((level, index) => {
            // 创建层级的容器元素
            const levelDiv = document.createElement('div');
            levelDiv.classList.add('level');
            levelDiv.setAttribute('num', index);

            // 创建层级标题元素
            const lel = document.createElement('div');
            lel.classList.add('lel');
            lel.textContent = `层级${level.layer}`;

            // 创建模型列表元素
            const moList = document.createElement('div');
            moList.classList.add('level-list');

            // 遍历该层级下的模型
            level.models.forEach((model, index) => {
                const modelBtn = document.createElement('input');
                modelBtn.type = 'button';
                modelBtn.value = model.modelName;
                modelBtn.classList.add('lemo');
                modelBtn.draggable = true;
                modelBtn.setAttribute('numm', index)
                moList.appendChild(modelBtn);
            });


            // 将标题和列表添加到层级容器中
            levelDiv.appendChild(lel);
            levelDiv.appendChild(moList);
            // 将层级容器添加到页面上的层级总容器中
            levels.appendChild(levelDiv);

        });


    }




})

// [{
//     "image": "base64的数据格式",
//     //如果⽤⼾输⼊了
//     "content": "",
//     "modelList": [
//         {
//             "layer": 1,//层级
//             "parallel": 0,//是否串⾏，0代表串⾏，1代表并⾏
//             "models": [
//                 {
//                     "modelName": "视⽹膜识别模型resnet50 model",
//                     "modelUrl": " ",
//                     "weight": 1
//                 }
//             ]
//         },
//         ]
// }]