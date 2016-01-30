var config = require('../config');
var jwt = require('jsonwebtoken');

var tokenHandler = function(req, res, next){
		// check header or url parameters or post parameters for token
  		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		try{
			var user_obj = jwt.verify(token, config.secret);
			if ((req.method != "GET") && (user_obj.role != "admin"))
			{
				res.status(401).json({
					success: 'false',
					msg: 'Not Authorized.'
				});
			}else{
				next();
			}
		}catch (err){
			res.status(401).json({
				success: 'false',
				msg: 'Not Authorized.'
			});
		}
}
module.exports = function(app){
	app.get('/', function(req, res){
		res.status(200).json({ message: 'API server is up and running!' });
	});

	app.post('/setup', function(req, res){
		var passcode = req.body.passcode;
		if ((passcode != config.passcode) || (passcode == null)){
			res.status(401).json({
				success: 'false',
				msg: 'Wrong passcode for setup action.'
			});
			return;
		}
		var userController = require('../controller/user');

		userController.getAdmin(function(results){
			if (results.status == 'error')
			{
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				if (results.data != null){
					res.status(409).json({
						success: 'false',
						msg: 'Admin account is already setup.'
					});
				}else{
					userController.setupAdmin(function(results){
						if (results.status == 'error')
						{
							res.status(403).json({
								success: 'false',
								msg: 'Error while connecting to server.'
							});
						}else{
							res.status(201).json({
								success: 'true',
								user: {
									id: results.data
								}
							});
						}
					});
				}
			}
		});		
	});
	app.post('/secret', function(req, res){
		var passcode = req.body.passcode;
		if ((passcode != config.passcode) || (passcode == null)){
			res.status(401).json({
				success: 'false',
				msg: 'Wrong passcode.'
			});
			return;
		}
		var userController = require('../controller/user');

		userController.getAdmin(function(results){
			if (results.status == 'error')
			{
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json(results.data);
			}
		});
	});
	app.post('/authenticate', function(req, res){
		var email = req.body.email;
		var password = req.body.password;
		if (email == null || password == null)
		{
			res.status(400).json({
				success: 'false',
				msg: 'Bad request.'
			});
			return;
		}

		var userController = require('../controller/user');
		
		userController.authenticateUser(email, password, function(results){
			if (results.status == 'error')
			{
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				var obj_user = results.data[0];
				if (obj_user == null){
					res.status(401).json({
						success: 'false',
						msg: 'Invalid Credentials.'
					});
				}else{
					var token = jwt.sign(obj_user, config.secret, {
			          expiresIn: 3600*24 // expires in 24 hours
			        });
					res.status(201).json({
						success: 'true',
						id: obj_user.id,
						token: token
					});
				}
			}
		});
	});

	//Token authentication middleware
	app.use("/area*", tokenHandler);
	app.use("/user*", tokenHandler);
	app.use("/business*", tokenHandler);
	app.use("/service*", tokenHandler);

	//Actual API endpoints
	//Area
	app.post('/area', function(req, res){
		var areaController = require('../controller/area');
		areaController.addArea(req.body, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'New area created.'
				});
			}
		});
	})
	app.get('/area', function(req, res){
		var areaController = require('../controller/area');
		areaController.getAllAreas(function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					areas: result.data
				});
			}
		});
	})
	//User
	app.post('/user', function(req, res){
		var userController = require('../controller/user');
		userController.addUser(req.body, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'New user created.'
				});
			}
		});
	});
	app.get('/user', function(req, res){
		var userController = require('../controller/user');
		userController.getAllUsers(function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					users: result.data
				});
			}
		});
	});
	app.put('/user/:user_id', function(req, res){
		var userController = require('../controller/user');
		var user_id = req.params.user_id;

		userController.updateUser(user_id, req.body, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'Updated user.'
				});
			}
		});
	});
	//Business
	app.post('/business', function(req, res){
		var bizController = require('../controller/business');
		bizController.addBiz(req.body, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'New business created.'
				});
			}
		});
	});
	app.get('/business', function(req, res){
		var bizController = require('../controller/business');
		bizController.getBiz(req.query, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					businesses: result.data
				});
			}
		});
	});
	app.put('/business/:biz_id', function(req, res){
		var bizController = require('../controller/business');
		var biz_id = req.params.biz_id;
		bizController.updateBiz(biz_id, req.body, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'Business updated.'
				});
			}
		});
	});

	//Service
	app.post('/business/:biz_code/service', function(req, res){
		var serviceController = require('../controller/service');
		var biz_code = req.params.biz_code;
		serviceController.addServiceToBusiness(biz_code, req.body.type, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'New Service added.'
				});
			}
		})
	});

	//Action
	app.post('/action/:biz_code/:service_type', function(req, res){
		var actionController = require('../controller/action');

		var biz_code = req.params.biz_code;
		var service_type = (req.params.service_type=='brunch')?1:2;
		var action_type = req.body.type;
		var time = new Date();

		actionController.addAction({business_code:biz_code, service: service_type, type:action_type, time: time}, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'New action added.'
				});
			}
		});
	});
	app.get('/action/:biz_code', function(req, res){
		var actionController = require('../controller/action');

		var biz_code = req.params.biz_code;

		actionController.getActionByBiz(biz_code, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					actions: result.data
				});
			}
		});
	});
}