"use strict";
class Order {
    constructor(id, user_id, order_type, status, finalized, estimated_time, name, amount) {
        this.id = id;
        this.user_id = user_id;
        this.order_type = order_type;
        this.status = status;
        this.finalized = finalized;
        this.estimated_time = estimated_time;
        this.name = name;
        this.amount = amount;
    }
}
