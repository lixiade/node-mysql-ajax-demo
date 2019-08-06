var http = require("http");
var fs = require("fs");
var url = require("url");
var querystring = require("querystring");
var mysql = require('mysql');




var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '637315',
    database: 'node+ajax-demo'
});
//连接数据库
connection.connect(function (err) {
    if (err) {
        console.error('error connecting:' + err.stack);
        return;
    }
    // console.log('connected as id' + connection.threadId);
});



var app = http.createServer(function (req, res) {
    var url_obj = url.parse(req.url);
    if (req.url === "/") {
        render("./node+mysql+ajax的信息管理/template/login.html", res);
        return;
    } else if (req.url === "/register" && req.method === "POST") {
        // res.write('{"name":"fengkun"}');
        // res.end();
        var user_info = '';
        req.on("data", function (chunk) {
            user_info += chunk;
        });
        req.on("end", function (err) {
            var user_obj = querystring.parse(user_info);
            if (!err) {
                // console.log(user_info);
                res.setHeader("content-type", "text/html;charset=utf-8");

                if (user_obj.username === "" || user_obj.password === "") {
                    res.write('{"code":0,"message":"用户名和密码不能为空"}');
                    res.end();
                    return;
                } else if (user_obj.username !== user_obj.check_password) {
                    res.write('{"code":1,"message":"两次密码输入不一致"}');
                    res.end();
                    return;
                }
                // console.log(user_obj);
                //将信息写入数据库
                var adduser = 'insert into admin(username,password) value(" ' + user_obj.username + ' ","' + user_obj.password + '")';
                connection.query(adduser, function (error, results) {
                    // if (error) throw error;
                    console.log("error:", error);
                    console.log(results);
                    if (!error && results && res.length !== 0) {
                        res.write('{"code":666,"message":"注册成功了"}', 'utf-8');
                        res.end();
                        return;
                    }
                });
            }
        });
    } else if (req.url === "/login" && req.method === "POST") {
        var user_info = '';
        req.on("data", function (chunk) {
            user_info += chunk;
        });
        req.on("end", function (error, ) {
            user_obj = querystring.parse(user_info);
            if (!error) {
                res.setHeader("content-type", "text/html;charset=utf-8");
                var loginUser = "select * from admin where username='" + user_obj.username + "'and password='" + user_obj.password + "'";
                connection.query(loginUser, function (error, results) {
                    // if (error) throw error;
                    console.log("error:", error);
                    console.log(results);
                    //如果查询出数据说明能够登录
                    if (!error && results && results.length !== 0) {
                        res.write('{"code":2,"message":"登录成功"}', 'utf-8');
                        res.end();
                    } else {
                        res.write('{"code":3,"message":"用户名或密码错误，请重试"}', 'utf-8');
                        res.end();
                    }
                    return;
                });
            }
        })
    } else if (req.url === "/list" && req.method === "GET") {
        // console.log();
        var selectUser = "select * from user";
        connection.query(selectUser, function (error, results) {
            // if (error) throw error;
            // console.log("error:", error);
            // console.log(results);
            //如果查询出数据说明能够登录
            if (!error && results && results.length !== 0) {
                var arrstr = JSON.stringify(results);
                console.log(arrstr);
                res.setHeader("content-type", "text/html;charset=utf-8");
                res.write('{"code":4,"data":' + arrstr + '}', 'utf-8');
                res.end();
            } else {
                res.write('{"code":5,"message":"请求失败，请刷新重试"}', 'utf-8');
                res.end();
            }
            return;
        });
    } else {
        // console.log(req.url)
        var surl = req.url;
        // substr() 方法可在字符串中抽取从 开始 下标开始的指定数目的字符。
        var type = surl.substr(surl.lastIndexOf(".") + 1, surl.length)
        res.writeHead(200, { 'Content-type': "text/" + type });
        render("./node+mysql+ajax的信息管理/template" + url_obj.pathname, res);
    }
}).listen(3000);

/**
 * 将经常重复的代码封装使用，方便生产
 */
function render(path, res) {
    fs.readFile(path, "binary", function (err, data) {
        if (!err) {
            res.write(data, "binary");
            res.end();
        }
    })
};