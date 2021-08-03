import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumns();

        for (let column of columns) {
            if (column.owner === boardId || column.owner === "global") {
                const columnBuilder = htmlFactory(htmlTemplates.column);
                const content = columnBuilder(column)
                await domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, content)
                domManager.addEventListener(`.board-column-title[column-title-id='${column.id}']`, "click", columnsManager.changeColumnTitle)
            }
            let delete_buttons = document.querySelectorAll(`.delete-column-button[data-delete-status-id="${column.id}"], .delete-column-button[data-delete-owner-id="${column.owner}"]`)
            for (let delete_button of delete_buttons) {
                if (delete_button.getAttribute('data-delete-owner-id') === 'global') {//node.dataset
                    delete_button.parentNode.removeChild(delete_button)
                } else {
                    delete_button.addEventListener("click", columnsManager.deleteStatus)
                }
            }
        }
        let column_content_fields = document.getElementsByClassName("board-column-content")
        await columnsManager.insertDragged(column_content_fields)
    },
    deleteStatus: async function (clickEvent) {
        const statusId = clickEvent.target.attributes['data-delete-status-id'].nodeValue;
        const ownerId = clickEvent.target.attributes['data-delete-owner-id'].nodeValue;
        let item = document.querySelector(`.board-column[data-column-id="${statusId}"], .board-column[data-owner-id="${ownerId}"]`)
        let parent = document.querySelector(`.board-container[board-id="${ownerId}"] .board-columns`)
        parent.removeChild(item)
        await dataHandler.deleteStatusById(ownerId, statusId)
    },
    insertDragged: async function (column_content_fields) {
        for (let column_content_field of column_content_fields) {
            column_content_field.addEventListener('dragover', e => {
                e.preventDefault()
                const draggable = document.querySelector('.dragging')
                draggable.setAttribute('over_content', 'true')
                if (draggable.getAttribute('over_card') === 'false') {
                    if (draggable.getAttribute('over_content') === 'true') {
                        column_content_field.appendChild(draggable)
                    }
                }
            })

            column_content_field.addEventListener('dragleave', e => {
                const draggable = document.querySelector('.dragging')
                draggable.setAttribute('over_content', 'false')
                draggable.setAttribute('over_card', 'false')
            })
        }
    },
    changeColumnTitle: function (clickEvent) {
        const columnId = clickEvent.target.attributes['column-title-id'].nodeValue;
        let element = document.querySelector(`.board-column-title[column-title-id='${columnId}']`)
        let oldText = element.innerText
        element.addEventListener('focusout', async () => {
            let title = element.innerText
            if (title === "") {
                element.innerText = "unnamed"
                await dataHandler.renameColumn(columnId, "unnamed")
            } else if (title !== oldText) {
                await dataHandler.renameColumn(columnId, title)
            }
        })
    },
    orderCards: async function(card){
        let cardID = card.attributes['data-card-id'].nodeValue
        let cards_parent = document.querySelector(`.card[data-card-id="${cardID}"]`)
        let children = cards_parent.parentNode.childNodes
        let order = 1
        for (let child of children){
            child.attributes['data-card-order'].nodeValue = order
            await dataHandler.updateCardOrder(child.attributes['data-card-id'].nodeValue, order)
            order++
        }
    }
}


