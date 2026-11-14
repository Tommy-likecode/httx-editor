export function explainJsError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('is not defined')) {
    return '变量或函数未定义。检查拼写，或确认是否在使用前声明。'
  }
  if (lower.includes('cannot read properties of null') || lower.includes('cannot read property')) {
    return '读取了空对象的属性。常见原因：getElementById 未找到元素，请确认 HTML 中的 id 是否一致。'
  }
  if (lower.includes('cannot read properties of undefined')) {
    return '访问了 undefined 的属性。检查对象是否已创建，或使用可选链 ?. 。'
  }
  if (lower.includes('unexpected token')) {
    return '语法错误。检查括号、引号或逗号是否成对。'
  }
  if (lower.includes('is not a function')) {
    return '把非函数当成函数调用了。确认变量类型，或检查是否覆盖了同名函数。'
  }
  if (lower.includes('unhandled rejection')) {
    return 'Promise 被拒绝且未捕获。为 async 调用添加 try/catch 或 .catch()。'
  }
  if (lower.includes('networkerror') || lower.includes('failed to fetch')) {
    return '网络请求失败。检查 CDN/接口地址，或预览 sandbox 是否限制了跨域。'
  }

  return '运行时错误。打开控制台详情，优先检查最近修改的 JS 与对应 HTML 元素。'
}
