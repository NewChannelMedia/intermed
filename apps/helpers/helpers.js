var session = {};

function varSession(variablesSesion){
    session = variablesSesion;
}

function session(input){
    return session[input];
}

function ifSession(input, options){
    if (session[input])
        return options.fn(session[input]);
    else
        return options.inverse(session[input]);
}

exports.varSession = varSession;
exports.session = session;
exports.ifSession = ifSession;
