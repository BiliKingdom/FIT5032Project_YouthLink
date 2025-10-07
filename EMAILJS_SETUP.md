# EmailJS 配置指南

## 获取 EmailJS 凭证

### 1. 访问 EmailJS Dashboard
前往 [EmailJS Dashboard](https://dashboard.emailjs.com/)

### 2. 获取 Public Key (User ID)
1. 点击左侧菜单的 **"Account"**
2. 在 **"General"** 标签页中找到 **"Public Key"** 或 **"User ID"**
3. 复制这个值（通常是 20-30 个字符的随机字符串）

**注意**：这个 Public Key 和 Private Key 是不同的！
- ✅ Public Key - 用于前端（浏览器）
- ❌ Private Key - 仅用于后端，不能暴露在前端

### 3. 获取 Service ID
1. 点击左侧菜单的 **"Email Services"**
2. 找到你要使用的邮件服务
3. 复制 **Service ID**（例如：`service_ky1fzlt`）

### 4. 获取 Template ID
1. 点击左侧菜单的 **"Email Templates"**
2. 找到你要使用的模板
3. 复制 **Template ID**（例如：`template_kba0mkb`）

## 配置 .env 文件

在项目根目录的 `.env` 文件中添加以下配置：

```env
VITE_EMAILJS_SERVICE_ID=service_ky1fzlt
VITE_EMAILJS_TEMPLATE_ID=template_kba0mkb
VITE_EMAILJS_PUBLIC_KEY=你的_PUBLIC_KEY_这里
```

## 模板变量配置

确保你的 EmailJS 模板包含以下变量：

- `{{to_email}}` - 收件人邮箱
- `{{to_name}}` - 收件人姓名
- `{{subject}}` - 邮件主题
- `{{message}}` - 邮件内容
- `{{from_name}}` - 发件人名称

## 常见问题

### "The Public Key is invalid" 错误

**原因**：你可能使用了 Private Key 而不是 Public Key

**解决方案**：
1. 检查你是否从 **Account > General** 页面复制了 **Public Key**
2. Public Key 应该是一串随机字符，不应该以 `sk_` 开头（那是 Private Key）
3. 如果找不到 Public Key，可能显示为 **"User ID"**

### 邮件发送失败

**检查清单**：
- [ ] EmailJS 账户是否已验证
- [ ] Service 是否已正确配置（Gmail, Outlook 等）
- [ ] Template 是否包含所有必需的变量
- [ ] 是否超出了免费计划的发送限额（200封/月）
- [ ] 控制台是否显示任何错误信息

## 测试配置

重启开发服务器后，打开浏览器控制台，你应该看到：

```
EmailJS initialized with config: {
  SERVICE_ID: 'service_ky1fzlt',
  TEMPLATE_ID: 'template_kba0mkb',
  PUBLIC_KEY: 'zXsYcTog...'
}
```

如果看到错误信息，说明配置有问题。
