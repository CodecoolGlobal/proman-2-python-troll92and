import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumns();

        for (let column of columns) {
            if (column.owner === boardId || column.owner === "global"){
                const columnBuilder = htmlFactory(htmlTemplates.column);
                const content = columnBuilder(column)
                await domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, content)
            }
            let delete_buttons = document.querySelectorAll(`.delete-column-button[data-delete-status-id="${column.id}"], .delete-column-button[data-delete-owner-id="${column.owner}"]`)
            for (let delete_button of delete_buttons){
                delete_button.addEventListener("click", columnsManager.deleteStatus)
            }
        }
        await columnsManager.insertDragged()
    },
    deleteStatus: async function(clickEvent) {
        const statusId = clickEvent.target.attributes['data-delete-status-id'].nodeValue;
        const ownerId = clickEvent.target.attributes['data-delete-owner-id'].nodeValue;
        let item = document.querySelector(`.board-column[data-column-id="${statusId}"], .board-column[data-owner-id="${ownerId}"]`)
        let parent = document.querySelector(`.board-container[board-id="${ownerId}"] .board-columns`)
        console.log(parent)
        console.log(item)
        parent.removeChild(item)
        await dataHandler.deleteStatusById(ownerId, statusId)
        console.log("done")
    },
    insertDragged: async function(){
        let column_content_fields = document.getElementsByClassName("board-column-content")
            for (let column_content_field of column_content_fields){
                column_content_field.addEventListener('dragover', e => {
                    e.preventDefault()
                    const draggable = document.querySelector('.dragging')
                    column_content_field.appendChild(draggable)
                    //draggable.parentNode.childNodes()
                })
            }
    },
    saveDragDrop: async function(){

    }
}
