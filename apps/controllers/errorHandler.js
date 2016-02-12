var models = require( '../models' );

exports.report = function ( err, req, res ) {
  var err = err.toString();
  var type = err.type;
  var stack = err.stack;
  var arguments = err.arguments;
  var session = null;
  var usuario_id = null;
  if (req.session.passport && req.session.passport.user){
    var session = JSON.stringify(req.session.passport.user);
    var usuario_id =req.session.passport.user.id
  }

  var userAgent = req.headers['user-agent'];
  var headers = JSON.stringify(req.headers);
  if (headers.length>450){
    headers =  headers.substring(0,450);
  }
  models.DBError_registro.create({
    type: type,
    err: err,
    stack: stack,
    arguments: arguments,
    session: session,
    usuario_id: usuario_id,
    file: req.file,
    function: req.funct,
    protocol: req.protocol,
    host: req.hostname,
    port: req.port,
    method: req.method,
    path: req.path,
    headers: headers,
    userAgent: userAgent
  }).then(function(error){
    console.log('xxxx [' + new Date().toISOString() + '] Error insertado en BD.')
    if (!res.headersSent){
      if (req.method == "GET"){
        req.routeLife( 'plataforma2', 'interno', req.hps );
        res.render('error',{success:false,error: err});
      } else {
        res.status(200).json({success:false,error: err});
      }
    }
  });


}
