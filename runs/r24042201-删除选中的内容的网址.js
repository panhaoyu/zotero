async function func(item) {
    if (!item) return
    if (!item.isRegularItem()) return
    if (item.isAttachment()) return
    if (item.isNote()) return
    let urlField = item.getField('url');
    const prefix = 'https://webofscience.clarivate.cn/wos/alldb/summary/'
    if (!urlField.startsWith(prefix)) return
    item.setField('url', '');
}

// noinspection JSAnnotator
return func(item)