// 原型污染漏洞示例文件

// 示例 1: 不安全的对象合并
export function unsafeMerge(target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
  return target;
}

// 示例 2: 直接赋值__proto__
export function assignProto(target, source) {
  target.__proto__ = source;
  return target;
}

// 示例 3: 直接赋值constructor.prototype
export function assignConstructorProto(target, source) {
  target.constructor.prototype = source;
  return target;
}

// 示例 4: 使用Object.assign进行原型污染
export function unsafeObjectAssign(target, source) {
  return Object.assign(target, source);
}

// 示例 5: 使用展开运算符进行原型污染
export function unsafeSpread(target, source) {
  return { ...target, ...source };
}

// 示例 6: 不安全的JSON.parse
export function unsafeJSONParse(jsonString) {
  return JSON.parse(jsonString);
}

// 示例 7: 不安全的深拷贝
export function unsafeDeepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 示例 8: 不安全的克隆
export function unsafeClone(obj) {
  const clone = {};
  for (let key in obj) {
    clone[key] = obj[key];
  }
  return clone;
}

// 示例 9: 不安全的扩展
export function unsafeExtend(target, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
}

// 示例 10: 不安全的混入
export function unsafeMixin(target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
  return target;
}

// 示例 11: Vue组件中的原型污染
export default {
  name: 'PrototypePollutionComponent',
  methods: {
    mergeUserData(userData) {
      const user = {};
      for (let key in userData) {
        user[key] = userData[key];
      }
      return user;
    },
    
    mergeConfig(config) {
      const defaultConfig = {};
      for (let key in config) {
        defaultConfig[key] = config[key];
      }
      return defaultConfig;
    },
    
    mergeOptions(options) {
      const merged = Object.assign({}, options);
      return merged;
    }
  },
  
  mounted() {
    const userData = this.$route.query.userData;
    const mergedUser = this.mergeUserData(JSON.parse(userData));
    console.log(mergedUser);
  }
};

// 示例 12: 不安全的路径操作
export function unsafePathOperation(path) {
  const parts = path.split('/');
  let current = {};
  for (let part of parts) {
    current[part] = {};
    current = current[part];
  }
  return current;
}

// 示例 13: 不安全的查询参数解析
export function unsafeQueryParse(queryString) {
  const params = {};
  const pairs = queryString.split('&');
  for (let pair of pairs) {
    const [key, value] = pair.split('=');
    params[key] = value;
  }
  return params;
}

// 示例 14: 不安全的表单数据处理
export function unsafeFormDataProcessing(formData) {
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

// 示例 15: 不安全的配置合并
export function unsafeConfigMerge(defaultConfig, userConfig) {
  const merged = { ...defaultConfig };
  for (let key in userConfig) {
    merged[key] = userConfig[key];
  }
  return merged;
}

// 示例 16: 不安全的选项合并
export function unsafeOptionsMerge(defaultOptions, userOptions) {
  return Object.assign({}, defaultOptions, userOptions);
}

// 示例 17: 不安全的属性设置
export function unsafePropertySet(obj, key, value) {
  obj[key] = value;
  return obj;
}

// 示例 18: 不安全的属性访问
export function unsafePropertyAccess(obj, key) {
  return obj[key];
}

// 示例 19: 不安全的属性删除
export function unsafePropertyDelete(obj, key) {
  delete obj[key];
  return obj;
}

// 示例 20: 不安全的属性检查
export function unsafePropertyCheck(obj, key) {
  return key in obj;
}

// 示例 21: 不安全的属性枚举
export function unsafePropertyEnum(obj) {
  const properties = [];
  for (let key in obj) {
    properties.push(key);
  }
  return properties;
}

// 示例 22: 不安全的属性描述符
export function unsafePropertyDescriptor(obj, key) {
  return Object.getOwnPropertyDescriptor(obj, key);
}

// 示例 23: 不安全的属性定义
export function unsafePropertyDefine(obj, key, descriptor) {
  Object.defineProperty(obj, key, descriptor);
  return obj;
}

// 示例 24: 不安全的属性创建
export function unsafePropertyCreate(obj, key, value) {
  Object.create(obj, {
    [key]: {
      value: value,
      enumerable: true,
      writable: true,
      configurable: true
    }
  });
  return obj;
}

// 示例 25: 不安全的属性冻结
export function unsafePropertyFreeze(obj) {
  return Object.freeze(obj);
}

// 示例 26: 不安全的属性密封
export function unsafePropertySeal(obj) {
  return Object.seal(obj);
}

// 示例 27: 不安全的属性阻止
export function unsafePropertyPrevent(obj) {
  return Object.preventExtensions(obj);
}

// 示例 28: 不安全的属性键
export function unsafePropertyKeys(obj) {
  return Object.keys(obj);
}

// 示例 29: 不安全的属性值
export function unsafePropertyValues(obj) {
  return Object.values(obj);
}

// 示例 30: 不安全的属性条目
export function unsafePropertyEntries(obj) {
  return Object.entries(obj);
}

// 示例 31: 不安全的属性获取
export function unsafePropertyGet(obj, key) {
  return Object.getPrototypeOf(obj)[key];
}

// 示例 32: 不安全的属性设置
export function unsafePropertySet(obj, key, value) {
  Object.getPrototypeOf(obj)[key] = value;
  return obj;
}

// 示例 33: 不安全的原型获取
export function unsafePrototypeGet(obj) {
  return Object.getPrototypeOf(obj);
}

// 示例 34: 不安全的原型设置
export function unsafePrototypeSet(obj, prototype) {
  Object.setPrototypeOf(obj, prototype);
  return obj;
}

// 示例 35: 不安全的原型创建
export function unsafePrototypeCreate(prototype, properties) {
  return Object.create(prototype, properties);
}

// 示例 36: 不安全的原型检查
export function unsafePrototypeCheck(obj, prototype) {
  return prototype.isPrototypeOf(obj);
}

// 示例 37: 不安全的实例检查
export function unsafeInstanceCheck(obj, constructor) {
  return obj instanceof constructor;
}

// 示例 38: 不安全的构造函数检查
export function unsafeConstructorCheck(obj, constructor) {
  return obj.constructor === constructor;
}

// 示例 39: 不安全的toString检查
export function unsafeToStringCheck(obj, str) {
  return obj.toString() === str;
}

// 示例 40: 不安全的valueOf检查
export function unsafeValueOfCheck(obj, value) {
  return obj.valueOf() === value;
}

// 示例 41: 不安全的类型转换
export function unsafeTypeConversion(value) {
  return String(value);
}

// 示例 42: 不安全的类型检查
export function unsafeTypeCheck(value) {
  return typeof value;
}

// 示例 43: 不安全的相等检查
export function unsafeEqualityCheck(a, b) {
  return a == b;
}

// 示例 44: 不安全的严格相等检查
export function unsafeStrictEqualityCheck(a, b) {
  return a === b;
}

// 示例 45: 不安全的比较
export function unsafeComparison(a, b) {
  return a < b;
}

// 示例 46: 不安全的逻辑运算
export function unsafeLogicalOperation(a, b) {
  return a && b;
}

// 示例 47: 不安全的位运算
export function unsafeBitwiseOperation(a, b) {
  return a & b;
}

// 示例 48: 不安全的算术运算
export function unsafeArithmeticOperation(a, b) {
  return a + b;
}

// 示例 49: 不安全的字符串运算
export function unsafeStringOperation(a, b) {
  return a + b;
}

// 示例 50: 不安全的数组运算
export function unsafeArrayOperation(arr, index) {
  return arr[index];
}
