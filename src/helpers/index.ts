import {
  routes,
  tags,
  definitions,
  defaultParams
} from '../controllers/route-controller';

export const swaggerizeObj = swaggerObject => {
  swaggerObject.swagger = '2.0';
  swaggerObject.paths = swaggerObject.paths || {};
  swaggerObject.definitions = swaggerObject.definitions || {};
  swaggerObject.responses = swaggerObject.responses || {};
  swaggerObject.parameters = swaggerObject.parameters || {};
  swaggerObject.securityDefinitions = swaggerObject.securityDefinitions || {};
  swaggerObject.tags = swaggerObject.tags || [];
  return swaggerObject;
};

export const mapRoutes = swaggerObject => {
  let obj = {};
  for (let i = 0; i < routes.length; i++) {
    let route: any = routes[i].route;
    let method: any = routes[i].method;

    //@ts-ignore
    obj[route] = Object.assign({}, obj[route], {
      [method]: {
        parameters: mapToParameters(routes[i]),
        responses: mapToResponses(routes[i].returns),
        tags: [routes[i].group]
      }
    });
  }

  swaggerObject.paths = obj;
  swaggerObject.tags = tags;
  swaggerObject.definitions = definitions;
};

const mapToParameters = models => {
  let list = [];
  const routes = models.body;
  const payload = models.payload;

  if (payload.length > 0) {
    list.push({
      name: 'reqBody',
      in: 'body',
      description: null,
      required: false,
      schema: {
        $ref: payload[0].ref
      }
    });
  }

  for (let prop in routes) {
    if (routes[prop].type !== 'object')
      list.push({
        name: routes[prop].prop,
        type: routes[prop].type,
        in: routes[prop].in,
        required: routes[prop].required,
        description: routes[prop].description,
        default: routes[prop].default
      });
  }

  for (let prop in defaultParams) {
    if (defaultParams[prop].type !== 'object') {
      list.push({
        name: routes[prop].prop,
        type: routes[prop].type,
        in: routes[prop].in,
        required: routes[prop].required,
        description: routes[prop].description,
        default: routes[prop].default
      });
    }
  }

  return list;
};

const mapToResponses = model => {
  if (model) {
    const obj = {};

    model.forEach(item => {
      obj[item.statusCode] = {
        description: item.description,
        schema: {
          $ref: item.ref
        }
      };
    });

    return obj;
  }
  return {};
};
