# AI学习平台 Supabase 聊天记录集成

## 🚀 **功能概述**

这个项目为 AI 学习平台添加了完整的聊天记录存储和分析功能，使用 Supabase 作为后端数据库，实现了：

### **✅ 已实现功能**

1. **用户身份管理** 
   - 自动生成 UUID 作为用户标识
   - 无需注册登录，本地存储与云端同步

2. **聊天记录存储**
   - 自动保存所有对话到 Supabase
   - 支持文件上传记录（图片等）
   - 与 Dify conversation_id 关联

3. **个性化 AI 对话**
   - 传递用户历史聊天上下文给 AI
   - 包含用户学习进度和当前课程信息
   - 提供更连贯和个性化的 AI 回答

4. **学习进度跟踪**
   - 自动同步课程完成状态
   - 问卷调查结果存储
   - 用户偏好和学习目标记录

5. **数据分析工具**
   - 用户行为分析
   - 常见问题分类
   - Q&A 数据集生成
   - 数据导出功能

## 📁 **文件结构**

```
├── index.html              # 主页面（已更新引入 Supabase）
├── js/
│   ├── app.js              # 主应用逻辑（已集成 Supabase）
│   └── supabase.js         # Supabase 服务类
├── css/
│   └── styles.css          # 样式文件（已添加动画）
├── supabase_setup.sql      # 数据库表结构创建脚本
├── supabase-config.md      # Supabase 配置指南
├── dify-config.md          # Dify 配置指南
├── data-analysis.html      # 数据分析工具页面
└── README-Supabase.md      # 本文件
```

## 🔧 **快速开始**

### **1. Supabase 配置**

1. 创建 Supabase 项目
2. 执行 `supabase_setup.sql` 创建数据表
3. 更新 `js/supabase.js` 中的 URL 和 Key
4. 详细步骤见 `supabase-config.md`

### **2. Dify 配置**

1. 在 Dify 中配置输入变量：`user_id`, `current_lesson`, `learning_progress`
2. 更新系统提示词以利用这些变量
3. 详细配置见 `dify-config.md`

### **3. 测试功能**

1. 打开网页，填写问卷
2. 发送消息测试 AI 对话
3. 检查浏览器控制台日志
4. 在 Supabase 中查看存储的数据

## 📊 **数据库架构**

### **表结构**

```sql
chat_sessions       # 聊天会话
├── id (UUID)       # 主键
├── user_id         # 用户 UUID
├── conversation_id # Dify 对话 ID
├── session_title   # 会话标题
└── total_messages  # 消息总数

chat_messages       # 聊天消息
├── id (UUID)       # 主键
├── session_id      # 会话 ID
├── user_id         # 用户 UUID
├── message_type    # 'user' 或 'assistant'
├── content         # 消息内容
├── files (JSONB)   # 附件文件
└── timestamp       # 时间戳

user_profiles       # 用户档案
├── id (UUID)       # 主键
├── user_id         # 用户 UUID（唯一）
├── profile_data    # 档案数据（JSONB）
├── learning_progress # 学习进度（JSONB）
└── preferences     # 用户偏好（JSONB）
```

## 🎯 **数据流程**

```
用户发送消息
    ↓
前端获取历史聊天记录（Supabase）
    ↓
构建增强消息（消息 + 上下文 + 学习进度）
    ↓
发送到 Dify API
    ↓
接收 AI 回复
    ↓
同时保存用户消息和 AI 回复到 Supabase
```

## 💡 **核心特性**

### **个性化上下文**
- 每次 AI 对话都包含用户的最近 10 条聊天记录
- 传递用户的学习进度和当前课程信息
- AI 可以基于历史对话提供更连贯的回答

### **数据隐私保护**
- 使用 UUID 而非真实身份
- 无需注册登录系统
- 数据仅用于改进学习体验
- 符合最小化数据收集原则

### **实时同步**
- 聊天记录实时保存到云端
- 学习进度自动同步
- 支持多设备数据一致性

## 📈 **数据分析**

使用 `data-analysis.html` 可以：

1. **用户行为分析**
   - 最活跃用户统计
   - 消息频率分析
   - 学习路径追踪

2. **内容分析**
   - 常见问题分类
   - 问题类型统计
   - 回答质量评估

3. **数据导出**
   - JSON/CSV 格式导出
   - Q&A 数据集生成
   - 用于训练数据准备

## 🔍 **调试技巧**

### **检查连接状态**
```javascript
// 在浏览器控制台中检查
console.log(window.aiPlatform.supabaseService);
console.log(window.aiPlatform.currentUserId);
```

### **查看日志**
- ✅ 表示成功操作
- ❌ 表示失败操作
- 💾 表示数据保存操作
- 📚 表示数据检索操作

### **常见问题**
1. **连接失败**: 检查 URL 和 Key 配置
2. **数据不保存**: 确认表结构正确创建
3. **上下文不生效**: 检查消息格式和 Dify 配置

## 🚀 **扩展可能**

### **短期优化**
- [ ] 添加消息搜索功能
- [ ] 实现对话摘要
- [ ] 优化上下文长度控制
- [ ] 添加数据备份功能

### **中期发展**
- [ ] 智能问题推荐
- [ ] 学习效果评估
- [ ] 个性化学习路径
- [ ] 多语言支持

### **长期规划**
- [ ] AI 模型微调
- [ ] 知识图谱构建
- [ ] 智能课程生成
- [ ] 社区功能集成

## ⚙️ **技术栈**

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **数据库**: Supabase (PostgreSQL)
- **AI 平台**: Dify
- **文件存储**: Supabase Storage
- **部署**: 静态托管（Netlify/Vercel）

## 📞 **支持与反馈**

如果在使用过程中遇到问题：

1. 查看浏览器控制台错误信息
2. 检查 Supabase 项目日志
3. 参考配置指南文档
4. 使用数据分析工具排查

## 📄 **许可证**

本项目为学习目的创建，请遵循相应的使用条款。 