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
        await cardsManager.dragCards()

    },
    deleteButtonHandler: async function(clickEvent) {
        const cardId = clickEvent.target.attributes['data-card-id'].nodeValue;
        let item = document.querySelector(`.card[data-card-id="${cardId}"]`)
        let parent = item.parentNode

        parent.removeChild(item)
        await dataHandler.deleteCardById(cardId)
    },
    dragCards: async function (){
        let dragAbles = document.getElementsByClassName('card')
        for (let dragAble of dragAbles){
            dragAble.addEventListener('dragstart', () => {
                dragAble.classList.add('dragging')
                console.log('start')
            })

            dragAble.addEventListener('dragend', () => {
                dragAble.classList.remove('dragging')
                console.log('end')
            })
        }

    }
}



async function cardOrder(boardId, columnId){
    const cards = await dataHandler.getCardOrderByBoardColumnId(boardId,columnId);

}

