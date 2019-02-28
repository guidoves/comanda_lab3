/// <reference path='Order.ts'/>

 class Table {
   public id: Number;
   public status: String;
   public identifier: String;

   constructor(id: Number, status: String, identifier: String){
       this.id = id;
       this.status = status;
       this.identifier = identifier;
   }

}