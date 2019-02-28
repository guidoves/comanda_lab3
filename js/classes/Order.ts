
class Order{
    public id: Number;
    public user_id: Number;
    public order_type: String;
    public status: String;
    public finalized: String;
    public estimated_time: Number;
    public name: String;
    public amount: Number;

    constructor(id: Number, user_id: Number, order_type: String, 
        status: String, finalized: String, estimated_time: Number, name: String, amount:Number){
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