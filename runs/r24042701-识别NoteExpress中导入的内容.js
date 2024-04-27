// 对以下内容进行持续的修改。
// 不要使用Zotero.debug，而是要使用console.log
// 筛选如下格式的笔记：
// 笔记内容: <p>NoteExpress Custom Data<br/>Tags: 热; EGS; 结构面; 目录-粗糙度<br/>Rating: 3<br/>NoteExpress ID: 1417</p>
// 首先转换为纯文本，然后获取其第一行的数据。
// 确保选中的条目有且仅有一个笔记的第一行符合要求。
// 然后将后续的行转换为键值对，并log出来
if (ZoteroPane.getSelectedItems().length) {
    var item = ZoteroPane.getSelectedItems()[0];

    // 获取所有子项，这些子项是笔记
    Zotero.Items.getAsync(item.id).then(item => item.getNotes()).then(notesIds => {
        return Zotero.Items.getAsync(notesIds);
    }).then(noteasItems => {
        notesItems.forEach(note => {
            // 输出笔记内容
            console.log("笔记内容: " + note.getNote());
        });
    });
} else {
    ZoteroPane.displayErrorMessage("没有选中的条目");
}

