/// <reference path='Order.ts'/>

class Comanda{
    public id: Number;
    public client_name: String;
    public orders: String[];
    public amount: String;
    public opinion: Object;
    public identifier: String;
    public table_id: Number;
    public date: String;
    public photo: String;
    public mozo_id: Number;
    public status: String;

    constructor(id: Number, client_name: String, orders: String[],
        amount: String, opinion: Object, identifier: String,
        table_id: Number, date: String, photo: String, mozo_id: Number,
        status: String){
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