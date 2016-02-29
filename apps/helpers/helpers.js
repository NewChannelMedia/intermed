var session = {};

function varSession( variablesSesion ) {
  session = JSON.parse( JSON.stringify( variablesSesion ) );
}

function valSession( input ) {
  return session[ input ];
}

function ifSession( input, options ) {
  if ( session[ input ] )
    return options.fn( session[ input ] );
  else
    return options.inverse( session[ input ] );
}

function ifSessionVal( input, options ) {
  if ( session[ input ] > 0 )
    return options.fn( true );
  else
    return options.inverse( false );
}

function unlessSessionVal( input, options ) {
  if ( session[ input ] === 0 )
    return options.fn( true );
  else
    return options.inverse( false );
}

function ifID( value, options ) {
  if ( session.id == value )
    return options.fn( true );
  else
    return options.inverse( true );
}

function ifTipoMedico( options ) {
  if ( session.tipoUsuario == 'M' ) {
    return options.fn( true );
  }
  else {
    return options.inverse( true );
  }
}

function ifTipoPaciente( options ) {
  if ( session.tipoUsuario == 'P' ) {
    return options.fn( true );
  }
  else {
    return options.inverse( true );
  }
}
/*
function ifPaciente( value, options ) {
  if ( value && session.tipoUsuario == 'P' ) {
    return options.fn( true );
  }
  else {
    return options.inverse( true );
  }
}*/

function eachValSession(value, options){
  var ret = "";
  if (session[ value ]){
    for(var i=0, j=session[ value ].length; i<j; i++) {
      ret = ret + options.fn(session[ value ][i]);
    }
  }

  return ret;
}

function ifsubEsp(options){
  if ( session[ 'especialidades' ]){
    var continuar = true;
    for(var i=0, j=session['especialidades'].length; i<j; i++) {
      if (session['especialidades'][i]['subEsp']==1 && continuar){
        continuar = false;
        return options.fn( true );
      }
    }
  }
  else
    return options.inverse(true);
}

function unset(value){
  session[value] = 0;
}

function set(value){
  session[value] = 1;
}

function base_url() {
  return global.base_url;
}

function indexBaseUno(num){
  return num + 1;
}

function ifFirst(num,options){
  if (num == 0){
    return options.fn( true );
  } else {
    return options.inverse(true);
  }
}

function Last(num){
  session.Last = num;
}

function numLast(){
  return session.Last+1;
}

function ifSessionValNN( input, options ) {
  if (session[ input ] && session[ input ] != "" )
    return options.fn( true );
  else
    return options.inverse( false );
}

function ifNotSession(options){
  if (session.length == 0)
    return options.fn( true );
  else
    return options.inverse( false );
}

exports.varSession = varSession;
exports.valSession = valSession;
exports.ifSession = ifSession;
exports.ifSessionVal = ifSessionVal;
exports.ifSessionValNN = ifSessionValNN;
exports.unlessSessionVal = unlessSessionVal;
exports.ifID = ifID;
exports.ifTipoMedico = ifTipoMedico;
exports.ifTipoPaciente = ifTipoPaciente;
//exports.ifPaciente = ifPaciente;
exports.eachValSession = eachValSession;
exports.ifsubEsp = ifsubEsp;
exports.set = set;
exports.unset = unset;
exports.base_url = base_url;
exports.indexBaseUno = indexBaseUno;
exports.ifFirst = ifFirst;
exports.Last = Last;
exports.numLast = numLast;
exports.ifNotSession = ifNotSession;
