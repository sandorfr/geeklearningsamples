var express = require('express');
var app = express();
var bunyan = require('bunyan');
var azBunyan = require('az-bunyan');

// define the target azure storage table name
var tableName = 'LogDev';

// define the connection string to your azure storage account
var connectionString = 'DefaultEndpointsProtocol=https;AccountName=accountName;AccountKey=accessKey;'

// initialize the az-bunyan table storage stream
var azureStream = azBunyan.createTableStorageStream('warning', {   // warning and above
    connectionString: connectionString,
    tableName: tableName
});

var logger = bunyan.createLogger({
    name: "DemoLogger",                     // logger name
    serializers: {
        req: bunyan.stdSerializers.req,     // standard bunyan req serializer
        err: bunyan.stdSerializers.err      // standard bunyan error serializer
    },
    streams: [
        {
            level: 'info',                  // loging level
            stream: process.stdout          // log INFO and above to stdout
        },
        azureStream
    ]
});

app.use(function(req, res, next){
    logger.info({req : req, msg : "Request received"});
    req.log = logger;
    next();
})


app.get('/', function (req, res) {
    res.send('Hello World!')
});


var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    logger.info('Express server listening on port ' + app.get('port'));

});