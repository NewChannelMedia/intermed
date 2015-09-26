var session = {};

function varSession(variablesSesion){
    session = JSON.parse(JSON.stringify(variablesSesion));
}

function valSession(input){
    return session[input];
}

function ifSession(input, options){
    if (session[input])
        return options.fn(session[input]);
    else
        return options.inverse(session[input]);
}

function ifSessionVal(input, options){
    if (session[input] > 0)
        return options.fn(true);
    else
        return options.inverse(false);
}

function unlessSessionVal(input, options){
    if (session[input] === 0)
        return options.fn(true);
    else
        return options.inverse(false);
}

function ifID(value, options){
    if (session.id == value)
        return options.fn(true);
    else
        return options.inverse(true);
}

function ifTipoMedico (options){
    if (session.tipoUsuario == 'M'){
        return options.fn(true);
    } else {
        return options.inverse(true);
    }
}

function ifTipoPaciente (options){
    if (session.tipoUsuario == 'P'){
        return options.fn(true);
    } else {
        return options.inverse(true);
    }
}

function ifPaciente (value, options){
    if (value && session.tipoUsuario == 'P'){
        console.log('ifPaciente-->' + value + ' -- Result: true');
        return options.fn(true);
    } else {
        console.log('ifPaciente-->' + value + ' -- Result: false');
        return options.inverse(true);
    }
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
