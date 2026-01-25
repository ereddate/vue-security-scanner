// Malicious File Upload 漏洞示例文件

// 示例 1: 缺少文件类型验证
export function maliciousFileUploadExample1() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    // 危险：没有验证文件类型，允许上传任意文件
    const file = req.file;
    res.json({ message: 'File uploaded successfully', filename: file.filename });
  });
  
  return app;
}

// 示例 2: 仅依赖文件扩展名验证
export function maliciousFileUploadExample2() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const allowedExtensions = ['.jpg', '.png', '.gif'];
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));
    
    // 危险：仅检查扩展名，攻击者可以伪造扩展名
    if (allowedExtensions.includes(fileExtension)) {
      res.json({ message: 'File uploaded successfully' });
    } else {
      res.status(400).json({ error: 'Invalid file type' });
    }
  });
  
  return app;
}

// 示例 3: 缺少文件内容验证
export function maliciousFileUploadExample3() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    
    // 危险：没有验证文件内容，可以上传恶意脚本
    if (file.mimetype.startsWith('image/')) {
      res.json({ message: 'File uploaded successfully' });
    } else {
      res.status(400).json({ error: 'Invalid file type' });
    }
  });
  
  return app;
}

// 示例 4: 允许上传可执行文件
export function maliciousFileUploadExample4() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const allowedExtensions = ['.jpg', '.png', '.gif', '.exe', '.bat', '.sh'];
    
    // 危险：允许上传可执行文件
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));
    if (allowedExtensions.includes(fileExtension)) {
      res.json({ message: 'File uploaded successfully' });
    } else {
      res.status(400).json({ error: 'Invalid file type' });
    }
  });
  
  return app;
}

// 示例 5: 缺少文件大小限制
export function maliciousFileUploadExample5() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    
    // 危险：没有文件大小限制，可以上传超大文件导致DoS
    res.json({ message: 'File uploaded successfully', size: file.size });
  });
  
  return app;
}

// 示例 6: 上传到可执行目录
export function maliciousFileUploadExample6() {
  const express = require('express');
  const multer = require('multer');
  const path = require('path');
  const app = express();
  
  const upload = multer({ dest: 'public/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    
    // 危险：上传到public目录，可以直接访问执行
    const filePath = path.join('public', file.filename);
    res.json({ message: 'File uploaded successfully', url: `/public/${file.filename}` });
  });
  
  return app;
}

// 示例 7: 缺少文件名清理
export function maliciousFileUploadExample7() {
  const express = require('express');
  const multer = require('multer');
  const fs = require('fs');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    
    // 危险：使用原始文件名，可能导致路径遍历
    const newPath = `uploads/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    
    res.json({ message: 'File uploaded successfully', path: newPath });
  });
  
  return app;
}

// 示例 8: WebShell 上传
export function maliciousFileUploadExample8() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    
    // 危险：允许上传PHP文件，可能包含WebShell
    if (file.originalname.endsWith('.php')) {
      res.json({ message: 'PHP file uploaded', url: `/uploads/${file.filename}` });
    } else {
      res.status(400).json({ error: 'Invalid file type' });
    }
  });
  
  return app;
}

// 示例 9: 缺少病毒扫描
export function maliciousFileUploadExample9() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    
    // 危险：没有进行病毒扫描
    res.json({ message: 'File uploaded successfully' });
  });
  
  return app;
}

// 示例 10: 允许上传双扩展名文件
export function maliciousFileUploadExample10() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  
  const upload = multer({ dest: 'uploads/' });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    
    // 危险：允许双扩展名文件，如 image.jpg.php
    if (file.originalname.match(/\.(jpg|png|gif)$/)) {
      res.json({ message: 'File uploaded successfully' });
    } else {
      res.status(400).json({ error: 'Invalid file type' });
    }
  });
  
  return app;
}
