// Supabase 配置和数据库交互
class SupabaseService {
    constructor() {
        // Supabase 配置 - 需要替换为你的实际配置
        this.supabaseUrl = 'https://ntxkmsuheurrczdfxoax.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eGttc3VoZXVycmN6ZGZ4b2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTk1NDcsImV4cCI6MjA2ODY3NTU0N30.Fyl39b_O0tkLfnJTowOHfOLUw9tXd9O3Sf-f4rRYagw';
        this.supabase = null;
        this.currentSessionId = null;
        
        this.initSupabase();
    }

    async initSupabase() {
        try {
            // 动态导入 Supabase 客户端
            const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
            this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
            console.log('✅ Supabase 客户端初始化成功');
        } catch (error) {
            console.error('❌ Supabase 客户端初始化失败:', error);
        }
    }

    // 获取或生成用户 UUID
    getUserId() {
        let userId = localStorage.getItem('ai_platform_user_id');
        if (!userId) {
            userId = this.generateUUID();
            localStorage.setItem('ai_platform_user_id', userId);
            console.log('🆔 生成新用户 ID:', userId);
        }
        return userId;
    }

    // 生成 UUID
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 创建新的聊天会话
    async createChatSession(conversationId, title = null) {
        if (!this.supabase) {
            console.warn('⚠️ Supabase 未初始化，跳过会话创建');
            return null;
        }

        try {
            const userId = this.getUserId();
            const sessionTitle = title || `学习会话 ${new Date().toLocaleString('zh-CN')}`;

            const { data, error } = await this.supabase
                .from('chat_sessions')
                .insert([{
                    user_id: userId,
                    conversation_id: conversationId,
                    session_title: sessionTitle,
                    total_messages: 0
                }])
                .select()
                .single();

            if (error) throw error;

            this.currentSessionId = data.id;
            console.log('✅ 创建聊天会话:', data.id);
            return data;
        } catch (error) {
            console.error('❌ 创建聊天会话失败:', error);
            return null;
        }
    }

    // 保存消息到数据库
    async saveMessage(messageType, content, files = [], difyMessageId = null) {
        if (!this.supabase || !this.currentSessionId) {
            console.warn('⚠️ Supabase 未初始化或无会话 ID，跳过消息保存');
            return null;
        }

        try {
            const userId = this.getUserId();

            const messageData = {
                session_id: this.currentSessionId,
                user_id: userId,
                message_type: messageType,
                content: content,
                files: files || [],
                dify_message_id: difyMessageId
            };

            const { data, error } = await this.supabase
                .from('chat_messages')
                .insert([messageData])
                .select()
                .single();

            if (error) throw error;

            // 更新会话消息计数
            await this.updateSessionMessageCount();

            console.log(`💾 保存${messageType === 'user' ? '用户' : 'AI'}消息:`, data.id);
            return data;
        } catch (error) {
            console.error('❌ 保存消息失败:', error);
            return null;
        }
    }

    // 更新会话消息计数
    async updateSessionMessageCount() {
        if (!this.supabase || !this.currentSessionId) return;

        try {
            const { count } = await this.supabase
                .from('chat_messages')
                .select('*', { count: 'exact', head: true })
                .eq('session_id', this.currentSessionId);

            await this.supabase
                .from('chat_sessions')
                .update({ total_messages: count })
                .eq('id', this.currentSessionId);

        } catch (error) {
            console.error('❌ 更新消息计数失败:', error);
        }
    }

    // 保存用户档案（学习进度等）
    async saveUserProfile(profileData, learningProgress = {}, preferences = {}) {
        if (!this.supabase) {
            console.warn('⚠️ Supabase 未初始化，跳过档案保存');
            return null;
        }

        try {
            const userId = this.getUserId();

            const { data, error } = await this.supabase
                .from('user_profiles')
                .upsert([{
                    user_id: userId,
                    profile_data: profileData,
                    learning_progress: learningProgress,
                    preferences: preferences
                }])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ 保存用户档案:', data.id);
            return data;
        } catch (error) {
            console.error('❌ 保存用户档案失败:', error);
            return null;
        }
    }

    // 获取用户聊天历史（用于上下文）
    async getUserChatHistory(limit = 10) {
        if (!this.supabase) return [];

        try {
            const userId = this.getUserId();

            const { data, error } = await this.supabase
                .from('chat_messages')
                .select('message_type, content, timestamp')
                .eq('user_id', userId)
                .order('timestamp', { ascending: false })
                .limit(limit);

            if (error) throw error;

            console.log(`📚 获取用户聊天历史: ${data.length} 条消息`);
            return data.reverse(); // 按时间顺序排列
        } catch (error) {
            console.error('❌ 获取聊天历史失败:', error);
            return [];
        }
    }

    // 获取当前会话 ID
    getCurrentSessionId() {
        return this.currentSessionId;
    }

    // 设置当前会话 ID（用于恢复会话）
    setCurrentSessionId(sessionId) {
        this.currentSessionId = sessionId;
    }

    // 获取或创建会话（基于 Dify conversation_id）
    async getOrCreateSession(conversationId) {
        if (!this.supabase) return null;

        try {
            const userId = this.getUserId();

            // 先尝试查找现有会话
            const { data: existingSession } = await this.supabase
                .from('chat_sessions')
                .select('*')
                .eq('user_id', userId)
                .eq('conversation_id', conversationId)
                .single();

            if (existingSession) {
                this.currentSessionId = existingSession.id;
                console.log('🔄 恢复现有会话:', existingSession.id);
                return existingSession;
            } else {
                // 创建新会话
                return await this.createChatSession(conversationId);
            }
        } catch (error) {
            console.error('❌ 获取或创建会话失败:', error);
            // 如果查询失败，尝试创建新会话
            return await this.createChatSession(conversationId);
        }
    }

    // 导出聊天记录（用于分析和优化）
    async exportChatData(startDate = null, endDate = null) {
        if (!this.supabase) return null;

        try {
            let query = this.supabase
                .from('chat_overview')
                .select('*');

            if (startDate) {
                query = query.gte('session_created_at', startDate);
            }
            if (endDate) {
                query = query.lte('session_created_at', endDate);
            }

            const { data, error } = await query;
            if (error) throw error;

            console.log(`📊 导出聊天数据: ${data.length} 个会话`);
            return data;
        } catch (error) {
            console.error('❌ 导出聊天数据失败:', error);
            return null;
        }
    }
} 