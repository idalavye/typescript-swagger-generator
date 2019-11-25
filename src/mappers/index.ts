//@ts-ignore
import { frS } from '../controllers/swagger_controller';

export const mapModelsToParamsWithFr = (body, model, type) => {
  const returnModel = frS.create(model);

  const array = Object.keys(returnModel).map(function(key) {
    return [key, returnModel[key]];
  });

  let newBody = body;
  for (var i = 0; i < array.length; i++) {
    newBody[array[i][0]] = {
      prop: array[i][0],
      type: getType(array[i][1]),
      in: type,
      required: type === 'path' ? true : false,
      description: ''
    };
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

const getType = item => {
  let type: any = typeof item;
  if (type === 'number') {
    type = 'integer';
  }

  if (Array.isArray(item)) {
    type = 'string';
  }

  return type;
};
