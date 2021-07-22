/*
*Request handlers
*
*/

// Dependencies
const _data = require('./data');
const helapers = require('./helpers');



// Define the handlers
let handlers = {};

// Sample handler
handlers.sample = (data,callback)=>{
  // Callback a http status code , and a payload object
  callback(406,{'name':'My name is sample handler'}) 
};


// users handler
handlers.users = (data,callback)=>{
  let acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
      handlers._users[data.method](data,callback);
  } else {
      callback(405)
  }
}

// Container for the users submethods
handlers._users = {};

// Users - post
// Required-data: firstName, lastname, phone, password, tosAgreement
// Optional data : none
handlers._users.post = function(data,callback){
    // Check that all requirede fie;ds are filled out 
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false ; 
    let lastName  = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false ; 
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false ; 
    let password  = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false ; 
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement.trim().length == true ? true : false ; 
    
    if(firstName && lastName && phone && password && tosAgreement){
      // Make sure that the user doesnot already exist
      _data.read('users',phone,function(err,data){
          if(err){
            // Hash the password
            let hashedPassword = helpers.hash(password);

            // Create the user object
            let userObject = {
                'firstName' : firstName,
                'lastName'  : lastName,
                'phone'     : phone,
                'hashedPassword' : hashedPassword,
                'tosAgreement'   : true 
            }
          } else {
          // User already exists
          callback(400,{'Error' : 'A user with that phone number already exists '})    
          }

      })

    } else {
        callback(400,{'Error' : ' Missing required fields '});
    }
};

// Users - get
handlers._users.get = function(data,callback){

};

// Users - put 
handlers._users.put = function(data,callback){

};

// Usres - delete 
handlers._users.delete = function(data,callback){

};

// Ping handler
handlers.ping = (data,callback)=>{
    // Csllbsck a http status code , and a payload object
    callback(200) 
  };

// Not found handler
handlers.notFound = (data,callback)=>{
  callback(404,{'name':'My name is Not Found handler'}); 
};

// Export the module
module.exports = handlers