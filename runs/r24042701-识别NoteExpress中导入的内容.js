/*
你将写一段可以在Zotero本地客户端里面的Run Javascript功能里面直接可以运行的代码。
对以下代码进行修改，根据todo里面的内容进行修改。
遵循以下要求：
- 不要使用Zotero.debug而是要使用console.log进行日志的输出。
- 不必向我解释编码的过程，不要先为我解释要做什么事情，准备做什么事情，而是直接给我代码。
- 避免使用正则表达式
- 只需要给我发生变动的代码。对于不相关的代码不必重复。
 */
(async () => {
    const baseDir = 'F:\\OneDrive\\1002-data\\24041201-note-express\\rock.Attachments\\'
    const fileStats = {};
    await Zotero.File.iterateDirectory(baseDir, async i => {
        const fileNameParts = i.name.split(' '); // Assumes file names are separated by spaces and the first part is the numeric key
        const key = fileNameParts[0]; // The first part of the filename, expected to be numeric
        if (!fileStats[key]) {
            fileStats[key] = [];
        }
        fileStats[key].push(i);
    })
    for (const item of ZoteroPane.getSelectedItems()) {
        const notes = item.getNotes().map(i => {
            const noteItem = Zotero.Items.get(i)
            let noteContent = noteItem.getNote()
            noteContent = noteContent.replace('<p>', ""); // 移除所有HTML标签
            noteContent = noteContent.replace('</p>', "");  // 移除所有HTML标签
            if (!noteContent.startsWith('NoteExpress Custom Data')) {
                Zotero.DB.executeTransaction(async () => {
                    await noteItem.erase()
                });
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
        const noteExpressId = meta['NoteExpress ID']
        const rating = meta['Rating']
        const tags = meta['Tags'].split('; ').map(i => i.trim()).map(i => {
            if (i.startsWith('目录-')) {
                return i.split('-', 2)[1]
            } else {
                return i
            }
        }).map(i => `#${i}`)
        item.setTags(tags.map(tag => ({tag})));
        await Zotero.DB.executeTransaction(async () => {
            await item.save();
        });

        try {
            const v = await Zotero.File.iterateDirectory(baseDir, true)
            console.log(v)
        } catch (error) {
            console.log('Error accessing directory:', error);
        }
    }
})().then()
