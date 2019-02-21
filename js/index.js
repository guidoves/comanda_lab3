"use strict";
/// <reference path='./classes/Table.ts'/>
$(document).ready(function () {
    all_tables();
});
function all_tables() {
    $.ajax({
        url: URL_SERVER + '/tables/list',
        success: function (res) {
            console.log(res);
            var tables = res['tables'];
            $('#table_tables').html('');
            for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
                var t = tables_1[_i];
                if (t.status === ESTADO_PEDIDOS[3]) {
                    var html = "\n                        <tr>\n                        <td>" + t.id + "</td>\n                        <td>" + t.identifier + "</td>\n                        <td><button class=\"btn btn-sm btn-success\" onclick=\"update_status(" + t.id + ", '" + ESTADO_PEDIDOS[0] + "')\">Abrir Mesa</button></td>\n                        <td><button class=\"btn btn-link\" disabled>Ver pedido</button></td>\n                        </tr>\n                    ";
                    $('#table_tables').append(html);
                }
                else {
                    var html = "\n                        <tr>\n                        <td>" + t.id + "</td>\n                        <td>" + t.identifier + "</td>\n                        <td>\n                            <select onchange='update_status(" + t.id + ", this.value)'>\n                                <option id='opt_0_" + t.id + "' value='" + ESTADO_PEDIDOS[0] + "' >Cliente esperando pedido</option>\n                                <option id='opt_1_" + t.id + "' value='" + ESTADO_PEDIDOS[1] + "'>Cliente comiendo</option>\n                                <option id='opt_2_" + t.id + "' value='" + ESTADO_PEDIDOS[2] + "'>Cliente pagando</option>\n                            </select>\n                        </td>\n                        <td><button class=\"btn btn-link\">Ver pedido</button><i class=\"far fa-times-circle\"></i></td>   \n                        </tr>\n                    ";
                    $('#table_tables').append(html);
                    var id = '#opt_' + ESTADO_PEDIDOS.indexOf(t.status).toString() + '_' + t.id;
                    console.log(id);
                    $(id).attr('selected', 'selected');
                }
            }
            //  $('#table_tables').html(html);
        }
    });
}
function update_status(id, status) {
    var data = { id: id, status: status };
    console.log(ESTADO_PEDIDOS[1]);
    $.ajax({
        url: URL_SERVER + '/tables/update',
        type: 'POST',
        data: data,
        success: function (res) {
            all_tables();
        }
    });
}
