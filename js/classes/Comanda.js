"use strict";
/// <reference path='Order.ts'/>
class Comanda {
    constructor(id, client_name, orders, amount, opinion, identifier, table_id, date, photo, mozo_id, status) {
        this.id = id;
        this.client_name = client_name;
        this.orders = orders;
        this.amount = amount;
        this.opinion = opinion;
        this.identifier = identifier;
        this.table_id = table_id;
        this.date = date;
        this.photo = photo;
        this.mozo_id = mozo_id;
        this.status = status;
    }
}
