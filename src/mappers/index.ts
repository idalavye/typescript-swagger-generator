//@ts-ignore
import { frS } from '../controllers/swagger_controller';

export const mapModelsToParamsWithFr = (body, model, type) => {
  const returnModel = frS.create(model);

  const array = Object.keys(returnModel).map(function(key) {
    return [key, returnModel[key]];
  });

  let newBody = body;
  for (var i = 0; i < array.length; i++) {
    if (Array.isArray(array[i][1])) {
      let arrayBody = getArrayType(array[i][1]);
      newBody[array[i][0]] = {
        prop: array[i][0],
        type: getType(array[i][1]),
        in: type,
        required: type === 'path' ? true : false,
        description: '',
        ...arrayBody
      };
    } else {
      newBody[array[i][0]] = {
        prop: array[i][0],
        type: getType(array[i][1]),
        in: type,
        required: type === 'path' ? true : false,
        description: ''
      };
    }
  }

  return newBody;
};

export const mapModelsToParams = (body, model, type) => {
  let newBody = body;
  for (var i = 0; i < model.length; i++) {
    newBody[model[i]] = {
      prop: model[i],
      type: 'string',
      in: type,
      required: type === 'path' ? true : false,
      description: ''
    };
  }

  return newBody;
};

export const mapReturnModel = model => {
  const returnModel = frS.create(model);
  const array = Object.keys(returnModel).map(function(key) {
    return [key, returnModel[key]];
  });

  const obj = {
    required: [],
    properties: {}
  };

  for (let i = 0; i < array.length; i++) {
    let name: any = [array[i][0]];
    obj.properties[name] = {
      type: getType(array[i][1]),
      description: ''
    };
  }

  return obj;
};

export const mapRouteName = (routeName: string) => {
  let newRouteName = '';
  let props = [];
  let propName = '';
  let check = false;
  for (let letter of routeName) {
    if (check) {
      if (letter === '/') {
        props.push(propName);
        propName = '';
        newRouteName += '}';
        check = false;
      } else {
        propName += letter;
      }
    }

    if (letter === ':') {
      newRouteName += '{';
      check = true;
    } else {
      newRouteName += letter;
    }
  }

  if (check) {
    newRouteName += '}';
    props.push(propName);
  }

  return { newRoute: newRouteName, props: props };
};

export const applyDefaultParams = (model, defaultParams: any) => {
  model = {
    ...model
  };

  model.body = {
    ...model.body,
    ...defaultParams.body
  };

  let returns = { ...defaultParams.returns };
  for (let prop in model.returns) {
    returns[model.returns[prop].statusCode] = {
      ref: model.returns[prop].ref,
      statusCode: model.returns[prop].statusCode,
      description: model.returns[prop].description
    };
  }
  model.returns = returns;

  if (defaultParams.group) model.group = defaultParams.group;

  return model;
};

const getType = item => {
  let type: any = typeof item;
  if (type === 'number') {
    type = 'integer';
  }

  return type;
};

const getArrayType = item => {
  return {
    type: 'array',
    items: {
      type: typeof item[0]
    },
    collectionFormat: 'multi'
  };
};
