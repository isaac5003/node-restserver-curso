const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');



//======================
//Obtener productos
//======================
app.get('/productos', verificarToken, (req, res) => {
    //trae todos los productos
    // populate: usuario categori
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })



        })


});


//======================
//Obtener un producto por ID
//======================
app.get('/productos/:id', verificarToken, (req, res) => {
    // populate: usuario categori
    // paginado

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })


        })


});


//======================
//Buscar productos
//======================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {


    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (productos == '') {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No hay ningun producto'
                    }
                });
            }

            res.json({
                ok: true,
                productos
            })



        })







});







//======================
//Crear un producto
//======================
app.post('/productos/', verificarToken, (req, res) => {
    // grabar usuario
    // grabar categoria de listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }



        res.status(201).json({
            ok: true,
            producto: productoDB
        });



    });


});


//======================
//Actualiza un producto
//======================
app.put('/productos/:id', verificarToken, (req, res) => {
    // grabar usuario
    // grabar categoria de listado

    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })

        })


    });

});

//======================
//Borrar un producto
//======================
app.delete('/productos/:id', verificarToken, (req, res) => {
    // grabar usuario
    // grabar categoria de listado

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no esxiste'
                }
            });
        }


        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            })

        })



    })




});





module.exports = app;