<?php

switch ($view) {
	
	# pago en linea
case 'testservicios':
	echo '{"result":"ok"}';	
    break;
# test
case 'test2':
	echo '{"result":"ok test2"}';	
    break;
# test

case 'loginusuario':
	//echo '{"result":"ok"}';
	$clsCursos = new classServiciosFormatos();
	$clsCursos->getUsuariosLogin($jdata->d);
	break;
case 'tipocapacitacion':
	//echo '{"result":"ok"}';
	$clsCursos = new classServiciosFormatos();
	$clsCursos->getTipoCapacitacion();
	break;
case 'modalidadcapacitacion':
	//echo '{"result":"ok"}';
	$clsCursos = new classServiciosFormatos();
	$clsCursos->getModalidadCapacitacion();
	break;
case 'insertformato1':
	//echo '{"result":"ok"}';
	$clsCursos = new classServiciosFormatos();
	$clsCursos->insertformato1($jdata->d);
	break;
case 'inserttemtentativas':
	//echo '{"result":"ok"}';
	$clsCursos = new classServiciosFormatos();
	$clsCursos->insertTemTentativas($jdata->d);
	break;
case 'insertinsttentativas':
	//echo '{"result":"ok"}';
	$clsCursos = new classServiciosFormatos();
	$clsCursos->insertInstTentativas($jdata->d);
	break;
case 'insertconsecuencia':
	$clsCursos = new classServiciosFormatos();
	$clsCursos->insertConsecuenciaFormato1($jdata->d);
	break;
case 'verformato1':
	//echo '{"result":"ok"}';
	$clsCursos = new classServiciosFormatos();
	$clsCursos->getformatos1();
	break;

case 'getformato1Reporte':
	$clsCursos = new classServiciosFormatos();
	$clsCursos->getformato1Reporte($jdata->d);
	break;

case 'insertCursoDefinido':
	$clsCursos = new classServiciosFormatos();
	$clsCursos->insertCursoDefinido($jdata->d);
	break;

case 'getformato1PorCodigo':
	$clsCursos = new classServiciosFormatos();
	$clsCursos->getformato1PorCodigo($jdata->d);
	break;

case 'insertformato6':
	$clsCursos = new classServiciosFormatos();
	$clsCursos->insertformato6($jdata->d);
	break;

case 'getformato6':
	$clsCursos = new classServiciosFormatos();	
	$clsCursos->getformato6($jdata->d);
	break;

case 'getformato6Reporte':
	$clsCursos = new classServiciosFormatos();
	$clsCursos->getformato6Reporte($jdata->d);
	break;

case 'getformato1CursoDefinido':
    $clsCursos = new classServiciosFormatos();
    $clsCursos->getformato1CursoDefinido($jdata->d);
    break;
}




?>