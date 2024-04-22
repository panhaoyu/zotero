async function script(item) {
    if (!item) {
        return "No item"
    }

// 确保当前对象是一个文献条目
    if (!item.isRegularItem()) {
        return
    }
    if (item.isAttachment()) {
        return
    }
    if (item.isNote) {
        return
    }

    let urlField = item.getField('url');


    const prefix = 'https://webofscience.clarivate.cn/wos/alldb/summary/'

// 检查是否存在网址
    if (urlField.startsWith(prefix) {
        // 删除网址
        item.setField('url', '');

        // 保存更改
        await item.saveTx();
    }
}

await script(item)