// 换成你自己的讯飞星火凭据；真实密钥不要提交到仓库
// 生产环境建议改为通过云函数转发，避免在前端暴露密钥
const config = {
  baseUrl: 'https://maas-api.cn-huabei-1.xf-yun.com/v2',
  appId: 'YOUR_XF_APPID',
  apiKey: 'YOUR_XF_API_KEY',
  apiSecret: 'YOUR_XF_API_SECRET',
  modelId: 'xop3qwen1b7',
  resourceId: '0',
  timeout: 30000,
  debug: false
}

module.exports = config
