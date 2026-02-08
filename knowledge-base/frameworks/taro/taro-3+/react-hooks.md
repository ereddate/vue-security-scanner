# Taro 3+ React Hooks 安全

## 📋 概述

Taro 3+ 完全支持 React Hooks，为开发者提供了更简洁和强大的组件开发方式。React Hooks 的引入为 Taro 应用带来了新的安全特性和挑战。了解和正确使用 React Hooks 对于构建安全的 Taro 应用至关重要。

## 🎯 核心安全特性

- **状态隔离**：React Hooks 提供了组件级别的状态隔离，避免状态污染
- **副作用管理**：useEffect 钩子提供了安全的副作用管理机制
- **内存管理**：useEffect 的清理函数确保组件卸载时清理资源
- **依赖追踪**：React 的依赖追踪机制确保状态更新的一致性

## 🔍 常见安全问题

### 问题 1：useEffect 中的内存泄漏

**描述**：如果在 useEffect 中创建了副作用（如定时器、事件监听器），但未在清理函数中清理，可能导致内存泄漏。

**风险**：中风险，可能导致应用性能下降，内存占用持续增长，最终导致应用崩溃。

**解决方案**：

1. **使用清理函数**：在 useEffect 中返回清理函数，清理副作用
2. **避免全局副作用**：避免在组件中创建全局副作用
3. **使用 ref 追踪**：使用 ref 追踪需要清理的资源

```javascript
import { useEffect, useRef } from 'react';

function TimerComponent() {
  const timerRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 创建定时器
    timerRef.current = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return <div>计数: {count}</div>;
}
```

### 问题 2：useEffect 中的竞态条件

**描述**：如果在 useEffect 中执行异步操作，但未正确处理竞态条件，可能导致数据不一致或未授权操作。

**风险**：中风险，可能导致数据不一致，未授权操作等后果。

**解决方案**：

1. **使用 AbortController**：使用 AbortController 取消未完成的请求
2. **验证组件状态**：在异步操作完成后验证组件是否仍然挂载
3. **使用 loading 状态**：使用 loading 状态防止重复操作

```javascript
import { useEffect, useState, useRef } from 'react';
import Taro from '@tarojs/taro';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // 创建 AbortController
    abortControllerRef.current = new AbortController();

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await Taro.request({
          url: `/api/users/${userId}`,
          signal: abortControllerRef.current.signal
        });
        setUser(response.data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('获取用户失败:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // 清理函数
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [userId]);

  if (loading) return <div>加载中...</div>;
  if (!user) return <div>用户不存在</div>;

  return <div>{user.name}</div>;
}
```

### 问题 3：useCallback 和 useMemo 中的安全问题

**描述**：如果在 useCallback 和 useMemo 中使用不安全的依赖，可能导致安全漏洞。

**风险**：低风险，主要影响性能和代码质量，但在某些情况下可能导致安全问题。

**解决方案**：

1. **正确指定依赖**：正确指定 useCallback 和 useMemo 的依赖
2. **验证依赖**：验证依赖的安全性和有效性
3. **避免过度优化**：避免过度使用 useCallback 和 useMemo

```javascript
import { useCallback, useMemo } from 'react';

function SecureComponent({ user, actions }) {
  // 安全：正确指定依赖
  const handleClick = useCallback(() => {
    if (actions && actions.onClick) {
      actions.onClick(user.id);
    }
  }, [user.id, actions]);

  // 安全：正确指定依赖
  const filteredUsers = useMemo(() => {
    return users.filter(u => u.active);
  }, [users]);

  return <button onClick={handleClick}>点击</button>;
}
```

### 问题 4：useContext 中的敏感信息泄露

**描述**：如果在 Context 中存储敏感信息，可能导致信息泄露。

**风险**：中风险，可能导致敏感信息被其他组件访问，信息泄露等后果。

**解决方案**：

1. **避免在 Context 中存储敏感信息**：不要在 Context 中存储敏感信息
2. **使用多个 Context**：使用多个 Context 分离不同类型的信息
3. **验证 Context 访问**：验证 Context 的访问权限

```javascript
import { createContext, useContext } from 'react';

// 不安全：在 Context 中存储敏感信息
// const UserContext = createContext({ user: null, token: null });

// 安全：使用多个 Context
const UserContext = createContext({ user: null });
const AuthContext = createContext({ isAuthenticated: false });

function App() {
  const user = { id: '123', name: '张三' };
  const isAuthenticated = true;

  return (
    <UserContext.Provider value={{ user }}>
      <AuthContext.Provider value={{ isAuthenticated }}>
        <UserProfile />
      </AuthContext.Provider>
    </UserContext.Provider>
  );
}

function UserProfile() {
  const { user } = useContext(UserContext);
  const { isAuthenticated } = useContext(AuthContext);

  return <div>{user.name}</div>;
}
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// config/index.js
export default {
  // 配置 React
  framework: 'react',
  // 启用严格模式
  reactStrictMode: true,
  // 配置编译选项
  compiler: {
    // 启用类型检查
    typeCheck: true
  }
};
```

### 安全检查清单

- [x] 在 useEffect 中返回清理函数，清理副作用
- [x] 使用 AbortController 取消未完成的请求
- [x] 正确指定 useCallback 和 useMemo 的依赖
- [x] 避免在 Context 中存储敏感信息
- [x] 使用多个 Context 分离不同类型的信息
- [x] 验证组件状态，避免在卸载的组件中更新状态
- [x] 使用 ref 追踪需要清理的资源
- [x] 避免在组件中创建全局副作用

## 📚 最佳实践

1. **使用清理函数**：在 useEffect 中返回清理函数，清理副作用
2. **使用 AbortController**：使用 AbortController 取消未完成的请求
3. **正确指定依赖**：正确指定 useCallback 和 useMemo 的依赖
4. **避免在 Context 中存储敏感信息**：不要在 Context 中存储敏感信息
5. **使用多个 Context**：使用多个 Context 分离不同类型的信息
6. **验证组件状态**：验证组件状态，避免在卸载的组件中更新状态
7. **使用 ref 追踪资源**：使用 ref 追踪需要清理的资源

## 📞 安全资源

- [React 官方文档 - Hooks](https://react.dev/reference/react)
- [Taro 官方文档 - React Hooks](https://docs.taro.zone/docs/react-hooks)
- [OWASP 前端安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Frontend_Web_Application_Security_Cheat_Sheet.html)

## 📝 更新日志

- 2026-02-08：初始版本，添加 React Hooks 安全指南