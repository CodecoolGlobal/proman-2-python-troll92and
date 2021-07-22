from flask import Flask, render_template, url_for, request
from util import json_response

import queires

import mimetypes
mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queires.get_boards()


@app.route("/get-columns")
@json_response
def get_columns():
    """
    All the columns
    """
    return queires.get_all_columns()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


@app.route("/get-cards/<int:board_id>/<int:column_id>")
@json_response
def get_card_order(board_id: int, column_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    :param column_id: id of the parent column board
    """

    return queires.get_card_order(board_id, column_id)


@app.route("/get-last-card-id")
@json_response
def get_last_card_id():
    return queires.get_max_id_card()


@app.route("/get-last-status-id")
@json_response
def get_last_status_id():
    return queires.get_max_id_status()


@app.route("/get-last-board-id")
@json_response
def get_last_board():
    return queires.get_max_id_board()


@app.route("/add-new-card/<data>", methods=["POST"])
@json_response
def add_new_card(data):
    queires.add_new_card(list(data.split(',')))


@app.route("/add-new-status/<data>", methods=["POST"])
@json_response
def add_new_status(data):
    queires.add_new_status(list(data.split(',')))


@app.route("/add-new-board/<data>", methods=["POST"])
@json_response
def add_new_board(data):
    queires.add_new_board(data)


@app.route("/delete-board-by-id/<int:board_id>", methods=["POST"])
@json_response
def delete_board_by_id(board_id):
    queires.delete_all_cards_by_board_id(board_id)
    queires.delete_all_statuses_by_board_id(str(board_id))
    queires.delete_board_by_id(board_id)


@app.route("/delete-status-by-id/<string:board_id>/<string:status_id>", methods=["POST"])
@json_response
def delete_status_by_id(board_id, status_id):
    queires.delete_all_cards_by_board_status_id(board_id, status_id)
    queires.delete_all_statuses_by_board_status_id(str(board_id), status_id)


@app.route("/delete-card-by-id/<string:card_id>", methods=["POST"])
@json_response
def delete_card_by_id(card_id):
    queires.delete_card_by_id(card_id)


@app.route("/update-card-by-id/<data>", methods=["POST"])
@json_response
def update_card_position(data):
    data = list(data.split(','))
    queires.update_card_position(data)


@app.route("/update-card-order/<data>", methods=["POST"])
@json_response
def update_card_order(data):
    data = list(data.split(','))
    queires.update_card_order(data)


@app.route("/rename-board-by-id/<int:board_id>/<string:board_title>", methods=["POST"])
@json_response
def rename_board_by_id(board_id, board_title):
    queires.rename_board_by_id(board_id, board_title)


@app.route("/rename-column-by-id/<int:column_id>/<string:column_title>", methods=["POST"])
@json_response
def rename_column_by_id(column_id, column_title):
    queires.rename_column_by_id(column_id, column_title)


@app.route("/rename-card-by-id/<int:card_id>/<string:card_title>", methods=["POST"])
@json_response
def rename_card_by_id(card_id, card_title):
    queires.rename_card_by_id(card_id, card_title)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
