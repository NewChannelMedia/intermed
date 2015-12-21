 var fs = require('fs');
 var models = require('../models');
 module.exports ={
   creaArchivo: function(req,res){
     var html = "";
     var html2 = "";
     var d = new Date();
     var fechaCompleta = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
     //si existe
     fs.exists('sitemapindex.xml', function(exists){
       if( !exists ){
         fs.exists('sitemap'+fechaCompleta+'.xml', function( existe ){
           if( !existe ){
             //crea los archivos
             if( fs.openSync('sitemap'+fechaCompleta+'.xml','w') ){//crea el sitemap
               if( fs.openSync('sitemapindex.xml','w') ){// crea el sitemap index
                 //maqueta el sitemap index
                 html += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
                  html += '\t<sitemap>\n';
                    html += '\t\t<loc>'+'http://www.intermed.online/'+'sitemap'+fechaCompleta+'.xml'+'</loc>\n';
                    html += '\t\t<lastmod>'+fechaCompleta+'</lastmod>\n';
                  html += '\t</sitemap>\n';
                 html += '</sitemapindex>\n';
                 //escribe en el archivo sitemapindex
                 fs.writeFile('sitemapindex.xml',html,'utf8',function(err){
                   if(err){
                     console.log("Error al escribir el archivo: "+err);
                   }else{
                     console.log("Creado y escrito exitosamente");
                   }
                 });
                 //consulta para traer la informacion que va a ir dentro de sitemap
                 models.Usuario.findAll({
                   where:{tipoUsuario:'M'},
                   attributes:['usuarioUrl','urlPersonal']
                 }).then(function(usuario){
                   usuario = JSON.parse(JSON.stringify(usuario));
                   //html2 se usa para maquetar la informacion de sitemap
                   html2 += '<?xml version="1.0" encoding="UTF-8"?>\n';
                   html2 += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
                   for( var i in usuario ){
                     //condicion para checar que sea menor de 50 mil url
                     if( i < 50000 ){
                       // condicion para checar si el usuario trae url personalizada
                       if( usuario[i].urlPersonal && usuario[i].urlPersonal.length > 0 ){
                         html2 += '\t<url>\n';
                           html2 += '\t\t<loc>http://www.intermed.online/'+usuario[i].urlPersonal+'</loc>\n';
                           html2 += '\t\t<lastmod>'+fechaCompleta+'</lastmod>\n';
                           html2 += '\t\t<changefreq>weekly</changefreq>\n';
                           html2 += '\t\t<priority>1.0</priority>\n';
                         html2 += '\t</url>\n';
                       }else{
                         html2 += '\t<url>\n';
                           html2 += '\t\t<loc>http://www.intermed.online/'+usuario[i].usuarioUrl+'</loc>\n';
                           html2 += '\t\t<lastmod>'+fechaCompleta+'</lastmod>\n';
                           html2 += '\t\t<changefreq>weekly</changefreq>\n';
                           html2 += '\t\t<priority>1.0</priority>\n';
                         html2 += '\t</url>\n';
                       }
                     }else{
                       //se crea nuevo archivo y se escribe en sitemapindex la nueva ruta del nuevo sitemap

                     }
                   }
                   html2 += '</urlset>';
                   //var nombre se saca el nombre del sitemap en el cual se va a escribir
                   var nombre = 'sitemap'+fechaCompleta+'.xml';
                   //se abre el flujo para escribir lo que se saco de la consulta
                   fs.writeFile(nombre,html2,'utf8',function(err){
                     if(err){
                       console.log("Error a escribir en este archivo");
                     }else{
                       console.log("Escrito correctamente");
                     }
                   });
                 });
               }else{
                 console.log("no se pudo crear el sitemapindex");
               }
             }else{
               console.log("No se pudo crear el sitemap");
             }
           }else{
             console.log("Archivo sitemap"+fechaCompleta+".xml ya existe");
           }
         });
       }else{
         console.log("Archivo sitemapindex.xml ya existe");
       }
     });
   },
   actualizaArchivo: function(file){
     fs.appendFile(file,'data',function( err ){
       if( err ){
         console.log('Err: No agregado');
       }else{
         console.log('SI');
       }
     });
   },
   actualizaIndex: function(){

   }
 }
