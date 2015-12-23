 var fs = require('fs');
 var models = require('../models');
 module.exports ={
   creaArchivo: function( req, res ){
     existFile('sitemapindex','sitemap');
   }
 }
 /**
 *  Todas las tareas separadas en funciones
 *  <- crear archivo ->
 *  <- agregar al archivo ->
 *  <- checar si el archivo existe ->
 *  <- tamaño del archivo <- de 10000 ->
 *  <- menos de 50 000 registros ->
 **/

  /**
  * La siguiente funcion determina si alguno de los archivos ya existe, en caso de que asi sea
  * llamara a la funcion correspondiente: Ejem. Si el archivo ya existe, checara que contenga
  * valores registrados en caso de que no sea así se registraran, para que no se cree una copia
  * si alguno de los archivos no existe, lo va a crear y registrarle valores, e ir haceindo el correspondiente
  * registro. Si ninguno de los dos archivos no existe los va a crear y registrar sus correspondientes valores
  * @param name nombre del primer archivo del indice
  * @param name2 nombre del segundo archivo del sitemap
  * @return boolean, en caso3 de ser verdadero que si existe retornara un true
  */
  function existFile( name, name2 ){
    fs.stat('./'+name, function( err, stats ){
      if( err ){
        fs.stat('./'+name2, function( erro, statss ){
          if( erro ){
            creaIndex(name);
            creaSite(name2, 1);
            registerSites(name,name2,1);
            // se llena el sitemap con los valores
            registerAllSites(name2,name,1);
          }else{
            registerAllSites(name2,name,1);
          }
        });
      }
    });
  }
  /**
  * Crear contenido en el sitemapindex
  * la siguiente funcion servira para agregar
  * informacion al archivo sitemapindex, para
  * poder ir agregando cada que se dispone de un nuevo
  * archivo sitemap, irlo registrando en el sitemapindex
  * @param nameIndex, nombre del archivo al cual se le debe de ingresar la informacion(sitemapindex)
  * @param nameSi, nombre del site que se va a agregar
  * @param indice, numero con el cual se hara el registro del sitemap en el index
  **/
  function registerSites( name, nameIndex, indice ){
    var html = "";
    var d = new Date();
    var fechaCompleta = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    var complete = nameIndex+indice+".xml";
    var vComplete = name+".xml";
    html += '<?xml version="1.0" encoding="UTF-8"?>\n';
    html += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
     html += '\t<sitemap>\n';
       html += '\t\t<loc>'+'http://www.intermed.online/'+complete+'</loc>\n';
       html += '\t\t<lastmod>'+fechaCompleta+'</lastmod>\n';
     html += '\t</sitemap>\n';
     fs.writeFile( vComplete, html, 'utf8', function( err ){
       if( err ){
        console.log("Si existe");
      }
     });
  }
  /**
  * funcion para crear el sitemapindex
  * @param name nombre que llevara el archivo
  * @return message if success
  **/
  function creaIndex(name){
    if( !fs.openSync(name+".xml",'w') ){
      console.log("Fallo en la creacion del index");
    }
  }
  /**
  * funcion para la creacion del sitemap
  * @param name nombre que llevara el archivo
  * @return message if success
  */
  function creaSite(name, indice){
    if( !fs.openSync(name+indice+".xml", 'w') ){
      console.log("Fallo en la creacion del sitemap");
    }
  }
  /**
  * Con la siguiente funcion se podrá registrar la informacion en los archivos
  * sitemap.xml ademas de que se les podra poner un numero aleatorio para
  * poderlos ir identificando.
  * @param name, nombre del archivo
  **/
  function registerAllSites(name,name2, indice){
    var html = "";
    var id; // variable para guardar el ultimo id que se uso
    var d = new Date();
    var bandera = false; // bandera para cuando sobre pase los 50 mil saber que eso paso, se pondrá en true
    var fechaCompleta = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    var complete = name +indice+ ".xml";
    html += '<?xml version="1.0" encoding="UTF-8"?>\n';
    html += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    // en esta parte el archivo ya debe de estar creado entonces se puede escribir sobre el
    fs.writeFile( complete , html, 'utf8', function( err ){
      if( err ){
        console.log("Error: al intentar escribir en este archivo: "+complete);
      }
    });
      // se hace una consulta para traer todos los url de los usuarios medicos
      models.Usuario.findAll({
        where:{tipoUsuario:'M'},
        attributes:['id','usuarioUrl','urlPersonal']
      }).then(function(usuario){
        usuario = JSON.parse(JSON.stringify(usuario));
        for( var i in usuario ){
          // en caso que el usuario llegue a mas de 50 mil registros, se dejara de agregar la informacion
          //al archivo y se abrira otro donde se empeza a escribir en el nuevo archivo
          if( i < 50000 ){
            // se revisa si el campo urlPersonal contenga datos, en caso de hacer asi se escribe,
            // la etiqueta loc con la url personalizada en caso contrario se agregara solamente
            // la url por default
            if( usuario[i].urlPersonal && usuario[i].urlPersonal.length > 0 ){
                updateSitemap(complete, usuario[i].urlPersonal);
            }else{
                updateSitemap( complete, usuario[i].usuarioUrl );
            }
          }else{
            //en este else, si entro excedio los 50 mil y el peso que debe de tener el archivo
            // crea el nuevo sitemap
            creaSite(name,(indice+1));
            // actualiza el sitemapindex
            updateIndex(name2,name,(indice+1));
            // llena el nuevo sitemap
            updateSitemap(name, usuario[i].usuarioUrl);
            // se rompe el for con un break
            break;
          }
        }
      });
  }
  /**
  * Siguiente funcion servira para agregar un bloque de <sitemap> al xml
  * sitemapindex, donde se encuentran registrados la ubicacion y diversos
  * datos sobre los archivos sitemaps.
  *
  * @param name, nombre del archivo al cual se le debe de ir agregando la informacion
  * @param addName, nombre del sitemap a agregar
  **/
  function updateIndex( name, addName, fecha ){
    //se va a ir maquetando la informacion en una variable para pasarla a la funcion
    // que va a ir agregando todo.
    var html = "";
    var vComplete = addName+'.xml';
    html += '\t<sitemap>\n';
      html += '\t\t<loc>http://www.intermed.online/'+addName+'</loc>\n';
      html += '\t\t<lastmod>'+fecha+'</lastmod>\n';
    html += '\t</sitemap>';
    fs.appendFile(name,html, function( err ){
      if( err )throw err;
    });
  }
  /**
  * funcion para la actualizacion del archivo SITEMAP.xml en el cual se podra
  * agregar un bloque de <url>
  * @param String name, nombre del archivo al cual se le debe de agregar
  * @param String valor, esta variable sirve para ir agregando el url
  */
  function updateSitemap( name, valor ){
    // variable para poder maquedar el bloque
    var html = "";
    var d = new Date();
    var url = valor+".xml";
    var fechaCompleta = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    html += '\t<url>\n';
      html += '\t\t<loc>http://www.intermed.online/'+valor+'</loc>\n';
      html += '\t\t<lastmod>'+fechaCompleta+'</lastmod>\n';
      html += '\t\t<changefreq>weekly</changefreq>\n';
      html += '\t\t<priority>1.0</priority>\n';
    html += '\t</url>\n';
    fs.appendFile(name, html, function( err ){
      if( err ){
        console.log("Archivo: "+name+' no se pude escribir');
      }
    });
  }
