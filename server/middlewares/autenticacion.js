const jwt = require('jsonwebtoken');

//=====================
//Verificar token
//=====================
let verificarToken = (req, res, next) => {

    let token = req.get('token'); //token

    jwt.verify(token, process.env.SEED, (err, decode) => {


        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        };

        req.usuario = decode.usuario;
        next();

    });


};



//=====================
//Verificar token
//=====================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es admin'
            }
        });

    }





}


module.exports = {
    verificarToken,
    verificaAdmin_Role
}