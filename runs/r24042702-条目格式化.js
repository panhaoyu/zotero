async function func(item) {
    if (!item) return
    if (!item.isRegularItem()) return
    if (item.isAttachment()) return
    if (item.isNote()) return
    let urlField = item.getField('url');
    const prefix = 'https://webofscience.clarivate.cn/wos/alldb/summary/'
    if (urlField.startsWith(prefix)) {
        item.setField('url', '');
    }

    const extra = item.getField('extra')
    const lines = extra.split('\n')
    const extraObj = {}

    // 使用split的第二个参数限制分割次数
    for (const line of lines) {
        const [key, value] = line.split(': ', 1)
        if (key && value) {
            extraObj[key] = value
        }
    }

    const titleTranslation = extraObj['titleTranslation']
    const title = item.getField('title')

    // 如果没有titleTranslation并且title包含至少一个中文字符，则添加
    if (!titleTranslation && /[\u4e00-\u9fa5]/.test(title)) {
        const newExtra = `${extra}\ntitleTranslation: ${title}`
        item.setField('extra', newExtra) // 假设setField是用来设置字段的方法
    }


}

// noinspection JSAnnotator
return func(item)