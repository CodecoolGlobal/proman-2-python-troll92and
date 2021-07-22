export const htmlTemplates = {
    board: 1,
    column: 2,
    card: 3
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.column:
            return columnBuilder
        case htmlTemplates.card:
            return cardBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board) {
    return `<div class="board-container" board-id="${board.id}">
                <div class="board-header"><span class="board-title" title-id="${board.id}" contenteditable="true">${board.title}</span>
                    <button class="add-new-card" new-card-id="${board.id}">New card</button>
                    <button class="add-new-status" new-status-id="${board.id}">New status</button>
                    <button class="delete-board-button" delete-board-id="${board.id}">Delete Board</button>
                    <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
                </div>
                <div class="board-columns">
                
                </div>
            </div>`;
}

function columnBuilder(column) {
    return `<div class="board-column" data-column-id="${column.id}">
                <span class="board-column-title" column-title-id="${column.id}" contenteditable="true">${column.title}</span>
                <button class="delete-column-button" data-delete-status-id="${column.id}" data-delete-owner-id="${column.owner}">X</button>
                <div class="board-column-content"></div>
            </div>`
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" data-card-order="${card.card_order}" draggable="true">
                <span class="card-title" card-title-id="${card.id}" contenteditable="true">${card.title}</span>
                <div class="card-remove" data-card-id="${card.id}">X</div>
            </div>`;
}
