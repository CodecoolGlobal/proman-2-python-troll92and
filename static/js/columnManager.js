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
                domManager.addEventListener(`.delete-column-button[delete-status-id="${column.owner}"]`, "click", deleteStatus)
                domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, content)
            }
        }
    },
}

async function deleteStatus(clickEvent){
    const statusId = clickEvent.target.attributes['delete-status-id'].nodeValue;
    //get board id by status id
    let column = "";
    const columns = await dataHandler.getColumns();
    for (let status of columns){
        if (status.id === statusId){
            column = status;
            break;
        }
    }


    await dataHandler.deleteStatusById(column.owner, statusId)
    root.board-container.
}



