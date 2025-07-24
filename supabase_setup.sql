-- 聊天记录表
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_title TEXT,
  total_messages INTEGER DEFAULT 0
);

-- 消息表
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant')),
  content TEXT NOT NULL,
  files JSONB DEFAULT '[]'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dify_message_id TEXT,
  tokens_used INTEGER DEFAULT 0
);

-- 用户档案表（可选，存储用户偏好和学习进度）
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  profile_data JSONB DEFAULT '{}'::jsonb,
  learning_progress JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_conversation_id ON chat_sessions(conversation_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- RLS (Row Level Security) 策略
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（因为我们使用 UUID 而不是认证系统）
-- 注意：在生产环境中可能需要更严格的策略
CREATE POLICY "Enable all operations for chat_sessions" ON chat_sessions FOR ALL USING (true);
CREATE POLICY "Enable all operations for chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Enable all operations for user_profiles" ON user_profiles FOR ALL USING (true);

-- 创建函数：更新 updated_at 时间戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 创建视图：聊天记录概览
CREATE VIEW chat_overview AS
SELECT 
  cs.id as session_id,
  cs.user_id,
  cs.conversation_id,
  cs.session_title,
  cs.total_messages,
  cs.created_at as session_created_at,
  cs.updated_at as last_activity,
  COUNT(cm.id) as actual_message_count,
  MAX(cm.timestamp) as last_message_time
FROM chat_sessions cs
LEFT JOIN chat_messages cm ON cs.id = cm.session_id
GROUP BY cs.id, cs.user_id, cs.conversation_id, cs.session_title, cs.total_messages, cs.created_at, cs.updated_at; 