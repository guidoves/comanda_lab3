"use strict";
var role = localStorage.getItem('role');
var user_name = localStorage.getItem('user_name');
var header = `<div>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">${user_name}</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        ${role == 'SOCIO' ? `<ul id="nav_list" class="navbar-nav mr-auto">
            <li class="nav-item">
                <a class="nav-link" href="./index.html">Mesas</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="./employees.html">Pedidos</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Administración
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" href="./estadisticas.html">Estadísticas</a>
                    <a class="dropdown-item" href="#">Mesas</a>
                    <a class="dropdown-item" href="#">Menú</a>
                </div>
            </li>
        </ul>` : `<ul class="navbar-nav mr-auto"></ul>`}
        <div class="form-inline align-right my-2 my-lg-0">
            <button onclick="log_out()" class="btn btn-outline-danger my-2 my-sm-0">Logout</button>
        </div>
    </div>
</nav>
</div>`;
$('#header').html(header);
function log_out() {
    localStorage.clear();
    window.location.href = './login.html';
}
