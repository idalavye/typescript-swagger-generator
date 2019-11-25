import { routes, tags, definitions } from '../controllers/route-controller';
import { listenerCount } from 'cluster';

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

  routes.forEach(model => {
    const propList = model;

    for (let i = 0; i < propList.length; i++) {
      list.push({
        name: propList[i].prop,
        type: propList[i].type,
        in: propList[i].in,
        required: propList[i].required,
        description: propList[i].description,
        default: propList[i].default
      });
    }
  });

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
