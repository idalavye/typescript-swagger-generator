//@ts-ignore
const swaggerUi = require('express-swaggerize-ui');

import { validateOptions } from '../validations/validations';
import { swaggerizeObj, mapRoutes } from '../helpers/index';
//@ts-ignore
import fr from 'fixture-repository';
export const frS = fr;

export const generateSwaggerUi = (app, files) => {
  fr.setup(files);
  return options => {
    validateOptions(options);

    let swaggerObject = swaggerizeObj(options.swaggerDefinition);
    mapRoutes(options.swaggerDefinition);

    let url = options.route ? options.route.url : '/swagger-ui';
    let docs = options.route ? options.route.docs : '/swagger.json';

    app.use(docs, function(req, res) {
      res.json(swaggerObject);
    });
    app.use(
      url,
      swaggerUi({
        route: url,
        docs: docs
      })
    );
    return swaggerObject;
  };
};
