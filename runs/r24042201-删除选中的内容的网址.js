// 这段代码需要在Zotero的环境中运行
async function removeURLsFromSelectedItems() {
    // 获取当前选中的所有文献
    let items = Zotero.getActiveZoteroPane().getSelectedItems();

    // 遍历每个选中的文献
    for (let item of items) {
        // 确保当前对象是一个文献条目
        if (item.isRegularItem() && !item.isAttachment() && !item.isNote()) {
            // 访问文献的网址字段
            let urlField = item.getField('url');

            // 检查是否存在网址
            if (urlField) {
                // 删除网址
                item.setField('url', '');

                // 保存更改
                await item.saveTx();
            }
        }
    }
}

// 调用函数
removeURLsFromSelectedItems();