/*
你将写一段可以在Zotero本地客户端里面的Run Javascript功能里面直接可以运行的代码。
对以下代码进行修改，根据todo里面的内容进行修改。
遵循以下要求：
- 不要使用Zotero.debug而是要使用console.log进行日志的输出。
 */
for (const item of ZoteroPane.getSelectedItems()) {
    const notes = item.getNotes().map(i => Zotero.Items.get(i).getNote())
    console.log(notes)
    // todo 每一个笔记的格式都如下所示，对其进行调整，转换为纯文本，删除格式标记。
    // <p>NoteExpress Custom Data<br/>Tags: 热; EGS; 结构面; 目录-粗糙度<br/>Rating: 3<br/>NoteExpress ID: 1417</p>
}