const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

const upload = multer({ dest: './public/uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filename = req.file.originalname;
  const filepath = path.join(uploadDir, filename);
  
  res.json({ success: true, filename });
});

app.post('/upload-no-validation', (req, res) => {
  const { file } = req.files;
  const filename = file.name;
  const filepath = path.join('./uploads', filename);
  
  res.json({ success: true });
});

app.post('/upload-path-traversal', (req, res) => {
  const filename = req.body.filename;
  const filepath = path.join(uploadDir, filename);
  
  res.json({ success: true, filepath });
});

app.post('/upload-executable', (req, res) => {
  const file = req.file;
  
  if (file.mimetype === 'application/x-msdownload' || 
      file.mimetype === 'application/x-sh' ||
      file.mimetype === 'application/x-executable') {
    return res.status(400).json({ error: 'Executable files not allowed' });
  }
  
  res.json({ success: true });
});

app.post('/upload-webshell', (req, res) => {
  const file = req.file;
  const filename = file.originalname;
  
  if (filename.endsWith('.php') || filename.endsWith('.jsp') || filename.endsWith('.asp')) {
    return res.status(400).json({ error: 'Webshell files not allowed' });
  }
  
  res.json({ success: true });
});

app.post('/upload-large-file', (req, res) => {
  const upload = multer({ 
    dest: './uploads/',
    limits: { fileSize: 10000000000 }
  });
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

app.post('/upload-no-size-limit', (req, res) => {
  const upload = multer({ dest: './uploads/' });
  
  upload.single('file')(req, res, (err) => {
    res.json({ success: true });
  });
});

app.post('/upload-public-dir', (req, res) => {
  const upload = multer({ dest: './public/uploads/' });
  
  upload.single('file')(req, res, (err) => {
    res.json({ success: true });
  });
});

app.post('/upload-webroot', (req, res) => {
  const upload = multer({ dest: './www/uploads/' });
  
  upload.single('file')(req, res, (err) => {
    res.json({ success: true });
  });
});

app.post('/upload-no-extension-check', (req, res) => {
  const file = req.file;
  const filename = file.originalname;
  
  res.json({ success: true, filename });
});

app.post('/upload-allow-all', (req, res) => {
  const allowedExtensions = ['*'];
  const file = req.file;
  const filename = file.originalname;
  const ext = path.extname(filename);
  
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ error: 'File type not allowed' });
  }
  
  res.json({ success: true });
});

app.post('/upload-no-mimetype-check', (req, res) => {
  const file = req.file;
  const filename = file.originalname;
  
  res.json({ success: true, filename });
});

app.post('/upload-mimetype-spoof', (req, res) => {
  const file = req.file;
  const mimetype = file.mimetype;
  const filename = mimetype + filename;
  
  res.json({ success: true, filename });
});

app.post('/upload-no-virus-scan', (req, res) => {
  const file = req.file;
  const filename = file.originalname;
  
  res.json({ success: true, filename });
});

module.exports = app;
