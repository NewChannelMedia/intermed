var intermed = require('../apps/controllers/Intermed');

var io = function(io, bundle, ioPassport)
{
    io.use(bundle.cookieParser());
    io.use(bundle.session({secret: 'my secret'}));
    io.use(ioPassport.initialize());
    io.use(ioPassport.session());

    var conectados = [];

    function indexOf(id){
        var index = 0;
        conectados.forEach(function(record) {
            if (record.socket == id) {
                return index;
            } else index++;
        })
        return -1;
    }

    function desconectar(id){
        var index = indexOf(id);
        if (index >= 0){
            conectados.splice(index,1);
            return true;
        } else {
            return false;
        }
    }

    io.on('connection', function(socket){
        console.log('[CONEXIÓN:' + socket.id + ']USUARIO:' + socket.request.cookies.intermed_sesion.usuario + '.');
        conectados.push({
            socket : socket.id,
            id: socket.request.cookies.intermed_sesion.id,
            usuario: socket.request.cookies.intermed_sesion.usuario
        });

        socket.on('disconnect', function() {
                desconectar(socket.id);
                console.log('[DESCONEXIÓN:' + socket.id + ']USUARIO:' + socket.request.cookies.intermed_sesion.usuario + '.');
            });

        socket.on('solicitudAmistad', function(){
            console.log('socket_id: ' + socket.id + ' [Buscar: solicitudAmistad]');
            var req = {
                socket: socket,
                usuario_id: socket.request.cookies.intermed_sesion.id
            };

            intermed.callController('notificaciones', 'solicitudAmistad', req);
        });

        socket.on('verNotificaciones', function(){
            console.log('socket_id: ' + socket.id + ' [Buscar: verNotificaciones]');
            var req = {
                socket: socket,
                usuario_id: socket.request.cookies.intermed_sesion.id
            };

            intermed.callController('notificaciones', 'verNotificaciones', req);
        });



    });
};

//se importa para que otros js lo puedan ejecutar
exports.io = io;
