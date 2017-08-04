
var startTime = new Date().getTime();

function startupParams() {
    var app_params = {};
    if (process.argv.length == 0) {
        app_params.mode = 'production';
        app_params.port = 8082;
        return app_params;
    }
    for (var i = 2; i < process.argv.length; i++) {
        if (process.argv[i].indexOf('-p:') == 0) {
            var port = process.argv[i].replace("-p:", "");
            if (port > 0 && port < 65536) {
                app_params.port = port;
            }
        } else if (process.argv[i].charAt(0).toUpperCase() > 'A' && process.argv[i].charAt(0).toUpperCase() < 'Z') {
            app_params.mode = process.argv[i];
        } else if (process.argv[i].indexOf('-log:') == 0) {
            var logParam = process.argv[i].replace("-log:", "");
            if (logParam.toLowerCase() == "console") {
                app_params.logToConsole = true;
            }
        }
    }
    if (!app_params.port)app_params.port = 8080;
    if (!app_params.mode)app_params.mode = 'production';
    return app_params;
}

var app_params = startupParams();

var log = require('winston');

if (!app_params.logToConsole) {
    log.add(log.transports.File, {filename: 'history.log', level: 'debug', timestamp: true});
    log.remove(log.transports.Console);
}

module.exports.startupMode = app_params.mode;

var fs = require('fs');
log.info('fs...', new Date().getTime() - startTime);//test
var express = require('express');
log.info('express...', new Date().getTime() - startTime);//test
var port = app_params.port;
var path = require('path');
log.info('path...', new Date().getTime() - startTime);//test
var bodyParser = require('body-parser');
log.info('body-parser...', new Date().getTime() - startTime);//test

var app = express();
log.info('http...', new Date().getTime() - startTime);//test


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/', express.static('public'));
var database = require('./dataBase');
log.info('./dataBase...', new Date().getTime() - startTime);//test
var ConfigurationError, DBConnectError;

tryLoadConfiguration();
function tryLoadConfiguration() {
    log.info('tryLoadConfiguration...', new Date().getTime() - startTime);//test
    try {
        database.loadConfig();
        ConfigurationError = null;
    } catch (e) {
        ConfigurationError = "Failed to load configuration! Reason:" + e;
    }
}
if (!ConfigurationError) tryDBConnect();
function tryDBConnect(postaction) {
    log.info('tryDBConnect...', new Date().getTime() - startTime);//test
    database.databaseConnection(function (err) {
        DBConnectError = null;
        if (err) {
            DBConnectError = "Failed to connect to database! Reason:" + err;
        }
        if (postaction)postaction(err);
        log.info('tryDBConnect DBConnectError=', DBConnectError);//test
    });
}

app.get("/", function (req, res) {
    log.info('URL: /');
    res.sendFile(path.join(__dirname, '/views', 'main.html'));
});
app.get("/sysadmin", function (req, res) {
    log.info('URL: /sysadmin');
    res.sendFile(path.join(__dirname, '/views', 'sysadmin.html'));
});
app.get("/main/get_data", function (req, res) {
    log.info('URL: /main/get_data');
    var outData= {};
    outData.title= 'moda.ua';
    outData.mode= app_params.mode;
    outData.mode_str= app_params.mode;
    //outData.port=port;
    outData.user="";
    if (ConfigurationError) {
        outData.error= ConfigurationError;
        res.send(outData);
        return;
    }
    //outData.configuration= database.getDBConfig();
    if (DBConnectError) {
        outData.dbConnection= DBConnectError;
        res.send(outData);
        return;
    }
    outData.dbConnection='Connected';
    outData.menuBar = [];
    outData.menuBar.push({ itemname:"menuBarItemPInvs", itemtitle:"Приходные накладные", action:"open", id:"wrhPInvs", title:"Приходные накладные", content:"/p_invoice", closable:false});
    outData.menuBar.push({ itemname:"menuBarItemClose", itemtitle:"Выход", action:"close"});
    outData.menuBar.push({ itemname:"menuBarItemHelpAbout", itemtitle:"О программе", action:"help_about"});
    outData.autorun = [];
    outData.autorun.push({menuitem:"menuBarItemPInvs"});
    res.send(outData);
});

//var dataModel = require("./datamodel/datamodel");
//dataModel.init(app);

app.get("/mainOpenPage/*", function (req, res) {
    log.info('URL: '+req.originalUrl);                          console.log("req.originalUrl=",req.originalUrl);console.log("req.path=",req.path);
    var file=req.originalUrl.replace("/mainOpenPage","");
    res.sendFile(path.join(__dirname, '/views', file+'.html'));
});


