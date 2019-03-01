/// <reference path='./classes/Order.ts'/>
/// <reference path='constants.js'/>

var token = localStorage.getItem('token');
var headers = { 'token': token };
var role = localStorage.getItem('role');
var user_id = localStorage.getItem('user_id');
var orders: Order[] = [];

$(document).ready(() => {
    get_data_orders();
});


function get_data_orders() {

    $('#table_orders').html('');
    orders = [];

    $.ajax({
        url: URL_SERVER + '/orders/all_by_type',
        headers,
        data: { 'order_type': role }
    }).done((res) => {
        for (const o of res['orders']) {
            let new_order = new Order(o.id, o.user_id, o.order_type, o.status, o.finalized,
                o.estimated_time, o.name, o.amount);
            orders.push(new_order);
        }

        all_orders();

    });

}


function all_orders() {
    $('#modals_employee').html('');
    let html = '';

    if (orders.length > 0) {
        for (const o of orders) {
            html += `
                <tr>
                <td>${o.name}</td>
                <td>${o.status}</td>
                <td>${o.user_id ? o.user_id : 'SIN ASIGNAR'}</td>
                <td>${o.estimated_time ? o.estimated_time : 'SIN ASIGNAR'}</td>
                <td>${o.status == 'PENDIENTE' ? `<button data-backdrop="static" data-toggle="modal" data-target="#modal_employee_${o.id}" class="btn btn-sm btn-success">Comenzar pedido</button>` : `${o.status != 'LISTO PARA SERVIR' ? `<button onclick="update_status_order(${o.id}, 'LISTO PARA SERVIR')" class="btn btn-sm btn-warning">Listo</button>`: `<button onclick="update_status_order(${o.id}, 'EN PREPARACION')" class="btn btn-sm btn-primary">Trabajando</button>`}<button data-backdrop="static" data-toggle="modal" data-target="#modal_employee_${o.id}" class="btn btn-sm btn-danger">Finalizar pedido</button>`}</td>
                </tr>
            `;
            create_modal_employees(o.id, o.status == 'PENDIENTE');
        }
    }
    else{
        html += `<strong>SIN PEDIDOS</strong>`;
    }

    $('#table_orders').html(html);
    

}


function create_modal_employees(id: Number, start: boolean) {
    let html = `
                <div  id="modal_employee_${id}" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal_employee_${id}" aria-hidden="true">
                <div class="modal-dialog-centered modal-dialog modal-sm">
                <div class="modal-content"><div class="modal-header">
                <div class="modal-title" >${start ? 'Asignar pedido' : 'Confirmación de finalización'}</div>
                <button onclick="reload_employee()" type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
    if(start){
        html += `<div >
                <div class="col-12 mb-1"><input oninput="enabled_start(${id})" class="form-control" id="input_${id}" placeholder="Tiempo estimado (minutos)"></div>
        
                <div class="col-12 text-center"><button onclick="start_order(${id})" id="btn_ok_${id}" disabled  class="btn btn-sm btn-success">Aceptar</button></div>
                </div>        
        </div>  
        </div>
        </div>
        `;
    }
    else{
        html += `<div >
                <div class="col-12 text-center"><button onclick="end_order(${id})"  class="btn btn-sm btn-danger">Aceptar</button></div>
                </div>        
        </div>  
        </div>
        </div>
        `;
    }
        
    $('#modals_employee').append(html);
}

function enabled_start(id:Number){
    let estimated_time = parseInt($('#input_' + id).val());

    if(estimated_time > 0){
        $('#btn_ok_' + id).removeAttr('disabled');
    }
    else{
        $('#btn_ok_' + id).attr('disabled', 'disabled');
    }
    
}

function reload_employee() {
    window.location.reload();
}

function start_order(order_id:Number){
    
    let estimated_time = $('#input_' + order_id).val();
    
    $.ajax({
        url: URL_SERVER + '/orders/update_status',
        type: 'POST',
        headers,
        data : {order_id, 'status' : 'PENDIENTE', estimated_time }
    }).done((res)=>{reload_employee();})
}

function end_order(order_id:Number){
    $.ajax({
        url: URL_SERVER + '/orders/close';
        headers,
        data: {order_id},
        type: 'POST'
    }).done((res)=>{reload_employee();})
}

function update_status_order(order_id:Number, status:String){
    $.ajax({
        url: URL_SERVER + '/orders/update_status',
        type: 'POST',
        headers,
        data : {order_id, status }
    }).done((res)=>{reload_employee();})
}