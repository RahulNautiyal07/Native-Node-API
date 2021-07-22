/*
*Primary file for the API
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data  = require('./lib/data');
const handlers = require('./lib/handlers');

// Testing
// @TODO delete this
// _data.create('test','newFile',{'foo':'bar'},function(err){
//     console.log('this was the error',err);
//  });
_data.read('test','newFile1',function(err,data){
    console.log('this was the error : ',err,' and this was the data : ',data);
})

// Instantiate the Http server
const httpServer = http.createServer((req,res)=>{
    unifiedServer(req,res);   
});

// Start the server, 
httpServer.listen(config.httpPort,()=>{console.log("Hello I am running port "+config.httpPort)});

// Instantiate the Https server
let httpsServerOptions = {
   'key' : fs.readFileSync('./https/key.pem'),
   'cert': fs.readFileSync('./https/cert.pem') 
};

const httpsServer = https.createServer(httpsServerOptions,(req,res)=>{
    unifiedServer(req,res);   
});

// Start the server, 
httpsServer.listen(config.httpsPort,()=>{console.log("Hello I am running port "+config.httpsPort)});


// All server logic for both the heep and https createServer
let unifiedServer = (req,res)=>{

    // Get the URL and parse it
    let parsedUrl = url.parse(req.url,true);

    // Get the path 
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');
    
    //Get the query string as an object
    let queryStringObject = parsedUrl.query; 

    // Get the HTTP Method
    let method = req.method.toLowerCase();

    // Get the header as an object 
    let headers = req.headers;

    // Get the payload if any
    let decorder = new StringDecoder('utf-8');
    let buffer = '';
 
    req.on('data',(data)=>{
      buffer += decorder.write(data);
    });

    req.on('end',()=>{
      buffer += decorder.end();

    //  Choose the handler this request go to, If one is not found use the notFound handler
    let chosenHandler = typeof(router[trimmedPath]) !=='undefined' ? router[trimmedPath] : handlers.notFound;
    console.log('chosenHandler',trimmedPath)
    // Construct the datya object to send the handler
    let data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'methods' : method,
        'headers' : headers,
        'payload' : buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data,(statusCode,payload)=>{ 
    //   Use the status code called by handler, or default to 200
    statusCode = typeof(statusCode) == 'number' ? statusCode :200;

    // Use the payload called back by the handler, or default to an empty object
    payload = typeof(payload) == 'object' ? payload : {};

    // Convert the payload to a string
    let payloadString = JSON.stringify(payload);
    
    // Set Header content-type
    res.setHeader('Content-Type','application/json')

    // Return the response
    res.writeHead(statusCode);
    res.end(payloadString);

    // Log the request path
    // console.log('Request received on thi path :'+trimmedPath+'with method:'+method+'and with these query string parameters',queryStringObject);
    console.log('Returning this response' ,statusCode,payloadString);

    });

    });
};


// Define a request router
let router = {
    'sample':handlers.sample,
    'ping':handlers.ping,
    'users':handlers.users
}