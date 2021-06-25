const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv');
const {promisify} = require('util'); //Promise執行非同步

require('dotenv').config()



const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

const query = promisify(db.query.bind(db));//bind   指定參數

//async 非同步
exports.login = async (req, res) => {
    try {

        const {name,password} = req.body;

        if (!name || !password) {
            return res.status(400).render('login', {
                message: 'Please Provide an email and password'
            });
        }

        //await 等代，會等待這段函式完成後再往下繼續執行，這是一個卡住的概念。
        const results = await query('SELECT * FROM user WHERE name = ? ', [name]); // problem occur due to usage of curly brackets.
            
        if (!name || !(await bcrypt.compare(password, results[0].password))) {
            // console.log(results);
            res.status(401).render('login', {
                message: 'Name or Password is Incorrect'
            });
        }else{ //everything is ok
            const UID = results[0].UID; 

            const token = jwt.sign({UID},process.env.JWT_SECRET,{
                expiresIn:process.env.JWT_EXPIRES_IN
            });

            console.log("the token is : " + token);

            const cookieOptions = {
                expires:new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly:true
            } 
            res.cookie('jwt',token,cookieOptions);
            res.status(200).redirect("/ordermanage");
        }

    } catch (error) {
        console.log(error);
    }
}

exports.register = (req,res) => {
    
    const {name,password,passwordConfirm} = req.body;

    db.query('SELECT name FROM user WHERE name = ?',[name],async (error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register',{
                message:'User is in register'
            });
        }else if(password !== passwordConfirm){
            return res.render('register',{
                message:'password do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password,8);
        // console.log("--------------:"+hashedPassword);

        db.query('INSERT INTO user SET ?',{name:name,password:hashedPassword},(error,results)=>{
            if(error){
                console.log(error);
            }else{
                // console.log(results);
                return res.render('register',{
                    message:'User registered'
                });
            }
        })

    });
}

exports.index = (req,res) =>{
    const {name,phone,commodity,time,ordernumber} = req.body;
    // console.log(time);
        
    db.query('INSERT INTO orderform SET ?',{name:name,phone:phone,MID:commodity,number:ordernumber,time:time},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            // console.log(time);
            return res.render('index',{
                message:'The order has been sent'
            });
        }
    })
} 

exports.Warehousing = (req,res) =>{
    const {name,time,batch,instock,IsBig} = req.body;
        
    db.query('INSERT INTO material SET ?',{Mname:name,leadtime:time,batch:batch,instock:instock,IsBig:IsBig},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.status(200).redirect("/Warehousing");
        }
    })
} 

exports.editmaterial = (req,res) =>{
    const {ID,name,time,batch,instock,IsBig} = req.body;
    // console.log(req.body);
        
    db.query('UPDATE material SET Mname = ?,leadtime = ?,batch = ?,instock = ?,IsBig = ? WHERE MID = ?',[name,time,batch,instock,IsBig,ID],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            // console.log(ID);
            res.status(200).redirect("/Warehousing");
        }
    })
} 

exports.addbom = async(req,res) =>{
    const {name,material,number} = req.body;

    try{
        for(let i = 0;i < name.length;i++){
            await query('INSERT INTO bom SET MID = ?,material = ?, number = ?',[name[i],material[i],number[i]]);
            console.log('query');
        }
        return res.status(200).redirect('/bom');

    }catch(err){
        console.log(err);
    }
} 

exports.purchase = (req,res) =>{
    const {name,time,number} = req.body;
        
    db.query('INSERT INTO expectedarrival SET ?',{MID:name,time:time,number:number},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.status(200).redirect("/purchase");
        }
    })
} 

exports.haha = async(req,res) =>{
    const {number} = req.body;

    try{
        function getRandom(min,max){
            return Math.floor(Math.random()*(max-min+1))+min;
        };

        for(let i = 0;i < number;i++){
            let a = getRandom(1,3);
            let b = getRandom(10,20);
            let c = getRandom(1,9);
            await query('INSERT INTO material SET Mname = ?,leadtime = ?, batch = ?,instock = ?,IsBig = ?',[(i+1),a,b,c,0]);
            console.log('query');
        }
        for(let i = 0;i < number;i++){
            let d = getRandom(1,3);
            await query('INSERT INTO bom SET MID = ?,material = ?, number = ?',[8,(11+i),d]);
            console.log('query1');
        }
        return res.status(200).redirect('/Warehousing');

    }catch(err){
        console.log(err);
    }
} 