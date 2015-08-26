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

exports.varSession = varSession;
exports.valSession = valSession;
exports.ifSession = ifSession;
