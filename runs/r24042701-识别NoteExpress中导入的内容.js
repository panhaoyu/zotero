// 对以下内容进行持续的修改。
// 不要使用Zotero.debug，而是要使用console.log
if (ZoteroPane.getSelectedItems().length) {
    const item = ZoteroPane.getSelectedItems()[0];
    const notes = item.getNotes().map(i => Zotero.Items.get(i).getNote())
    console.log(notes)

    // 获取所有子项，这些子项是笔记
    // Zotero.Items.getAsync(item.id).then(item => item.getNotes()).then(notesIds => {
    //     return Zotero.Items.getAsync(notesIds);
    // }).then(notesItems => {
    //     notesItems.forEach(note => {
    //         // 输出笔记内容
    //         console.log("笔记内容: " + note.getNote());
    //     });
    // });
} else {
    ZoteroPane.displayErrorMessage("没有选中的条目");
}

