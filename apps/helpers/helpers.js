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

function ifPaciente( value, options ) {
  if ( value && session.tipoUsuario == 'P' ) {
    console.log( 'ifPaciente-->' + value + ' -- Result: true' );
    return options.fn( true );
  }
  else {
    console.log( 'ifPaciente-->' + value + ' -- Result: false' );
    return options.inverse( true );
  }
}

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

var Last;

function Last(num){
  Last = num;
}

function numLast(){
  return Last+1;
}

exports.varSession = varSession;
exports.valSession = valSession;
exports.ifSession = ifSession;
exports.ifSessionVal = ifSessionVal;
exports.unlessSessionVal = unlessSessionVal;
exports.ifID = ifID;
exports.ifTipoMedico = ifTipoMedico;
exports.ifTipoPaciente = ifTipoPaciente;
exports.ifPaciente = ifPaciente;
exports.eachValSession = eachValSession;
exports.ifsubEsp = ifsubEsp;
exports.set = set;
exports.unset = unset;
exports.base_url = base_url;
exports.indexBaseUno = indexBaseUno;
exports.ifFirst = ifFirst;
exports.Last = Last;
exports.numLast = numLast;
