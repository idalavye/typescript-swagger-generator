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
export let defaultParams = {};

export const SwaggerPaths = {
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

export const DefaultParams = () => {
  return {
    query: (model: string) => {
      defaultParams = mapModelsToParamsWithFr(defaultParams, model, 'query');
      return this;
    },
    header: (model: string) => {
      defaultParams = mapModelsToParamsWithFr(defaultParams, model, 'header');
    }
  };
};

const Options = (methodName: string, routeName: string) => {
  return {
    model: {
      route: '',
      method: methodName,
      body: {},
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
      this.model.body = mapModelsToParamsWithFr(
        this.model.body,
        model,
        'header'
      );
      return this;
    },
    query: function(model: string) {
      this.model.body = mapModelsToParamsWithFr(
        this.model.body,
        model,
        'query'
      );
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
      {
        required = null,
        defaultValue = null,
        type = null,
        paramType = null,
        description = null
      }
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

      if (this.model.body[paramName]) {
        this.model.body[paramName] = {
          ...this.model.body[paramName],
          ...custom
        };
      }

      return this;
    },
    returns: function({ statusCode, model = null, desc = '' }) {
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
      this.model.body = mapModelsToParams(this.model.body, obj.props, 'path');
      routes.push(this.model);
    }
  };
};
