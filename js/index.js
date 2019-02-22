"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/// <reference path='./classes/Table.ts'/>
$(document).ready(() => {
    all_tables();
});
function all_tables() {
    $.ajax({
        url: URL_SERVER + '/tables/list',
        success: (res) => {
            console.log(res);
            let tables = res['tables'];
            $('#table_tables').html('');
            $('#modals').html('');
            for (const t of tables) {
                create_modal(t.id);
                if (t.status === ESTADO_PEDIDOS[3]) {
                    let html = `
                        <tr>
                        <td>${t.id}</td>
                        <td>${t.identifier}</td>
                        <td><button class="btn btn-sm btn-success" onclick="update_status(${t.id}, '${ESTADO_PEDIDOS[0]}', true)">Abrir Mesa</button></td>
                        <td><button class="btn btn-link" disabled>Ver pedido</button></td>
                        </tr>
                    `;
                    $('#table_tables').append(html);
                }
                else {
                    let html = `
                        <tr>
                        <td>${t.id}</td>
                        <td>${t.identifier}</td>
                        <td>
                            <select onchange='update_status(${t.id}, this.value)'>
                                <option id='opt_0_${t.id}' value='${ESTADO_PEDIDOS[0]}' >Cliente esperando pedido</option>
                                <option id='opt_1_${t.id}' value='${ESTADO_PEDIDOS[1]}'>Cliente comiendo</option>
                                <option id='opt_2_${t.id}' value='${ESTADO_PEDIDOS[2]}'>Cliente pagando</option>
                            </select>
                        </td>
                        <td><button class="btn btn-link" data-toggle="modal" data-target="#orderModal_${t.id}"
                        data-backdrop="static"  >Ver pedido</button><i class="far fa-times-circle"></i></td>   
                        </tr>
                    `;
                    $('#table_tables').append(html);
                    let id = '#opt_' + ESTADO_PEDIDOS.indexOf(t.status).toString() + '_' + t.id;
                    console.log(id);
                    $(id).attr('selected', 'selected');
                }
            }
            //  $('#table_tables').html(html);
        }
    });
}
function update_status(id, status, open = false) {
    let data_comanda;
    if (open) {
        data_comanda = open_table(id);
    }
    console.log(data_comanda);
    let data = { id, status };
    $.ajax({
        url: URL_SERVER + '/tables/update',
        type: 'POST',
        data,
        success: (res) => {
            all_tables();
        }
    });
    if (open) {
        $('#orderModalLabel_' + id.toString()).html(data_comanda['identifier']);
        $('#mod_date_' + id.toString()).html(data_comanda['date']);
    }
}
function open_table(table_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let mozo_id = localStorage.getItem('user_id');
        let data = { table_id, mozo_id };
        yield $.ajax({
            url: URL_SERVER + '/comanda/new',
            data,
            type: 'POST',
            success: (res) => {
                return res['comanda'];
            }
        });
    });
}
function create_modal(id) {
    let html = `
    
            <div class="modal fade" id="orderModal_${id}" tabindex="-1" role="dialog" aria-labelledby="orderModalLabel_${id}"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="orderModalLabel_${id}"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="container row">
                        <div class="col-12 row my-2">
                            <span id="mod_date_${id}" class="col-12"></span>

                            <span class="col-12">Nombre del cliente: <input type="text" name="" id=""> </span>

                            <span class="col-12">Nombre del mozo: </span>
                        </div>
                        <div class="col-12 my-2">
                            <div class="col-12">
                                <table class="table">
                                    <thead>
                                        <th>Sector</th>
                                        <th>Responsable</th>
                                        <th>Estado</th>
                                        <th>Importe</th>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                                <button>Agregar</button>
                            </div>

                        </div>

                        <hr>

                        <div class="col row my-2">
                            <div class="col-6">
                                <button>Imprimir Identificación</button>
                                <button>Subir Foto</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
    $('#modals').append(html);
}
