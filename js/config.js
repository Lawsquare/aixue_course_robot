// 配置文件 - 用于加载环境变量
class Config {
    constructor() {
        // 默认使用占位符，实际值将通过服务器端环境变量提供
        this.supabaseUrl = '';
        this.supabaseKey = '';
        
        this.loadConfig();
    }
    
    async loadConfig() {
        try {
            // 从服务器获取配置（Netlify Functions）
            const response = await fetch('/.netlify/functions/config');
            if (response.ok) {
                const config = await response.json();
                this.supabaseUrl = config.supabaseUrl;
                this.supabaseKey = config.supabaseKey;
                console.log('✅ 配置加载成功');
            } else {
                console.error('❌ 配置加载失败:', response.statusText);
                this.loadFallbackConfig();
            }
        } catch (error) {
            console.error('❌ 配置加载错误:', error);
            this.loadFallbackConfig();
        }
    }
    
    // 仅在开发环境使用的备用配置
    loadFallbackConfig() {
        console.warn('⚠️ 使用备用配置 - 仅用于开发环境');
        // 这里不包含实际密钥，只是占位符
        this.supabaseUrl = window.SUPABASE_URL || '';
        this.supabaseKey = window.SUPABASE_KEY || '';
    }
    
    getSupabaseUrl() {
        return this.supabaseUrl;
    }
    
    getSupabaseKey() {
        return this.supabaseKey;
    }
}

// 导出配置实例
const config = new Config();
export default config;