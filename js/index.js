"use strict";
/// <reference path='./classes/Table.ts'/>
/// <reference path='./classes/Comanda.ts'/>
/// <reference path='constants.js'/>
/// <reference path='./classes/Menu.ts'/>
var token = localStorage.getItem('token');
var headers = { 'token': token };
var role = localStorage.getItem('role');
var user_id = localStorage.getItem('user_id');
var tables = [];
var comandas = [];
var menus = [];
var orders = [];
$(document).ready(() => {
    get_data();
});
function get_data() {
    $('#table_tables').html('');
    tables = [];
    comandas = [];
    $.ajax({
        url: URL_SERVER + '/tables/list',
        headers
    }).done((res) => {
        for (const t of res['tables']) {
            let new_table = new Table(t.id, t.status, t.identifier);
            tables.push(new_table);
        }
        $.ajax({
            url: URL_SERVER + '/menu/all',
            headers
        }).done((res) => {
            for (const m of res['menus']) {
                let new_menu = new Menu(m.id, m.type, m.name, m.amount);
                menus.push(new_menu);
            }
            $.ajax({
                url: URL_SERVER + '/orders/all_activate',
                headers
            }).done((res) => {
                for (const o of res['orders']) {
                    let new_order = new Order(o.id, o.user_id, o.order_type, o.status, o.finalized, o.estimated_time, o.name, o.amount);
                    orders.push(new_order);
                }
                $.ajax({
                    url: URL_SERVER + '/comanda/all_activate'
                }).done((res) => {
                    console.log(JSON.parse(res['comandas'][0].orders));
                    for (const c of res['comandas']) {
                        let new_comanda = new Comanda(c.id, c.client_name, JSON.parse(c.orders), c.amount, c.opinion, c.identifier, c.table_id, c.date, c.photo, c.mozo_id, c.status);
                        comandas.push(new_comanda);
                    }
                    all_tables();
                });
            });
        });
    });
}
function all_tables() {
    $('#modals').html('');
    for (const t of tables) {
        if (t.status == ESTADO_PEDIDOS[3]) {
            let html = `
                        <tr>
                        <td>${t.id}</td>
                        <td>${t.identifier}</td>
                        <td><button class="btn btn-sm btn-success" onclick="open_table(${t.id})">Abrir Mesa</button></td>
                        <td><button class="btn btn-link" disabled>Ver pedido</button></td>
                        </tr>
                    `;
            $('#table_tables').append(html);
        }
        else {
            create_modal(t.id);
            var comanda = null;
            for (const c of comandas) {
                if (c.table_id == t.id) {
                    comanda = c;
                    break;
                }
            }
            let html = `
                        <tr>
                        <td>${t.id}</td>
                        <td>${t.identifier}</td>
                        <td>
                            <select ${comanda.mozo_id == user_id || role == 'SOCIO' ? '' : 'disabled'} class="custom-select custom-select-sm" onchange='update_status(${t.id}, this.value)'>
                                <option id='opt_0_${t.id}' value='${ESTADO_PEDIDOS[0]}' >Cliente esperando pedido</option>
                                <option id='opt_1_${t.id}' value='${ESTADO_PEDIDOS[1]}'>Cliente comiendo</option>
                                <option id='opt_2_${t.id}' value='${ESTADO_PEDIDOS[2]}'>Cliente pagando</option>
                            </select>
                        </td>
                        <td><button class="btn btn-link" data-toggle="modal" data-target="#orderModal_${t.id}"
                        data-backdrop="static"  >Ver pedido</button>`;
            if (role === 'SOCIO') {
                html += `<i id='close_${t.id}' onclick="close_table(${t.id})" class="far fa-times-circle"></i>`;
            }
            html += `</td>   
                        </tr>
                    `;
            $('#table_tables').append(html);
            let id = '#opt_' + ESTADO_PEDIDOS.indexOf(t.status).toString() + '_' + t.id;
            $(id).attr('selected', 'selected');
        }
    }
}
function update_status(id, status) {
    let data = { id, status };
    $.ajax({
        url: URL_SERVER + '/tables/update',
        type: 'POST',
        data,
        headers
    }).done((res) => { get_data(); });
}
function open_table(table_id) {
    let data = { id: table_id };
    $.ajax({
        url: URL_SERVER + '/tables/open_table',
        data,
        type: 'POST',
        headers
    }).done((res) => {
        reload();
    });
}
function close_table(table_id) {
    let comanda_id = 0;
    for (const c of comandas) {
        if (c.table_id == table_id) {
            comanda_id = c.id;
            break;
        }
    }
    $.ajax({
        url: URL_SERVER + '/tables/close_table',
        type: 'POST',
        data: { table_id, comanda_id },
        headers
    }).done((res) => { reload(); });
}
function update_name(input_id, comanda_id) {
    var client_name = $('#inp_' + input_id).val();
    console.log(client_name);
    $.ajax({
        url: URL_SERVER + '/comanda/update_client_name',
        data: { comanda_id, client_name },
        type: 'POST',
        headers
    }).done((res) => { });
}
function reload() {
    window.location.reload();
}
function create_modal(id) {
    var comanda = null;
    console.log(comandas);
    for (const c of comandas) {
        if (c.table_id == id) {
            comanda = c;
            break;
        }
    }
    if (!comanda) {
        return;
    }
    let html = `
    
            <div class="modal fade" id="orderModal_${id}" tabindex="-1" role="dialog" aria-labelledby="orderModalLabel_${id}"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="orderModalLabel_${id}">${comanda.identifier}</h5>
                        <button onclick="reload()" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="container row">
                        <div class="col-12 row my-2">
                            <span id="mod_date_${id}" class="col-12">${comanda.date}</span>

                            <span class="col-8">Nombre del cliente: <input ${comanda.mozo_id == user_id || role == 'SOCIO' ? '' : 'disabled'} type="text" id="inp_${id}" value="${comanda.client_name ? comanda.client_name : ''}"> <i class="fas fa-save" onclick="update_name(${id}, ${comanda.id})"></i></span>

                            <span class="col-12">Mozo id: ${comanda.mozo_id}</span>
                        </div>
                        <div class="col-12 my-2">
                            <div class="col-12">
                                <table class="table">
                                    <thead>
                                        <th>Sector</th>
                                        <th>Menú</th>
                                        <th>Responsable</th>
                                        <th>Estado</th>
                                        <th>Importe</th>
                                    </thead>
                                    <tbody id="load_orders_${id}">
                                        
                                    </tbody>
                                    <tbody id="table_orders_${id}">
                                        <td>
                                            <select ${comanda.mozo_id == user_id || role == 'SOCIO' ? '' : 'disabled'} id="select_type_${id}" class="custom-select custom-select-sm" onchange="load_menus(${id}, this.value)">
                                                <option selected disabled>Elija..</option>
                                                <option value="COCINA">Cocina</option>
                                                <option value="CERVEZA">Cerveza</option>
                                                <option value="BARTENDER">Bartender</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select ${comanda.mozo_id == user_id || role == 'SOCIO' ? '' : 'disabled'} class="custom-select custom-select-sm" onchange="enable_append(${id})" id="select_orders_${id}">
                                            </select>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td id="amount_${id}">
                                        </td>
                                    </tbody>
                                </table>
                                <button onclick="new_order(${comanda.id}, ${id})" class="btn btn-sm btn-primary" id="btn_append_${id}" disabled>Agregar</button>
                            </div>

                        </div>

                        <hr>

                        <div class="col-12 row my-2">
                            <div class="col-12">
                                <button>Imprimir Identificación</button>
                                <button>Subir Foto</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    `;
    $('#modals').append(html);
    load_orders(comanda.orders, id);
}
function load_menus(id, value) {
    let select = '<option selected>Elija..</option>';
    let amount = 0;
    for (const m of menus) {
        if (m.type === value) {
            select += `<option value=${m.id}>${m.name}</option>`;
        }
    }
    $('#select_orders_' + id).html(select);
    $('#btn_append_' + id).attr('disabled', 'disabled');
}
function enable_append(id) {
    $('#btn_append_' + id).removeAttr('disabled');
}
function new_order(comanda_id, id) {
    let menu_id = $('#select_orders_' + id).val();
    $.ajax({
        url: URL_SERVER + '/orders/new',
        type: 'POST',
        data: { comanda_id, menu_id },
        headers
    }).done((res) => {
    });
}
function load_orders(data, id) {
    let html = '';
    for (const o of data) {
        let order_id = parseInt(o);
        console.log(o);
        for (const ord of orders) {
            if (order_id === ord.id) {
                html += `
                    <tr>
                    <td>${ord.order_type}</td>
                    <td>${ord.name}</td>
                    <td>${ord.user_id ? ord.user_id : 'Sin asignación'}</td>
                    <td>${ord.status}</td>
                    <td>$ ${ord.amount}</td>
                    </tr>
                `;
            }
        }
    }
    $('#load_orders_' + id).html(html);
}
