var pg = require('pg');
var formatter = require('pg-format');
var config = require('../config');
var connString = config.pgDatabase;
var tb_name = 'business';

module.exports.addBusiness = function(params, callback){
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
module.exports.removeBusiness = function(id, callback){
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
module.exports.updateBusiness = function(id, params, callback){
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
module.exports.getBusiness = function(params, callback){
  var sql = require('sql');
  pg.connect(connString, function(err, client, done){
        if(err) {
            done();
            callback({
              status: 'error',
              data: err
            });
        }

        var arr_users = [];
        
        sql.setDialect('postgres');
        var business_table = sql.define({
		  name: 'business',
		  columns: ['id', 'area_id', 'name', 'code']
		});
        var sql_query = business_table.select(business_table.star()).from(business_table).where([]);
        for (column in params){
        	eval("sql_query = sql_query.and(business."+column+".equals('"+params[column]+"'));");
        }

        console.log("Get query : " + sql_query.toQuery().text);
        var query = client.query(sql_query.toQuery().text);

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
