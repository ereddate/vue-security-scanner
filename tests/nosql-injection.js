// NoSQL Injection 漏洞示例文件

// 示例 1: 直接使用用户输入构建 MongoDB 查询
export function nosqlInjectionExample1(username) {
  // 危险：直接将用户输入拼接到查询对象中
  const query = {
    username: username
  };
  return query;
}

// 示例 2: 使用用户输入构建查询条件
export function nosqlInjectionExample2(userInput) {
  // 危险：用户输入作为查询值
  const query = {
    age: { $gt: userInput }
  };
  return query;
}

// 示例 3: 不安全的登录验证查询
export function nosqlInjectionExample3(credentials) {
  // 危险：凭据直接用于查询
  const query = {
    email: credentials.email,
    password: credentials.password
  };
  return query;
}

// 示例 4: 用户可控的排序参数
export function nosqlInjectionExample4(sortField) {
  // 危险：排序字段来自用户输入
  const sortQuery = {};
  sortQuery[sortField] = 1;
  return sortQuery;
}

// 示例 5: 构建不安全的更新查询
export function nosqlInjectionExample5(userId, updateData) {
  // 危险：更新数据来自用户输入
  const filter = { _id: userId };
  const update = { $set: updateData };
  return { filter, update };
}

// 示例 6: 用户输入影响查询操作符
export function nosqlInjectionExample6(operator, value) {
  // 危险：操作符和值都来自用户输入
  const query = {
    age: { [operator]: value }
  };
  return query;
}

// 示例 7: 不安全的查找查询
export function nosqlInjectionExample7(searchTerm) {
  // 危险：搜索项直接用于查询
  const query = {
    $text: { $search: searchTerm }
  };
  return query;
}

// 示例 8: 用户控制的聚合管道
export function nosqlInjectionExample8(groupField) {
  // 危险：分组字段来自用户输入
  const pipeline = [
    { $group: { _id: `$${groupField}`, count: { $sum: 1 } } }
  ];
  return pipeline;
}

// 示例 9: 不安全的范围查询
export function nosqlInjectionExample9(minAge, maxAge) {
  // 危险：范围值来自用户输入
  const query = {
    age: {
      $gte: minAge,
      $lte: maxAge
    }
  };
  return query;
}

// 示例 10: 用户输入构建复杂查询
export function nosqlInjectionExample10(field, operator, value, logicOperator) {
  // 危险：字段、操作符、值和逻辑操作符都来自用户输入
  const query = {
    [logicOperator]: [
      { [field]: { [operator]: value } }
    ]
  };
  return query;
}

// 示例 11: 不安全的投影查询
export function nosqlInjectionExample11(fields) {
  // 危险：投影字段来自用户输入
  const projection = {};
  for (const field of fields) {
    projection[field] = 1;
  }
  return projection;
}

// 示例 12: 用户可控的索引创建
export function nosqlInjectionExample12(indexField, indexType) {
  // 危险：索引字段和类型来自用户输入
  const indexSpec = {};
  indexSpec[indexField] = indexType;
  return indexSpec;
}

// 示例 13: 不安全的嵌套查询
export function nosqlInjectionExample13(nestedField, nestedValue) {
  // 危险：嵌套字段和值来自用户输入
  const query = {};
  query[`profile.${nestedField}`] = nestedValue;
  return query;
}

// 示例 14: 用户输入影响查询修饰符
export function nosqlInjectionExample14(limit, skip) {
  // 危险：限制和跳过值来自用户输入
  const options = {
    limit: parseInt(limit),
    skip: parseInt(skip)
  };
  return options;
}

// 示例 15: 构建不安全的 upsert 查询
export function nosqlInjectionExample15(filterField, filterValue, updateData) {
  // 危险：过滤字段、值和更新数据都来自用户输入
  const filter = { [filterField]: filterValue };
  const update = { $set: updateData };
  const options = { upsert: true };
  return { filter, update, options };
}

// 示例 16: 不安全的数组查询
export function nosqlInjectionExample16(arrayField, arrayValue) {
  // 危险：数组字段和值来自用户输入
  const query = {
    [arrayField]: { $in: [arrayValue] }
  };
  return query;
}

// 示例 17: 用户输入构建正则表达式查询
export function nosqlInjectionExample17(pattern, flags) {
  // 危险：模式和标志来自用户输入
  const query = {
    name: { $regex: pattern, $options: flags }
  };
  return query;
}

// 示例 18: 不安全的地理位置查询
export function nosqlInjectionExample18(longitude, latitude, distance) {
  // 危险：地理坐标和距离来自用户输入
  const query = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(distance)
      }
    }
  };
  return query;
}

// 示例 19: 用户控制的字段选择查询
export function nosqlInjectionExample19(fieldName, fieldValue) {
  // 危险：字段名和值都来自用户输入
  const query = {};
  query[fieldName] = fieldValue;
  return query;
}

// 示例 20: 复杂的用户输入驱动查询
export function nosqlInjectionExample20(userQueryObject) {
  // 危险：整个查询对象来自用户输入
  return userQueryObject;
}

// 辅助函数模拟 NoSQL 查询
function simulateMongoDBQuery(query, collection) {
  // 这是一个模拟函数，实际应用中会连接到数据库
  console.log('Executing query:', query);
  return [];
}
