-- AI学习平台 - Supabase 数据库表结构

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_uuid VARCHAR(255) UNIQUE NOT NULL, -- 前端生成的用户UUID
    user_profile JSONB, -- 用户问卷答案和基本信息
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_messages INTEGER DEFAULT 0, -- 总消息数
    completed_lessons TEXT[], -- 已完成的课程ID数组
    preferences JSONB DEFAULT '{}' -- 用户偏好设置
);

-- 2. 对话会话表
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dify_conversation_id VARCHAR(255), -- Dify的会话ID
    title VARCHAR(500), -- 会话标题（可由AI生成）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}' -- 额外的元数据
);

-- 3. 聊天消息表
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'ai')), -- 消息类型
    content TEXT NOT NULL, -- 消息内容
    files JSONB DEFAULT '[]', -- 附件信息数组
    lesson_context VARCHAR(50), -- 当前课程上下文（如 '1.1'）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}', -- 额外信息（如AI模型版本、响应时间等）
    
    -- 为常用查询添加索引
    INDEX idx_chat_messages_user_id (user_id),
    INDEX idx_chat_messages_conversation_id (conversation_id),
    INDEX idx_chat_messages_created_at (created_at),
    INDEX idx_chat_messages_lesson_context (lesson_context)
);

-- 4. 学习分析表（用于AI个性化和数据分析）
CREATE TABLE IF NOT EXISTS learning_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 事件类型：lesson_start, lesson_complete, question_asked, etc.
    lesson_id VARCHAR(50), -- 课程ID
    event_data JSONB DEFAULT '{}', -- 事件详细数据
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_learning_analytics_user_id (user_id),
    INDEX idx_learning_analytics_event_type (event_type),
    INDEX idx_learning_analytics_lesson_id (lesson_id)
);

-- 5. Q&A知识库表（从聊天记录生成）
CREATE TABLE IF NOT EXISTS qa_knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100), -- 分类（如课程相关、技术问题等）
    lesson_context VARCHAR(50), -- 相关课程
    confidence_score DECIMAL(3,2) DEFAULT 0.8, -- 置信度
    usage_count INTEGER DEFAULT 0, -- 被引用次数
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'review')),
    
    -- 全文搜索索引
    INDEX idx_qa_knowledge_base_question (question),
    INDEX idx_qa_knowledge_base_category (category)
);

-- 启用行级安全策略（RLS）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_knowledge_base ENABLE ROW LEVEL SECURITY;

-- 创建安全策略（允许匿名用户访问自己的数据）
CREATE POLICY "用户只能访问自己的数据" ON users FOR ALL USING (user_uuid = current_setting('app.current_user_uuid', true));
CREATE POLICY "用户只能访问自己的对话" ON conversations FOR ALL USING (user_id IN (SELECT id FROM users WHERE user_uuid = current_setting('app.current_user_uuid', true)));
CREATE POLICY "用户只能访问自己的消息" ON chat_messages FOR ALL USING (user_id IN (SELECT id FROM users WHERE user_uuid = current_setting('app.current_user_uuid', true)));
CREATE POLICY "用户只能访问自己的分析数据" ON learning_analytics FOR ALL USING (user_id IN (SELECT id FROM users WHERE user_uuid = current_setting('app.current_user_uuid', true)));
CREATE POLICY "Q&A知识库对所有人可读" ON qa_knowledge_base FOR SELECT USING (true);

-- 创建函数：更新用户最后活跃时间
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET last_active = NOW(), 
        total_messages = total_messages + 1,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器：当添加新消息时更新用户活跃状态
CREATE TRIGGER trigger_update_user_last_active
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_user_last_active();

-- 创建函数：更新对话消息数量
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET message_count = message_count + 1,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器：当添加新消息时更新对话消息数
CREATE TRIGGER trigger_update_conversation_message_count
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_message_count();

-- 创建视图：用户统计信息
CREATE VIEW user_stats AS
SELECT 
    u.user_uuid,
    u.created_at as registered_at,
    u.last_active,
    u.total_messages,
    u.completed_lessons,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(DISTINCT CASE WHEN cm.message_type = 'user' THEN cm.id END) as user_messages,
    COUNT(DISTINCT CASE WHEN cm.message_type = 'ai' THEN cm.id END) as ai_responses,
    COALESCE(ARRAY_AGG(DISTINCT cm.lesson_context) FILTER (WHERE cm.lesson_context IS NOT NULL), '{}') as discussed_lessons
FROM users u
LEFT JOIN conversations c ON c.user_id = u.id
LEFT JOIN chat_messages cm ON cm.user_id = u.id
GROUP BY u.id, u.user_uuid, u.created_at, u.last_active, u.total_messages, u.completed_lessons;

-- 插入示例数据（可选，用于测试）
INSERT INTO qa_knowledge_base (question, answer, category, lesson_context) VALUES 
('如何开始学习AI？', '建议从Day1的顶级AI巡礼开始，先了解各种AI工具的基本功能和应用场景。', '入门指导', '1.1'),
('AI创富的核心是什么？', '核心在于掌握AI工具的使用技巧，找到适合的商业场景，并持续优化工作流程。', '商业指导', 'general'),
('学习遇到困难怎么办？', '可以：1）重复观看课程材料 2）在聊天中向AI助教提问 3）参考同学作业案例 4）分步骤练习', '学习方法', 'general'); 