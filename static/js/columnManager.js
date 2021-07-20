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
                domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, content)
            }
        }
    },
}
