const express  = require("express"); //載入 express 函式庫
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

require('dotenv').config()//會去此專案的跟目錄找.env檔

const app = express(); //建立一個Express伺服器

const db = mysql.createConnection({ //資料庫連線
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATADASE
});

const publicDirectory = path.join(__dirname,'./public');//__dirname為此app.js的絕對路徑
app.use(express.static(publicDirectory));//express.static() 呼叫靜態檔案

// Parse URL-encode bodies (as sent by HTML FORM)
app.use(express.urlencoded({extended:false}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine','hbs');//設定hbs，創建view後，裡面存放前端程式碼，副檔名為.hbs

db.connect((error)=>{
    if(error){
        console.log('error');
    }else{
        console.log("MYSQL Connected....");
    }
});

//Define Router
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth')); 

app.listen(5000,()=>{ ////告訴server聽取3000這個Port
    console.log("Server started on Port 5000");
})