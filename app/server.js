const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const Pack = require('./package');

(async () => {
    const server = await new Hapi.Server({
        host: '0.0.0.0',
        port: 3000,
    });

    const swaggerOptions = {
        info: {
                title: 'Test API Documentation',
                version: Pack.version,
            },
        };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch(err) {
        console.log(err);
    }

    await server.route({
        method: 'GET',
        path: '/todo/{id}',
        options: {
            handler: function (request, h) {
                return `Your todo id is ${request.params.id}`;
            },
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'], // ADD THIS TAG
            validate: {
                params: Joi.object({
                    id : Joi.number()
                            .required()
                            .description('the id for the todo item'),
                })
            }
        },
    });

})();
