// Index.js

// Packages
var express = require('express');
var app = express();
var morgan      = require('morgan');
var jwt    = require('jsonwebtoken');
var bodyParser = require('body-parser');
var config = require('./config');

// For swagger
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
var swaggerPath = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

// use morgan to log requests to the console
app.use(morgan('dev'));

// Serve static files in dist folder

app.use(express.static('frontend'));
app.use(express.static('dist'));

// All the routes will be prefixed with /api
app.use('/api', router);

// Swagger operations
app.use('/swagger', swaggerPath);
swagger.setAppHandler(swaggerPath);
swagger.setApiInfo({
        title: "Boozy analytics API",
        description: "API to CRUD user behavior data and carry out Boozy analytics board functions.",
        termsOfServiceUrl: "",
        contact: "jonasswift@gmx.com",
        license: "",
        licenseUrl: ""
    });
swaggerPath.get('/', function (req, res) {
        res.sendFile(__dirname + '/dist/index.html');
});
swaggerPath.get('/api-docs.json', function (req, res) {
        res.sendFile(__dirname + '/dist/api-docs.json');
});
swagger.configureSwaggerPaths('', 'api-docs', '');
swagger.configure(config.rootURL, '1.0.0');

// Start the server
app.listen(port);
console.log('API server has started on port ' + port);

// Route Listeners
var routes = require('./lib/routes');
routes(router);