var pg = require('pg');
var formatter = require('pg-format');
var config = require('../config');
var connString = config.pgDatabase;
var tb_name = 'action';

module.exports.addAction = function(params, callback){
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
module.exports.getAction = function(params, callback){
  var sql = require('sql');
  pg.connect(connString, function(err, client, done){
        if(err) {
            done();
            callback({
              status: 'error',
              data: err
            });
        }

        var arr_actions = [];
        
        sql.setDialect('postgres');
        var action_table = sql.define({
		  name: tb_name,
		  columns: ['id', 'service', 'type', 'time', 'persona_id', 'business_code']
		});
        var sql_query = action_table.select(action_table.star()).from(action_table).where([]);
        for (column in params){
        	eval("sql_query = sql_query.and(action_table."+column+".equals('"+params[column]+"'));");
        }

        console.log(sql_query.toQuery());
        var query = client.query(sql_query.toQuery().text, sql_query.toQuery().values);

        query.on('error', function(error){
          callback({
            status: 'error',
            data: error
          });
          done();
        });
        query.on('row', function(row){
          arr_actions.push(row);
        });
        query.on('end', function(result){
          callback({
            status: 'success',
            data: arr_actions
          });
          done();
        });
  });
}