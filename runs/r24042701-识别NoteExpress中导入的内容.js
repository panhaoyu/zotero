/*
你将写一段可以在Zotero本地客户端里面的Run Javascript功能里面直接可以运行的代码。
对以下代码进行修改，根据todo里面的内容进行修改。
遵循以下要求：
- 不要使用Zotero.debug而是要使用console.log进行日志的输出。
- 不必向我解释编码的过程，不要先为我解释要做什么事情，准备做什么事情，而是直接给我代码。
- 避免使用正则表达式
 */
for (const item of ZoteroPane.getSelectedItems()) {
    const notes = item.getNotes().map(i => Zotero.Items.get(i).getNote()).map(noteContent => {
        noteContent = noteContent.replace('<p>', ""); // 移除所有HTML标签
        noteContent = noteContent.replace('</p>', "");  // 移除所有HTML标签
        if (!noteContent.startsWith('NoteExpress Custom Data')) {
            // todo 删除该条笔记
            return
        }

        // 转换注释内容为键值对格式
        const keyValuePairs = {};
        const lines = noteContent.split('<br/>');
        for (const line of lines) {
            const [key, value] = line.split(':');
            if (key && value) {
                keyValuePairs[key.trim()] = value.trim();
            }
        }

        return keyValuePairs;
    }).filter(i => i !== undefined)
    if (notes.length !== 1) {
        throw '无法识别到相应的笔记'
    }
    const meta = notes[0]
}