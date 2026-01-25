// SSR Injection 漏洞示例文件

// 示例 1: 使用 renderToString 进行服务器端渲染
export function ssrInjectionExample1(context) {
  const { req, res, url } = context;
  const userProvidedData = req.query.data;
  const rendered = renderToString(userProvidedData);
  res.send(rendered);
}

// 示例 2: 使用 renderToStaticMarkup 进行服务器端渲染
export function ssrInjectionExample2(context) {
  const { req, res, query } = context;
  const userProvidedData = query.input;
  const rendered = renderToStaticMarkup(userProvidedData);
  res.send(rendered);
}

// 示例 3: 使用 renderToNodeStream 进行服务器端渲染
export function ssrInjectionExample3(context) {
  const { req, res, params } = context;
  const userProvidedData = params.content;
  const stream = renderToNodeStream(userProvidedData);
  stream.pipe(res);
}

// 示例 4: 在 Nuxt.js 中使用 SSR 渲染
export async function ssrInjectionExample4({ route, req }) {
  const userParam = route.params.id;
  const userData = await fetchUserData(userParam);
  return {
    html: renderToString(userData),
    head: `<title>${userParam}</title>`
  };
}

// 示例 5: 使用 Vue 3 的 SSR 功能
export async function ssrInjectionExample5(request) {
  const userInput = request.url.searchParams.get('input');
  const app = createApp({
    template: `<div>${userInput}</div>`
  });
  const html = await renderToString(app);
  return html;
}

// 示例 6: 不安全的 SSR 数据传递
export function ssrInjectionExample6(ctx) {
  const data = ctx.request.body;
  const template = `<div>${data.userInput}</div>`;
  ctx.body = renderToString(template);
}

// 示例 7: SSR 模板注入
export function ssrInjectionExample7(req, res) {
  const templatePart = req.query.template;
  const fullTemplate = `<div>${templatePart}</div>`;
  res.send(renderToString(fullTemplate));
}

// 示例 8: 使用 dangerouslySetInnerHTML 在 SSR 中
export function ssrInjectionExample8(props) {
  const userContent = props.content || '';
  return {
    __html: userContent
  };
}

// 示例 9: 不安全的 SSR 上下文数据
export function ssrInjectionExample9(context) {
  const unsafeData = context.state.unsafeInput;
  const app = createApp({
    data() {
      return {
        content: unsafeData
      };
    }
  });
  return renderToString(app);
}

// 示例 10: SSR 服务端模板注入
export async function ssrInjectionExample10(request, response) {
  const templateString = await getTemplateFromRequest(request);
  const rendered = renderToString(templateString);
  response.send(rendered);
}

// 辅助函数模拟 SSR 函数
function renderToString(content) {
  return `<div>${content}</div>`;
}

function renderToStaticMarkup(content) {
  return `<div>${content}</div>`;
}

function renderToNodeStream(content) {
  return { pipe: () => {} };
}

async function fetchUserData(id) {
  return { id, name: `User ${id}` };
}

async function getTemplateFromRequest(request) {
  return request.query.template || '<div>Hello</div>';
}
