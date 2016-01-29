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
function send( object, file ,res) {
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
    host: 'mx1.hostinger.mx',
    secure: true,
    port: 465,
    connectionTimeout: 3000,
    auth: {
      user: 'hola@intermed.online',
      pass: 'holatomas5766'
    },
    tls: {
      rejectUnauthorized: false
    }
  };
  // se configura un json con los valores que debe de traer el object
  // este json se le pasara como parametro a la funcion para enviar el correo
  var mailOptions = {
    from: 'Intermed <hola@intermed.online>',
    to: object.to,
    subject: object.subject,
    template: file,
    context: object
  };
  var transporter = nodemailer.createTransport( smtpTransport( datos ) );
  transporter.use( 'compile', hbs( options ) );
  // se hace la funcion para el envio de el correo
  transporter.sendMail( mailOptions, function ( err, informacion ) {
    if ( err ) {
      console.log( "Error sending mail {"+ object.to +":"+ file +"}: " + JSON.stringify(err));
      if (res){
        res.send({success: false, error: err});
      }
    }
    else {
      console.log( "Sending mail {"+ object.to +":"+ file +"}: " + informacion.response );
      if (res){
        res.send({success: true, result: informacion.response});
      }

    }
  } );
}
exports.send = send;