app.get("/sysadmin/app_state", function(req, res){                                     log.info("app.get /sysadmin/app_state");
    var outData= {};
    outData.mode= app_params.mode;
    outData.port=port;
    outData.connUserName=database.getDBConfig().user;
    if (ConfigurationError) {
        outData.error= ConfigurationError;
        res.send(outData);
        return;
    }
    outData.configuration= database.getDBConfig();
    if (DBConnectError)
        outData.dbConnection= DBConnectError;
    else
        outData.dbConnection='Connected';
    res.send(outData);
});

app.get("/sysadmin/startup_parameters", function (req, res) {
    log.info('URL: /sysadmin/startup_parameters');
    res.sendFile(path.join(__dirname, '/views/sysadmin', 'startup_parameters.html'));
});

app.get("/sysadmin/startup_parameters/get_app_config", function (req, res) {
    log.info('URL: /sysadmin/startup_parameters/get_app_config');
    if (ConfigurationError) {
        res.send({error:ConfigurationError});
        return;
    }
    res.send(database.getDBConfig());
});
app.get("/sysadmin/startup_parameters/load_app_config", function (req, res) {
    log.info('URL: /sysadmin/startup_parameters/load_app_config');
    tryLoadConfiguration();
    if (ConfigurationError) {
        res.send({error: ConfigurationError});
        return;
    }
    res.send(database.getDBConfig());
});

app.post("/sysadmin/startup_parameters/store_app_config_and_reconnect", function (req, res) {
    log.info('URL: /sysadmin/startup_parameters/store_app_config_and_reconnect', 'newDBConfigString =', req.body);
    var newDBConfigString = req.body;
    database.setDBConfig(newDBConfigString);
    database.saveConfig(
        function (err) {
            var outData = {};
            if (err) outData.error = err;
            tryDBConnect(/*postaction*/function (err) {
                if (DBConnectError) outData.DBConnectError = DBConnectError;
                res.send(outData);
            });
        }
    );
});

app.get("/print/printSimpleDocument", function (req, res) {                                                 log.info(req.url);
    res.sendFile(path.join(__dirname, '/views/print', 'printSimpleDocument.html'));
});

