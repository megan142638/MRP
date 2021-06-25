const mysql = require("mysql");
const dotenv = require('dotenv');
const express = require('express');

const router = express.Router();

require('dotenv').config()
const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE,
    multipleStatements: true
});

let sql1 = "SELECT * FROM orderform;SELECT * FROM material;SELECT * FROM bom;SELECT * FROM expectedarrival";
let sql2 = "SELECT * FROM bom;SELECT * FROM material;";
let sql3 = "SELECT * FROM orderform;SELECT * FROM material;";


router.get('/mrp',(req,res) => {
    try {
        db.query(sql1,[2,1],(err,results,fields)=>{
            if (err) {
                throw err;
            }else{
                results = JSON.stringify(results);
                res.render('mrp',{
                    results
                })
            }
        });
    }catch(error){
        console.log(error);
    }
});

router.get('/register',(req,res) => {
    res.render('register');
});

router.get('/login',(req,res) => {
    res.render('login');
});

router.get('/',(req,res) => {
    try {
        db.query('SELECT * FROM material;',(err,results)=>{
            if (err) {
                throw err;
            }else{
                console.log(results);
                results = JSON.stringify(results);
                res.render('index',{
                    results
                })
            }
        });
    }catch(error){
        console.log(error);
    }
});

router.get('/ordermanage',(req,res) => {
    try {
        db.query(sql3,[2,1],(err,results,fields)=>{
            if (err) {
                throw err;
            }else{
                results = JSON.stringify(results);
                res.render('ordermanage',{
                    results
                })
            }
        });
    }catch(error){
        console.log(error);
    }
});

router.get('/bom',(req,res) => {
    try {
        db.query(sql2,[2,1],(err,results,fields)=>{
            if (err) {
                throw err;
            }else{
                results = JSON.stringify(results);
                res.render('bom',{
                    results
                })
            }
        });
    }catch(error){
        console.log(error);
    }
});

router.get('/addbom',(req,res) => {
    try {
        db.query('SELECT * FROM material;',(err,results)=>{
            if (err) {
                throw err;
            }else{
                console.log(results);
                results = JSON.stringify(results);
                res.render('addbom',{
                    results
                })
            }
        });
    }catch(error){
        console.log(error);
    }
});

router.get('/Warehousing',(req,res) => {
    try {
        db.query('SELECT * FROM material;',(err,results)=>{
            if (err) {
                throw err;
            }else{
                // console.log(results);
                // results = JSON.stringify(results);
                res.render('Warehousing',{
                    results
                })
            }
        });
    }catch(error){
        console.log(error);
    }
});

router.get('/editmaterial/:MID',(req,res) => {
    try{
        // console.log(req.params.MID);
        db.query('SELECT * FROM material WHERE MID = ?',[req.params.MID],(err,rows)=>{
            if (err) {
                throw err;
            }else{
                // console.log(rows);
                // rows = JSON.stringify(rows);
                res.render('editmaterial',{
                    rows
                })
            }
        });
    }catch(error){
        console.log(error);
    }
    
});

router.get('/purchase',(req,res) => {
    try {
        db.query('SELECT * FROM expectedarrival;',(err,results)=>{
            if (err) {
                throw err;
            }else{
                res.render('purchase',{
                    results
                })
            }
        });
    }catch(error){
        console.log(error);
    }
});

router.get('/ordermanage/:OID',(req,res) => {
    try{
        // console.log(req.params.MID);
        db.query('DELETE FROM orderform WHERE OID = ?',[req.params.OID],(err,results)=>{
            if (err) {
                throw err;
            }else{
                // console.log(rows);
                // rows = JSON.stringify(rows);
                res.status(200).redirect("/ordermanage");

                // res.render('/ordermanage')
            }
        });
    }catch(error){
        console.log(error);
    }
    
});

module.exports = router;