import {
  mapModelsToParams,
  mapReturnModel,
  mapRouteName,
  mapModelsToParamsWithFr
} from '../mappers/index';

import {
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_DELETE
} from '../helpers/Constants';

export const routes = [];
export const tags = [];
export const definitions = {};

export const HttpsMethods = {
  get(routeName: string) {
    return Options(HTTP_GET, routeName);
  },
  post(routeName: string) {
    return Options(HTTP_POST, routeName);
  },
  put(routeName: string) {
    return Options(HTTP_PUT, routeName);
  },
  delete(routeName: string) {
    return Options(HTTP_DELETE, routeName);
  }
};

const Options = (methodName: string, routeName: string) => {
  return {
    model: {
      route: '',
      method: methodName,
      body: [],
      payload: [],
      group: '',
      returns: []
    },
    body: function(model: string) {
      if (model) {
        definitions[model] = mapReturnModel(model);
      }

      this.model.payload.push({
        ref: model ? `#/definitions/${model}` : null
      });
      return this;
    },
    headers: function(model: string) {
      this.model.body.push(mapModelsToParamsWithFr(model, 'header'));
      return this;
    },
    query: function(model: string) {
      this.model.body.push(mapModelsToParamsWithFr(model, 'query'));
      return this;
    },
    group: function(groupName: string, groupDescription: string = '') {
      tags.push({
        name: groupName,
        description: groupDescription
      });
      this.model.group = groupName;
      return this;
    },
    customize: function(
      paramName: string,
      { required, defaultValue, type, paramType, description }
    ) {
      const custom: any = {};

      if (required) {
        custom.required = required;
      }
      if (defaultValue) {
        custom.default = defaultValue;
      }
      if (type) {
        custom.type = type;
      }
      if (paramType) {
        custom.in = paramType;
      }
      if (description) {
        custom.description = description;
      }

      this.model.body.forEach((item, index) => {
        item.forEach((el, index2) => {
          if (el.prop === paramName) {
            this.model.body[index][index2] = {
              ...this.model.body[index][index2],
              ...custom
            };
          }
        });
      });

      return this;
    },
    returns: function({ statusCode, model, desc = '' }) {
      if (model) {
        definitions[model] = mapReturnModel(model);
      }

      this.model.returns.push({
        ref: model ? `#/definitions/${model}` : null,
        statusCode: statusCode,
        description: desc
      });

      return this;
    },
    end: function() {
      const obj = mapRouteName(routeName);
      this.model.route = obj.newRoute;
      this.model.body.push(mapModelsToParams(obj.props, 'path'));
      routes.push(this.model);
    }
  };
};
