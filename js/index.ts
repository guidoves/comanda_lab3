/// <reference path='./classes/Table.ts'/>
$(document).ready(()=>{

    all_tables();
});

function all_tables(){

    $.ajax({
        url: URL_SERVER + '/tables/list',
        success: (res)=>{
            console.log(res);
            let tables: Table[] = res['tables'];

            $('#table_tables').html('');

            for (const t of tables) {
        
                if(t.status === ESTADO_PEDIDOS[3]){
                   let html = `
                        <tr>
                        <td>${t.id}</td>
                        <td>${t.identifier}</td>
                        <td><button class="btn btn-sm btn-success" onclick="update_status(${t.id}, '${ESTADO_PEDIDOS[0]}')">Abrir Mesa</button></td>
                        <td><button class="btn btn-link" disabled>Ver pedido</button></td>
                        </tr>
                    `;
                    $('#table_tables').append(html);
                }
                else{
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
                        <td><button class="btn btn-link">Ver pedido</button><i class="far fa-times-circle"></i></td>   
                        </tr>
                    `;
                    $('#table_tables').append(html);
                    
                    let id = '#opt_' + ESTADO_PEDIDOS.indexOf(t.status).toString() + '_' +t.id;

                    console.log(id);
                    
                    $( id ).attr('selected','selected');
                }
            }

          //  $('#table_tables').html(html);
        }
    });

}


function update_status(id: Number, status: String){
    
    let data: Object = { id, status };
    console.log(ESTADO_PEDIDOS[1]);
    $.ajax({
        url: URL_SERVER + '/tables/update',
        type: 'POST',
        data,
        success: (res)=>{
            all_tables();
        }

    });
}
