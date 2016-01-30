var pg = require('pg');
var config = require('../config');

pg.connect(config.pgDatabase, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    done();
    console.log("Database is up and running!");
});