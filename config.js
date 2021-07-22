/*
*Create and export configuration variables 
*/

// Container for all the environment
let environments = {}; 

// Statging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort':3001,
  'envName' : 'staging',
  'hashingSecret' : 'thisIsASecret'
};

// Production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'hashingSecret' : 'thisIsAlsoASecret'

};

// Determine which environment was passed as a comand-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '' ;

// Check that the current environment is one the environment above, if not, default to set to staging 
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Exports the module
module.exports = environmentToExport;