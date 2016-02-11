//PG
var pg = require('pg');
var formatter = require('pg-format');
var config = require('../config');
var connString = config.pgDatabase;
var tb_name = 'users';

module.exports.addUser = function(params, callback){
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

        var query = client.query(formatter('INSERT INTO %I (%I) VALUES(%L) RETURNING id', tb_name, arr_columns, arr_values), function(error, result){
          if (error){
            callback({
              status: 'error',
              data: error
            });
          }else{
            console.log(result);
            callback({
              status: 'success',
              data: result.rows[0].id
            });
          }
        });
	});
}
module.exports.removeUser = function(id, callback){
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
module.exports.updateUser = function(id, params, callback){
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
          console.log(error);
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
module.exports.getUser = function(id, callback){
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

        if (id != null)
          query = client.query(formatter('SELECT * FROM %I WHERE id = %L AND role = %L', tb_name, id, 'owner'));
        else
          query = client.query(formatter('SELECT * FROM %I WHERE role = %L', tb_name, 'owner'));
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
module.exports.getUserByRole = function(role, callback){
  pg.connect(connString, function(err, client, done){
        if(err) {
            done();
            callback({
              status: 'error',
              data: err
            });
        }

        var arr_users = [];
        var query = client.query(formatter('SELECT username, email, password FROM %I WHERE role = %L', tb_name, role));
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
            data: arr_users[0]
          });
          done();
        });
  });
}
module.exports.getUserByCredentials = function(email, password, callback){
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

        query = client.query(formatter('SELECT * FROM %I WHERE email=%L AND password=%L', tb_name, email, password));
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