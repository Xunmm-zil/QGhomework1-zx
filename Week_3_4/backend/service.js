// const mysql = require('mysql');
const express = require('express');
const port = 5000;
const cors = require('cors');

// 创建web服务器
const app = express();

app.use(cors());
// 设置传输格式和大小
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({limit:'10mb',extended:true}))
// 定义静态文件目录
app.use(express.static('../frontend'));

// 数据库连接池
// const pool = mysql.createPool({
//     host: '127.0.0.1', //数据库IP地址
//     user: 'root', //登录数据库的账号
//     password: '',
//     database: 'model' //操作的数据库名称
// })

// pool.query('select 1',(err,results)=>{
//     if(err){
//         console.log(err.massaga);
//     }else{console.log(results);
//     }
// })

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); 
// 允许的HTTP ⽅法
res.header("Access-Control-Allow-Headers", "Content-Type"); // 允许的请求头
if (req.method === "OPTIONS") {
return res.sendStatus(200); // 直接响应预检请求
}
next();
});


// 定义 POST 接口
app.post('/submitData', (req, res) => {
    const data = req.body;
    console.log('接收到的数据:', JSON.stringify(data,null,2)); 
    res.json({ message: '数据已成功接收', data: data });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
    
