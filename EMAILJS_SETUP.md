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

### 重要：正确配置收件人地址

**在 EmailJS 模板设置中，必须将 "To Email" 字段设置为动态变量 `{{to_email}}`，而不是固定的邮箱地址！**

#### 步骤：
1. 在 EmailJS Dashboard 中打开你的模板
2. 找到 **"To Email"** 字段（通常在模板顶部的设置区域）
3. **将该字段设置为**: `{{to_email}}`
4. **不要**使用固定的邮箱地址（如 admin@example.com）

这样，系统才能将邮件发送到不同用户的注册邮箱中。

### 模板内容变量

确保你的 EmailJS 模板包含以下变量：

- `{{to_email}}` - ⚠️ **必须设置在模板的 "To Email" 字段中**
- `{{to_name}}` - 收件人姓名
- `{{subject}}` - 邮件主题
- `{{message}}` - 邮件内容
- `{{from_name}}` - 发件人名称

### 示例模板配置

**模板设置区域：**
```
To Email: {{to_email}}
From Name: YouthLink
From Email: your-verified-email@gmail.com
Subject: {{subject}}
Reply To: noreply@youthlink.com
```

**模板内容：**
```
Dear {{to_name}},

{{message}}

Best regards,
{{from_name}}
```

## 常见问题

### 邮件总是发送到固定的邮箱地址

**原因**：EmailJS 模板的 "To Email" 字段设置了固定的邮箱地址，而不是动态变量 `{{to_email}}`

**解决方案**：
1. 登录 [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. 点击 **"Email Templates"**
3. 打开你正在使用的模板
4. 在模板设置的顶部找到 **"To Email"** 字段
5. **删除固定的邮箱地址**（如 admin@example.com）
6. **输入**: `{{to_email}}`
7. 保存模板
8. 重新测试邮件发送功能

这样配置后：
- 管理员群发邮件时，每个用户会收到发送到自己注册邮箱的邮件
- 用户预订课程时，确认邮件会发送到用户自己的注册邮箱

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

### 步骤 1: 检查初始化日志

重启开发服务器后，打开浏览器控制台，你应该看到：

```
EmailJS initialized with config: {
  SERVICE_ID: 'service_ky1fzlt',
  TEMPLATE_ID: 'template_kba0mkb',
  PUBLIC_KEY: 'zXsYcTog...'
}
```

如果看到错误信息，说明配置有问题。

### 步骤 2: 测试邮件发送

#### 测试课程预订邮件：
1. 登录到系统
2. 访问 **Course Booking** 页面
3. 选择一个课程并预订
4. 检查你的注册邮箱（而不是固定的管理员邮箱）是否收到确认邮件

#### 测试群发邮件：
1. 以管理员身份登录
2. 访问 **Admin Dashboard > Bulk Email**
3. 选择几个测试用户
4. 发送测试邮件
5. 检查每个用户的注册邮箱是否都收到了邮件

### 验证代码正确性

应用代码已经正确实现：

**课程预订邮件** (`CourseBooking.vue`):
```javascript
emailService.sendBookingConfirmation({
  to_email: authStore.user.email,  // ✅ 使用用户的注册邮箱
  to_name: authStore.user.displayName,
  // ...
})
```

**群发邮件** (`BulkEmail.vue`):
```javascript
const recipients = selectedUsers.value.map(user => ({
  email: user.email,  // ✅ 使用每个用户的注册邮箱
  name: user.displayName || 'User'
}))
```

如果邮件仍然发送到固定地址，问题出在 EmailJS 模板配置，而不是代码。
