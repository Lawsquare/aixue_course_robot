// 简单的 Node.js 服务器，用于安全地提供 Supabase 配置
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
require('dotenv').config(); // 加载 .env 文件中的环境变量

// 定义服务器端口
const PORT = process.env.PORT || 3000; // 使用3000端口避免与现有服务器冲突

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 解析请求 URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // 设置 CORS 头，允许所有来源访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理 OPTIONS 请求（预检请求）
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; // No Content
    res.end();
    return;
  }
  
  // 处理 API 请求
  if (pathname === '/api/config') {
    // 设置响应头
    res.setHeader('Content-Type', 'application/json');
    
    // 返回配置信息（从环境变量中获取）
    const config = {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || ''
    };
    
    res.statusCode = 200;
    res.end(JSON.stringify(config));
    return;
  }
  
  // 处理静态文件请求
  // 如果请求根路径，默认返回 index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // 构建文件路径
  const filePath = path.join(__dirname, pathname);
  
  // 读取文件
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 文件不存在或读取错误
      res.statusCode = 404;
      res.end('文件未找到');
      return;
    }
    
    // 获取文件扩展名
    const ext = path.extname(filePath);
    
    // 设置响应头
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'text/plain');
    res.statusCode = 200;
    res.end(data);
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}/`);
  console.log(`环境变量加载状态: SUPABASE_URL ${process.env.SUPABASE_URL ? '已加载' : '未加载'}`);
});