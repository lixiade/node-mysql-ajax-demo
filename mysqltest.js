var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '637315',
    database: 'node+ajax-demo'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting:' + err.stack);
        return;
    }
    // console.log('connected as id' + connection.threadId);
});
//执行查询操作 把查询命令发送出去
connection.query('select * from user', function (error, results) {
    if (error) throw error;
    console.log(results);
});