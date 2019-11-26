import {
  mapModelsToParams,
  mapReturnModel,
  mapRouteName,
  mapModelsToParamsWithFr,
  applyDefaultParams
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

export const SwaggerPaths = {
  defaultParams: null,
  get(routeName: string) {
    return Options(HTTP_GET, routeName, this.defaultParams);
  },
  post(routeName: string) {
    return Options(HTTP_POST, routeName, this.defaultParams);
  },
  put(routeName: string) {
    return Options(HTTP_PUT, routeName, this.defaultParams);
  },
  delete(routeName: string) {
    return Options(HTTP_DELETE, routeName, this.defaultParams);
  }
};

export const UseDefaults = {
  build() {
    return DefaultOptions();
  }
};

const DefaultOptions = () => {
  return {
    model: {
      body: {},
      group: '',
      returns: {}
    },
    query: function(model: string) {
      this.model.body = mapModelsToParamsWithFr(
        this.model.body,
        model,
        'query'
      );
      return this;
    },
    header: function(model: string) {
      this.model.body = mapModelsToParamsWithFr(
        this.model.body,
        model,
        'header'
      );
      return this;
    },
    group: function(groupName: string, groupDescription?: string) {
      tags.push({
        name: groupName,
        description: groupDescription
      });
      this.model.group = groupName;
      return this;
    },
    returns: function({ statusCode, model, desc = '' }) {
      if (model) {
        definitions[model] = mapReturnModel(model);
      }

      this.model.returns = {
        ...this.model.returns,
        [statusCode]: {
          ref: model ? `#/definitions/${model}` : null,
          statusCode: statusCode,
          description: desc
        }
      };

      return this;
    },
    end: function(callback) {
      let swaggerPaths = SwaggerPathsWithDefault;
      swaggerPaths.defaultParams = this.model;
      callback(swaggerPaths);
    }
  };
};

const Options = (
  methodName: string,
  routeName: string,
  defaultParams?: any
) => {
  return {
    model: {
      route: '',
      method: methodName,
      body: {},
      payload: [],
      group: '',
      returns: {}
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
      } else if (type && paramName && paramType) {
        this.model.body[paramName] = {
          prop: paramName,
          type: type,
          in: paramType,
          required: type === 'path' ? true : false,
          description: description ? description : ''
        };
      }

      return this;
    },
    returns: function({ statusCode, model = null, desc = '' }) {
      if (model) {
        definitions[model] = mapReturnModel(model);
      }

      this.model.returns = {
        ...this.model.returns,
        [statusCode]: {
          ref: model ? `#/definitions/${model}` : null,
          statusCode: statusCode,
          description: desc
        }
      };

      return this;
    },
    end: function() {
      const obj = mapRouteName(routeName);
      this.model.route = obj.newRoute;
      this.model.body = mapModelsToParams(this.model.body, obj.props, 'path');
      if (defaultParams)
        this.model = applyDefaultParams(this.model, defaultParams);
      routes.push(this.model);
    }
  };
};

const SwaggerPathsWithDefault = {
  defaultParams: null,
  get(routeName: string) {
    return Options(HTTP_GET, routeName, this.defaultParams);
  },
  post(routeName: string) {
    return Options(HTTP_POST, routeName, this.defaultParams);
  },
  put(routeName: string) {
    return Options(HTTP_PUT, routeName, this.defaultParams);
  },
  delete(routeName: string) {
    return Options(HTTP_DELETE, routeName, this.defaultParams);
  }
};
