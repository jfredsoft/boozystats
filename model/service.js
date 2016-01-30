var pg = require('pg');
var formatter = require('pg-format');
var config = require('../config');
var connString = config.pgDatabase;
var tb_name = 'service';

module.exports.addService = function(params, callback){
	pg.connect(connString, function(err, client, done){
		// Handle connection errors
        if(err) {
          done();
          callback({
          	status: 'error',
          	data: err
          });
        }

        var arr_columns = [], arr_values = [];
        for (var column in params){
          arr_columns.push(column);
          arr_values.push(params[column]);
        }

        var query = client.query(formatter('INSERT INTO %I (%I) VALUES(%L)', tb_name, arr_columns, arr_values));
        query.on('error', function(error){
        	callback({
        		status: 'error',
        		data: error
        	});
          done();
        });
        query.on('end', function(result){
        	callback({
        		status: 'success',
        		data: result.oid
        	});
          done();
        });
	});
}
module.exports.removeService = function(id, callback){
	pg.connect(connString, function(err, client, done){
        if(err) {
            done();
            callback({
              status: 'error',
              data: err
            });
        }

        var query = client.query(formatter('DELETE FROM %I WHERE id = %L', tb_name, id));
        query.on('error', function(error){
          callback({
            status: 'error',
            data: error
          });
          done();
        });
        query.on('end', function(result){
          callback({
            status: 'success',
            data: result
          });
          done();
        });
  });
}
module.exports.updateService = function(id, params, callback){
  pg.connect(connString, function(err, client, done){
        if(err) {
            done();
            callback({
              status: 'error',
              data: err
            });
        }

        var arr_columns = [], arr_values = [];
        for (var column in params){
          arr_columns.push(column);
          arr_values.push(params[column]);
        }

        var query = client.query(formatter('UPDATE %I SET (%I)=(%L) WHERE id = %L', tb_name, arr_columns, arr_values, id));
        query.on('error', function(error){
          callback({
            status: 'error',
            data: error
          });
          done();
        });
        query.on('end', function(result){
          callback({
            status: 'success',
            data: result
          });
          done();
        });
  });
}
module.exports.getService = function(business_code, callback){
  pg.connect(connString, function(err, client, done){
        if(err) {
            done();
            callback({
              status: 'error',
              data: err
            });
        }

        var arr_users = [];
        var query;

        if (business_code != null)
          query = client.query(formatter('SELECT * FROM %I WHERE business_code = %L', tb_name, business_code));
        else
          query = client.query(formatter('SELECT * FROM %I', tb_name));
        query.on('error', function(error){
          callback({
            status: 'error',
            data: error
          });
          done();
        });
        query.on('row', function(row){
          arr_users.push(row);
        });
        query.on('end', function(result){
          callback({
            status: 'success',
            data: arr_users
          });
          done();
        });
  });
}