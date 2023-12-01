const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesAPIController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: movies.length,
                        url: 'api/movies'
                    },
                    data: movies
                }
                res.json(respuesta);
            })
    },

    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include: ['genre']
            })
            .then(movie => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: movie.length,
                        url: '/api/movie/:id'
                    },
                    data: movie
                }
                res.json(respuesta);
            });
    },
    'recomended': (req, res) => {
        // Verificar si se proporciona el parámetro de rating
        if (req.params.rating) {
            db.Movie.findAll({
                include: ['genre'],
                where: {
                    rating: { [db.Sequelize.Op.gte]: req.params.rating }
                },
                order: [
                    ['rating', 'DESC']
                ]
            })
                .then(movies => {
                    let respuesta = {
                        meta: {
                            status: 200,
                            total: movies.length,
                            url: 'api/movies/recomended/:rating'
                        },
                        data: movies
                    }
                    res.json(respuesta);
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({
                        meta: {
                            status: 500,
                            url: 'api/movies/recomended/:rating'
                        },
                        error: 'Internal Server Error'
                    });
                });
        } else {
            // Manejar el caso donde no se proporciona el parámetro de rating
            res.status(400).json({
                meta: {
                    status: 400,
                    url: 'api/movies/recomended/:rating'
                },
                error: 'Bad Request: Se requiere el parámetro "rating"'
            });
        }
    },
    'listFavorites': async (req, res) => {
        try {
            // Obtener la lista de IDs de películas favoritas del localStorage
            const favoriteMoviesIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

            // Consultar las películas favoritas desde la base de datos
            const favoriteMovies = await db.Movie.findAll({
                where: {
                    id: {
                        [db.Sequelize.Op.in]: favoriteMoviesIds
                    }
                },
                include: ['genre']
            });

            // Responder con las películas favoritas
            let respuesta = {
                meta: {
                    status: 200,
                    total: favoriteMovies.length,
                    url: 'api/favorites'
                },
                data: favoriteMovies
            };
            res.json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                meta: {
                    status: 500,
                    url: 'api/favorites'
                },
                error: 'Internal Server Error'
            });
        }
    },
    create: (req, res) => {

        console.log('create', req.body, req.params)
        Movies
            .create(
                {
                    title: req.body.title,
                    rating: req.body.rating,
                    awards: req.body.awards,
                    release_date: req.body.release_date,
                    length: req.body.length,
                    genre_id: req.body.genre_id
                }
            )
            .then(confirm => {
                let respuesta;
                if (confirm) {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: 'api/movies/create'
                        },
                        data: confirm
                    }
                } else {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: 'api/movies/create'
                        },
                        data: confirm
                    }
                }
                res.json(respuesta);
            })
            .catch(error => res.send(error))
    },
    update: (req, res) => {
        let movieId = req.params.id;
        console.log(movieId)
        console.log(req.body)
        Movies.update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: { id: movieId }
            })
            .then(confirm => {
                let respuesta;
                if (confirm) {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: 'api/movies/:id'
                        },
                        data: confirm
                    }
                } else {
                    respuesta = {
                        meta: {
                            status: 204,
                            total: confirm.length,
                            url: 'api/movies/update/:id'
                        },
                        data: confirm
                    }
                }
                res.json(respuesta);
            })
            .catch(error => res.send(error))
    },
    destroy: (req, res) => {
        let movieId = req.params.id;
        console.log(movieId)
        Movies
            .destroy({ where: { id: movieId }, force: true }) // force: true es para asegurar que se ejecute la acción
            .then(confirm => {
                let respuesta;
                console.log('confirm', confirm)
                if (confirm) {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: 'api/movies/delete/:id'
                        },
                        data: confirm
                    }
                } else {
                    respuesta = {
                        meta: {
                            status: 204,
                            total: confirm.length,
                            url: 'api/movies/destroy/:id'
                        },
                        data: confirm
                    }
                }
                res.json(respuesta);
            })
            .catch(error => res.send(error))
    }

}

module.exports = moviesAPIController;