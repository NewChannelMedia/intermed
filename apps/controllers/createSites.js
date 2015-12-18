 var fs = require('fs');
 var models = require('../models');
 module.exports ={
   leer:function(){
     fs.readFile('indixeSiteMaps.xml', function( err, data ){
         if( err ){
           console.log("Err: "+err);
         }else{
           console.log("algo "+data);
         }
     });
   },
   creaArchivo: function(req,res){
     var html = "";
     var d = new Date();
     var fechaCompleta = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDay();
     //si existe
     fs.exists('sitemapindex.xml', function(exists){
       if( !exists ){
         fs.exists('sitemap'+fechaCompleta+'.xml', function( existe ){
           if( !existe ){
             //crea los archivos
             if( fs.openSync('sitemap'+fechaCompleta+'.xml','w') ){
               if( fs.openSync('sitemapindex.xml','w') ){
                 html += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
                  html += '\t<sitemap>\n';
                    html += '\t\t<loc>'+'http://www.intermed.online/'+'sitemap'+fechaCompleta+'.xml'+'</lo>\n';
                    html += '\t\t<lastmod>'+fechaCompleta+'</lastmod>\n';
                  html += '\t</sitemap>\n';
                 html += '</sitemapindex>\n';
                 fs.writeFile('sitemapindex.xml',html,'utf8',function(err){
                   if(err){
                     console.log("Error al escribir el archivo: "+err);
                   }else{
                     console.log("Creado y escrito exitosamente");
                   }
                 });
               }else{
                 console.log("no se pudo crear el sitemapindex");
               }
             }else{
               console.log("No se pudo crear el sitemap");
             }
           }
         });
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
