/**
 *  Este script modulara el envio de diferentes tipos de correos
 *  estara programado para mandar diferentes plantillas en la
 *  extension hbs, y cada una tendrá su funcionalidad diferente.
 *  Objectivos: mandar dinamicamente correos a diferentes usuarios,
 *  y se pueda seleccionar la plantilla que se necesite para tal
 *  correo.
 *
 *  @author Oscar
 *  @version 0.0.0.0
 *  @date Thursday, August 20, 2015
 *
 */

// Librerias
var nodemailer = require( 'nodemailer' );
var smtpTransport = require( 'nodemailer-smtp-transport' );
var hbs = require( 'nodemailer-express-handlebars' );
//cryptomaniacs
var cryptomaniacs = require( './encryption' );
/**
 *  funcion que se encargara de enviar un correo, con la
 *  plantilla correspondiente, desde los parametros se pedira
 *  el nombre de la plantilla que se desea enviar.
 *
 *  @param object este objeto traera todos los datos del mailOptions
 *  @param file nombre del archivo hbs que se desea enviar por correo
 *
 */
function mailer( object, file ) {
  // se configuran las plantillas para el envio de cadad una
  var options = {
    viewEngine: {
      extname: '.hbs',
      layoutsDir: 'apps/views/layouts/',
      defaultLayout: 'mail.hbs'
    },
    viewPath: 'apps/views/mail/',
    extName: '.hbs'
  };
  // se configuran los datos del host
  var datos = {
    host: 'server119.neubox.net',
    secure: true,
    port: 465,
    connectionTimeout: 3000,
    auth: {
      user: 'hola@newchannel.mx',
      pass: 'channel5766'
    },
    tls: {
      rejectUnauthorized: false
    }
  };
  // se configura un json con los valores que debe de traer el object
  // este json se le pasara como parametro a la funcion para enviar el correo
  var mailOptions = {
    from: 'Tu cuenta Intermed ®<hola@newchannel.mx>',
    to: object.to,
    subject: object.subject,
    template: file,
    context: {
      name: object.nombre,
      correo: object.to,
      enlace: 'localhost:3000/activar/' + object.token,
    }
  };
  if ( object.enlace ) mailOptions.context.enlace = object.enlace;
  if ( object.nombreSesion ) mailOptions.context.nombresesion = object.nombreSesion;
  if ( object.mensaje ) mailOptions.context.mensaje = object.mensaje;

  var transporter = nodemailer.createTransport( smtpTransport( datos ) );
  transporter.use( 'compile', hbs( options ) );
  // se hace la funcion para el envio de el correo
  transporter.sendMail( mailOptions, function ( err, informacion ) {
    if ( err ) {
      console.log( "1 :- " + err );
      return false;
    }
    else {
      console.log( "Sending mail: " + informacion.response );
      return true;
    }
  } );
}

function recomendacion( object ,res, file ) {
  // se configuran las plantillas para el envio de cadad una
  var options = {
    viewEngine: {
      extname: '.hbs',
      layoutsDir: 'apps/views/layouts/',
      defaultLayout: 'mail.hbs'
    },
    viewPath: 'apps/views/mail/',
    extName: '.hbs'
  };
  // se configuran los datos del host
  var datos = {
    host: 'server119.neubox.net',
    secure: true,
    port: 465,
    connectionTimeout: 3000,
    auth: {
      user: 'hola@newchannel.mx',
      pass: 'channel5766'
    },
    tls: {
      rejectUnauthorized: false
    }
  };
  // se configura un json con los valores que debe de traer el object
  // este json se le pasara como parametro a la funcion para enviar el correo
  var mailOptions = {
    from: 'Recomendaciones Intermed ®<hola@newchannel.mx>',
    to: object.to,
    subject: object.subject,
    template: file,
    context: {
      name: object.nombre,
      correo: object.to,
      enlace: object.enlace,
      usuario: object.usuario,
      mensaje: object.mensaje
    }
  };
  if ( object.enlace ) mailOptions.context.enlace = object.enlace;
  if ( object.nombreSesion ) mailOptions.context.nombresesion = object.nombreSesion;
  if ( object.mensaje ) mailOptions.context.mensaje = object.mensaje;

  var transporter = nodemailer.createTransport( smtpTransport( datos ) );
  transporter.use( 'compile', hbs( options ) );
  // se hace la funcion para el envio de el correo
  transporter.sendMail( mailOptions, function ( err, informacion ) {
    if ( err ) {
      console.log( "1 :- " + err );
      res.send(false);
    }
    else {
      console.log( "Sending mail: " + informacion.response );
      res.send(true);
    }
  } );
}
exports.recomendacion = recomendacion;
exports.mailer = mailer;
