// GraphQL Injection 漏洞示例文件

// 示例 1: GraphQL 注入
export function graphqlInjectionExample1() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      user(id: String!): User
    }
    type User {
      id: String!
      name: String!
      email: String!
    }
  `);
  
  const root = {
    user: ({ id }) => {
      // 危险：直接使用用户输入
      const query = `SELECT * FROM users WHERE id = '${id}'`;
      return db.query(query);
    }
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}

// 示例 2: GraphQL 批量查询
export function graphqlInjectionExample2() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      users(ids: [String!]!): [User]
    }
    type User {
      id: String!
      name: String!
      email: String!
    }
  `);
  
  const root = {
    users: ({ ids }) => {
      // 危险：批量查询可能导致 DoS
      return ids.map(id => getUser(id));
    }
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}

// 示例 3: GraphQL 深度查询
export function graphqlInjectionExample3() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      user(id: String!): User
    }
    type User {
      id: String!
      name: String!
      friends: [User]
      friendsOfFriends: [User]
    }
  `);
  
  const root = {
    user: ({ id }) => getUser(id)
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}

// 示例 4: GraphQL 别名注入
export function graphqlInjectionExample4() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      user(id: String!): User
    }
    type User {
      id: String!
      name: String!
      email: String!
    }
  `);
  
  const root = {
    user: ({ id }) => getUser(id)
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}

// 示例 5: GraphQL 指令注入
export function graphqlInjectionExample5() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      user(id: String!): User
    }
    type User {
      id: String!
      name: String!
      email: String!
    }
  `);
  
  const root = {
    user: ({ id }) => getUser(id)
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}

// 示例 6: GraphQL 变量注入
export function graphqlInjectionExample6() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      user(id: String!): User
    }
    type User {
      id: String!
      name: String!
      email: String!
    }
  `);
  
  const root = {
    user: ({ id }) => getUser(id)
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}

// 示例 7: GraphQL 片段注入
export function graphqlInjectionExample7() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      user(id: String!): User
    }
    type User {
      id: String!
      name: String!
      email: String!
    }
  `);
  
  const root = {
    user: ({ id }) => getUser(id)
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}

// 示例 8: GraphQL 操作名注入
export function graphqlInjectionExample8() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      user(id: String!): User
    }
    type User {
      id: String!
      name: String!
      email: String!
    }
  `);
  
  const root = {
    user: ({ id }) => getUser(id)
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}

// 示例 9: GraphQL 内省泄露
export function graphqlInjectionExample9() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      user(id: String!): User
    }
    type User {
      id: String!
      name: String!
      email: String!
    }
  `);
  
  const root = {
    user: ({ id }) => getUser(id)
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));
  
  return app;
}

// 示例 10: GraphQL 认证绕过
export function graphqlInjectionExample10() {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  
  const schema = buildSchema(`
    type Query {
      adminData: String
    }
  `);
  
  const root = {
    adminData: () => {
      // 危险：没有认证检查
      return 'Sensitive admin data';
    }
  };
  
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, rootValue: root }));
  
  return app;
}
