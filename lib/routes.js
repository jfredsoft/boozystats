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
						user: obj_user,
						token: token
					});
				}
			}
		});
	});

	//Token authentication middleware
	app.use("/area*", tokenHandler);
	
	app.use("/service*", tokenHandler);
	
	app.put("/user*", tokenHandler);
	app.get("/user*", tokenHandler);
	app.delete("/user*", tokenHandler);
	
	app.post("/business*", tokenHandler);
	app.put("/business*", tokenHandler);
	app.delete("/business*", tokenHandler);
	
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
					msg: 'New area created.',
					id: result.data
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
	});
	app.put('/area/:area_id', function(req, res){
		var areaController = require('../controller/area');
		var area_id = req.params.area_id;

		areaController.updateArea(area_id, req.body, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'Updated area.'
				});
			}
		});
	});
	app.delete('/area/:area_id', function(req, res){
		var areaController = require('../controller/area');
		var area_id = req.params.area_id;

		areaController.removeArea(area_id, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'Updated area.'
				});
			}
		});
	});
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
					msg: 'New user created.',
					id: result.data
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
	app.delete('/user/:user_id', function(req, res){
		var userController = require('../controller/user');
		var user_id = req.params.user_id;

		userController.removeUser(user_id, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'Removed user.'
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
					msg: 'New business created.',
					id: result.data
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
	app.get('/business/:biz_code', function(req, res){
		var bizController = require('../controller/business');
		var biz_code = req.params.biz_code;
		bizController.getBiz({code:biz_code}, function(result){
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
	app.get('/business/:biz_code/overall', function(req, res){
		var actionController = require('../controller/action');
		var biz_code = req.params.biz_code;
		actionController.getOverallByBiz(biz_code, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(200).json({
					success: 'true',
					views: result.data.view,
					clicks: result.data.click
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
	app.delete('/business/:biz_id', function(req, res){
		var bizController = require('../controller/business');
		var biz_id = req.params.biz_id;

		bizController.removeBiz(biz_id, function(result){
			if (result.status == 'error'){
				res.status(403).json({
					success: 'false',
					msg: 'Error while connecting to server.'
				});
			}else{
				res.status(201).json({
					success: 'true',
					msg: 'Removed business.'
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
		var time = Date.now() / 1000;

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
	app.get('/action/:biz_code/:start/:end', function(req, res){
		var actionController = require('../controller/action');

		var biz_code = req.params.biz_code;
		var start_unix = req.params.start;
		var end_unix = req.params.end;

		actionController.getActionByPeriod(biz_code, start_unix, end_unix, function(result){
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
	//Creation of Dummy data
	app.get('/action/bulk/:biz_code/:action_type/:action_count/:date_string', function(req, res){
		var actionController = require('../controller/action');

		console.log("Now working on bulk addition");
		var biz_code = req.params.biz_code;
		var action_type = req.params.action_type;
		var action_count = req.params.action_count;
		var date_string = req.params.date_string;

		var time_unix = new Date(date_string).getTime() / 1000;
		var count_to_add = action_count;
		for (var i=0; i<action_count; i++){
			var params = {
				type: action_type,
				time: time_unix + "",
				business_code: biz_code
			};

			actionController.addAction(params, function(){
				count_to_add --;
				if (count_to_add == 0){
					res.status(201).json({
						success: 'true',
						msg: 'Successfully added ' + action_count + ' ' + action_type + ' to ' + biz_code
					});
				}
			});

			time_unix += 10;
		}

	});
}