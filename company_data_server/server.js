
import express from 'express';
import bodyParser from 'body-parser';
import models from './models/index.js';
import GraphHTTP from 'express-graphql';
import Schema from './graphql';
import cors from 'cors';

var app = express();

function startApp(port) {
    app.listen(port, function() {
        console.log('Server is listening on port ' + port);
    });
}

async function syncSequelize() {
    let retries = 5;
    while (retries) {
        try {
            await models.sequelize.sync();
            break;
        } catch (err) {
            console.log("Connection to sequelize failed. Retrying...")
            retries -= 1;
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

syncSequelize();
startApp(8088);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
 * This is here because of authentication. Auth middleware decodes the JWT token
 * and saves its content to request.user object.
 */
app.use('/graphql', GraphHTTP((request) => ({
        schema: Schema,
        pretty: true,
        graphiql: true
})));
