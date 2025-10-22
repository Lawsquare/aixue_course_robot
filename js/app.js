// 导入 SupabaseService 类
import { SupabaseService } from './supabase.js';

// AI创富营学习平台 - 主应用逻辑
class AILearningPlatform {
    constructor() {
        this.currentLesson = null;
        this.userProfile = null;
        this.completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
        this.difyApiKey = 'app-1RHYhhlsadlAe9x3FZBcMvZj'; // 从aboutapi文件获取
        this.difyApiUrl = 'https://pro.aifunbox.com/v1';
        this.conversationId = localStorage.getItem('difyConversationId') || null;
        this.uploadedFiles = []; // 存储已上传的文件信息
        
        // 初始化 Supabase 服务
        this.supabaseService = new SupabaseService();
        this.currentUserId = this.supabaseService.getUserId();
        
        this.lessonData = {
            '1.1': {
                title: 'Day1 顶级AI巡礼',
                description: '体验和感受当下最前沿的AI工具能力，开启AI创富之旅',
                materials: [
                    { title: '《课前资料》', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/MqDqwp5D0ijXIykl7bSc7KCrnmc' },
                    { title: '《顶级AI巡礼》', url: 'https://htjxcky601.feishu.cn/docx/D1BBdKC6LoMTigxdfJLc6XfDn7b' },
                    { title: '《迎接我们的"神人"时代》', url: 'https://wcntmlbovrgg.feishu.cn/wiki/YwGMwMGeCiQmcgk1Amqc7eqQnpg' },
                    { title: '《课程骨架详解》', url: 'https://htjxcky601.feishu.cn/docx/A5GldBT4BoAzsIxpjBZc0P0nnAf' },
                    { title: '《一句话生成AI游戏》', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/QbWVwxZvXihCfUkPhnqcYj0Bnrc' },
                    { title: '《一句话商业级网站》', url: 'https://wcntmlbovrgg.feishu.cn/wiki/FgrJwG8STiAxIjkPRq3cnVO6nMd' },
                    { title: '《大模型即产品》', url: 'https://htjxcky601.feishu.cn/docx/GVbhdSZU1o0yo5xmlclcLxFNngg' },
                    { title: '《AI全行业搜索＋ppt生成》', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/Qb4CwBEO1i7TFukgTLqc1v8Jncd' },
                    { title: '《虚拟ip出道的全流程》', url: 'https://htjxcky601.feishu.cn/docx/FHpidu1z7oYJASxzvlYc1pvknIf' },
                    { title: '《AI知识库 (NotebookLM)》', url: 'https://ui6t5revpkk.feishu.cn/docx/FTa9d9NbvoZej7xdFz6ciMqcnQe' },
                    { title: '《Ai营销矩阵工作流》', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/TwHVw7DRQitIIukRsekchF1NnTg' },
                    { title: '《前沿AI应用趋势展示》', url: 'https://htjxcky601.feishu.cn/docx/D1BBdKC6LoMTigxdfJLc6XfDn7b' }
                ],
                homework: [
                    '【必做】提交你的"三项全能"作品集： - 完成案例一，案例二，案例三，将生成的商业网站截图、NotebookLM案例、以及ai视频/绘画二选一，三张图放在一起提交。',
                    '【必做】"遇事不决问 AI"打卡： - 在本周接下来的学习或生活中，遇到任何一个你觉得可以用 AI 解决的问题（无论是写邮件、想点子还是查资料），请先尝试问 AI。将你的问题和 AI 的回答截图，并发到作业区。',
                    '【进阶】把其他案例里按照教程做完'
                ]
            },
            '1.2': {
                title: 'Day2 AI时代必掌握三大心法',
                description: '掌握提示词五步心法、痛点翻译和解决问题路径规划',
                materials: [
                    { title: '《AI时代必掌握三大心法》（上午）', url: 'https://htjxcky601.feishu.cn/docx/P3JMdeOy4oEbcWxorQmcDiTLnCf' },
                    { title: '《AI时代必掌握三大心法》（下午）', url: 'https://htjxcky601.feishu.cn/docx/LJoodn8oxorIQSxpTrTcDzGHnkg' },
                    { title: '《把AI融合进我们的大脑——三大心法》', url: 'https://wcntmlbovrgg.feishu.cn/wiki/ZfemwicrhiD45EkfqCocP3yfnkg' },
                    { title: '《思维熔炉激活游戏》', url: 'https://htjxcky601.feishu.cn/docx/VDEMdi23Qotv5rxLifwct2c7noN' }
                ],
                homework: [
                    '【必做】与AI探讨出你的"新人生地图"',
                    '【必做】从你的工作或生活中选择一个最近正困扰你的、有点复杂的真实问题，并通过AI找到解决路径。',
                    '【选做】提交一张标有A点和B点的个人"AI能力坐标图"。',
                    '【选做】一份简短的商业机会分析报告（1-2页），包含机会描述、解决方案构想和商业模式创新三个部分。',
                    '【选做】一份清晰的"AI工作流"图或文字描述，最终的产出物（如：营销海报、学习计划表）。',
                    '【选做】一个5分钟的项目路演PPT,包含一个可演示的产品原型（或SOP），以及一份包含真实用户反馈的记录。'
                ]
            },
            '1.3': {
                title: 'Day3 发现身边的商业机会',
                description: '学会寻找痛点、识别痛点、催生产品的全套方法论',
                materials: [
                    { title: '《发现我们身边的商机》', url: 'https://wcntmlbovrgg.feishu.cn/wiki/EOosw17mHixalWkw30NcZ0ybnnc' },
                    { title: '《周末48小时，开启你的百万生意》', url: 'https://100weekend.netlify.app/' },
                    { title: '《终极AI产品顾问》', url: 'https://aitina.netlify.app' },
                    { title: '《一句话生成商业级网站》', url: 'https://wcntmlbovrgg.feishu.cn/wiki/FgrJwG8STiAxIjkPRq3cnVO6nMd' },
                    { title: '《百万周末》', url: 'https://48hcoach.netlify.app' }
                ],
                homework: [
                    '【必做】提交你的一个有人愿意付费的网站，发布到netlify上，把网站地址提交到今日作业上，将作业按照要求提交到作业提交区。',
                    '【选做】提交你的"48小时创业行动计划。'
                ]
            },
            '1.4': {
                title: 'Day4 打造你的AI智能体助手',
                description: '制作并发布自己的AI金牌客服，完成智能体上线全流程',
                materials: [
                    { title: '《打造你的AI智能体助手》', url: 'https://htjxcky601.feishu.cn/docx/BNHXde5cJo2SQ9xOdP0ciEupn8c' }
                ],
                homework: [
                    '【必做】学员根据上课内容完成任意一个小微智能体的上线。',
                    '【进阶选做】学员根据前几天想的产品点子为自己做一个智能体客服，上线小微智能体。'
                ]
            },
            '1.5': {
                title: 'Day5 打造你的AI全员工工作流',
                description: '学会改造工作流模板，制作个性化营销视频',
                materials: [
                    { title: '《一键爆款历史讲解视频》', url: 'https://htjxcky601.feishu.cn/docx/JoFhdzaaAo9KMzxzId9cpeOTnNf' },
                    { title: '《Ai营销矩阵工作流》', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/TwHVw7DRQitIIukRsekchF1NnTg' },
                    { title: '《Ai营销矩阵工作流-实操》（上午）', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/LXdIwn3VxiRq2fkn7KEcR8XAnNh' },
                    { title: '《Ai营销矩阵工作流-实操》（下午）', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/AYCswUfQPikb9ok7SVLcxCOin7f' }
                ],
                homework: [
                    '【必做】成功使用"一键生成历史讲解视频工作流"生成一条视频。',
                    '【必做】成功使用"一键拆解小红书账号"完成一次账号拆解分析。',
                    '【必做】成功使用"一键生成小红书图文"完成图文的生成。',
                    '【必做】成功将"历史视频工作流"复制到自己的空间并修改参数，生成有差异化的视频内容。',
                    '【必做】成功将"一键拆解小红书账号工作流"复制到自己的空间。',
                    '【必做】成功将"一键生成小红书图文工作流"复制到自己的空间。',
                    '【进阶】在"加餐"的工作流中将2个其他的工作流复制到自己的个人空间，并修改成自己的参数并生成内容。'
                ]
            },
            '1.6': {
                title: 'Day6 设计AI创富蓝图 & AI全球化之路',
                description: '规划个人商业模式和海外IP方案，开启全球化思维',
                materials: [
                    { title: '《"AI创富蓝图"规划工作坊》', url: 'https://htjxcky601.feishu.cn/docx/PXRLdk9y1o8NqPxVLlFctKOInXg' },
                    { title: '《开启你的AI全球化之路》', url: 'https://htjxcky601.feishu.cn/docx/VBItda8WZop3SUxXqmWTGeGnCd' }
                ],
                homework: [
                    '【必做】：请完成前面百万周末48小时创业行动计划。',
                    '【必做】：注册谷歌邮箱。准备好网络环境。',
                    '【必做】：在谷歌浏览器上安装沉浸式翻译和viewstats插件。',
                    '【必做】：打开youtube 先不要登陆，把梯子的节点改为美国，然后看默认推送给你的内容。从中选择一个你最想模仿复刻的赛道和频道。请把频道链接和数据发出来。并认真思考一下自己能否坚持3个月每天发1-2篇像素级别的复刻内容。如果可以就开始准备工具。',
                    '【必做】：youtube 视频下载工具，AI内容创作工具，视频剪辑工具。',
                    '【必做】：最终提交的是一份出海油管创作具体行动计划。'
                ]
            },
            '1.7': {
                title: 'Day7 结营与启航',
                description: '回顾学习成果，分享收获，正式启航AI创富之路',
                materials: [
                    { title: '《出海宝典与出海三件套》', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/L2mQw9WidiN2l1kXeHic1u3Znhf' }
                ],
                homework: [
                    '【必做】完成YouTube账号的注册',
                    '【必做】文字作业。想象自己的作品获得百万/千万/亿级别的播放量的情景！然后自问，你的账号为什么能做到这个高度？',
                    '【必做】用"神器二"分析工具总结10个参考对象的数据，让AI分析出一份报告以及你自己起号的行动指南。'
                ]
            },
            '2.1': {
                title: 'Day8 进阶顶级AI巡礼',
                description: '体验和感受进阶AI工具的震撼效果，开启第二周进阶之旅',
                materials: [
                    { title: '《进阶顶级AI巡礼》（上午）', url: 'https://htjxcky601.feishu.cn/docx/FwtddpL5qolUhyxPcb7cSSZxn8f' },
                    { title: '《进阶顶级AI巡礼》（下午）', url: 'https://htjxcky601.feishu.cn/docx/VVrodBQ9qoo1gNx6I8QchA9EnZc' }
                ],
                homework: [
                    '【必做】安装注册cursor，成功做出一个金句卡片生成器的插件。',
                    '【进阶】思考/直接发布——把浏览器插件发布到谷歌商店并且盈利',
                    '【必做】安装注册dify，创建一个dify机器人（可以是课堂上的案例，也可以是自己的资料）并发布为app链接。',
                    '【必做】完成n8n的本地部署。',
                    '【必做】在Cursor上安装一个可以访问数据库的MCP服务：Supabase MCP。'
                ]
            },
            '2.2': {
                title: 'Day9 我的第一个AI应用诞生！',
                description: '90分钟冲刺赛，用Coze创建个人特色的MVP原型',
                materials: [
                    { title: '《扣子应用教程》', url: 'https://ui6t5revpkk.feishu.cn/docx/H2CZduQ40oObiuxGTHvcS0Sonhe' }
                ],
                homework: [
                    '作业1（必做）：改编课程案例',
                    '作业2（必做）：复制改编官方其他模板',
                    '作业3（进阶选做）：做自己产品相关的应用 改编官方其他模板或者自己完全新建一个自己的应用'
                ]
            },
            '2.3': {
                title: 'Day10 小程序——UI与功能篇',
                description: '使用AI工具进行功能拆解，用Cursor完成精美UI界面设计',
                materials: [
                    { title: '《AI编程打造AI产品——UI篇》', url: 'https://htjxcky601.feishu.cn/docx/X2uAddw06o0HhTxL19PcQs7gnHL' }
                ],
                homework: [
                    '【必做】成功做出课堂上模板的小程序的前端ui界面，作业截图要能看到微信开发者工具的界面。',
                    '【进阶】做出自己产品的小程序前端UI界面，作业截图要能看到微信开发者工具的界面。'
                ]
            },
            '2.4': {
                title: 'Day11 小程序——接入API',
                description: '学习API概念，将Dify API接口接入到Cursor小程序项目中',
                materials: [
                    { title: '《AI编程打造AI产品——功能篇》', url: 'https://htjxcky601.feishu.cn/docx/TKYDdBEdCoFhSMxFXKdcSwptnYc' }
                ],
                homework: [
                    '【必做】成功把AI接入自己的小程序截图，和dify后台唤起的截图。',
                    '【进阶】进阶修改，完善好自己产品的功能细节（如完善了分数呈现＋改运系统）',
                    '【进阶】做出自己产品的完整功能，有功能运行展示截图'
                ]
            },
            '2.5': {
                title: 'Day12 n8n自动化工作流',
                description: '掌握n8n核心概念，修改参数节点实现自动化内容生成与发布',
                materials: [
                    { title: '《用n8n打造AI高我》（上午）', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/Z3hBwc7FQiVSyckP42Ncw0MDnl4' },
                    { title: '《用n8n打造新闻分析机器人》（下午）', url: 'https://ycn1n76t2yyb.feishu.cn/wiki/KaS6w68bniSH90ksXtncz0cunhc' }
                ],
                homework: [
                    '【必做】完成辩论机器人的制作并提交对话截图。',
                    '【进阶】完成高我AI的制作并提交两个Agent的提示词的截图与对话截图。',
                    '【必做】完成新闻机器人的制作并提交飞书多为表格与群机器人的截图。',
                    '【进阶】在新闻机器人的基础上进行修改。',
                    '【进阶】用manus与heyboss做一个案例，并提交截图。'
                ]
            },
            '2.6': {
                title: 'Day13 MCP模型控制协议',
                description: '学习MCP协议，掌握AI模型的高级控制和集成技术',
                materials: [
                    { title: '《从入门到精通：模型上下文协议（MCP）实战》', url: 'https://wcntmlbovrgg.feishu.cn/wiki/LGXlwEQfci7jkYkSWj4cniJbnlI' }
                ],
                homework: [
                    '【必做】用Cursor结合Supabase MCP 服务构建一个前后端齐全的商业网站。并把网站链接提交到打卡作业里面。',
                    '【必做】在n8n的官网创建一个旅游行程规划的工作流其中要调用外部的MCP服务（比如高德地图、百度地图），并且封装成一个MCP的服务可以对外提供服务。并且可以让cherry studio的客户端添加为一个新的外部mcp服务，并且点亮绿灯。在作业里提交mcp服务链接地址。一个URL用于老师验证和cherry studio的MCP点亮绿灯的截图。',
                    '【进阶选做】：创建一个AI CEO可以指挥几个不同的AI员工（已经封装成MCP服务的n8n工作流），让他们可以在CEO的指挥下协调工作。提交工作流正常运行的截图到作业区。'
                ]
            },
            '2.7': {
                title: 'Day14 AI创富集市路演',
                description: '参与产品发布与路演，展示学习成果，完成深度复盘',
                materials: [],
                homework: [
                    '暂无明确作业要求，主要为课程总结和成果展示'
                ]
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeNodeStates(); // 初始化节点状态
        this.updateProgress();
        this.showDefaultContent();
        this.checkFirstTimeUser();
    }

    setupEventListeners() {
        // 点击课程节点
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lesson-node')) {
                const node = e.target.closest('.lesson-node');
                const lessonId = node.dataset.lesson;
                
                // 所有节点都可以点击
                this.selectLesson(lessonId);
            }
        });

        // 点击地图中的完成按钮
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lesson-complete-btn')) {
                const btn = e.target.closest('.lesson-complete-btn');
                const lessonId = btn.dataset.lesson;
                
                // 设置当前课程为按钮对应的课程
                this.currentLesson = lessonId;
                
                if (btn.classList.contains('completed')) {
                    // 撤回完成状态
                    this.uncompleteLesson();
                } else {
                    // 标记为完成
                    this.completeLesson();
                }
            }
        });

        // 首页开始学习按钮
        const startLearningBtn = document.getElementById('start-learning-btn');
        if (startLearningBtn) {
            startLearningBtn.addEventListener('click', () => {
                this.handleStartLearning();
            });
        }

        // 问卷提交按钮
        const submitQuestionnaireBtn = document.getElementById('submit-questionnaire');
        if (submitQuestionnaireBtn) {
            submitQuestionnaireBtn.addEventListener('click', () => {
                this.submitQuestionnaire();
            });
        }

        // 问卷导航按钮
        const nextQuestionBtn = document.getElementById('next-question');
        const prevQuestionBtn = document.getElementById('prev-question');
        
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => {
                this.nextQuestion();
            });
        }
        
        if (prevQuestionBtn) {
            prevQuestionBtn.addEventListener('click', () => {
                this.prevQuestion();
            });
        }

        // 问卷选项变化监听
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' && e.target.closest('#questionnaire')) {
                this.validateCurrentStep();
            }
        });

        // 调试重置按钮
        const debugResetBtn = document.getElementById('debug-reset');
        if (debugResetBtn) {
            debugResetBtn.addEventListener('click', () => {
                this.debugReset();
            });
        }

        // 作业完成按钮
        document.addEventListener('click', (e) => {
            if (e.target.closest('#homework-complete-btn')) {
                const btn = e.target.closest('#homework-complete-btn');
                if (this.currentLesson) {
                    // 触发当前课程的完成/取消完成操作
                    const lessonBtn = document.querySelector(`.lesson-complete-btn[data-lesson="${this.currentLesson}"]`);
                    if (lessonBtn) {
                        lessonBtn.click(); // 模拟点击学习地图中的按钮
                    }
                }
            }
        });



        // 聊天相关事件
        document.getElementById('send-button').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 快速问题按钮
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                this.sendQuickQuestion(question);
            });
        });

        // 欢迎弹窗事件
        document.getElementById('start-learning').addEventListener('click', () => {
            this.startLearning();
        });

        // 文件上传事件
        document.getElementById('upload-button').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        document.getElementById('file-input').addEventListener('change', this.handleFileSelection.bind(this));

        // 粘贴上传图片事件
        document.addEventListener('paste', this.handlePaste.bind(this));
        
        // 在输入框区域显示粘贴提示
        document.getElementById('chat-input').addEventListener('focus', () => {
            // 可以在这里添加粘贴提示，但现在先保持简洁
        });


    }

    initializeNodeStates() {
        const lessonOrder = [
            '1.1', '1.2', '1.3', '1.4',
            '1.5', '1.6', '1.7',
            '2.1', '2.2', '2.3', '2.4',
            '2.5', '2.6', '2.7'
        ];

        // 重置所有节点状态
        document.querySelectorAll('.lesson-node').forEach(node => {
            node.classList.remove('active', 'completed', 'selected');
            node.classList.add('locked');
        });

        // 第一个节点始终解锁
        const firstNode = document.querySelector('[data-lesson="1.1"]');
        if (firstNode) {
            firstNode.classList.remove('locked');
            firstNode.classList.add('active');
        }

        // 根据已完成的课程设置节点状态
        this.completedLessons.forEach(lessonId => {
            const node = document.querySelector(`[data-lesson="${lessonId}"]`);
            if (node) {
                node.classList.remove('active', 'locked');
                node.classList.add('completed');
            }
        });

        // 解锁下一个可学习的课程
        for (let i = 0; i < lessonOrder.length; i++) {
            const currentLessonId = lessonOrder[i];
            const isCompleted = this.completedLessons.includes(currentLessonId);
            
            if (isCompleted && i + 1 < lessonOrder.length) {
                const nextLessonId = lessonOrder[i + 1];
                const isNextCompleted = this.completedLessons.includes(nextLessonId);
                
                if (!isNextCompleted) {
                    const nextNode = document.querySelector(`[data-lesson="${nextLessonId}"]`);
                    if (nextNode && nextNode.classList.contains('locked')) {
                        nextNode.classList.remove('locked');
                        nextNode.classList.add('active');
                    }
                }
            }
        }

        // 更新按钮显示状态
        this.updateAllLessonButtons();
    }

    updateAllLessonButtons() {
        // 隐藏所有按钮
        document.querySelectorAll('.lesson-complete-btn').forEach(btn => {
            btn.style.display = 'none';
            btn.classList.remove('completed');
        });

        // 更新每个课程的按钮
        document.querySelectorAll('.lesson-node').forEach(node => {
            const lessonId = node.dataset.lesson;
            const btn = document.querySelector(`.lesson-complete-btn[data-lesson="${lessonId}"]`);
            
            if (btn && (node.classList.contains('active') || node.classList.contains('completed'))) {
                btn.style.display = 'block';
                
                const isCompleted = this.completedLessons.includes(lessonId);
                
                if (isCompleted) {
                    btn.classList.add('completed');
                    btn.innerHTML = `
                        <span class="checkbox"></span>
                        <span>已完成</span>
                    `;
                } else {
                    btn.classList.remove('completed');
                    btn.innerHTML = `
                        <span class="checkbox"></span>
                        <span>已完成</span>
                    `;
                }
            }
        });
    }

    showDefaultContent() {
        // 显示默认的学习资料
        const materialsContainer = document.querySelector('.materials-items');
        materialsContainer.innerHTML = `
            <div class="material-item">
                <a href="https://openai.com/blog/chatgpt" target="_blank">📖 AI学习资源合集</a>
            </div>
            <div class="material-item">
                <a href="https://www.youtube.com/results?search_query=AI+tutorial" target="_blank">🎥 AI工具视频教程</a>
            </div>
            <div class="material-item">
                <a href="https://github.com/f/awesome-chatgpt-prompts" target="_blank">💡 ChatGPT提示词大全</a>
            </div>
            <div class="material-item">
                <a href="https://docs.midjourney.com" target="_blank">🎨 Midjourney使用指南</a>
            </div>
            <div class="material-item">
                <strong>💼 创富案例：</strong><br>
                学习如何利用AI工具实现内容变现、电商优化和数据分析
            </div>
        `;
        
        // 调用自适应显示功能
        this.adjustMaterialsDisplay();
    }

    showWelcomeModal() {
        const modal = document.getElementById('welcome-modal');
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        
        if (!hasSeenWelcome) {
            modal.style.display = 'flex';
        } else {
            modal.style.display = 'none';
            // 如果已经看过欢迎页面，自动选择第一个关卡
            setTimeout(() => {
                this.selectLesson('1.1');
            }, 500);
        }
    }

    startLearning() {
        const experience = document.querySelector('input[name="experience"]:checked')?.value;
        const interest = document.querySelector('input[name="interest"]:checked')?.value;

        if (experience && interest) {
            this.userProfile = { experience, interest };
            localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
            localStorage.setItem('hasSeenWelcome', 'true');
            
            document.getElementById('welcome-modal').style.display = 'none';
            
            // 发送个性化欢迎消息
            this.sendPersonalizedWelcome();
            
            // 自动选择第一个关卡
            this.selectLesson('1.1');
        } else {
            alert('请完成所有选择再开始学习！');
        }
    }

    sendPersonalizedWelcome() {
        const { experience, interest } = this.userProfile;
        
        let welcomeMessage = '很高兴认识你！根据你的选择，我为你制定了个性化的学习建议：\n\n';
        
        if (experience === 'beginner') {
            welcomeMessage += '🌱 作为AI新手，建议你从基础工具开始，循序渐进地学习。\n';
        } else if (experience === 'basic') {
            welcomeMessage += '📚 你有一定基础，可以重点关注实战应用和技巧提升。\n';
        } else {
            welcomeMessage += '💪 你已有实践经验，可以直接学习高级技巧和变现方法。\n';
        }

        const interestMap = {
            content: '✍️ 内容创作是很好的方向，重点关注第2个岛屿的课程。',
            ecommerce: '🛍️ 电商服务前景广阔，第3个岛屿会是你的重点。',
            data: '📊 数据分析能力很有价值，第4个岛屿的课程很适合你。',
            all: '🎯 全方位学习是明智选择，建议按顺序完成所有岛屿。'
        };

        welcomeMessage += interestMap[interest];
        welcomeMessage += '\n\n开始你的学习之旅吧！有问题随时问我～';

        this.addAIMessage(welcomeMessage);
    }

    selectLesson(lessonId) {
        // 移除之前的选中状态
        document.querySelectorAll('.lesson-node').forEach(node => {
            node.classList.remove('selected');
        });

        // 添加选中状态
        const selectedNode = document.querySelector(`[data-lesson="${lessonId}"]`);
        if (selectedNode) {
            selectedNode.classList.add('selected');
        }

        this.currentLesson = lessonId;
        this.displayLessonDetails(lessonId);
    }

    displayLessonDetails(lessonId) {
        const lesson = this.lessonData[lessonId];
        if (!lesson) return;

        document.getElementById('lesson-title').textContent = lesson.title;
        document.getElementById('lesson-description').textContent = lesson.description;

        // 检查当前关卡状态
        const currentNode = document.querySelector(`[data-lesson="${lessonId}"]`);
        const isLessonUnlocked = currentNode && (currentNode.classList.contains('active') || currentNode.classList.contains('completed'));

        // 显示学习材料
        const materialsContainer = document.querySelector('.materials-items');
        materialsContainer.innerHTML = '';
        
        if (lesson.materials && lesson.materials.length > 0) {
            // 创建材料容器
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'materials-dropdown';
            
            // 直接创建内容容器
            const dropdownContent = document.createElement('div');
            dropdownContent.className = 'materials-dropdown-content';
            
            // 如果关卡未解锁，添加样式类
            if (!isLessonUnlocked) {
                dropdownContent.classList.add('materials-locked');
            }
            
            lesson.materials.forEach((material, index) => {
                const materialDiv = document.createElement('div');
                materialDiv.className = 'material-item';
                
                if (isLessonUnlocked) {
                    // 解锁状态：正常显示可点击链接
                    materialDiv.innerHTML = `
                        <span class="material-number">${index + 1}.</span>
                        <a href="${material.url}" target="_blank" class="material-link">${material.title}</a>
                    `;
                } else {
                    // 锁定状态：显示不可点击的文本，带锁定图标
                    materialDiv.innerHTML = `
                        <span class="material-number">${index + 1}.</span>
                        <span class="material-link locked-material">
                            🔒 ${material.title}
                        </span>
                    `;
                    materialDiv.classList.add('locked-material-item');
                }
                dropdownContent.appendChild(materialDiv);
            });
            
            // 如果关卡未解锁，添加解锁提示
            if (!isLessonUnlocked) {
                const unlockTip = document.createElement('div');
                unlockTip.className = 'unlock-tip';
                unlockTip.innerHTML = '💡 完成前置课程即可解锁学习资料';
                dropdownContent.appendChild(unlockTip);
            }
            
            // 直接添加内容到容器
            dropdownContainer.appendChild(dropdownContent);
            materialsContainer.appendChild(dropdownContainer);
        } else {
            materialsContainer.innerHTML = '<div class="no-materials">暂无学习资料</div>';
        }

        // 显示课后作业
        const homeworkContainer = document.getElementById('lesson-homework');
        if (lesson.homework) {
            if (isLessonUnlocked) {
                // 解锁状态：正常显示作业内容
                if (Array.isArray(lesson.homework)) {
                    // 如果作业是数组，创建列表显示
                    homeworkContainer.innerHTML = lesson.homework
                        .map((hw, index) => `${index + 1}. ${hw}`)
                        .join('<br><br>');
                } else {
                    // 如果作业是字符串，直接显示
                    homeworkContainer.textContent = lesson.homework;
                }
                homeworkContainer.classList.remove('homework-locked');
            } else {
                // 锁定状态：显示锁定提示
                homeworkContainer.innerHTML = '🔒 完成前置课程后可查看课后作业要求';
                homeworkContainer.classList.add('homework-locked');
            }
        } else {
            homeworkContainer.textContent = '暂无课后作业';
            homeworkContainer.classList.remove('homework-locked');
        }

        // 显示操作按钮（现在移到地图中）
        this.updateLessonButtons(lessonId);
        
        // 更新作业完成按钮状态
        this.updateHomeworkCompleteButton(lessonId);
    }

    updateLessonButtons(lessonId) {
        // 隐藏所有按钮
        document.querySelectorAll('.lesson-complete-btn').forEach(btn => {
            btn.style.display = 'none';
            btn.classList.remove('completed');
        });

        // 获取当前选中的课程按钮
        const currentBtn = document.querySelector(`.lesson-complete-btn[data-lesson="${lessonId}"]`);
        if (!currentBtn) return;

        const currentNode = document.querySelector(`.lesson-node[data-lesson="${lessonId}"]`);
        
        // 只有激活或已完成的课程才显示按钮
        if (currentNode && (currentNode.classList.contains('active') || currentNode.classList.contains('completed'))) {
            currentBtn.style.display = 'block';
            
            const isCompleted = this.completedLessons.includes(lessonId);
            
            if (isCompleted) {
                const canUncomplete = this.canUncompleteLesson(lessonId);
                if (canUncomplete) {
                    currentBtn.classList.add('completed');
                    currentBtn.innerHTML = `
                        <span class="checkbox"></span>
                        <span>已完成</span>
                    `;
                } else {
                    currentBtn.classList.add('completed');
                    currentBtn.innerHTML = `
                        <span class="checkbox"></span>
                        <span>已完成</span>
                    `;
                    currentBtn.style.opacity = '0.6';
                    currentBtn.style.cursor = 'not-allowed';
                }
            } else {
                currentBtn.classList.remove('completed');
                currentBtn.innerHTML = `
                    <span class="checkbox"></span>
                    <span>已完成</span>
                `;
                currentBtn.style.opacity = '1';
                currentBtn.style.cursor = 'pointer';
            }
        }
    }

    // 更新作业完成按钮状态
    updateHomeworkCompleteButton(lessonId) {
        const homeworkBtn = document.getElementById('homework-complete-btn');
        if (!homeworkBtn) return;

        const currentNode = document.querySelector(`.lesson-node[data-lesson="${lessonId}"]`);
        const isLessonUnlocked = currentNode && (currentNode.classList.contains('active') || currentNode.classList.contains('completed'));
        
        if (isLessonUnlocked) {
            // 课程已解锁，显示按钮
            homeworkBtn.style.display = 'flex';
            
            const isCompleted = this.completedLessons.includes(lessonId);
            const checkbox = homeworkBtn.querySelector('.checkbox');
            
            if (isCompleted) {
                homeworkBtn.classList.add('completed');
                checkbox.style.background = '#10b981';
                checkbox.style.borderColor = '#10b981';
            } else {
                homeworkBtn.classList.remove('completed');
                checkbox.style.background = 'white';
                checkbox.style.borderColor = '#cbd5e1';
            }
        } else {
            // 课程未解锁，隐藏按钮
            homeworkBtn.style.display = 'none';
        }
    }





    // 判断是否可以撤销该课程的完成状态
    canUncompleteLesson(lessonId) {
        if (!this.completedLessons.includes(lessonId)) {
            return false; // 未完成的课程无法撤销
        }

        const lessonOrder = [
            '1.1', '1.2', '1.3', '1.4',
            '1.5', '1.6', '1.7',
            '2.1', '2.2', '2.3', '2.4',
            '2.5', '2.6', '2.7'
        ];

        const currentLessonIndex = lessonOrder.indexOf(lessonId);
        
        // 检查是否是最后一个或最后几个完成的课程
        // 允许撤销任何已完成的课程，但会同时撤销后续所有课程
        return true;
    }

    completeLesson() {
        if (!this.currentLesson) return;

        // 添加到已完成列表
        if (!this.completedLessons.includes(this.currentLesson)) {
            this.completedLessons.push(this.currentLesson);
            localStorage.setItem('completedLessons', JSON.stringify(this.completedLessons));
            
            // 同步学习进度到 Supabase
            this.syncLearningProgressToSupabase();
        }

        // 更新节点状态
        const currentNode = document.querySelector(`[data-lesson="${this.currentLesson}"]`);
        if (currentNode) {
            currentNode.classList.remove('active');
            currentNode.classList.add('completed');
        }

        // 解锁下一个节点
        this.unlockNextLesson();

        // 更新进度
        this.updateProgress();

        // 显示鼓励消息
        this.showEncouragement();

        // 更新当前关卡显示
        this.displayLessonDetails(this.currentLesson);
    }

    // 同步学习进度到 Supabase
    async syncLearningProgressToSupabase() {
        try {
            const learningProgress = {
                completed_lessons: this.completedLessons,
                current_lesson: this.currentLesson,
                progress_percentage: Math.round((this.completedLessons.length / Object.keys(this.lessonData).length) * 100),
                last_activity: new Date().toISOString()
            };

            await this.supabaseService.saveUserProfile({}, learningProgress, {});
            console.log('✅ 学习进度已同步到 Supabase');
        } catch (error) {
            console.error('❌ 同步学习进度失败:', error);
        }
    }

    // 同步用户档案到 Supabase
    async syncUserProfileToSupabase(userProfile) {
        try {
            const profileData = {
                ...userProfile,
                user_id: this.currentUserId,
                platform: 'ai-learning-platform',
                registration_completed: true
            };

            const preferences = {
                goal: userProfile.goal,
                experience_level: userProfile.experience,
                weekly_time_commitment: userProfile.time
            };

            await this.supabaseService.saveUserProfile(profileData, {}, preferences);
            console.log('✅ 用户档案已同步到 Supabase');
        } catch (error) {
            console.error('❌ 同步用户档案失败:', error);
        }
    }

    uncompleteLesson() {
        if (!this.currentLesson) return;

        // 检查是否可以撤销
        if (!this.canUncompleteLesson(this.currentLesson)) {
            alert('该课程无法撤销！');
            return;
        }

        const lessonOrder = [
            '1.1', '1.2', '1.3', '1.4',
            '1.5', '1.6', '1.7',
            '2.1', '2.2', '2.3', '2.4',
            '2.5', '2.6', '2.7'
        ];

        const currentLessonIndex = lessonOrder.indexOf(this.currentLesson);
        
        // 撤销当前课程及其后续所有已完成的课程
        const lessonsToUncomplete = [];
        for (let i = currentLessonIndex; i < lessonOrder.length; i++) {
            const lessonId = lessonOrder[i];
            if (this.completedLessons.includes(lessonId)) {
                lessonsToUncomplete.push(lessonId);
            }
        }

        // 从已完成列表中移除这些课程
        lessonsToUncomplete.forEach(lessonId => {
            const index = this.completedLessons.indexOf(lessonId);
            if (index > -1) {
                this.completedLessons.splice(index, 1);
            }
        });

        localStorage.setItem('completedLessons', JSON.stringify(this.completedLessons));

        // 重新初始化所有节点状态
        this.initializeNodeStates();

        // 更新进度
        this.updateProgress();

        // 重新显示当前关卡详情
        this.displayLessonDetails(this.currentLesson);

        // 显示撤销消息
        if (lessonsToUncomplete.length > 1) {
            this.addAIMessage(`📝 已撤销 ${lessonsToUncomplete.length} 个课程的完成状态，需要重新完成这些课程。`);
        } else {
            this.addAIMessage('📝 已撤销课程完成状态，该课程需要重新完成。');
        }
    }

    unlockNextLesson() {
        const lessonOrder = [
            '1.1', '1.2', '1.3', '1.4',
            '1.5', '1.6', '1.7',
            '2.1', '2.2', '2.3', '2.4',
            '2.5', '2.6', '2.7'
        ];

        const currentIndex = lessonOrder.indexOf(this.currentLesson);
        if (currentIndex >= 0 && currentIndex < lessonOrder.length - 1) {
            const nextLessonId = lessonOrder[currentIndex + 1];
            const nextNode = document.querySelector(`[data-lesson="${nextLessonId}"]`);
            
            if (nextNode && nextNode.classList.contains('locked')) {
                nextNode.classList.remove('locked');
                nextNode.classList.add('active');
            }
        }
    }

    updateProgress() {
        const total = 14;
        const completed = this.completedLessons.length;
        document.getElementById('progress-text').textContent = `进度: ${completed}/${total}`;
    }

    showEncouragement() {
        const encouragements = [
            '🎉 太棒了！继续保持这个节奏！',
            '💪 你的学习进度很不错，加油！',
            '🌟 又掌握了一个新技能，距离目标更近了！',
            '🚀 学以致用是关键，记得实践今天学到的内容！',
            '🔥 你的学习热情令人钦佩！',
            '💡 每一步都是进步，为你点赞！',
            '🎯 保持这个学习状态，成功不会太远！',
            '✨ 知识的积累终会带来质的飞跃！'
        ];

        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.addAIMessage(randomEncouragement);

        // 根据完成的课程数量给出特别奖励
        const completed = this.completedLessons.length;
        if (completed === 7) {
            this.addAIMessage('🏆 恭喜你完成了第一行的所有课程！AI基础技能已经掌握，可以开始学习进阶技能了！');
        } else if (completed === 14) {
            this.addAIMessage('🎊 恭喜你完成了所有课程！现在你已经掌握了完整的AI创富技能体系，是时候开始你的创富之旅了！记得在实践中不断完善和优化你的技能！');
        }
    }

    async sendMessage(userInput = null) {
        const chatInput = document.getElementById('chat-input');
        const message = userInput || chatInput.value.trim();

        if (!message && this.uploadedFiles.length === 0) {
            return;
        }

        // 准备文件信息
        const filesToSend = [...this.uploadedFiles];
        
        // 显示用户消息（包含文件）
        this.addUserMessage(message, filesToSend);
        
        if (!userInput) {
            chatInput.value = '';
        }
        
        // 清空上传的文件
        this.uploadedFiles = [];
        this.displayUploadedFiles();
        
        this.scrollToBottom();
        this.showTyping();

        try {
            const aiResponse = await this.callDifyAPI(message, filesToSend);
            this.addAIMessage(aiResponse);
        } catch (error) {
            console.error('Error sending message:', error);
            this.addAIMessage('抱歉，AI助教当前遇到了一些问题，请稍后再试。');
        } finally {
            this.hideTyping();
            this.scrollToBottom();
        }
    }

    sendQuickQuestion(question) {
        this.sendMessage(question);
    }

    async callDifyAPI(message, files = []) {
        try {
            // 确保有一个稳定的会话ID
            const sessionKey = this.conversationId || `session-${this.currentUserId}`;
            console.log('🔑 会话密钥:', sessionKey, '对话ID:', this.conversationId);
            
            // 获取或创建当前会话（基于 conversation_id）
            await this.supabaseService.getOrCreateSession(sessionKey);

            // 获取用户聊天历史上下文（最近10条消息）
            const chatHistory = await this.supabaseService.getUserChatHistory(10);
            
            // 构建增强的消息内容（包含上下文）
            let enhancedMessage = message;
            
            // 如果有聊天历史，添加到消息中提供上下文
            if (chatHistory.length > 0) {
                const historyContext = chatHistory.map(msg => 
                    `${msg.message_type === 'user' ? '用户' : 'AI'}: ${msg.content}`
                ).join('\n');
                
                enhancedMessage = `【上下文参考】\n${historyContext}\n\n【当前问题】\n${message}`;
            }

            const requestBody = {
                "inputs": {
                    "user_id": this.currentUserId,  // 添加用户 ID
                    "learning_progress": JSON.stringify(this.completedLessons), // 添加学习进度
                    "current_lesson": this.currentLesson || null  // 添加当前课程信息
                },
                "query": enhancedMessage,  // 使用增强的消息
                "user": this.currentUserId,  // 使用用户的 UUID
                "conversation_id": this.conversationId || undefined,
                "response_mode": "blocking"
            };

            // 如果有文件，添加到请求中 - 使用正确的格式
            if (files && files.length > 0) {
                requestBody.files = files.map(file => ({
                    type: "image",
                    transfer_method: "local_file",
                    upload_file_id: file.id
                }));
            }

            console.log('Enhanced Request body:', JSON.stringify(requestBody, null, 2)); // 调试日志

            const sendRequest = async (body) => {
                const resp = await fetch(`${this.difyApiUrl}/chat-messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.difyApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
                return resp;
            };

            let response = await sendRequest(requestBody);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (_) {
                    errorData = { message: response.statusText };
                }
                console.error('Dify API Error:', errorData);

                const msg = (errorData.message || '').toLowerCase();
                const isConversationProblem = response.status === 404 || response.status === 422 || msg.includes('conversation') || msg.includes('会话');
                if (isConversationProblem && this.conversationId) {
                    console.warn('⚠️ 会话可能已过期，自动清除并重试一次');
                    localStorage.removeItem('difyConversationId');
                    this.conversationId = null;
                    delete requestBody.conversation_id;
                    response = await sendRequest(requestBody);
                }

                if (!response.ok) {
                    let secondError;
                    try {
                        secondError = await response.json();
                    } catch (_) {
                        secondError = { message: response.statusText };
                    }
                    throw new Error(`Dify API request failed: ${secondError.message || response.statusText}`);
                }
            }

            const data = await response.json();

            // 更新 conversation_id
            if (data.conversation_id) {
                this.conversationId = data.conversation_id;
                localStorage.setItem('difyConversationId', data.conversation_id);
                
                // 如果是新的对话，更新 Supabase 会话
                await this.supabaseService.getOrCreateSession(data.conversation_id);
            }

            // 保存用户消息到数据库
            await this.supabaseService.saveMessage('user', message, files);

            // 保存 AI 回复到数据库
            await this.supabaseService.saveMessage('assistant', data.answer, [], data.id);

            return data.answer;
        } catch (error) {
            console.error('Error calling Dify API:', error);
            // 将错误向上抛出，由调用方处理UI
            throw error;
        }
    }

    addUserMessage(message, files = []) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        
        let messageContent = '<div class="avatar">👤</div><div class="content">';
        
        // 显示上传的文件
        if (files && files.length > 0) {
            messageContent += '<div class="message-files">';
            files.forEach(file => {
                if (file.preview) {
                    messageContent += `<img src="${file.preview}" alt="${file.name}" style="max-width: 200px; border-radius: 8px; margin: 5px;">`;
                }
            });
            messageContent += '</div>';
        }
        
        if (message) {
            messageContent += `<p>${this.escapeHtml(message)}</p>`;
        }
        
        messageContent += '</div>';
        messageDiv.innerHTML = messageContent;
        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addAIMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="content">${this.formatMessage(message)}</div>
        `;
        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="content">
                <div class="loading"></div>
                <span style="margin-left: 10px;">小艾正在思考...</span>
            </div>
        `;
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    formatMessage(message) {
        // 简单的markdown格式支持
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // 支持markdown链接格式 [文本](链接)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            // 支持简单的HTTP/HTTPS链接自动识别
            .replace(/(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
            // 换行处理
            .replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 新增方法：检查是否首次访问
    checkFirstTimeUser() {
        const userProfile = localStorage.getItem('userProfile');
        const hasSeenHome = localStorage.getItem('hasSeenHome');
        
        console.log('检查用户状态:', { userProfile: !!userProfile, hasSeenHome }); // 调试日志
        
        if (!userProfile) {
            // 没有用户档案，显示首页（无论是否看过首页）
            console.log('没有用户档案，显示首页');
            this.showHomePage();
        } else {
            // 有用户档案，直接进入学习界面
            console.log('有用户档案，进入学习界面');
            this.userProfile = JSON.parse(userProfile);
            this.hideAllOverlays();
            // 自动选择合适的关卡
            this.selectAppropriateLesson();
        }
    }

    // 选择合适的关卡（返回用户时使用）
    selectAppropriateLesson() {
        const lessonOrder = [
            '1.1', '1.2', '1.3', '1.4',
            '1.5', '1.6', '1.7',
            '2.1', '2.2', '2.3', '2.4',
            '2.5', '2.6', '2.7'
        ];

        // 找到下一个未完成的课程
        let nextLesson = '1.1'; // 默认第一关
        for (const lessonId of lessonOrder) {
            if (!this.completedLessons.includes(lessonId)) {
                nextLesson = lessonId;
                break;
            }
        }

        // 如果所有关卡都完成了，选择最后一个
        if (this.completedLessons.length === lessonOrder.length) {
            nextLesson = lessonOrder[lessonOrder.length - 1];
        }

        // 选择并显示该关卡
        this.selectLesson(nextLesson);
    }

    // 显示首页
    showHomePage() {
        console.log('显示首页'); // 调试日志
        const homePage = document.getElementById('home-page');
        if (homePage) {
            homePage.style.display = 'flex';
        }
        this.hideOtherOverlays(['home-page']);
    }

    // 处理首页开始学习按钮点击
    handleStartLearning() {
        const userProfile = localStorage.getItem('userProfile');
        
        // 标记已看过首页
        localStorage.setItem('hasSeenHome', 'true');
        
        if (!userProfile) {
            // 新用户，显示问卷
            this.showQuestionnaire();
        } else {
            // 老用户，直接进入学习
            this.userProfile = JSON.parse(userProfile);
            this.hideAllOverlays();
            this.selectAppropriateLesson();
            this.sendPersonalizedWelcomeMessage();
        }
    }

    // 显示问卷
    showQuestionnaire() {
        console.log('显示问卷'); // 调试日志
        const questionnaire = document.getElementById('questionnaire');
        if (questionnaire) {
            questionnaire.style.display = 'flex';
        }
        this.hideOtherOverlays(['questionnaire']);
        
        // 初始化问卷状态
        this.currentQuestionStep = 1;
        this.updateQuestionStep();
    }

    // 验证当前步骤是否完成
    validateCurrentStep() {
        const currentStep = this.currentQuestionStep;
        let isValid = false;
        
        switch (currentStep) {
            case 1:
                isValid = document.querySelector('input[name="goal"]:checked') !== null;
                break;
            case 2:
                isValid = document.querySelector('input[name="experience"]:checked') !== null;
                break;
            case 3:
                isValid = document.querySelector('input[name="time"]:checked') !== null;
                break;
        }
        
        const nextBtn = document.getElementById('next-question');
        const submitBtn = document.getElementById('submit-questionnaire');
        
        if (currentStep < 3) {
            nextBtn.disabled = !isValid;
        } else {
            submitBtn.style.display = isValid ? 'block' : 'none';
        }
    }

    // 下一个问题
    nextQuestion() {
        if (this.currentQuestionStep < 3) {
            // 标记当前步骤为完成
            this.markStepCompleted(this.currentQuestionStep);
            
            this.currentQuestionStep++;
            this.updateQuestionStep();
        }
    }

    // 上一个问题
    prevQuestion() {
        if (this.currentQuestionStep > 1) {
            this.currentQuestionStep--;
            this.updateQuestionStep();
        }
    }

    // 更新问题步骤显示
    updateQuestionStep() {
        console.log('更新问题步骤:', this.currentQuestionStep);
        
        // 隐藏所有步骤
        document.querySelectorAll('.question-step').forEach(step => {
            step.classList.remove('active');
            console.log('隐藏步骤:', step.dataset.step);
        });
        
        // 显示当前步骤
        const currentStepElement = document.querySelector(`.question-step[data-step="${this.currentQuestionStep}"]`);
        console.log('找到当前步骤元素:', currentStepElement);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            console.log('激活步骤:', this.currentQuestionStep);
        } else {
            console.error('未找到步骤元素:', this.currentQuestionStep);
        }
        
        // 更新进度点
        this.updateProgressDots();
        
        // 更新导航按钮
        this.updateNavigationButtons();
        
        // 验证当前步骤
        this.validateCurrentStep();
    }

    // 更新进度点
    updateProgressDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            const stepNumber = index + 1;
            dot.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentQuestionStep) {
                dot.classList.add('completed');
            } else if (stepNumber === this.currentQuestionStep) {
                dot.classList.add('active');
            }
        });
    }

    // 标记步骤为完成
    markStepCompleted(stepNumber) {
        const dot = document.querySelector(`.dot[data-step="${stepNumber}"]`);
        if (dot) {
            dot.classList.remove('active');
            dot.classList.add('completed');
        }
    }

    // 更新导航按钮
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const submitBtn = document.getElementById('submit-questionnaire');
        
        // 上一步按钮
        if (this.currentQuestionStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }
        
        // 下一步和提交按钮
        if (this.currentQuestionStep === 3) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    // 提交问卷
    submitQuestionnaire() {
        const goal = document.querySelector('input[name="goal"]:checked').value;
        const experience = document.querySelector('input[name="experience"]:checked').value;
        const time = document.querySelector('input[name="time"]:checked').value;
        
        const userProfile = {
            goal,
            experience,
            time,
            registrationDate: new Date().toISOString()
        };
        
        // 保存用户档案
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        this.userProfile = userProfile;
        
        // 同步用户档案到 Supabase
        this.syncUserProfileToSupabase(userProfile);
        
        // 隐藏问卷，进入学习界面
        this.hideAllOverlays();
        
        // 选择合适的关卡
        this.selectAppropriateLesson();
        
        // 发送个性化欢迎消息
        this.sendPersonalizedWelcomeMessage();
    }

    // 发送个性化欢迎消息
    async sendPersonalizedWelcomeMessage() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (!userProfile) return;

        let welcomePrompt = `你好！我是一名新用户，刚刚完成了个人情况问卷。请根据我的问卷回答，为我生成一段热情、个性化的欢迎语，并鼓励我开始学习。

我的基本情况如下：
- 我的学习目标是: ${userProfile.goal}
- 我对AI的了解程度是: ${userProfile.experience}
- 我计划每周投入的学习时间是: ${userProfile.time}

请在欢迎语中提及我的目标，并根据我的AI经验水平，推荐我从第一课开始，或者给我一些初学者的建议。语言要亲切、有鼓励性。`;

        this.showTyping();
        this.scrollToBottom();

        try {
            const aiResponse = await this.callDifyAPI(welcomePrompt);
            this.addAIMessage(aiResponse);
        } catch (error) {
            console.error('Error sending personalized welcome message:', error);
            this.addAIMessage('欢迎来到AI创富营！让我们开始这段激动人心的学习之旅吧！');
        } finally {
            this.hideTyping();
            this.scrollToBottom();
        }
    }

    // 隐藏所有覆盖层
    hideAllOverlays() {
        const overlays = ['home-page', 'questionnaire', 'welcome-modal'];
        overlays.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        // 确保主应用界面可见
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.style.display = 'flex';
        }
        
        // 清除dify会话
        localStorage.removeItem('difyConversationId');
        this.conversationId = null;
    }

    // 隐藏除指定之外的覆盖层
    hideOtherOverlays(except = []) {
        const overlays = ['home-page', 'questionnaire', 'welcome-modal'];
        overlays.forEach(id => {
            if (!except.includes(id)) {
                const element = document.getElementById(id);
                if (element) {
                    element.style.display = 'none';
                }
            }
        });
    }

    // 重置功能
    async debugReset() {
        if (confirm('⚠️ 一旦重置，课程助手将删除以往对话的记忆，你确定这么做吗？\n\n这将清除：\n• 所有聊天记录和对话记忆\n• 用户档案信息\n• 学习进度记录\n• 首页访问记录')) {
            
            // 显示删除进度提示
            this.addAIMessage('🔄 正在重置中，请稍候...');
            
            try {
                // 删除 Supabase 中的用户数据
                await this.deleteUserDataFromSupabase();
                
                // 清除所有localStorage数据
                localStorage.clear();
                
                // 显示重置成功提示
                this.addAIMessage('✅ 重置成功！所有数据和对话记忆已清除，页面即将重新加载...');
                
            } catch (error) {
                console.error('删除云端数据失败:', error);
                
                // 即使云端删除失败，也清除本地数据
                localStorage.clear();
                this.addAIMessage('⚠️ 重置完成！本地数据已清除，部分云端数据可能需要手动清理。页面即将重新加载...');
            }
            
            // 延迟2秒后刷新页面
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    // 删除用户在 Supabase 中的所有数据
    async deleteUserDataFromSupabase() {
        if (!this.supabaseService || !this.supabaseService.supabase) {
            console.warn('⚠️ Supabase 未初始化，跳过云端数据删除');
            return;
        }

        const userId = this.currentUserId;
        if (!userId) {
            console.warn('⚠️ 用户ID不存在，跳过云端数据删除');
            return;
        }

        try {
            console.log('🗑️ 开始删除用户数据:', userId);

            // 1. 删除聊天消息（会自动级联删除，因为有外键约束）
            const { error: messagesError } = await this.supabaseService.supabase
                .from('chat_messages')
                .delete()
                .eq('user_id', userId);

            if (messagesError) {
                console.error('删除聊天消息失败:', messagesError);
            } else {
                console.log('✅ 已删除聊天消息');
            }

            // 2. 删除聊天会话
            const { error: sessionsError } = await this.supabaseService.supabase
                .from('chat_sessions')
                .delete()
                .eq('user_id', userId);

            if (sessionsError) {
                console.error('删除聊天会话失败:', sessionsError);
            } else {
                console.log('✅ 已删除聊天会话');
            }

            // 3. 删除用户档案
            const { error: profileError } = await this.supabaseService.supabase
                .from('user_profiles')
                .delete()
                .eq('user_id', userId);

            if (profileError) {
                console.error('删除用户档案失败:', profileError);
            } else {
                console.log('✅ 已删除用户档案');
            }

            console.log('🎉 用户数据删除完成');

        } catch (error) {
            console.error('❌ 删除用户数据时发生错误:', error);
            throw error; // 重新抛出错误，让调用方处理
        }
    }

    // 自适应调整学习资料显示
    adjustMaterialsDisplay() {
        const materialsContainer = document.querySelector('.materials-items');
        if (!materialsContainer) return;

        const itemCount = materialsContainer.children.length;
        
        // 根据材料数量自动调整样式
        materialsContainer.classList.remove('compact');
        
        if (itemCount > 5) {
            // 材料较多时使用紧凑样式
            materialsContainer.classList.add('compact');
        }
        
        // 检查内容是否溢出，进一步调整
        // 移除checkAndAdjustOverflow的调用，因为CSS已经处理了高度自适应和滚动
    }

    // 处理文件选择
    async handleFileSelection(event) {
        const files = Array.from(event.target.files);
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                await this.uploadFile(file);
            } else {
                alert('目前只支持上传图片文件');
            }
        }
        // 清空文件输入框，允许重复选择同一文件
        event.target.value = '';
    }

    // 处理粘贴事件
    async handlePaste(event) {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            // 检查是否为图片
            if (item.type.indexOf('image') !== -1) {
                event.preventDefault(); // 阻止默认粘贴行为
                
                const file = item.getAsFile();
                if (file) {
                    // 给粘贴的文件一个默认名称
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const fileExtension = file.type.split('/')[1] || 'png';
                    const fileName = `pasted-image-${timestamp}.${fileExtension}`;
                    
                    // 创建一个新的File对象，带有自定义名称
                    const renamedFile = new File([file], fileName, {
                        type: file.type,
                        lastModified: file.lastModified
                    });
                    
                    await this.uploadFile(renamedFile);
                    
                    // 显示提示信息
                    this.showPasteSuccess();
                }
                break; // 只处理第一个图片
            }
        }
    }

    // 显示粘贴成功提示
    showPasteSuccess() {
        // 创建临时提示
        const notification = document.createElement('div');
        notification.textContent = '📋 图片已粘贴上传';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 上传文件到Dify
    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user', 'anonymous');

            // 显示上传进度
            const tempFileInfo = {
                id: Date.now(),
                name: file.name,
                size: this.formatFileSize(file.size),
                uploading: true,
                file: file
            };
            this.uploadedFiles.push(tempFileInfo);
            this.displayUploadedFiles();

            const response = await fetch(`${this.difyApiUrl}/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.difyApiKey}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`上传失败: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('File upload response:', data); // 调试日志
            
            // 更新文件信息 - 使用正确的字段名
            const fileIndex = this.uploadedFiles.findIndex(f => f.id === tempFileInfo.id);
            if (fileIndex !== -1) {
                this.uploadedFiles[fileIndex] = {
                    id: data.id,
                    name: data.name || file.name,
                    size: this.formatFileSize(data.size || file.size),
                    mime_type: data.mime_type || file.type,
                    created_by: data.created_by,
                    created_at: data.created_at,
                    uploading: false,
                    file: file,
                    preview: URL.createObjectURL(file)
                };
                this.displayUploadedFiles();
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('文件上传失败，请重试');
            // 移除失败的文件
            this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== tempFileInfo.id);
            this.displayUploadedFiles();
        }
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 显示已上传的文件
    displayUploadedFiles() {
        const container = document.getElementById('uploaded-files');
        container.innerHTML = '';

        this.uploadedFiles.forEach((file, index) => {
            const fileElement = document.createElement('div');
            fileElement.className = 'uploaded-file';
            
            const preview = file.preview || (file.file ? URL.createObjectURL(file.file) : '');
            
            fileElement.innerHTML = `
                ${preview ? `<img src="${preview}" alt="${file.name}">` : '<span>📄</span>'}
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${file.size}</div>
                </div>
                ${file.uploading ? '<span>上传中...</span>' : `<button class="remove-file" onclick="window.aiPlatform.removeFile(${index})">×</button>`}
            `;
            
            container.appendChild(fileElement);
        });
    }

    // 移除文件
    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.displayUploadedFiles();
    }

    async handleFileUpload(file) {
        // 这个方法被uploadFile替代，保留是为了兼容性
        return await this.uploadFile(file);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.aiPlatform = new AILearningPlatform();
});

// 添加选中节点的样式
const style = document.createElement('style');
style.textContent = `
    .lesson-node.selected {
        border-color: #3b82f6 !important;
        background: linear-gradient(135deg, #dbeafe, #bfdbfe) !important;
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
    }
`;
document.head.appendChild(style);