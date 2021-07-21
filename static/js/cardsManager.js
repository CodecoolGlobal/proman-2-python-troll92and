import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card)
            domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="${card.status_id}"] .board-column-content`, content)
            domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`, "click", cardsManager.deleteButtonHandler)
        }
    },
    deleteButtonHandler: async function(clickEvent) {
        const cardId = clickEvent.target.attributes['data-card-id'].nodeValue;
        let item = document.querySelector(`.card[data-card-id="${cardId}"]`)
        let parent = item.parentNode

        parent.removeChild(item)
        await dataHandler.deleteCardById(cardId)
    }
}



async function cardOrder(boardId, columnId){
    const cards = await dataHandler.getCardOrderByBoardColumnId(boardId,columnId);

}

