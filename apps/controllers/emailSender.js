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
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var hbs = require('nodemailer-express-handlebars');

/**
 *  funcion que se encargara de enviar un correo, con la
 *  plantilla correspondiente, desde los parametros se pedira
 *  el nombre de la plantilla que se desea enviar.
 *
 *  @param object este objeto traera todos los datos del mailOptions
 *  @param file nombre del archivo hbs que se desea enviar por correo
 *
 */
function mailer(object, file) {
	// se configuran las plantillas para el envio de cadad una
	var options = {
		viewEngine: {
			extname: '.hbs',
			layoutsDir: 'views/layouts/',
			defaultLayout: 'principal.hbs'
		},
		viewPath: 'views/' + file,
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
		from: 'New Channel corps © <hola@newchannel.mx>',
		to: object.to,
		subject: object.subject,
		template: file,
		context: {
			name: 'nombre'
		}
	};
	var transporter = nodemailer.createTransport(smtpTransport(datos));
	transporter.use('compile', hbs(options));
	// se hace la funcion para el envio de el correo
	transporter.sendMail(mailOptions, function(err, informacion) {
		if (err)
			return console.log("1 :- " + err);
		else
			console.log("Sending mail: " + informacion.response);
	});
}
exports.mailer = mailer;