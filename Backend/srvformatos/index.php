<?php
////////////////////////////////////////////////////////////////////////////////
// INDEX DEL SISTIO ASISTENCIA PASANTES DEL SISTEMA PASANTESAPP
// SERVIDOR CODE
//
/////////////////////////////////////////////////////////////////////////////////
include 'appconfig.php';

include_once PAGE_URL . '/class/config.php';
include_once PAGE_URL . '/class/exception_object.php';
include_once PAGE_URL . '/Database/databasev2.php';
include_once PAGE_URL . '/class/servicios/classServiciosFormatos.php';


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if (isset($_SERVER['HTTP_ORIGIN'])) {
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 86400');
}


if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
	header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
}

if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
	header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}

$json = file_get_contents('php://input');
$jdata = json_decode($json);
$accion = "nada";
$view = "no identificado";



if (!isset($jdata)) {
	$jdata = new stdClass();
	$jdata->fx = 'no identificado';
	$view = isset($jdata->fx) ? $jdata->fx : "no identificado";
} else {
	$view = isset($jdata->fx) ? $jdata->fx : "no identificado";
	$accion = isset($jdata->alid) ? $jdata->alid : "no identificado";
}

// echo $view;

if ($view == "no identificado" || $view == "none") {
	// include './template/head.php';
	echo '<section class="section container-fluid section-wide">
    <h1 class="page-header">Ingreso al Sistema Restringido</h1>
    <div class="clearfix"></div>
              <div class="row center">
                   <div class="">
                      <div class="login-card"><img src="template/images/default.png" class="img-circle profile-img-card" />
                          <p class="profile-name-card"> </p>
                          ';
	echo 'Advertencia no esta autorizado para ver el recurso solicitado<br>';
	echo '<button href="http://educaciononline.uta.edu.ec/">DEaDV</button>';
	echo '
                  </div>
              </div>
          </div>
  </section>';
	// include './template/pie.php';
} else {

	$opsamples = array(
		'test' => True,	
        'gtdtalstalumnos' => TRUE	
	);

	$opmanagerservicio = array(
		'testservicios' => true,
		'test2' => true,
		'loginusuario'=>true,
		'tipocapacitacion'=>true,
		'modalidadcapacitacion'=>true,
		'verformato1' => True,
		'insertformato1'=>true,
		'inserttemtentativas'=>true,
		'insertinsttentativas'=>true,
		'insertconsecuencia'=>true,
		'verdatosRoles'=>true,
		'getformato1Reporte'=>true,
		'insertCursoDefinido'=>true,
		'getformato1PorCodigo'=>true,
		'insertformato6'=>true,
		'getformato6'=>true,
		'getformato6Reporte'=>true,
		'getformato1CursoDefinido'=>true,
		
	);

	$bview = false;

	if (isset($opsamples[$view])) {
		include_once PAGE_URL . 'manager/sample.php';
		$bview = true;
	} elseif (isset($opmanagerservicio[$view])) {
		// echo "1";
		include_once PAGE_URL . 'manager/managerservicios.php';
		$bview = true;
	}
	 else{
		if ($bview == false) {
			$resultados = new stdClass();
			$resultados->data = new stdClass();
			$resultados->data->success = false;
			$resultados->data->estado = 6666;
			$resultados->data->message = "No se ha encontrado el recurso solicitado";
			header('Content-type: application/json');
			echo json_encode($resultados);
		}

	}

}

?>



