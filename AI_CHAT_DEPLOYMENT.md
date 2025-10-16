# 🚀 Firebase AI 聊天云函数 - 部署指南

## ✅ 准备工作已完成

以下文件已经准备就绪：
- ✅ `functions/index.js` - AI 聊天云函数代码
- ✅ `functions/package.json` - 包含 Gemini AI 依赖

## 📋 部署步骤

### 步骤 1：获取 Gemini API 密钥

1. 访问：**https://makersuite.google.com/app/apikey**
2. 使用您的 Google 账户登录
3. 点击 **"Create API Key"** 创建新密钥
4. 复制生成的 API 密钥（格式：`AIzaSy...`）

---

### 步骤 2：在终端中执行以下命令

#### 2.1 进入 functions 目录并安装依赖

```bash
cd functions
npm install
cd ..
```

这会安装 `@google/generative-ai` 和其他必要的包。

#### 2.2 设置 Gemini API 密钥

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

当提示输入时，粘贴您在步骤 1 中获取的 API 密钥，然后按回车。

#### 2.3 部署云函数

```bash
firebase deploy --only functions
```

部署过程大约需要 2-5 分钟。

---

### 步骤 3：验证部署成功

部署完成后，您会看到类似的输出：

```
✔ functions[aiChat(us-central1)] Successful create operation.
✔ functions[aiChatHttp(us-central1)] Successful create operation.
```

访问 Firebase Console 验证：
**https://console.firebase.google.com/project/youthlink-1b9e0/functions**

您应该看到两个新的云函数：
- ✅ **aiChat** - Callable 函数（推荐使用）
- ✅ **aiChatHttp** - HTTP 端点

---

## 🎯 部署的云函数说明

### 1. aiChat（Callable 函数）
- **类型**：Firebase Callable Function
- **用途**：安全的 AI 聊天接口
- **特点**：
  - 自动身份验证
  - 更好的错误处理
  - 推荐在 Firebase 客户端使用

### 2. aiChatHttp（HTTP 函数）
- **类型**：HTTP 端点
- **用途**：REST API 方式的 AI 聊天
- **特点**：
  - 支持 CORS
  - 可从任何客户端调用
  - 适合非 Firebase 应用

---

## 🔐 安全特性

✅ **API 密钥保护**
- API 密钥存储在 Firebase Secrets 中
- 永不暴露给客户端
- 所有 AI 请求都通过云函数处理

✅ **日志记录**
- 所有对话自动记录到 Firestore `ai_chat_logs` 集合
- 包含用户 ID、消息、响应和时间戳
- 便于审计和分析

✅ **并发控制**
- 最多 5 个函数实例同时运行
- 防止滥用和成本失控

---

## 🧪 测试部署

### 测试 aiChatHttp 函数

使用 curl 测试：

```bash
curl -X POST https://us-central1-youthlink-1b9e0.cloudfunctions.net/aiChatHttp \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，AI！", "userId": "test-user"}'
```

应该返回 JSON 响应：
```json
{
  "success": true,
  "response": "AI 的回复...",
  "timestamp": "2025-10-16T..."
}
```

---

## 🔧 故障排查

### 问题 1：Firebase CLI 未安装

**错误**：`firebase: command not found`

**解决**：
```bash
npm install -g firebase-tools
```

### 问题 2：未登录 Firebase

**错误**：`Error: not logged in`

**解决**：
```bash
firebase login
```

### 问题 3：权限错误

**错误**：`Permission denied`

**解决**：
```bash
firebase logout
firebase login
```
确保使用正确的 Google 账户。

### 问题 4：Lint 错误

**错误**：ESLint 检查失败

**解决**：
```bash
firebase deploy --only functions --force
```

### 问题 5：API 密钥未设置

**错误**：部署后函数返回 "AI service not configured"

**解决**：
1. 验证密钥已设置：
   ```bash
   firebase functions:secrets:access GEMINI_API_KEY
   ```
2. 如果没有，重新设置：
   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   ```

---

## 📝 快速部署命令（复制粘贴）

```bash
# 安装函数依赖
cd functions && npm install && cd ..

# 设置 API 密钥
firebase functions:secrets:set GEMINI_API_KEY
# 输入您的 Gemini API 密钥

# 部署函数
firebase deploy --only functions
```

---

## 📚 客户端集成

您的前端代码（`src/services/aiChatService.ts`）已经配置好，部署完成后会自动工作。

无需修改任何客户端代码！

---

## 📊 查看日志

部署后，查看函数日志：

```bash
firebase functions:log
```

或在 Firebase Console 中查看：
**https://console.firebase.google.com/project/youthlink-1b9e0/functions/logs**

---

## 💡 重要提醒

1. ⚠️ **必须先获取 Gemini API 密钥** - 这是部署的前提
2. ⚠️ **必须先登录 Firebase** - 使用 `firebase login`
3. ⚠️ **首次部署需要时间** - 请耐心等待 2-5 分钟
4. ⚠️ **检查 Firebase 计费** - 确保已启用 Blaze 计费计划

---

## 🎉 部署完成后

恭喜！您的 AI 聊天功能现在：
- ✅ API 密钥已安全存储在服务器端
- ✅ 所有 AI 请求通过云函数处理
- ✅ 对话历史自动记录
- ✅ 客户端无需任何修改即可使用

访问您的应用，进入 AI 聊天页面即可测试！
