/*
示例的RIS文件的题录格式如下，可以对NoteExpress的模板进行编辑，主要是添加一个新的N1字段，也就是下面的示例里面的最后一个字段。
这样就可以通过读取该字段中的标题实现相应的文件匹配。
需要先将文件借助NoteExpress重命名为相应的格式，即文献编号 序号格式。
从而可以实现文件、标签、评级、主题的导入。

这里主要是考虑到了我的个人使用习惯，即，阅读文献后，借助优先级标注文献的质量，在主题字段中进行总结，并添加标签。
因此，NoteExpress的导出样式以及这里的导入方法均与我的个人习惯相匹配。
标签以及评级都是通过Tags导入的，其中标签导入为#Tag，而评级导入为星星，这两个功能应该是Style插件所提供的。

在使用本代码进行导入的过程中，勿必不要直接使用，而是完全读懂逻辑后按照自己的要求进行重写。
在使用本代码进行导入的过程中，勿必不要直接使用，而是完全读懂逻辑后按照自己的要求进行重写。
在使用本代码进行导入的过程中，勿必不要直接使用，而是完全读懂逻辑后按照自己的要求进行重写。
在使用本代码进行导入的过程中，勿必不要直接使用，而是完全读懂逻辑后按照自己的要求进行重写。
在使用本代码进行导入的过程中，勿必不要直接使用，而是完全读懂逻辑后按照自己的要求进行重写。

TY  - JOUR
AU  - Author A
AU  - Author B
AU  - Author C
PY  - 2018
TI  - This is the title
SP  - 2219-2231
JF  - The journal name
VL  - 37
IS  - 10
SN  - 1000-6915
M3  - 10.0000/a.b.c.e.f.g
N2  - This is the abstract.
AD  - xxx; xxx
UR  - https://link.to/paper
DO  - 10.0000/a.b.c.e.f.g
N1  - NoteExpress Custom Data
Tags: 渗流剪切; 目录-渗流剪切
Rating: 0
NoteExpress ID: 169
Subject: XXXXX
ER  -


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
    let i = 0
    ZoteroPane.getSelectedItems().map(item => (async () => {
        i += 1
        console.log(`Processing ${i}: ${item.getField('title')}`)
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
            console.error('无法识别到相应的笔记')
            return
        }
        const meta = notes[0]
        const noteExpressId = meta['NoteExpress ID']
        const rating = Number.parseInt(meta['Rating'] ?? `0`)
        const subject = meta['Subject']
        const tags = meta['Tags'].split('; ')
            .map(i => i.trim())
            // .map(i => i.startsWith('目录-') ? i.split('-', 2)[1] : i)
            .map(i => `#${i}`)
        tags.push([...Array(rating).keys()].map(_ => '⭐').join(''))
        item.setTags(tags.filter(t => t.length > 0).map(tag => ({tag})));

        if (subject) {
            const extra = item.getField('extra')
            const newExtra = `${extra}\nNESubject: ${subject}`
            item.setField('extra', newExtra)
        }


        await Zotero.DB.executeTransaction(async () => {
            await item.save();
        });
        const files = fileStats[noteExpressId] ?? []
        for (const file of files) {
            await Zotero.Attachments.importFromFile({
                file: file.path, parentItemID: item.id,
            })
        }
        item.getNotes().map(i => {
            const noteItem = Zotero.Items.get(i)
            Zotero.DB.executeTransaction(async () => {
                await noteItem.erase()
            });
        })
    })())
})().then()
