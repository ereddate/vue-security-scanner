// File Inclusion 漏洞示例文件

// 示例 1: 本地文件包含 (LFI)
export function fileInclusionExample1() {
  const express = require('express');
  const fs = require('fs');
  const app = express();
  
  app.get('/page', (req, res) => {
    const page = req.query.page;
    // 危险：直接包含用户指定的文件
    const content = fs.readFileSync(`pages/${page}.html`, 'utf8');
    res.send(content);
  });
  
  return app;
}

// 示例 2: 远程文件包含 (RFI)
export function fileInclusionExample2() {
  const express = require('express');
  const request = require('request');
  const app = express();
  
  app.get('/include', (req, res) => {
    const url = req.query.url;
    // 危险：包含远程文件
    request(url, (error, response, body) => {
      res.send(body);
    });
  });
  
  return app;
}

// 示例 3: 路径遍历文件包含
export function fileInclusionExample3() {
  const express = require('express');
  const fs = require('fs');
  const app = express();
  
  app.get('/view', (req, res) => {
    const file = req.query.file;
    // 危险：路径遍历攻击
    const content = fs.readFileSync(file, 'utf8');
    res.send(content);
  });
  
  return app;
}

// 示例 4: 动态包含
export function fileInclusionExample4() {
  const express = require('express');
  const app = express();
  
  app.get('/module', (req, res) => {
    const module = req.query.module;
    // 危险：动态加载模块
    const loadedModule = require(`./modules/${module}`);
    res.json(loadedModule.getData());
  });
  
  return app;
}

// 示例 5: 模板文件包含
export function fileInclusionExample5() {
  const express = require('express');
  const fs = require('fs');
  const app = express();
  
  app.get('/template', (req, res) => {
    const template = req.query.template;
    // 危险：包含模板文件
    const templateContent = fs.readFileSync(`templates/${template}`, 'utf8');
    res.render(templateContent, { data: req.query });
  });
  
  return app;
}

// 示例 6: 配置文件包含
export function fileInclusionExample6() {
  const express = require('express');
  const fs = require('fs');
  const app = express();
  
  app.get('/config', (req, res) => {
    const config = req.query.config;
    // 危险：包含配置文件
    const configContent = fs.readFileSync(`configs/${config}.json`, 'utf8');
    res.json(JSON.parse(configContent));
  });
  
  return app;
}

// 示例 7: 日志文件包含
export function fileInclusionExample7() {
  const express = require('express');
  const fs = require('fs');
  const app = express();
  
  app.get('/logs', (req, res) => {
    const logFile = req.query.file;
    // 危险：包含日志文件
    const logContent = fs.readFileSync(`logs/${logFile}`, 'utf8');
    res.send(`<pre>${logContent}</pre>`);
  });
  
  return app;
}

// 示例 8: 上传文件包含
export function fileInclusionExample8() {
  const express = require('express');
  const multer = require('multer');
  const fs = require('fs');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    // 危险：包含上传的文件
    const content = fs.readFileSync(file.path, 'utf8');
    res.send(content);
  });
  
  return app;
}

// 示例 9: 备份文件包含
export function fileInclusionExample9() {
  const express = require('express');
  const fs = require('fs');
  const app = express();
  
  app.get('/backup', (req, res) => {
    const backup = req.query.backup;
    // 危险：包含备份文件
    const backupContent = fs.readFileSync(`backups/${backup}`, 'utf8');
    res.send(backupContent);
  });
  
  return app;
}

// 示例 10: 环境变量文件包含
export function fileInclusionExample10() {
  const express = require('express');
  const fs = require('fs');
  const app = express();
  
  app.get('/env', (req, res) => {
    const envFile = req.query.env;
    // 危险：包含环境变量文件
    const envContent = fs.readFileSync(`.env.${envFile}`, 'utf8');
    res.send(`<pre>${envContent}</pre>`);
  });
  
  return app;
}
