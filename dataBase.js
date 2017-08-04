var fs = require('fs');
var sql = require('mssql');
var app = require('./app');
var dbConfig;
var dbConfigFilePath;
var conn=null;
var connection=null;

module.exports.getDBConfig=function(){
    return dbConfig;
};
module.exports.setDBConfig=function(newDBConfig){
    dbConfig= newDBConfig;
};
module.exports.loadConfig=function(){
    dbConfigFilePath='./' + app.startupMode + '.cfg';
    var stringConfig = fs.readFileSync(dbConfigFilePath);
    dbConfig = JSON.parse(stringConfig);
};
module.exports.saveConfig=function(callback) {
    fs.writeFile(dbConfigFilePath, JSON.stringify(dbConfig), function (err, success) {
        callback(err,success);
    })
};

module.exports.databaseConnection=function(callback){  console.log("databaseConnection");
    if(conn) conn.close();
    conn = new sql.Connection(dbConfig);
    conn.connect(function (err) {
        if (err) {
            callback(err.message);
            return;
        }
        callback(null,"connected");
    });
};

/**
 * for database query insert/update/delete
 * callback = function(err, updateCount)
 */
module.exports.executeQuery= function(query, callback) { console.log("executeQuery: ",query);
    var reqSql = new sql.Request(conn);
    reqSql.query(query,
        function (err, recordset, fields) {
            if (err) {                                                                                                  console.log("executeQuery err=",err);
                callback(err);
                return;
            }
            callback(null, recordset.affectedRows);
        });
};

/**
 * for database query select
 * callback = function(err, recordset, count, fields)
 */
module.exports.selectQuery= function(query, callback) {
    var reqSql = new sql.Request(conn);
    reqSql.query(query,
        function (err, recordset, fields) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, recordset, recordset.affectedRows, fields);
        });
};
/**
 * callback = function(outData)
 */
function getDataItemsFromDatabase(dbQuery, outData, resultItemName, callback){                                          console.log("getDataItemsFromDatabase dbQuery=",dbQuery);
    exports.selectQuery(dbQuery,function(err, recordset){
        if (err) {                                                                                                      console.log("selectQuery err=",err);
            outData.error= err.message;
            callback(outData);
            return;
        }
        outData[resultItemName]= recordset;
        callback(outData);
    })
};

module.exports.getDataForTable=function(dbQuery, outData, callback){
    getDataItemsFromDatabase(dbQuery, outData, "items", callback)
};

function getDataItemFromDatabase(dbQuery, outData, resultItemName, callback){                                           console.log("getDataItemFromDatabase dbQuery=",dbQuery);
    exports.selectQuery(dbQuery,function(err, recordset){
        if (err) {                                                                                                      console.log("selectQuery err=",err);
            outData.error= err.message;
            callback(outData);
            return;
        }
        outData[resultItemName]= recordset[0];
        callback(outData);
    })
};
module.exports.getDataItem=function(dbQuery, outData, callback){
    getDataItemFromDatabase(dbQuery, outData, "item", callback)
};

module.exports.getResultDataItem=function(dbQuery, outData, callback){
    getDataItemFromDatabase(dbQuery, outData, "resultItem", callback)
};
