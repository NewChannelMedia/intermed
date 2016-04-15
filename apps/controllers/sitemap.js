var models = require('../models');
var fs = require('fs');
var xmldoc = require('xmldoc');

/*
//SITEMAPINDEX
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>http://www.intermed.online/sitemap1.xml</loc>
		<lastmod>2016-4-15</lastmod>
	</sitemap>
*/

/*
//SITEMAP
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>http://www.intermed.online/Dr.Maldonado</loc>
		<lastmod>2016-4-15</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
*/

exports.agregarUsuario = function ( object, req, res ) {
  fs.stat('./sitemapindex.xml', function (err, stats){
    if (err){
      //crear por primera vez el sitemap
      existFile('sitemapindex','sitemap');
    } else {
      //Buscar el ultimo sitemap en sitemapindex, y agregar el nuevo nodo de usuario
      object.usuario_id = 1;
      addUserValidate(object,req, res);
    }
  });
  res.status(200).json({creado:true})
};

exports.actualizarUsuario = function ( object, req, res ) {
  fs.stat('./sitemapindex.xml', function (err, stats){
    if (err){
      //crear por primera vez el sitemap
      existFile('sitemapindex','sitemap');
    } else {
      //Buscar en todos los sitemaps el usuarioUrl y actualizar ese nodo a urlFotoPerfil

    }
  });
};

function addUserValidate(object,req, res){

  fs.readFile('./sitemapindex.xml', 'utf8', function (err,xml) {
    if (err) {
      return console.log(err);
    } else {
      var sitemapindex = new xmldoc.XmlDocument(xml);
      var lastsitemap = sitemapindex.lastChild.childNamed('loc').val.toString();
      var base_url = global.base_url.toString();
      console.log('base_url: ' + base_url);
      lastsitemap = lastsitemap.replace(base_url, "");
      console.log('replace. ' + lastsitemap)
      //revisar si el nuevo usuario aun se puede agregar en ese archivo, si no, crear uno nuevo
      object.sitemap = (sitemapindex.lastChild.childNamed('loc').val.toString().replace(global.base_url,''));
      addUser(object, req, res);
    }
  });
}

function addUser(object, req, res){
  console.log('OBJECT. ' + JSON.stringify(object));
  fs.stat('./'+object.sitemap, function( err, stats ){
    if (err){
      console.log('Error al leer el sitemap: ' + object.sitemap +':'+err)
    } else {
      console.log('STATS: ' + stats);
    }
  });



/*



  fs.writeFile( complete , html, 'utf8', function( err ){
    if( err ){
      console.log("Error: al intentar escribir en este archivo: "+complete);
    }
  });
    // se hace una consulta para traer todos los url de los usuarios medicos
    models.Usuario.findAll({
      where:{tipoUsuario:'M'},
      attributes:['usuarioUrl','urlPersonal']
    }).then(function(usuario){
      usuario = JSON.parse(JSON.stringify(usuario));
      var i = 0;
      usuario.forEach(function(usu){
          // en caso que el usuario llegue a mas de 50 mil registros, se dejara de agregar la informacion
          //al archivo y se abrira otro donde se empeza a escribir en el nuevo archivo
          // y tambien se checa que el archivo sea menor de 10 mb(10,000 kb)
          var weight;
          fs.stat(name+(indice)+".xml", function( err2, stats ){
            weight = stats.size;
            if( i >= 50000 || weight >= 10000 ){
              i = 0;
              //en este else, si entro excedio los 50 mil y el peso que debe de tener el archivo
              // crea el nuevo sitemap
              creaSite(name,(++indice));
              // actualiza el sitemapindex
              updateIndex(name2,name,fechaCompleta, indice);
            } else {
              console.log('Test');
            }
            i++;
            // se revisa si el campo urlPersonal contenga datos, en caso de hacer asi se escribe,
            // la etiqueta loc con la url personalizada en caso contrario se agregara solamente
            // la url por default
            var usuarioNombre = '';
            if( usu.urlPersonal && usu.urlPersonal.length > 0 ){
                usuarioNombre = usu.urlPersonal;
            } else {
              usuarioNombre = usu.usuarioUrl;
            }
            updateSitemap( name+(indice)+".xml", usuarioNombre);
          });
      });
    });
    */
}

/*
 module.exports ={
   creaArchivo: function( req, res ){
     existFile('sitemapindex','sitemap');
   }
 }*/
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
          var indice = 0;
          if( erro ){
            creaIndex(name);
            creaSite(name2, ++indice);
            registerSites(name,name2,indice);
            // se llena el sitemap con los valores
            registerAllSites(name2,name,indice);
          }else{
            registerAllSites(name2,name,indice);
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
       html += '\t\t<loc>'+ global.base_url +complete+'</loc>\n';
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
  * @return message if not success
  **/
  function creaIndex(name){
    if( !fs.openSync(name+".xml",'w') ){
      console.log("Fallo en la creacion del index");
    }
  }
  /**
  * funcion para la creacion del sitemap
  * @param name nombre que llevara el archivo
  * @return message if not success
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
    var complete = name +'_'+indice+ ".xml";
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
        attributes:['usuarioUrl','urlPersonal']
      }).then(function(usuario){
        usuario = JSON.parse(JSON.stringify(usuario));
        var i = 0;
        usuario.forEach(function(usu){
            // en caso que el usuario llegue a mas de 50 mil registros, se dejara de agregar la informacion
            //al archivo y se abrira otro donde se empeza a escribir en el nuevo archivo
            // y tambien se checa que el archivo sea menor de 10 mb(10,000 kb)
            var weight;
            fs.stat(name+(indice)+".xml", function( err2, stats ){
              weight = stats.size;
              if( i >= 50000 || weight >= 10000 ){
                i = 0;
                //en este else, si entro excedio los 50 mil y el peso que debe de tener el archivo
                // crea el nuevo sitemap
                creaSite(name,(++indice));
                // actualiza el sitemapindex
                updateIndex(name2,name,fechaCompleta, indice);
              } else {
                console.log('Test');
              }
              i++;
              // se revisa si el campo urlPersonal contenga datos, en caso de hacer asi se escribe,
              // la etiqueta loc con la url personalizada en caso contrario se agregara solamente
              // la url por default
              var usuarioNombre = '';
              if( usu.urlPersonal && usu.urlPersonal.length > 0 ){
                  usuarioNombre = usu.urlPersonal;
              } else {
                usuarioNombre = usu.usuarioUrl;
              }
              updateSitemap( name+(indice)+".xml", usuarioNombre);
            });
        });
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
  function updateIndex( name, addName, fecha,indice ){
    //se va a ir maquetando la informacion en una variable para pasarla a la funcion
    // que va a ir agregando todo.
    var html = "";
    var vComplete = addName+indice+'.xml';
    html += '\t<sitemap>\n';
      html += '\t\t<loc>' + global.base_url +vComplete+'</loc>\n';
      html += '\t\t<lastmod>'+fecha+'</lastmod>\n';
    html += '\t</sitemap>\n';
    var complete = name+".xml";
    fs.appendFile(complete,html, function( err ){
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
    var url = name+".xml";
    var fechaCompleta = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    html += '\t<url>\n';
      html += '\t\t<loc>'+ global.base_url +valor+'</loc>\n';
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