app.get("/p_invoice/get_pinvs_list", function (req, res) {                                      console.log(req.url + " params:", req.query);
    var tableKeyField="ChID", tableColumns=[
        {"data": "ChID", "name": "ChID", "width": 100, "type": "text", readOnly:true, visible:false},
        {"data": "DocID", "name": "Номер", "width": 80, "type": "text", readOnly:true},
        {"data": "DocDate", "name": "Дата", "width": 90, "type": "text", dateFormat:"DD.MM.YY", readOnly:true},
        {"data": "OurName", "name": "Фирма", "width": 120, "type": "text", readOnly:true},
        {"data": "StockName", "name": "Склад", "width": 120, "type": "text", readOnly:true},
        {"data": "CompName", "name": "Предприятие", "width": 150, "type": "text", readOnly:true},
        {"data": "TSumCC_wt", "name": "Сумма", "width": 90, "type": "numeric", format:"#,###,###,##0.00[#######]", language:"ru-RU", readOnly:true},
        {"data": "Notes", "name": "Примечание", "width": 300, "type": "text", readOnly:true}
    ];
    var outData = {columns: tableColumns, identifier: tableColumns[0].data};
    var getDataQuery = "select m.*, o.OurName,s.StockName,c.CompName from t_Rec m inner join r_Ours o on o.OurID=m.OurID inner join r_Stocks s on s.StockID=m.StockID inner join r_Comps c on c.CompID=m.CompID";
    var whereCondition="";
    if (req.query){
        if (req.query["BDATE"]) whereCondition+="DocDate>='"+req.query["BDATE"]+"'";
        if (req.query["EDATE"]) whereCondition+=" and DocDate<='"+req.query["EDATE"]+"'";
    }
    if (whereCondition.length==0){
        res.send(outData);
        return;
    }
    //if (req.query){
    //    var getDataQueryWhereConditions=null, getDataQueryWhereCondition;
    //    for(var queryItemName in req.query) {
    //        getDataQueryWhereCondition= queryItemName+"="+req.query[queryItemName];
    //        getDataQueryWhereConditions = (getDataQueryWhereConditions==null)?getDataQueryWhereCondition:" and "+getDataQueryWhereCondition;
    //    }
    //    if (getDataQueryWhereConditions!=null) getDataQuery+= " where "+getDataQueryWhereConditions;
    //}
    getDataQuery+= " where "+whereCondition+" order by m.DocDate, m.OurID, m.StockID, m.DocID";
    database.getDataForTable(getDataQuery, outData,
        function (outData) {
            if (outData&&outData.items){
                for(var ri=0;ri<outData.items.length;ri++){
                    var dataItem=outData.items[ri];
                    if (dataItem&&tableKeyField&&dataItem[tableKeyField]!==undefined)
                        dataItem[tableKeyField]=dataItem[tableKeyField].toString();
                }
            }
            res.send(outData);
        });
});
app.get("/p_invoice/get_pinv", function (req, res) {                                      console.log(req.url + " params:", req.query);
    var tableKeyField="ChID", outData = {};
    var getDataQuery = "select m.ChID, m.DocID, m.DocDate, m.TSumCC_wt, o.OurName,s.StockName,c.CompName, TCount=(select Count(1) from t_RecD where ChID=m.ChID), TQty=ISNULL(SUM(md.Qty),0) from t_Rec m inner join r_Ours o on o.OurID=m.OurID inner join r_Stocks s on s.StockID=m.StockID inner join r_Comps c on c.CompID=m.CompID left join t_RecD md on md.ChID=m.ChID";
    var whereCondition="";
    if (req.query){
        if (req.query["ChID"]) whereCondition+="m.ChID="+req.query["ChID"];
    }
    if (whereCondition.length==0){
        res.send(outData);
        return;
    }
    getDataQuery+= " where "+whereCondition+" group by m.ChID, m.DocID, m.DocDate, m.TSumCC_wt, o.OurName,s.StockName,c.CompName";
    database.getDataItem(getDataQuery, outData,
        function (outData) {
            if (outData&&outData.item){
                var dataItem=outData.item;
                if (dataItem&&tableKeyField&&dataItem[tableKeyField]!==undefined)
                    dataItem[tableKeyField]=dataItem[tableKeyField].toString();
            }
            res.send(outData);
        });
});
app.get("/p_invoice/get_pinv_products", function (req, res) {                                      console.log(req.url + " params:", req.query);
    var tableKeyField="ChID", tableColumns=[
        {"data": "ChID", "name": "ChID", "width": 100, "type": "text", readOnly:true, visible:false},
        {"data": "SrcPosID", "name": "№ п/п", "width": 70, "type": "numeric", format:"#,###,###,##0", readOnly:true},
        {"data": "ProdName", "name": "Товар", "width": 200, "type": "text", readOnly:true},
        {"data": "UM", "name": "Ед.изм.", "width": 60, "type": "text", readOnly:true},
        {"data": "Article1", "name": "Артикул", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "PriceCC_wt", "name": "Цена", "width": 90, "type": "numeric", format:"#,###,###,##0.00[#######]", language:"ru-RU", readOnly:true},
        {"data": "Qty", "name": "Кол-во", "width": 90, "type": "numeric", format:"#,###,###,##0.[#########]", language:"ru-RU", readOnly:true},
        {"data": "SumCC_wt", "name": "Сумма", "width": 90, "type": "numeric", format:"#,###,###,##0.00[#######]", language:"ru-RU", readOnly:true},
        {"data": "Notes", "name": "Примечание", "width": 300, "type": "text", readOnly:true},
        {"data": "Extra", "name": "Наценка", "width": 60, "type": "numeric", format:"#,###,###,##0", language:"ru-RU", readOnly:true},
        {"data": "PriceCC", "name": "Цена продажи", "width": 90, "type": "numeric", format:"#,###,###,##0.00[#######]", language:"ru-RU", readOnly:true}
    ];
    var outData = {columns: tableColumns, identifier: tableColumns[0].data};
    var getDataQuery = "select m.*, p.ProdName,ProdUM=p.UM,p.Article1 from t_RecD m inner join r_Prods p on p.ProdID=m.ProdID";
    var whereCondition="";
    if (req.query){
        if (req.query["ChID"]) whereCondition+="m.ChID="+req.query["ChID"];
    }
    if (whereCondition.length==0){
        res.send(outData);
        return;
    }
    getDataQuery+= " where "+whereCondition+" order by m.SrcPosID";
    database.getDataForTable(getDataQuery, outData,
        function (outData) {
            if (outData&&outData.items){
                for(var ri=0;ri<outData.items.length;ri++){
                    var dataItem=outData.items[ri];
                    if (dataItem&&tableKeyField&&dataItem[tableKeyField]!==undefined)
                        dataItem[tableKeyField]=dataItem[tableKeyField].toString();
                }
            }
            res.send(outData);
        });
});
app.get("/print/print_tags", function (req, res) {                                                 log.info(req.url);
    res.sendFile(path.join(__dirname, '/views/print', 'print_tags.html'));
});
app.get("/print/product_tag_58x30.html", function (req, res) {                                                 log.info(req.url);
    res.sendFile(path.join(__dirname, '/views/print', 'product_tag_58x30.html'));
});
app.get("/print/product_tag_40x25.html", function (req, res) {                                                 log.info(req.url);
    res.sendFile(path.join(__dirname, '/views/print', 'product_tag_40x25.html'));
});
//app.get("/p_invoice/get_pinv_products", function (req, res) {                                      console.log(req.url + " params:", req.query);
//
//});

app.listen(
    port, function (err) {
    if(err){
        console.log("listen port err= ", err);
        return;
    }
    console.log("app runs on port " + port);
    log.info("app runs on port " + port, new Date().getTime() - startTime);
});

log.info("end app", new Date().getTime() - startTime);
