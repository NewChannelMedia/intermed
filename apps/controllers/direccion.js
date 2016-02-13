var models = require('../models');

exports.index = function (objects, req, res) {
  try{
    res.render('ubicacion', {title:'Carlos'});
  }catch ( err ) {
    req.errorHandler.report(err, req, res);
  }
};
