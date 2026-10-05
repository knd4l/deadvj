<?php
////////////////////////////////////////////////////////////////////////////////
// Sistema SGI
// Ing. Santiago Pérez
// Todos los derechos reservados
//
/////////////////////////////////////////////////////////////////////////////////
include_once PAGE_URL . '/class/config.php';
include_once PAGE_URL . '/class/exception_object.php';
include_once PAGE_URL . '/Database/databasev2.php';

class classServiciosFormatos
{
    private $estado;
    private $utils;

    private $database = DB_NAME;
    private $hosts    = DB_HOST;
    private $us       = DB_USER;
    private $pw       = DB_PASS;
    private $isHTML = true;
  
    function __construct()
    {
      // $this->utils = new Utils();
    }

    public function getDatabase(){ return $this->database; }
    public function getHosts(){ return $this->hosts; }
    public function getUsuario(){ return $this->us; }
    public function getPassword(){ return $this->pw; }
    public function setDatabase($database=DB_NAME){ $this->database = $database; }
    public function setHosts($hosts=DB_HOST){ $this->hosts = $hosts; }
    public function setUsuario($usuario=DB_NAME){ $this->us = $usuario; }
    public function setPassword($password=DB_PASS){ $this->pw = $password; }

    public function getHtml(){ return $this->isHTML; }
    public function setHtml($value=false){ $this->isHTML = $value;}

    public function setConexion($database=DB_NAME,$hosts=DB_HOST,$usuario=DB_NAME,$password=DB_PASS)
    {
      $this->database = $database; 
      $this->hosts = $hosts; 
      $this->us = $usuario; 
      $this->pw = $password;
    }

    public function test()
    {
     // echo "<br>class prueba: " . $this->database; 
     // echo "<br>class prueba: " . $this->hosts; 
     // echo "<br>class prueba: " . $this->us; 
     // echo "<br>class prueba: " . $this->pw; 
    }

    public function getEstado()
    {
      return $this->estado;
    }

    private function normalizarFilaPresupuesto($fila)
    {
        $partida = isset($fila->partida)
            ? $fila->partida
            : '';

        $descripcion = isset($fila->descripcion)
            ? trim((string) $fila->descripcion)
            : '';

        $valor = isset($fila->valor)
            ? (string) $fila->valor
            : '';

        $totalTexto = isset($fila->total)
            ? str_replace(',', '.', trim((string) $fila->total))
            : '0';

        return array(
            'partida' => $partida,
            'descripcion' => $descripcion,
            'valor' => $valor,
            'total' => is_numeric($totalTexto)
                ? (float) $totalTexto
                : 0
        );
    }



    public function getInitDatabase()
    {
      $r=null;
      try {
        $dbc = new Database();
        $dbc->setHost($this->hosts);
        $dbc->setUserName($this->us);
        $dbc->setPassWord($this->pw);
        $dbc->initDatabase($this->database);

        if($dbc->getEstado()->codigo == 0  )
        {
          $r=$dbc;
        }else{
          $r=null;
          $this->estado = $dbc->getEstado();  
        }
      } catch (Exception $e) {
         $r=null;
         $this->estado = new Exception_Object(1001001,'No es posible conectarse a la fuente de datos, error al crear el objeto');
      }
      return $dbc;
    }

/////////////////////////////////////////////
public function getcategorias(){

      try {

         // $utilscod = new ClsDEaDVUtilFx();

        
        $result = array();
        $dataa = new stdClass();
        $dataa->n = 'No registrado';

        $get_Dataa = "select id, name,idnumber from mdl_course_categories ";
        
        $dbc = $this->getInitDatabase(); //new Database();        

        if($dbc->getEstado()->codigo == 0  )
        {

          $dbc->query($get_Dataa);

          $dbc->execute();         

          $tabla = $dbc->getTabla();

            if ($dbc->rowCount()>0) {

            foreach ($tabla as $row) {
                $item = new stdClass();
                                                
                 $item->id = ($row['id']);
                 $item->nombre = ($row['name']);
                 $item->idnumero = ($row['idnumber']);
                 

                $result[] = $item;
            }
            $this->estado = new Exception_Object(1,'');
               $this->estado->setLastID(1);

          }else{
            $item = new stdClass();
                 $item->id = 0;
                 $item->nombre = 'NO HAY REGISTROS';
                 $item->idnumero = 'NO HAY REGISTROS';            

            $result[] = $item;
            $this->estado = new Exception_Object(-1,'');
               $this->estado->setLastID(-1);
          }             
        
        }else{
            $this->estado = new Exception_Object(-2,'Error no es posible abrir la conexión.');
            $this->estado->setLastID(-2);
        }

 try{
  $dbc->closeAll();
  }catch(Exception $e){
 }

        } catch (Exception $e) {

           $this->estado = new Exception_Object(-3,'No es posible leer los datos requeridos.');
           $this->estado->setLastID(-3);
        }

        $resultados = new stdClass();
        $resultados->data =  new stdClass();

        $resultados->data->success = $this->estado->getLastID() >= 1 ? True: false;
        $resultados->data->message = $this->estado->getMessage();
        $resultados->data->estado = $this->estado->getCode();
        $resultados->data->item = $result;
                
        try {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
            echo json_encode($resultados);
          }else{
            return $resultados;
          }
        } catch (Exception $e) {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
           // echo json_encode($e);
          }else{
            return $e;
          }          
        } 
    }


    /////////////////////////////////////////////
public function getTipoCapacitacion(){

  try {

     // $utilscod = new ClsDEaDVUtilFx();

    
    $result = array();
    $dataa = new stdClass();
    $dataa->n = 'No registrado';

    //$get_Dataa = "SELECT tipo_capac_codigo,tipo_capac_nombre,tipo_capac_modalidad,tipo_capac_estado FROM tipo_capacitacion where tipo_capac_estado='Activo'";
    
    $get_Dataa = "SELECT tipo_capac_codigo,
                     tipo_capac_nombre,
                     tipo_capac_modalidad,
                     tipo_capac_estado
                  FROM tipo_capacitacion
                  WHERE tipo_capac_estado = 'Activo'
                  AND tipo_capac_nombre <> 'Alianza / Convenio'";
                  
    $dbc = $this->getInitDatabase(); //new Database();        

    if($dbc->getEstado()->codigo == 0  )
    {

      $dbc->query($get_Dataa);

      $dbc->execute();         

      $tabla = $dbc->getTabla();

        if ($dbc->rowCount()>0) {

        foreach ($tabla as $row) {
            $item = new stdClass();
                                            
             $item->tipo_capac_codigo = ($row['tipo_capac_codigo']);
             $item->tipo_capac_nombre = ($row['tipo_capac_nombre']);
             $item->tipo_capac_modalidad = ($row['tipo_capac_modalidad']);
             $item->tipo_capac_estado = ($row['tipo_capac_estado']);
             

            $result[] = $item;
        }
        $this->estado = new Exception_Object(1,'');
           $this->estado->setLastID(1);

      }else{
        $item = new stdClass();
             $item->id = 0;
             $item->nombre = 'NO HAY REGISTROS';
             $item->idnumero = 'NO HAY REGISTROS';            

        $result[] = $item;
        $this->estado = new Exception_Object(-1,'');
           $this->estado->setLastID(-1);
      }             
    
    }else{
        $this->estado = new Exception_Object(-2,'Error no es posible abrir la conexión.');
        $this->estado->setLastID(-2);
    }

try{
$dbc->closeAll();
}catch(Exception $e){
}

    } catch (Exception $e) {

       $this->estado = new Exception_Object(-3,'No es posible leer los datos requeridos.');
       $this->estado->setLastID(-3);
    }

    $resultados = new stdClass();
    $resultados->data =  new stdClass();

    $resultados->data->success = $this->estado->getLastID() >= 1 ? True: false;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
            
    try {
      if ($this->isHTML == true) {
        header('Content-type: application/json');
        echo json_encode($resultados);
      }else{
        return $resultados;
      }
    } catch (Exception $e) {
      if ($this->isHTML == true) {
        header('Content-type: application/json');
       // echo json_encode($e);
      }else{
        return $e;
      }          
    } 
}


    /////////////////////////////////////////////
    public function getModalidadCapacitacion(){

      try {
    
         // $utilscod = new ClsDEaDVUtilFx();
    
        
        $result = array();
        $dataa = new stdClass();
        $dataa->n = 'No registrado';
    
        $get_Dataa = "SELECT modalidad_codigo,modalidad_nombre,modalidad_estado FROM modalidad_capacitacion where modalidad_estado='Activo'";
        
        $dbc = $this->getInitDatabase(); //new Database();        
    
        if($dbc->getEstado()->codigo == 0  )
        {
    
          $dbc->query($get_Dataa);
    
          $dbc->execute();         
    
          $tabla = $dbc->getTabla();
    
            if ($dbc->rowCount()>0) {
    
            foreach ($tabla as $row) {
                $item = new stdClass();
                                                
                 $item->modalidad_codigo = ($row['modalidad_codigo']);
                 $item->modalidad_nombre = ($row['modalidad_nombre']);
                 $item->modalidad_estado = ($row['modalidad_estado']);                 
    
                $result[] = $item;
            }
            $this->estado = new Exception_Object(1,'');
               $this->estado->setLastID(1);
    
          }else{
            $item = new stdClass();
                 $item->id = 0;
                 $item->nombre = 'NO HAY REGISTROS';
                 $item->idnumero = 'NO HAY REGISTROS';            
    
            $result[] = $item;
            $this->estado = new Exception_Object(-1,'');
               $this->estado->setLastID(-1);
          }             
        
        }else{
            $this->estado = new Exception_Object(-2,'Error no es posible abrir la conexión.');
            $this->estado->setLastID(-2);
        }
    
    try{
    $dbc->closeAll();
    }catch(Exception $e){
    }
    
        } catch (Exception $e) {
    
           $this->estado = new Exception_Object(-3,'No es posible leer los datos requeridos.');
           $this->estado->setLastID(-3);
        }
    
        $resultados = new stdClass();
        $resultados->data =  new stdClass();
    
        $resultados->data->success = $this->estado->getLastID() >= 1 ? True: false;
        $resultados->data->message = $this->estado->getMessage();
        $resultados->data->estado = $this->estado->getCode();
        $resultados->data->item = $result;
                
        try {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
            echo json_encode($resultados);
          }else{
            return $resultados;
          }
        } catch (Exception $e) {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
           // echo json_encode($e);
          }else{
            return $e;
          }          
        } 
    }

public function getUsuariosLogin($filtros){

  try {

     // $utilscod = new ClsDEaDVUtilFx();

    
    $result = array();
    $dataa = new stdClass();
    $dataa->n = 'No registrado';

    $get_Dataa = "SELECT us.USUARIOSIS_ID,us.USUARIOSIS_PASSWORD,us.USUARIOSIS_IDENTIFICACION,us.USUARIOSIS_NOMBREDEUSUARIO,us.USUARIOSIS_ROLID, u.USUARIO_ESTADO,us.USUARIOSIS_RESTABLECE  
    FROM usuarios_sistema us, usuarios u WHERE us.USUARIOSIS_IDENTIFICACION=u.USUARIO_ID and us.USUARIOSIS_NOMBREDEUSUARIO=:nombreUsuario and us.USUARIOSIS_PASSWORD=:passwordUsuario and u.USUARIO_ESTADO='ACTIVO'";


    $dbc = $this->getInitDatabase(); //new Database();        

    if($dbc->getEstado()->codigo == 0  )
    {

      $dbc->query($get_Dataa);
       $dbc->bind(":nombreUsuario",$filtros->fnombreUsuario);
       $dbc->bind(":passwordUsuario",$filtros->fpasswordUsuario);
      $dbc->execute();         

      $tabla = $dbc->getTabla();

        if ($dbc->rowCount()>0) {

        foreach ($tabla as $row) {
            $item = new stdClass();
            
            $item->ide = ($row['USUARIOSIS_ID']);
            $item->identificacion = ($row['USUARIOSIS_IDENTIFICACION']);
               $item->nombresUsuario = ($row['USUARIOSIS_NOMBREDEUSUARIO']); 
               $item->passwordUsuario = ($row['USUARIOSIS_PASSWORD']);
               $item->rolUsuario = ($row['USUARIOSIS_ROLID']); 
               $item->restableceUsuario = ($row['USUARIOSIS_RESTABLECE']); 
            $result[] = $item;
        }
        $this->estado = new Exception_Object(1,'');
           $this->estado->setLastID(1);

      }else{
        $item = new stdClass();
        $item->ide = 'NO HAY REGISTROS'; 
        $item->identificacionm = 'NO HAY REGISTROS'; 
        $item->nombresUsuario = 'NO HAY REGISTROS'; 
        $item->passwordUsuario = 'NO HAY REGISTROS';  
        $item->rolUsuario = 'NO HAY REGISTROS';     
               
        $result[] = $item;
        $this->estado = new Exception_Object(-1,'');
           $this->estado->setLastID(-1);
      }             
    
    }else{
        $this->estado = new Exception_Object(-2,'Error no es posible abrir la conexión.');
        $this->estado->setLastID(-2);
    }

    try{
    $dbc->closeAll();
    }catch(Exception $e){
    }

    } catch (Exception $e) {

       $this->estado = new Exception_Object(-3,'No es posible leer los datos requeridos.');
       $this->estado->setLastID(-3);
    }

    $resultados = new stdClass();
    $resultados->data =  new stdClass();

    $resultados->data->success = $this->estado->getLastID() >= 1 ? True: false;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
            
    try {
      if ($this->isHTML == true) {
        header('Content-type: application/json');
        echo json_encode($resultados);
      }else{
        return $resultados;
      }
    } catch (Exception $e) {
      if ($this->isHTML == true) {
        header('Content-type: application/json');
       // echo json_encode($e);
      }else{
        return $e;
      }          
    } 
}


  
//////////////////INSERTAR USUARIO////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
public function insertformato1($filtros) {
  try
  {
      
   $result = array();
   $dataa = new stdClass();
   $dataa->n = 'No registrado';
   $recordsCount = 0;

   $get_Dataa = "INSERT INTO formato1 
   (formato1_tipo_capacitacion,
   formato1_fecha_elaboracion,
   formato1_institucion,
   formato1_persona_contacto,
   formato1_direccion,
   formato1_telefono,
   formato1_correo,
   formato1_tematicas,
   formato1_mes_ejecucion,
   formato1_numero_personas,
   formato1_modalidad,
   formato1_carga_horaria,
   formato1_instructores_tentativos,
   formato1_fecha_ejecucion_desde,
   formato1_fecha_ejecucion_hasta,
   formato1_inversion,
   formato1_estado)
   VALUES(
     :formato1_tipo_capacitacion,
   :formato1_fecha_elaboracion,
   :formato1_institucion,
   :formato1_persona_contacto,
   :formato1_direccion,
   :formato1_telefono,
   :formato1_correo,
   :formato1_tematicas,
   :formato1_mes_ejecucion,
   :formato1_numero_personas,
   :formato1_modalidad,
   :formato1_carga_horaria,
   :formato1_instructores_tentativos,
   :formato1_fecha_ejecucion_desde,
   :formato1_fecha_ejecucion_hasta,
   :formato1_inversion,
   'Activo')";


   $dbc = $this->getInitDatabase();

   if ($dbc->getEstado()->codigo == 0) {

        $dbc->query($get_Dataa);

            $dbc->bind(":formato1_tipo_capacitacion",$filtros->fformato1_tipo_capacitacion);
            $dbc->bind(":formato1_fecha_elaboracion",$filtros->fformato1_fecha_elaboracion);
            $dbc->bind(":formato1_institucion",$filtros->fformato1_institucion);
            $dbc->bind(":formato1_persona_contacto",$filtros->fformato1_persona_contacto);
            $dbc->bind(":formato1_direccion",$filtros->fformato1_direccion);
            $dbc->bind(":formato1_telefono",$filtros->fformato1_telefono);
            $dbc->bind(":formato1_correo",$filtros->fformato1_correo);
            $dbc->bind(":formato1_tematicas",$filtros->fformato1_tematicas);
            $dbc->bind(":formato1_mes_ejecucion",$filtros->fformato1_mes_ejecucion);
            $dbc->bind(":formato1_numero_personas",$filtros->fformato1_numero_personas);
            $dbc->bind(":formato1_modalidad",$filtros->fformato1_modalidad);
            $dbc->bind(":formato1_carga_horaria",$filtros->fformato1_carga_horaria);
            $dbc->bind(":formato1_instructores_tentativos",$filtros->fformato1_instructores_tentativos);
            $dbc->bind(":formato1_fecha_ejecucion_desde",$filtros->fformato1_fecha_ejecucion_desde);
            $dbc->bind(":formato1_fecha_ejecucion_hasta",$filtros->fformato1_fecha_ejecucion_hasta);
            $dbc->bind(":formato1_inversion",$filtros->fformato1_inversion);
            
        $dbc->execute();

    // $tabla = $dbc->getTabla();
    
    $recordsID = $dbc->lastId();
    $recordsCount= $dbc->lastId();

     if ($recordsID > 0) {

       $anexoActa = isset($filtros->fformato1_anexo_acta_trabajo) && $filtros->fformato1_anexo_acta_trabajo === 'SI' ? 'SI' : 'NO';
       $anexoActaDescripcion = !empty($filtros->fformato1_acta_trabajo) ? $filtros->fformato1_acta_trabajo : null;
       $anexoAcuerdo = !empty($filtros->fformato1_acuerdo_calidad) ? $filtros->fformato1_acuerdo_calidad : 'NO';
       $anexoAcuerdoRuta = !empty($filtros->fformato1_acuerdo_calidad_ruta) ? $filtros->fformato1_acuerdo_calidad_ruta : null;
       $anexoCriterio = !empty($filtros->fformato1_criterio_calidad) ? $filtros->fformato1_criterio_calidad : 'NO';
       $anexoCriterioRuta = !empty($filtros->fformato1_criterio_calidad_ruta) ? $filtros->fformato1_criterio_calidad_ruta : null;

       $dbc->query("INSERT INTO anexos_formato1
         (anexo_formato1_codigo, anexo_acta_trabajo, anexo_acta_trabajo_descripcion, anexo_acuerdo_calidad, anexo_acuerdo_calidad_ruta, anexo_criterio_aceptacion, anexo_criterio_aceptacion_ruta, anexo_estado)
         VALUES (:anexo_formato1_codigo, :anexo_acta_trabajo, :anexo_acta_trabajo_descripcion, :anexo_acuerdo_calidad, :anexo_acuerdo_calidad_ruta, :anexo_criterio_aceptacion, :anexo_criterio_aceptacion_ruta, 'ACTIVO')");
       $dbc->bind(":anexo_formato1_codigo", $recordsID);
       $dbc->bind(":anexo_acta_trabajo", $anexoActa);
       $dbc->bind(":anexo_acta_trabajo_descripcion", $anexoActaDescripcion);
       $dbc->bind(":anexo_acuerdo_calidad", $anexoAcuerdo);
       $dbc->bind(":anexo_acuerdo_calidad_ruta", $anexoAcuerdoRuta);
       $dbc->bind(":anexo_criterio_aceptacion", $anexoCriterio);
       $dbc->bind(":anexo_criterio_aceptacion_ruta", $anexoCriterioRuta);
       $dbc->execute();

       $this->estado = new Exception_Object(10012, 'Se ha grabado correctamente el registro');
       $this->estado->setLastID($recordsID);
      } else {
       # code...
       $this->estado = new Exception_Object(10012, 'No fue posible guardar el registro');
       $this->estado->setLastID(-2);
      }

   } else {
    $this->estado = new Exception_Object(10012, 'No fue posible guardar el registro, vuelva a intentarlo mas tarde.');
    $this->estado->setLastID(-3);
   }

  } catch (Exception $e) {
   $this->estado = new Exception_Object(60012002, 'ha ocurrido un error grave comuniquese con el admnistrador.');
   $this->estado->setLastID(-1);
  }

  try{
  $dbc->closeAll();
  }catch(Exception $e){
  }

  $resultados = new stdClass();
  $resultados->data = new stdClass();

  $resultados->data->success = $this->estado->getLastID() <= -1 ? false : true;
  $resultados->data->message = $this->estado->getMessage();
  $resultados->data->estado = $this->estado->getCode();
  $resultados->data->item = $result;
  $resultados->data->rcount = $recordsCount;
   

        try {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
            echo json_encode($resultados);
          }else{
            return $resultados;
          }
        } catch (Exception $e) {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
           // echo json_encode($e);
          }else{
            return $e;
          }          
        } 

 }

    //////////////////INSERTAR TEMATICAS TENTATIVAS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
public function insertTemTentativas($filtros) {
  try
  {
      
   $result = array();
   $dataa = new stdClass();
   $dataa->n = 'No registrado';
   $recordsCount = 0;

   $get_Dataa = "INSERT INTO tematicas_tentativasf1 
      (tematicat_nombre,tematicat_codigof1,tematicat_estado) VALUES 
      (:tematicat_nombre,
      :tematicat_codigof1,
      'Activo')";


   $dbc = $this->getInitDatabase();

   if ($dbc->getEstado()->codigo == 0) {

      $dbc->query($get_Dataa);
      $dbc->bind(":tematicat_nombre",$filtros->ftematicat_nombre);
      $dbc->bind(":tematicat_codigof1",$filtros->ftematicat_codigof1);
     $dbc->execute();

    // $tabla = $dbc->getTabla();
    
    $recordsID = $dbc->lastId();
    $recordsCount= $dbc->lastId();

     if ($recordsID > 0) {
       $this->estado = new Exception_Object(10012, 'Se ha grabado correctamente el registro');
       $this->estado->setLastID($recordsID);
      } else {
       # code...
       $this->estado = new Exception_Object(10012, 'No fue posible guardar el registro');
       $this->estado->setLastID(-2);
      }

   } else {
    $this->estado = new Exception_Object(10012, 'No fue posible guardar el registro, vuelva a intentarlo mas tarde.');
    $this->estado->setLastID(-3);
   }

  } catch (Exception $e) {
   
   $this->estado = new Exception_Object(60012002, 'ha ocurrido un error grave comuniquese con el admnistrador.');
   $this->estado->setLastID(-1);
  }

  try{
  $dbc->closeAll();
  }catch(Exception $e){
  }

  $resultados = new stdClass();
  $resultados->data = new stdClass();

  $resultados->data->success = $this->estado->getLastID() <= -1 ? false : true;
  $resultados->data->message = $this->estado->getMessage();
  $resultados->data->estado = $this->estado->getCode();
  $resultados->data->item = $result;
  $resultados->data->rcount = $recordsCount;
   

        try {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
            echo json_encode($resultados);
          }else{
            return $resultados;
          }
        } catch (Exception $e) {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
           // echo json_encode($e);
          }else{
            return $e;
          }          
        } 

 }


 
    //////////////////INSERTAR INSTRUCTORES TENTATIVAS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
public function insertInstTentativas($filtros) {
  try
  {
      
   $result = array();
   $dataa = new stdClass();
   $dataa->n = 'No registrado';
   $recordsCount = 0;

   $get_Dataa = "INSERT INTO instructores_tentativosf1 
      (instructorest_nombre,instructorest_codigof1,instructorest_estado) VALUES 
      (:instructorest_nombre,
      :instructorest_codigof1,
      'Activo')";


   $dbc = $this->getInitDatabase();

   if ($dbc->getEstado()->codigo == 0) {

      $dbc->query($get_Dataa);
      $dbc->bind(":instructorest_nombre",$filtros->finstructorest_nombre);
      $dbc->bind(":instructorest_codigof1",$filtros->finstructorest_codigof1);
     $dbc->execute();

    // $tabla = $dbc->getTabla();
    
    $recordsID = $dbc->lastId();
    $recordsCount= $dbc->lastId();

     if ($recordsID > 0) {
       $this->estado = new Exception_Object(10012, 'Se ha grabado correctamente el registro');
       $this->estado->setLastID($recordsID);
      } else {
       # code...
       $this->estado = new Exception_Object(10012, 'No fue posible guardar el registro');
       $this->estado->setLastID(-2);
      }

   } else {
    $this->estado = new Exception_Object(10012, 'No fue posible guardar el registro, vuelva a intentarlo mas tarde.');
    $this->estado->setLastID(-3);
   }

  } catch (Exception $e) {
   
   $this->estado = new Exception_Object(60012002, 'ha ocurrido un error grave comuniquese con el admnistrador.');
   $this->estado->setLastID(-1);
  }

  try{
  $dbc->closeAll();
  }catch(Exception $e){
  }

  $resultados = new stdClass();
  $resultados->data = new stdClass();

  $resultados->data->success = $this->estado->getLastID() <= -1 ? false : true;
  $resultados->data->message = $this->estado->getMessage();
  $resultados->data->estado = $this->estado->getCode();
  $resultados->data->item = $result;
  $resultados->data->rcount = $recordsCount;
   

        try {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
            echo json_encode($resultados);
          }else{
            return $resultados;
          }
        } catch (Exception $e) {
          if ($this->isHTML == true) {
            header('Content-type: application/json');
           // echo json_encode($e);
          }else{
            return $e;
          }          
        } 

 }

public function insertConsecuenciaFormato1($filtros) {
  try {
    $result = array();
    $recordsCount = 0;

    $get_Dataa = "INSERT INTO consecuencias_formato1 
      (consecuencia_descripcion, consecuencia_formato1_codigo, consecuencia_estado) VALUES 
      (:consecuencia_descripcion, :consecuencia_formato1_codigo, 'ACTIVO')";

    $dbc = $this->getInitDatabase();

    if ($dbc->getEstado()->codigo == 0) {
      $dbc->query($get_Dataa);
      $dbc->bind(":consecuencia_descripcion", $filtros->fconsecuencia_descripcion);
      $dbc->bind(":consecuencia_formato1_codigo", $filtros->fconsecuencia_formato1_codigo);
      $dbc->execute();

      $recordsID = $dbc->lastId();
      $recordsCount = $dbc->lastId();

      if ($recordsID > 0) {
        $this->estado = new Exception_Object(10012, 'Se ha grabado correctamente la consecuencia');
        $this->estado->setLastID($recordsID);
      } else {
        $this->estado = new Exception_Object(10012, 'No fue posible guardar la consecuencia');
        $this->estado->setLastID(-2);
      }
    } else {
      $this->estado = new Exception_Object(10012, 'No fue posible guardar la consecuencia, vuelva a intentarlo mas tarde.');
      $this->estado->setLastID(-3);
    }
  } catch (Exception $e) {
    $this->estado = new Exception_Object(60012002, 'ha ocurrido un error grave comunicándose con el administrador.');
    $this->estado->setLastID(-1);
  }

  try {
    $dbc->closeAll();
  } catch (Exception $e) {
  }

  $resultados = new stdClass();
  $resultados->data = new stdClass();
  $resultados->data->success = $this->estado->getLastID() <= -1 ? false : true;
  $resultados->data->message = $this->estado->getMessage();
  $resultados->data->estado = $this->estado->getCode();
  $resultados->data->item = $result;
  $resultados->data->rcount = $recordsCount;

  try {
    if ($this->isHTML == true) {
      header('Content-type: application/json');
      echo json_encode($resultados);
    } else {
      return $resultados;
    }
  } catch (Exception $e) {
    if ($this->isHTML == true) {
      header('Content-type: application/json');
    } else {
      return $e;
    }
  }
}

 /////ver lista de formatos1///

 public function getformatos1(){
   

  try {

     // $utilscod = new ClsDEaDVUtilFx();

    
    $result = array();
    $dataa = new stdClass();
    $dataa->n = 'No registrado';

    $get_Dataa = "
    SELECT
        f1.formato1_codigo,
        f1.formato1_tipo_capacitacion,
        tc.tipo_capac_nombre,
        f1.formato1_fecha_elaboracion,
        f1.formato1_curso_definido_fecha,
        f1.formato1_institucion,
        f1.formato1_persona_contacto,
        f1.formato1_direccion,
        f1.formato1_telefono,
        f1.formato1_correo,
        f1.formato1_tematicas,
        f1.formato1_mes_ejecucion,
        f1.formato1_numero_personas,
        f1.formato1_modalidad,
        f1.formato1_modalidad AS modalidad_nombre,
        f1.formato1_carga_horaria,
        f1.formato1_instructores_tentativos,
        f1.formato1_fecha_ejecucion_desde,
        f1.formato1_fecha_ejecucion_hasta,
        f1.formato1_inversion,
        f1.formato1_estado,

        MAX(af.anexo_acta_trabajo) AS anexo_acta_trabajo,
        MAX(af.anexo_acta_trabajo_descripcion) AS anexo_acta_trabajo_descripcion,
        MAX(af.anexo_acuerdo_calidad) AS anexo_acuerdo_calidad,
        MAX(af.anexo_acuerdo_calidad_ruta) AS anexo_acuerdo_calidad_ruta,
        MAX(af.anexo_criterio_aceptacion) AS anexo_criterio_aceptacion,
        MAX(af.anexo_criterio_aceptacion_ruta) AS anexo_criterio_aceptacion_ruta,

        GROUP_CONCAT(DISTINCT tt.tematicat_nombre SEPARATOR ', ') AS tematicas_tentativas,
        GROUP_CONCAT(DISTINCT it.instructorest_nombre SEPARATOR ', ') AS instructores_tentativos,
        GROUP_CONCAT(DISTINCT cf.consecuencia_descripcion SEPARATOR ', ') AS consecuencias

    FROM formato1 f1

    LEFT JOIN tipo_capacitacion tc
        ON f1.formato1_tipo_capacitacion = tc.tipo_capac_codigo

    LEFT JOIN tematicas_tentativasf1 tt
        ON f1.formato1_codigo = tt.tematicat_codigof1
        AND tt.tematicat_estado = 'Activo'

    LEFT JOIN instructores_tentativosf1 it
        ON f1.formato1_codigo = it.instructorest_codigof1
        AND it.instructorest_estado = 'Activo'

    LEFT JOIN consecuencias_formato1 cf
        ON f1.formato1_codigo = cf.consecuencia_formato1_codigo
        AND cf.consecuencia_estado = 'ACTIVO'

    LEFT JOIN anexos_formato1 af
        ON f1.formato1_codigo = af.anexo_formato1_codigo
        AND af.anexo_estado = 'ACTIVO'

    WHERE f1.formato1_estado = 'Activo'

    GROUP BY
        f1.formato1_codigo,
        f1.formato1_tipo_capacitacion,
        tc.tipo_capac_nombre,
        f1.formato1_fecha_elaboracion,
        f1.formato1_curso_definido_fecha,
        f1.formato1_institucion,
        f1.formato1_persona_contacto,
        f1.formato1_direccion,
        f1.formato1_telefono,
        f1.formato1_correo,
        f1.formato1_tematicas,
        f1.formato1_mes_ejecucion,
        f1.formato1_numero_personas,
        f1.formato1_modalidad,
        f1.formato1_carga_horaria,
        f1.formato1_instructores_tentativos,
        f1.formato1_fecha_ejecucion_desde,
        f1.formato1_fecha_ejecucion_hasta,
        f1.formato1_inversion,
        f1.formato1_estado
";
    
    $dbc = $this->getInitDatabase(); //new Database();        

    if($dbc->getEstado()->codigo == 0  )
    {

      $dbc->query($get_Dataa);

      $dbc->execute();         

     
      $tabla = $dbc->getTabla();
     

        if ($dbc->rowCount()>0) {

        foreach ($tabla as $row) {
            $item = new stdClass();
                                            
          

$item->id = $row['formato1_codigo'];

$item->formato1_tipo_capacitacion =
    $row['formato1_tipo_capacitacion'];

$item->tipo_capac_nombre =
    $row['tipo_capac_nombre'];

$item->formato1_fecha_elaboracion =
    $row['formato1_fecha_elaboracion'];

$item->formato1_institucion =
    $row['formato1_institucion'];

$item->formato1_persona_contacto =
    $row['formato1_persona_contacto'];

$item->formato1_direccion =
    $row['formato1_direccion'];

$item->formato1_telefono =
    $row['formato1_telefono'];

$item->formato1_correo =
    $row['formato1_correo'];

$item->formato1_tematicas =
    $row['formato1_tematicas'];

    $item->tematicas_tentativas =
    $row['tematicas_tentativas'];

    $item->instructores_tentativos =
    $row['instructores_tentativos'];

    $item->consecuencias =
    $row['consecuencias'];

$item->formato1_mes_ejecucion =
    $row['formato1_mes_ejecucion'];
    
    //indica si la tematica ya fue editada
    $item->formato1_curso_definido_fecha=
    $row['formato1_curso_definido_fecha'];

$item->formato1_numero_personas =
    $row['formato1_numero_personas'];

$item->formato1_modalidad =
    $row['formato1_modalidad'];

$item->modalidad_nombre =
    $row['modalidad_nombre'];

$item->formato1_carga_horaria =
    $row['formato1_carga_horaria'];

$item->formato1_instructores_tentativos =
    $row['formato1_instructores_tentativos'];

$item->formato1_fecha_ejecucion_desde =
    $row['formato1_fecha_ejecucion_desde'];

    $item->formato1_fecha_ejecucion_hasta =
    $row['formato1_fecha_ejecucion_hasta'];

$item->formato1_inversion =
    $row['formato1_inversion'];

$item->anexo_acta_trabajo = $row['anexo_acta_trabajo'];
$item->anexo_acta_trabajo_descripcion = $row['anexo_acta_trabajo_descripcion'];
$item->anexo_acuerdo_calidad = $row['anexo_acuerdo_calidad'];
$item->anexo_acuerdo_calidad_ruta = $row['anexo_acuerdo_calidad_ruta'];
$item->anexo_criterio_aceptacion = $row['anexo_criterio_aceptacion'];
$item->anexo_criterio_aceptacion_ruta = $row['anexo_criterio_aceptacion_ruta'];

$item->formato1_estado =
    $row['formato1_estado'];

$result[] = $item;
        }
        $this->estado = new Exception_Object(1,'');
           $this->estado->setLastID(1);

      }else{
        $item = new stdClass();
             $item->id = 0; 
             $item->formato1_institucion = 'NO HAY REGISTROS'; 
             $item->tipo_capac_nombre = 'NO HAY REGISTROS'; 
             $item->modalidad_nombre = 'NO HAY REGISTROS';  
             $item->formato1_persona_contacto = 'NO HAY REGISTROS'; 
             $item->formato1_telefono = 'NO HAY REGISTROS';  
             $item->formato1_fecha_ejecucion_desde = 'NO HAY REGISTROS';
             $item->formato1_fecha_ejecucion_hasta = 'NO HAY REGISTROS';

        $result[] = $item;
        $this->estado = new Exception_Object(-1,'');
           $this->estado->setLastID(-1);
      }             
    
    }else{
        $this->estado = new Exception_Object(-2,'Error no es posible abrir la conexión.');
        $this->estado->setLastID(-2);
    }

try{
$dbc->closeAll();
}catch(Exception $e){
}

    } catch (Exception $e) {

       $this->estado = new Exception_Object(-3,'No es posible leer los datos requeridos.');
       $this->estado->setLastID(-3);
    }

    $resultados = new stdClass();
    $resultados->data =  new stdClass();

    $resultados->data->success = $this->estado->getLastID() >= 1 ? True: false;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
            
    try {
      if ($this->isHTML == true) {
        header('Content-type: application/json');
        echo json_encode($resultados);
      }else{
        return $resultados;
      }
    } catch (Exception $e) {
      if ($this->isHTML == true) {
        header('Content-type: application/json');
       // echo json_encode($e);
      }else{
        return $e;
      }          
    } 
}

// =====================================================
// OBTENER UN FORMATO 1 POR SU CÓDIGO
// SE UTILIZA PARA CARGAR LOS DATOS EN FORMATO 6
// =====================================================

public function getformato1PorCodigo($codigo){

$codigo=$codigo->formato1_codigo;

    try {

        $result = array();

        $get_Dataa = "
        SELECT

            f1.formato1_codigo,

            f1.formato1_fecha_elaboracion,

            f1.formato1_fecha_ejecucion_desde,

            f1.formato1_fecha_ejecucion_hasta,

            tc.tipo_capac_nombre,

            f1.formato1_modalidad AS modalidad_nombre,

            f1.formato1_carga_horaria,

            f1.formato1_inversion,

            GROUP_CONCAT(
                DISTINCT it.instructorest_nombre
                SEPARATOR ', '
            ) AS instructores_tentativos

        FROM formato1 f1

        LEFT JOIN tipo_capacitacion tc
            ON f1.formato1_tipo_capacitacion = tc.tipo_capac_codigo

        LEFT JOIN instructores_tentativosf1 it
            ON f1.formato1_codigo = it.instructorest_codigof1
            AND it.instructorest_estado = 'Activo'

        WHERE f1.formato1_codigo = :formato1_codigo
        AND f1.formato1_estado = 'Activo'

        GROUP BY

            f1.formato1_codigo,
            f1.formato1_fecha_elaboracion,
            f1.formato1_fecha_ejecucion_desde,
            f1.formato1_fecha_ejecucion_hasta,
            tc.tipo_capac_nombre,
            f1.formato1_modalidad,
            f1.formato1_carga_horaria,
            f1.formato1_inversion
        ";

        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo == 0) {

            // =====================================================
            // ENVIAR CÓDIGO DEL FORMATO 1
            // =====================================================

            $dbc->query($get_Dataa);

            //Intentamos hacer el bind
            $dbc->bind(
                ":formato1_codigo",
                $codigo
            );

            

            $dbc->execute();

            

            $tabla = $dbc->getTabla();

            if ($dbc->rowCount() > 0) {

                foreach ($tabla as $row) {

                    $item = new stdClass();

                    $item->formato1_codigo =$row['formato1_codigo'];

                    $item->formato1_fecha_elaboracion= $row['formato1_fecha_elaboracion'];

                    $item->formato1_fecha_ejecucion_desde =$row['formato1_fecha_ejecucion_desde'];

                    $item->formato1_fecha_ejecucion_hasta =$row['formato1_fecha_ejecucion_hasta'];

                    $item->tipo_capac_nombre =$row['tipo_capac_nombre'];

                    $item->modalidad_nombre =$row['modalidad_nombre'];

                    $item->formato1_carga_horaria =$row['formato1_carga_horaria'];

                    $item->formato1_inversion =$row['formato1_inversion'];

                    $item->instructores_tentativos =$row['instructores_tentativos'];

                    $result[] = $item;
                }

                $this->estado =
                    new Exception_Object(1, '');

                $this->estado->setLastID(1);

            } else {

                $this->estado =
                    new Exception_Object(
                        -1,
                        'No se encontró el Formato 1.'
                    );

                $this->estado->setLastID(-1);
            }

        } else {

            $this->estado =
                new Exception_Object(
                    -2,
                    'Error no es posible abrir la conexión.'
                );

            $this->estado->setLastID(-2);
        }

        try {
            $dbc->closeAll();
        } catch (Exception $e) {
        }

    } catch (Exception $e) {

        

        $this->estado =
            new Exception_Object(
                -3,
                'No es posible leer los datos requeridos.'
            );

        $this->estado->setLastID(-3);
    }


    // =====================================================
    // PREPARAR RESPUESTA
    // =====================================================

    $resultados = new stdClass();

    $resultados->data = new stdClass();

    $resultados->data->success =
        $this->estado->getLastID() >= 1 ? True : false;

    $resultados->data->message =
        $this->estado->getMessage();

    $resultados->data->estado =
        $this->estado->getCode();

    $resultados->data->item = $result;


    try {

        if ($this->isHTML == true) {

            header('Content-type: application/json');

            echo json_encode($resultados);

        } else {

            return $resultados;

        }

    } catch (Exception $e) {

        if ($this->isHTML == true) {

            header('Content-type: application/json');

        } else {

            return $e;

        }
    }
}

public function getformato1Reporte($filtros)
{


    try {

        $result = array();

        $get_Dataa = "
            SELECT
                f1.formato1_codigo,
                f1.formato1_tipo_capacitacion,
                tc.tipo_capac_nombre,
                f1.formato1_fecha_elaboracion,
                f1.formato1_institucion,
                f1.formato1_persona_contacto,
                f1.formato1_direccion,
                f1.formato1_telefono,
                f1.formato1_correo,
                f1.formato1_tematicas,
                f1.formato1_mes_ejecucion,
                f1.formato1_numero_personas,
                f1.formato1_modalidad,
                f1.formato1_modalidad AS modalidad_nombre,
                f1.formato1_carga_horaria,
                f1.formato1_instructores_tentativos,
                f1.formato1_fecha_ejecucion,
                f1.formato1_inversion,
                f1.formato1_estado,
                MAX(af.anexo_acta_trabajo) AS anexo_acta_trabajo,
                MAX(af.anexo_acta_trabajo_descripcion) AS anexo_acta_trabajo_descripcion,
                MAX(af.anexo_acuerdo_calidad) AS anexo_acuerdo_calidad,
                MAX(af.anexo_acuerdo_calidad_ruta) AS anexo_acuerdo_calidad_ruta,
                MAX(af.anexo_criterio_aceptacion) AS anexo_criterio_aceptacion,
                MAX(af.anexo_criterio_aceptacion_ruta) AS anexo_criterio_aceptacion_ruta,
                GROUP_CONCAT(tt.tematicat_nombre SEPARATOR ', ') AS tematicas_tentativas,
                GROUP_CONCAT(it.instructorest_nombre SEPARATOR ', ') AS instructores_tentativos,
                GROUP_CONCAT(cf.consecuencia_descripcion SEPARATOR ', ') AS consecuencias
            FROM formato1 f1
            LEFT JOIN tipo_capacitacion tc
                ON f1.formato1_tipo_capacitacion = tc.tipo_capac_codigo
            LEFT JOIN tematicas_tentativasf1 tt
                ON f1.formato1_codigo = tt.tematicat_codigof1
                AND tt.tematicat_estado = 'Activo'
            LEFT JOIN instructores_tentativosf1 it
                ON f1.formato1_codigo = it.instructorest_codigof1
                AND it.instructorest_estado = 'Activo'
            LEFT JOIN consecuencias_formato1 cf
                ON f1.formato1_codigo = cf.consecuencia_formato1_codigo
                AND cf.consecuencia_estado = 'ACTIVO'
            LEFT JOIN anexos_formato1 af
                ON f1.formato1_codigo = af.anexo_formato1_codigo
                AND af.anexo_estado = 'ACTIVO'
            WHERE f1.formato1_codigo = :formato1_codigo
            GROUP BY
                f1.formato1_codigo,
                f1.formato1_tipo_capacitacion,
                tc.tipo_capac_nombre,
                f1.formato1_fecha_elaboracion,
                f1.formato1_institucion,
                f1.formato1_persona_contacto,
                f1.formato1_direccion,
                f1.formato1_telefono,
                f1.formato1_correo,
                f1.formato1_tematicas,
                f1.formato1_mes_ejecucion,
                f1.formato1_numero_personas,
                f1.formato1_modalidad,
                f1.formato1_carga_horaria,
                f1.formato1_instructores_tentativos,
                f1.formato1_fecha_ejecucion,
                f1.formato1_inversion,
                f1.formato1_estado
        ";

        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo == 0) {

            $dbc->query($get_Dataa);

            $dbc->bind(
                ":formato1_codigo",
                $filtros->fformato1_codigo
            );

            $dbc->execute();

            $tabla = $dbc->getTabla();

            if ($dbc->rowCount() > 0) {

                foreach ($tabla as $row) {

                    $item = new stdClass();

                    $item->formato1_codigo =
                        $row['formato1_codigo'];

                    $item->formato1_tipo_capacitacion =
                        $row['formato1_tipo_capacitacion'];

                    $item->tipo_capac_nombre =
                        $row['tipo_capac_nombre'];

                    $item->formato1_fecha_elaboracion =
                        $row['formato1_fecha_elaboracion'];

                    $item->formato1_institucion =
                        $row['formato1_institucion'];

                    $item->formato1_persona_contacto =
                        $row['formato1_persona_contacto'];

                    $item->formato1_direccion =
                        $row['formato1_direccion'];

                    $item->formato1_telefono =
                        $row['formato1_telefono'];

                    $item->formato1_correo =
                        $row['formato1_correo'];

                    $item->formato1_tematicas =
                        $row['formato1_tematicas'];

                    $item->tematicas_tentativas =
                        $row['tematicas_tentativas'];

                    $item->instructores_tentativos =
                        $row['instructores_tentativos'];

                    $item->consecuencias =
                        $row['consecuencias'];

                    $item->formato1_mes_ejecucion =
                        $row['formato1_mes_ejecucion'];

                    $item->formato1_numero_personas =
                        $row['formato1_numero_personas'];

                    $item->formato1_modalidad =
                        $row['formato1_modalidad'];

                    $item->modalidad_nombre =
                        $row['modalidad_nombre'];

                    $item->formato1_carga_horaria =
                        $row['formato1_carga_horaria'];

                    $item->formato1_instructores_tentativos =
                        $row['formato1_instructores_tentativos'];

                    $item->formato1_fecha_ejecucion =
                        $row['formato1_fecha_ejecucion'];

                    $item->formato1_inversion =
                        $row['formato1_inversion'];

                    $item->anexo_acta_trabajo = $row['anexo_acta_trabajo'];
                    $item->anexo_acta_trabajo_descripcion = $row['anexo_acta_trabajo_descripcion'];
                    $item->anexo_acuerdo_calidad = $row['anexo_acuerdo_calidad'];
                    $item->anexo_acuerdo_calidad_ruta = $row['anexo_acuerdo_calidad_ruta'];
                    $item->anexo_criterio_aceptacion = $row['anexo_criterio_aceptacion'];
                    $item->anexo_criterio_aceptacion_ruta = $row['anexo_criterio_aceptacion_ruta'];

                    $item->formato1_estado =
                        $row['formato1_estado'];

                    $result[] = $item;
                }

                $this->estado = new Exception_Object(
                    1,
                    'Datos obtenidos correctamente'
                );

                $this->estado->setLastID(1);

            } else {

                $this->estado = new Exception_Object(
                    -1,
                    'No existe el formato solicitado'
                );

                $this->estado->setLastID(-1);
            }

        } else {

            $this->estado = new Exception_Object(
                -2,
                'Error no es posible abrir la conexión.'
            );

            $this->estado->setLastID(-2);
        }

        $dbc->closeAll();

    } catch (Exception $e) {

        $this->estado = new Exception_Object(
            -3,
            'No es posible leer los datos requeridos.'
        );

        $this->estado->setLastID(-3);
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();

    $resultados->data->success =
        $this->estado->getLastID() >= 1 ? true : false;

    $resultados->data->message =
        $this->estado->getMessage();

    $resultados->data->estado =
        $this->estado->getCode();

    $resultados->data->item =
        $result;

    header('Content-type: application/json');

    echo json_encode($resultados);
}

public function insertCursoDefinido($filtros) {

    try {

        $result = array();
        $recordsCount = 0;

        // =====================================================
        // ACTUALIZA EL CURSO DEFINIDO Y LA FECHA DE ACTUALIZACIÓN
        // =====================================================

        $get_Dataa = "UPDATE formato1
                      SET
                          formato1_curso_definido = :formato1_curso_definido,
                          formato1_codigo_curso = :formato1_codigo_curso,
                          formato1_curso_definido_fecha = NOW()
                      WHERE formato1_codigo = :formato1_codigo";

        // Conexión con la base de datos
        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo == 0) {

            // Prepara la consulta
            $dbc->query($get_Dataa);

            // Código del formato que se va a actualizar
            $dbc->bind(
                ":formato1_codigo",
                $filtros->formato1_id
            );

            // Nuevo nombre del curso/temática
            $dbc->bind(
                ":formato1_curso_definido",
                $filtros->tematica
            );

            $dbc->bind(
                ":formato1_codigo_curso",
                isset($filtros->codigo_curso) && trim($filtros->codigo_curso) !== ''
                    ? trim($filtros->codigo_curso)
                    : null
            );

            // Ejecuta el UPDATE
            $dbc->execute();

            $recordsCount = 1;

            // Verifica que se haya ejecutado correctamente
            $this->estado = new Exception_Object(
                10012,
                'Se ha actualizado correctamente el curso definido'
            );

            $this->estado->setLastID(
                $filtros->formato1_id
            );

        } else {

            $this->estado = new Exception_Object(
                10012,
                'No fue posible actualizar el curso definido'
            );

            $this->estado->setLastID(-3);
        }

    } catch (Exception $e) {

        // Muestra el error para poder identificarlo durante el desarrollo
       

        $this->estado = new Exception_Object(
            60012002,
            'Ha ocurrido un error grave, comuníquese con el administrador.'
        );

        $this->estado->setLastID(-1);
    }

    // =====================================================
    // CIERRA LA CONEXIÓN
    // =====================================================

    try {
        $dbc->closeAll();
    } catch (Exception $e) {
    }

    // =====================================================
    // CONSTRUYE LA RESPUESTA
    // =====================================================

    $resultados = new stdClass();
    $resultados->data = new stdClass();

    $resultados->data->success =
        $this->estado->getLastID() <= -1 ? false : true;

    $resultados->data->message =
        $this->estado->getMessage();

    $resultados->data->estado =
        $this->estado->getCode();

    $resultados->data->item =
        $result;

    $resultados->data->rcount =
        $recordsCount;

    // =====================================================
    // DEVUELVE LA RESPUESTA
    // =====================================================

    try {

        if ($this->isHTML == true) {

            header('Content-type: application/json');
            echo json_encode($resultados);

        } else {

            return $resultados;
        }

    } catch (Exception $e) {

        if ($this->isHTML == true) {

            header('Content-type: application/json');

        } else {

            return $e;
        }
    }
}

// =====================================================
// GUARDAR FORMATO 6
// =====================================================




public function insertformato6($datos)
{
    try {

        $result = array();

        // =====================================================
        // CONEXIÓN
        // =====================================================

        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo != 0) {

            $this->estado = new Exception_Object(
                -2,
                'Error no es posible abrir la conexion'
            );

            $this->estado->setLastID(-2);

        } else {

            $dbc->query("SELECT formato6_codigo
                FROM formato6
                WHERE formato1_codigo = :formato1_codigo
                  AND formato6_estado = 'Activo'
                ORDER BY formato6_codigo DESC
                LIMIT 1");
            $dbc->bind(':formato1_codigo', $datos->formato1_codigo);
            $formato6Existente = $dbc->single();

            if ($formato6Existente) {
                $datos->formato6_codigo = (int) $formato6Existente['formato6_codigo'];
                $dbc->closeAll();
                return $this->updateformato6($datos);
            }

            // =====================================================
            // INICIAR TRANSACCIÓN
            // =====================================================

            $dbc->beginTransaction();


            // =====================================================
            // INSERTAR DATOS DEL FORMATO 6
            // =====================================================

            $insert = "
                INSERT INTO formato6 (
                    formato1_codigo,
                    formato6_fecha_elaboracion,
                    formato6_requerimiento,
                    formato6_unidad_responsable,
                    formato6_instructores,
                    formato6_beneficiarios,
                    formato6_paralelo,
                    formato6_modalidad,
                    formato6_area,
                    formato6_carga_horaria,
                    inscripcion_matricula_desde,
                    inscripcion_matricula_hasta,
                    formato6_lugar,
                    formato6_prerrequisitos,
                    formato6_tipo_certificado,
                    formato6_inversion,
                    formato6_introduccion,
                    formato6_justificacion,
                    formato6_objetivo_general,
                    formato6_objetivos_especificos,
                    formato6_metodologia,
                    formato6_planificacion_contenidos,
                    formato6_evaluacion,
                    formato6_acreditacion
                )
                VALUES (
                    :formato1_codigo,
                    :formato6_fecha_elaboracion,
                    :formato6_requerimiento,
                    :formato6_unidad_responsable,
                    :formato6_instructores,
                    :formato6_beneficiarios,
                    :formato6_paralelo,
                    :formato6_modalidad,
                    :formato6_area,
                    :formato6_carga_horaria,
                    :inscripcion_matricula_desde,
                    :inscripcion_matricula_hasta,
                    :formato6_lugar,
                    :formato6_prerrequisitos,
                    :formato6_tipo_certificado,
                    :formato6_inversion,
                    :formato6_introduccion,
                    :formato6_justificacion,
                    :formato6_objetivo_general,
                    :formato6_objetivos_especificos,
                    :formato6_metodologia,
                    :formato6_planificacion_contenidos,
                    :formato6_evaluacion,
                    :formato6_acreditacion
                )
            ";

            $dbc->query($insert);


            // =====================================================
            // DATOS DEL FORMATO 1
            // =====================================================

            $dbc->bind(
                ":formato1_codigo",
                $datos->formato1_codigo
            );


            // =====================================================
            // DATOS DEL FORMATO 6
            // =====================================================

            $dbc->bind(
                ":formato6_fecha_elaboracion",
                $datos->fechaElaboracion
            );

            $dbc->bind(
                ":formato6_requerimiento",
                $datos->requerimiento
            );

            $dbc->bind(
                ":formato6_unidad_responsable",
                $datos->unidadResponsable
            );

            $dbc->bind(
                ":formato6_instructores",
                $datos->instructores
            );

            $dbc->bind(
                ":formato6_beneficiarios",
                $datos->beneficiarios
            );

            $dbc->bind(
                ":formato6_paralelo",
                $datos->paralelo
            );

            $dbc->bind(
                ":formato6_modalidad",
                $datos->modalidad
            );

            $dbc->bind(
                ":formato6_area",
                $datos->area
            );

            $dbc->bind(
                ":formato6_carga_horaria",
                $datos->cargaHoraria
            );


            // =====================================================
            // FECHAS DE INSCRIPCIÓN / MATRÍCULA
            // =====================================================

            $dbc->bind(
                ":inscripcion_matricula_desde",
                isset($datos->inscripcionMatriculaDesde)
                    ? $datos->inscripcionMatriculaDesde
                    : null
            );

            $dbc->bind(
                ":inscripcion_matricula_hasta",
                isset($datos->inscripcionMatriculaHasta)
                    ? $datos->inscripcionMatriculaHasta
                    : null
            );


            // =====================================================
            // DATOS ADICIONALES
            // =====================================================

            $dbc->bind(
                ":formato6_lugar",
                $datos->lugar
            );

            $dbc->bind(
                ":formato6_prerrequisitos",
                $datos->prerrequisitos
            );

            $dbc->bind(
                ":formato6_tipo_certificado",
                $datos->tipoCertificado
            );

            $dbc->bind(
                ":formato6_inversion",
                $datos->inversion
            );

            $dbc->bind(
                ":formato6_introduccion",
                $datos->introduccion
            );

            $dbc->bind(
                ":formato6_justificacion",
                $datos->justificacion
            );

            $dbc->bind(
                ":formato6_objetivo_general",
                $datos->objetivos->general
            );

            $dbc->bind(
                ":formato6_objetivos_especificos",
                json_encode(
                    $datos->objetivos->especificos,
                    JSON_UNESCAPED_UNICODE
                )
            );

            $dbc->bind(
                ":formato6_metodologia",
                $datos->metodologiaCurso
            );

            $dbc->bind(
                ":formato6_planificacion_contenidos",
                json_encode(
                    $datos->planificacionContenidos,
                    JSON_UNESCAPED_UNICODE
                )
            );

            $dbc->bind(
                ":formato6_evaluacion",
                $datos->evaluacion
            );

            $dbc->bind(
                ":formato6_acreditacion",
                $datos->acreditacionCalificacion
            );


            // =====================================================
            // EJECUTAR INSERT DEL FORMATO 6
            // =====================================================

            $dbc->execute();


            // =====================================================
            // OBTENER ID REAL DEL FORMATO 6
            // =====================================================

            $formato6Codigo = $dbc->lastInsertId();

            if (!$formato6Codigo) {

                throw new Exception(
                    'No se pudo obtener el código del Formato 6.'
                );
            }


            // =====================================================
            // GUARDAR OBJETIVOS ESPECÍFICOS
            // =====================================================

            if (
                isset($datos->objetivos) &&
                isset($datos->objetivos->especificos) &&
                is_array($datos->objetivos->especificos)
            ) {

                foreach ($datos->objetivos->especificos as $objetivo) {

                    if (trim($objetivo) == '') {
                        continue;
                    }

                    $insertObjetivo = "
                        INSERT INTO objetivos_especificos_formato6 (
                            formato6_codigo,
                            objetivo
                        )
                        VALUES (
                            :formato6_codigo,
                            :objetivo
                        )
                    ";

                    $dbc->query($insertObjetivo);

                    $dbc->bind(
                        ":formato6_codigo",
                        $formato6Codigo
                    );

                    $dbc->bind(
                        ":objetivo",
                        $objetivo
                    );

                    $dbc->execute();
                }
            }


            // =====================================================
            // GUARDAR CONTENIDOS DE LOS MÓDULOS
            // =====================================================

            if (
                isset($datos->modulos) &&
                is_array($datos->modulos)
            ) {

                foreach ($datos->modulos as $i => $modulo) {

                    $moduloId = $i + 1;

                    if (
                        !isset($modulo->contenidos) ||
                        !is_array($modulo->contenidos)
                    ) {
                        continue;
                    }

                    foreach ($modulo->contenidos as $contenido) {

                        if (trim($contenido) == '') {
                            continue;
                        }

                        $insertContenido = "
                            INSERT INTO planificacion_contenidos_formato6 (
                                formato6_codigo,
                                modulo_id,
                                contenido
                            )
                            VALUES (
                                :formato6_codigo,
                                :modulo_id,
                                :contenido
                            )
                        ";

                        $dbc->query($insertContenido);

                        $dbc->bind(
                            ":formato6_codigo",
                            $formato6Codigo
                        );

                        $dbc->bind(
                            ":modulo_id",
                            $moduloId
                        );

                        $dbc->bind(
                            ":contenido",
                            $contenido
                        );

                        $dbc->execute();
                    }
                }
            }


            // =====================================================
            // GUARDAR PRESUPUESTO
            // =====================================================

            if (
                isset($datos->presupuesto) &&
                is_array($datos->presupuesto)
            ) {

                foreach ($datos->presupuesto as $fila) {

                    $filaNormalizada =
                        $this->normalizarFilaPresupuesto($fila);


                    $insertPresupuesto = "
                        INSERT INTO presupuesto_formato6 (
                            formato6_codigo,
                            partida,
                            descripcion,
                            valor,
                            total
                        )
                        VALUES (
                            :formato6_codigo,
                            :partida,
                            :descripcion,
                            :valor,
                            :total
                        )
                    ";

                    $dbc->query($insertPresupuesto);

                    $dbc->bind(
                        ":formato6_codigo",
                        $formato6Codigo
                    );

                    $dbc->bind(
                        ":partida",
                        $filaNormalizada['partida']
                    );

                    $dbc->bind(
                        ":descripcion",
                        $filaNormalizada['descripcion']
                    );

                    $dbc->bind(
                        ":valor",
                        $filaNormalizada['valor']
                    );

                    $dbc->bind(
                        ":total",
                        $filaNormalizada['total']
                    );

                    $dbc->execute();
                }
            }


            // =====================================================
            // GUARDAR HORARIOS DE EJECUCIÓN
            // =====================================================

            if (
                isset($datos->modulos) &&
                is_array($datos->modulos)
            ) {

                foreach ($datos->modulos as $modulo) {

                    // ---------------------------------------------
                    // FECHAS GENERALES DE EJECUCIÓN
                    // ---------------------------------------------

                    $ejecucionDesde =
                        isset($datos->ejecucionDesde)
                        ? $datos->ejecucionDesde
                        : null;

                    $ejecucionHasta =
                        isset($datos->ejecucionHasta)
                        ? $datos->ejecucionHasta
                        : null;


                    // ---------------------------------------------
                    // DATOS DEL MÓDULO
                    // ---------------------------------------------

                    $moduloNombre =
                        isset($modulo->nombre)
                        ? $modulo->nombre
                        : '';

                    $moduloDesde =
                        isset($modulo->desde)
                        ? $modulo->desde
                        : null;

                    $moduloHasta =
                        isset($modulo->hasta)
                        ? $modulo->hasta
                        : null;


                    // ---------------------------------------------
                    // VERIFICAR HORARIOS
                    // ---------------------------------------------

                    if (
                        !isset($modulo->horario) ||
                        !is_array($modulo->horario)
                    ) {
                        continue;
                    }


                    // ---------------------------------------------
                    // RECORRER HORARIOS
                    // ---------------------------------------------

                    foreach ($modulo->horario as $horario) {

                        if (
                            !isset($horario->dias) ||
                            !is_array($horario->dias) ||
                            count($horario->dias) == 0
                        ) {
                            continue;
                        }


                        // -----------------------------------------
                        // CREAR ARRAY DE DÍAS Y HORAS
                        // -----------------------------------------

                        $diasHorarios = array();

                        foreach ($horario->dias as $dia) {

                            $diasHorarios[] = array(

                                'dia' => $dia,

                                'horaDesde' =>
                                    isset($horario->horaDesde)
                                    ? $horario->horaDesde
                                    : '',

                                'horaHasta' =>
                                    isset($horario->horaHasta)
                                    ? $horario->horaHasta
                                    : ''

                            );
                        }


                        // -----------------------------------------
                        // INSERTAR HORARIO
                        // -----------------------------------------

                        $insertHorario = "
                            INSERT INTO horario_ejecucion (
                                formato6_codigo,
                                ejecucion_desde,
                                ejecucion_hasta,
                                modulo_nombre,
                                modulo_desde,
                                modulo_hasta,
                                tipo_actividad,
                                dias_horarios
                            )
                            VALUES (
                                :formato6_codigo,
                                :ejecucion_desde,
                                :ejecucion_hasta,
                                :modulo_nombre,
                                :modulo_desde,
                                :modulo_hasta,
                                :tipo_actividad,
                                :dias_horarios
                            )
                        ";

                        $dbc->query($insertHorario);


                        // -----------------------------------------
                        // BIND HORARIO
                        // -----------------------------------------

                        $dbc->bind(
                            ":formato6_codigo",
                            $formato6Codigo
                        );

                        $dbc->bind(
                            ":ejecucion_desde",
                            $ejecucionDesde
                        );

                        $dbc->bind(
                            ":ejecucion_hasta",
                            $ejecucionHasta
                        );

                        $dbc->bind(
                            ":modulo_nombre",
                            $moduloNombre
                        );

                        $dbc->bind(
                            ":modulo_desde",
                            $moduloDesde
                        );

                        $dbc->bind(
                            ":modulo_hasta",
                            $moduloHasta
                        );

                        $dbc->bind(
                            ":tipo_actividad",
                            isset($horario->tipo)
                            ? $horario->tipo
                            : ''
                        );

                        $dbc->bind(
                            ":dias_horarios",
                            json_encode(
                                $diasHorarios,
                                JSON_UNESCAPED_UNICODE
                            )
                        );


                        // -----------------------------------------
                        // EJECUTAR
                        // -----------------------------------------

                        $dbc->execute();
                    }
                }
            }


            // =====================================================
            // CONFIRMAR TRANSACCIÓN
            // =====================================================

            $dbc->endTransaction();


            // =====================================================
            // RESPUESTA EXITOSA
            // =====================================================

            $this->estado =
                new Exception_Object(
                    1,
                    'Formato 6, presupuesto y horarios guardados correctamente.'
                );

            $this->estado->setLastID(
                $formato6Codigo
            );

            $result[] = array(
                'formato6_codigo' => $formato6Codigo
            );
        }


        // =====================================================
        // CERRAR CONEXIÓN
        // =====================================================

        try {

            $dbc->closeAll();

        } catch (Exception $e) {
        }


    } catch (Exception $e) {

        if (
            isset($dbc) &&
            $dbc != null
        ) {

            try {
                $dbc->cancelTransaction();
            } catch (Exception $error) {
            }

            try {
                $dbc->closeAll();
            } catch (Exception $error) {
            }
        }


        $this->estado =
            new Exception_Object(
                -3,
                'Error al guardar el Formato 6 y sus horarios: '
                . $e->getMessage()
            );

        $this->estado->setLastID(-3);
    }


    // =====================================================
    // RESPUESTA
    // =====================================================

    $resultados = new stdClass();

    $resultados->data = new stdClass();

    $resultados->data->success =
        $this->estado->getLastID() >= 1
        ? true
        : false;

    $resultados->data->message =
        $this->estado->getMessage();

    $resultados->data->estado =
        $this->estado->getCode();

    $resultados->data->item =
        $result;


    if ($this->isHTML == true) {

        header(
            'Content-type: application/json'
        );

        echo json_encode(
            $resultados
        );

    } else {

        return $resultados;
    }
}





// OBTENER FORMATOS 6
// =====================================================
public function getformato6($filtros = null){

    try {

        $result = array();

        $filtroEstado = isset($filtros->incluirInactivos) && $filtros->incluirInactivos
            ? ''
            : "WHERE formato6_estado = 'Activo'";

        $get_Dataa = "
            SELECT formato6.*,
                formato1.formato1_curso_definido,
                formato1.formato1_codigo_curso
            FROM formato6
            LEFT JOIN formato1
                ON formato1.formato1_codigo = formato6.formato1_codigo
            {$filtroEstado}
            ORDER BY formato6_codigo DESC";

        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo == 0) {

            $dbc->query($get_Dataa);
            $dbc->execute();

            $tabla = $dbc->getTabla();

            if ($dbc->rowCount() > 0) {

                foreach ($tabla as $row) {

                    $item = new stdClass();

                    $item->formato6_codigo =
                        $row['formato6_codigo'];

                    $item->formato6_fecha_elaboracion =
                        $row['formato6_fecha_elaboracion'];

                    $item->formato6_modalidad =
                        $row['formato6_modalidad'];

                    $item->formato6_area =
                        $row['formato6_area'];

                    $item->formato1_curso_definido =
                        $row['formato1_curso_definido'];

                    $item->formato1_codigo_curso =
                        $row['formato1_codigo_curso'];

                    $item->formato1_codigo =
                        $row['formato1_codigo'];

                    $item->formato6_unidad_responsable =
                        $row['formato6_unidad_responsable'];

                    $item->formato6_beneficiarios =
                        $row['formato6_beneficiarios'];

                    $item->formato6_modalidad =
                        $row['formato6_modalidad'];

                    $item->formato6_carga_horaria =
                        $row['formato6_carga_horaria'];

                    $item->formato6_prerrequisitos =
                        $row['formato6_prerrequisitos'];

                    $item->formato6_tipo_certificado =
                        $row['formato6_tipo_certificado'];

                    $result[] = $item;
                }

                $this->estado =
                    new Exception_Object(1, '');

                $this->estado->setLastID(1);

            } else {

                $this->estado =
                    new Exception_Object(
                        -1,
                        'No existen registros de Formato 6.'
                    );

                $this->estado->setLastID(-1);
            }

        } else {

            $this->estado =
                new Exception_Object(
                    -2,
                    'Error no es posible abrir la conexión.'
                );

            $this->estado->setLastID(-2);
        }

        try {
            $dbc->closeAll();
        } catch (Exception $e) {
        }

    } catch (Exception $e) {

        // No usar var_dump porque dañaría el JSON
        $this->estado =
            new Exception_Object(
                -3,
                'Error'.$e->getMessage()
            );

        $this->estado->setLastID(-3);
    }

    $resultados = new stdClass();

    $resultados->data = new stdClass();

    $resultados->data->success =
        $this->estado->getLastID() >= 1 ? true : false;

    $resultados->data->message =
        $this->estado->getMessage();

    $resultados->data->estado =
        $this->estado->getCode();

    $resultados->data->item =
        $result;

    if ($this->isHTML == true) {

        header('Content-type: application/json');

        echo json_encode($resultados);

    } else {

        return $resultados;
    }
}



public function getformato6PorFormato1($codigo){

    $codigo = $codigo->formato1_codigo;

    try {

        $result = array();

        // =====================================================
        // BUSCAR FORMATO 6 DEL FORMATO 1 SELECCIONADO
        // =====================================================

        $get_Dataa = "
            SELECT
                formato6_codigo,
                formato1_codigo,
                (
                    SELECT f1.formato1_modalidad
                    FROM formato1 f1
                    WHERE f1.formato1_codigo = formato6.formato1_codigo
                    LIMIT 1
                ) AS formato1_modalidad_nombre,
                formato6_fecha_elaboracion,
                formato6_requerimiento,
                formato6_unidad_responsable,
                formato6_instructores,
                formato6_beneficiarios,
                formato6_paralelo,
                formato6_modalidad,
                formato6_area,
                formato6_carga_horaria,
                formato6_lugar,
                formato6_prerrequisitos,
                formato6_tipo_certificado,
                formato6_inversion

            FROM formato6

            WHERE formato1_codigo = :formato1_codigo
            AND formato6_estado = 'Activo'

            ORDER BY formato6_codigo DESC
        ";

        // =====================================================
        // CONEXIÓN
        // =====================================================

        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo == 0) {

            $dbc->query($get_Dataa);

            $dbc->bind(
                ":formato1_codigo",
                $codigo
            );

            $tabla = $dbc->resultset();

            // =====================================================
            // VERIFICAR SI EXISTE FORMATO 6
            // =====================================================

            if (count($tabla) > 0) {

                foreach ($tabla as $row) {

                    $item = new stdClass();

                    $item->formato6_codigo =
                        $row['formato6_codigo'];

                    $item->formato1_codigo =
                        $row['formato1_codigo'];

                    $item->formato6_fecha_elaboracion =
                        $row['formato6_fecha_elaboracion'];

                    $item->formato6_requerimiento =
                        $row['formato6_requerimiento'];

                    $item->formato6_unidad_responsable =
                        $row['formato6_unidad_responsable'];

                    $item->formato6_instructores =
                        $row['formato6_instructores'];

                    $item->formato6_beneficiarios =
                        $row['formato6_beneficiarios'];

                    $item->formato6_paralelo =
                        $row['formato6_paralelo'];

                    $item->formato6_modalidad =
                        $row['formato6_modalidad'];

                    $item->formato6_area =
                        $row['formato6_area'];

                    $item->formato6_carga_horaria =
                        $row['formato6_carga_horaria'];

                    $item->formato6_lugar =
                        $row['formato6_lugar'];

                    $item->formato6_prerrequisitos =
                        $row['formato6_prerrequisitos'];

                    $item->formato6_tipo_certificado =
                        $row['formato6_tipo_certificado'];

                    $item->formato6_inversion =
                        $row['formato6_inversion'];

                    $result[] = $item;
                }

                $this->estado =
                    new Exception_Object(1, '');

                $this->estado->setLastID(1);

            } else {

                // =====================================================
                // NO EXISTE FORMATO 6
                // =====================================================

                $this->estado =
                    new Exception_Object(
                        -1,
                        'No existe un Formato 6 para este Formato 1.'
                    );

                $this->estado->setLastID(-1);
            }

        } else {

            $this->estado =
                new Exception_Object(
                    -2,
                    'Error no es posible abrir la conexión.'
                );

            $this->estado->setLastID(-2);
        }

        // =====================================================
        // CERRAR CONEXIÓN
        // =====================================================

        try {

            $dbc->closeAll();

        } catch (Exception $e) {
        }

    } catch (Exception $e) {

        $this->estado =
            new Exception_Object(
                -3,
                'No es posible leer los datos requeridos.'
            );

        $this->estado->setLastID(-3);
    }

    // =====================================================
    // PREPARAR RESPUESTA
    // =====================================================

    $resultados = new stdClass();

    $resultados->data = new stdClass();

    $resultados->data->success =
        $this->estado->getLastID() >= 1 ? true : false;

    $resultados->data->message =
        $this->estado->getMessage();

    $resultados->data->estado =
        $this->estado->getCode();

    $resultados->data->item =
        $result;

    // =====================================================
    // DEVOLVER RESPUESTA
    // =====================================================

    if ($this->isHTML == true) {

        header('Content-type: application/json');

        echo json_encode($resultados);

    } else {

        return $resultados;
    }
}

// OBTENER FORMATO 6 PARA REPORTE PDF
// =====================================================

public function getformato6Reporte($filtros)
{
    try {

        $result = array();

        // =====================================================
        // CONEXIÓN
        // =====================================================

        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo != 0) {

            throw new Exception(
                'Error no es posible abrir la conexión'
            );
        }


        // =====================================================
        // CÓDIGO DEL FORMATO 6
        // =====================================================

        $formato6Codigo =
            isset($filtros->formato6_codigo)
            ? $filtros->formato6_codigo
            : null;

        if (!$formato6Codigo) {

            throw new Exception(
                'No se recibió el código del Formato 6.'
            );
        }


        // =====================================================
        // 1. DATOS PRINCIPALES DEL FORMATO 6
        // =====================================================

        $sql = "
            SELECT
                formato6_codigo,
                formato1_codigo,
                (
                    SELECT f1.formato1_curso_definido
                    FROM formato1 f1
                    WHERE f1.formato1_codigo = formato6.formato1_codigo
                    LIMIT 1
                ) AS formato1_curso_definido,
                (
                    SELECT f1.formato1_modalidad
                    FROM formato1 f1
                    WHERE f1.formato1_codigo = formato6.formato1_codigo
                    LIMIT 1
                ) AS formato1_modalidad_nombre,
                formato6_fecha_elaboracion,
                formato6_requerimiento,
                formato6_unidad_responsable,
                formato6_instructores,
                formato6_beneficiarios,
                formato6_paralelo,
                formato6_modalidad,
                formato6_area,
                formato6_carga_horaria,
                inscripcion_matricula_desde,
                inscripcion_matricula_hasta,
                formato6_lugar,
                formato6_prerrequisitos,
                formato6_tipo_certificado,
                formato6_inversion,
                formato6_estado,
                formato6_introduccion,
                formato6_justificacion,
                formato6_objetivo_general,
                formato6_metodologia,
                formato6_planificacion_contenidos,
                formato6_evaluacion,
                formato6_acreditacion
            FROM formato6
            WHERE formato6_codigo = :formato6_codigo
            AND formato6_estado = 'Activo'
        ";

        $dbc->query($sql);

        $dbc->bind(
            ":formato6_codigo",
            $formato6Codigo
        );

        $formato = $dbc->single();

        if (!$formato) {

            throw new Exception(
                'No se encontró el Formato 6 solicitado.'
            );
        }

        // Convertir el resultado a objeto
        $formato = (object) $formato;


        // =====================================================
        // 2. OBJETIVOS ESPECÍFICOS
        // =====================================================

        $sqlObjetivos = "
            SELECT
                objetivo_id,
                objetivo
            FROM objetivos_especificos_formato6
            WHERE formato6_codigo = :formato6_codigo
            ORDER BY objetivo_id ASC
        ";

        $dbc->query($sqlObjetivos);

        $dbc->bind(
            ":formato6_codigo",
            $formato6Codigo
        );

        $objetivos = $dbc->resultSet();
        if (!$objetivos) {
    $objetivos = array();
    }

    foreach ($objetivos as &$objetivo) {
        $objetivo = (object) $objetivo;
    }

    unset($objetivo);

    $formato->objetivos_especificos = $objetivos;

            $formato->objetivos_especificos =
                $objetivos
                ? $objetivos
                : array();


       // =====================================================
        // 3. CONTENIDOS DE LA PLANIFICACIÓN
        // =====================================================

            $sqlContenidos = "
                SELECT
                    contenido_id,
                    formato6_codigo,
                    modulo_id,
                    contenido
                FROM planificacion_contenidos_formato6
                WHERE formato6_codigo = :formato6_codigo
                ORDER BY modulo_id ASC, contenido_id ASC
            ";

            $dbc->query($sqlContenidos);

            $dbc->bind(
                ":formato6_codigo",
                $formato6Codigo
            );

            $contenidos = $dbc->resultSet();

            if (!$contenidos) {
                $contenidos = array();
            }


            // Convertir cada contenido a objeto
            foreach ($contenidos as &$contenido) {
                $contenido = (object) $contenido;
            }

            unset($contenido);


            // Guardar contenidos
            $formato->contenidos = $contenidos;


            // =====================================================
            // CREAR ESTRUCTURA DE MÓDULOS
            // =====================================================

            $modulos = array();

            foreach ($contenidos as $contenido) {

                $moduloId =
                    isset($contenido->modulo_id)
                    ? $contenido->modulo_id
                    : 0;

                if (!isset($modulos[$moduloId])) {

                    $modulos[$moduloId] = new stdClass();

                    $modulos[$moduloId]->id =
                        $moduloId;

                    $modulos[$moduloId]->nombre =
                        'Módulo ' . $moduloId;

                    $modulos[$moduloId]->contenidos =
                        array();
                }


                $modulos[$moduloId]->contenidos[] =
                    $contenido->contenido;
            }


            // Convertir índices asociativos
            $modulos = array_values($modulos);


            // Guardar módulos en el resultado
            $formato->modulos = $modulos;


            // =====================================================
            // DEBUG
            // =====================================================

            error_log(
                'FORMATO 6 ' .
                $formato6Codigo .
                ' - CONTENIDOS: ' .
                count($contenidos)
            );

            error_log(
                'FORMATO 6 ' .
                $formato6Codigo .
                ' - MODULOS: ' .
                count($modulos)
            );

        // =====================================================
        // 4. HORARIOS DE EJECUCIÓN
        // =====================================================

        $sqlHorarios = "
            SELECT
                horario_ejecucion_id,
                formato6_codigo,
                ejecucion_desde,
                ejecucion_hasta,
                modulo_nombre,
                modulo_desde,
                modulo_hasta,
                tipo_actividad,
                dias_horarios
            FROM horario_ejecucion
            WHERE formato6_codigo = :formato6_codigo
            ORDER BY horario_ejecucion_id ASC
        ";

        $dbc->query($sqlHorarios);

        $dbc->bind(
            ":formato6_codigo",
            $formato6Codigo
        );

       $horarios = $dbc->resultSet();

            if (!$horarios) {
                $horarios = array();
            }

            // Convertir cada horario a objeto
            foreach ($horarios as &$horario) {
                $horario = (object) $horario;
            }

            unset($horario);

            // Solo para comprobar
            $formato->horarios_debug = $horarios;


        // =====================================================
        // 5. PERÍODOS
        // =====================================================

        $periodos = '';

        if (count($horarios) > 0) {

            $primerHorario = $horarios[0];

            $desde =
                isset($primerHorario->ejecucion_desde)
                ? $primerHorario->ejecucion_desde
                : '';

            $hasta =
                isset($primerHorario->ejecucion_hasta)
                ? $primerHorario->ejecucion_hasta
                : '';

            if ($desde != '' && $hasta != '') {

                $periodos =
                    $desde . ' al ' . $hasta;

            } elseif ($desde != '') {

                $periodos = $desde;

            } elseif ($hasta != '') {

                $periodos = $hasta;
            }
        }

        $formato->periodos = $periodos;


        // =====================================================
        // 6. HORARIO GENERAL
        // =====================================================

        $horarioTexto = '';

        foreach ($horarios as $horario) {

            if (
                !isset($horario->dias_horarios) ||
                $horario->dias_horarios == ''
            ) {
                continue;
            }

            $dias = json_decode(
                $horario->dias_horarios,
                true
            );

            if (!is_array($dias)) {
                continue;
            }

            foreach ($dias as $dia) {

                $nombreDia =
                    isset($dia['dia'])
                    ? $dia['dia']
                    : '';

                $horaDesde =
                    isset($dia['horaDesde'])
                    ? $dia['horaDesde']
                    : '';

                $horaHasta =
                    isset($dia['horaHasta'])
                    ? $dia['horaHasta']
                    : '';

                $linea = $nombreDia;

                if (
                    $horaDesde != '' ||
                    $horaHasta != ''
                ) {

                    $linea .=
                        ' ' .
                        $horaDesde .
                        ' - ' .
                        $horaHasta;
                }

                if ($horarioTexto != '') {
                    $horarioTexto .= "\n";
                }

                $horarioTexto .= $linea;
            }
        }

        $formato->horario = $horarioTexto;


        // =====================================================
        // 7. CRONOGRAMA
        // =====================================================

        $cronograma = array();

        foreach ($horarios as $horario) {

            $dias = array();

            if (
                isset($horario->dias_horarios) &&
                $horario->dias_horarios != ''
            ) {

                $diasDecodificados =
                    json_decode(
                        $horario->dias_horarios,
                        true
                    );

                if (is_array($diasDecodificados)) {

                    $dias =
                        $diasDecodificados;
                }
            }


            // ---------------------------------------------
            // DÍAS
            // ---------------------------------------------

            $diasTexto = '';


            // ---------------------------------------------
            // HORAS
            // ---------------------------------------------

            $horasTexto = '';


            foreach ($dias as $dia) {

                $nombreDia =
                    isset($dia['dia'])
                    ? $dia['dia']
                    : '';

                $horaDesde =
                    isset($dia['horaDesde'])
                    ? $dia['horaDesde']
                    : '';

                $horaHasta =
                    isset($dia['horaHasta'])
                    ? $dia['horaHasta']
                    : '';


                if ($diasTexto != '') {
                    $diasTexto .= ', ';
                }

                $diasTexto .= $nombreDia;


                $rangoHora =
                    $horaDesde .
                    ' - ' .
                    $horaHasta;


                if ($horasTexto != '') {
                    $horasTexto .= "\n";
                }

                $horasTexto .= $rangoHora;
            }


            // ---------------------------------------------
            // CALCULAR HORAS TOTALES
            // ---------------------------------------------

            $horasTotales = 0;

            foreach ($dias as $dia) {

                $horaDesde =
                    isset($dia['horaDesde'])
                    ? $dia['horaDesde']
                    : '';

                $horaHasta =
                    isset($dia['horaHasta'])
                    ? $dia['horaHasta']
                    : '';

                if (
                    $horaDesde != '' &&
                    $horaHasta != ''
                ) {

                    $inicio =
                        strtotime($horaDesde);

                    $fin =
                        strtotime($horaHasta);

                    if (
                        $inicio !== false &&
                        $fin !== false
                    ) {

                        $diferencia =
                            ($fin - $inicio) / 3600;

                        if ($diferencia > 0) {

                            $horasTotales +=
                                $diferencia;
                        }
                    }
                }
            }


            // ---------------------------------------------
            // CREAR OBJETO DEL CRONOGRAMA
            // ---------------------------------------------

            $itemCronograma =
                new stdClass();


            $itemCronograma->modulo =
                isset($horario->modulo_nombre)
                ? $horario->modulo_nombre
                : '';


            $itemCronograma->desde =
                isset($horario->modulo_desde)
                ? $horario->modulo_desde
                : '';


            $itemCronograma->hasta =
                isset($horario->modulo_hasta)
                ? $horario->modulo_hasta
                : '';


            $itemCronograma->actividad =
                isset($horario->tipo_actividad)
                ? $horario->tipo_actividad
                : '';


            $itemCronograma->dias =
                $diasTexto;


            $itemCronograma->horario =
                $horasTexto;


            $itemCronograma->horas_totales =
                $horasTotales;


            $cronograma[] =
                $itemCronograma;
        }


        $formato->cronograma =
            $cronograma;


        // =====================================================
        // 8. PRESUPUESTO
        // =====================================================

        $sqlPresupuesto = "
            SELECT
                presupuesto_id,
                formato6_codigo,
                partida,
                descripcion,
                valor,
                total
            FROM presupuesto_formato6
            WHERE formato6_codigo = :formato6_codigo
            ORDER BY presupuesto_id ASC
        ";

        $dbc->query($sqlPresupuesto);

        $dbc->bind(
            ":formato6_codigo",
            $formato6Codigo
        );

        $presupuesto = $dbc->resultSet();

        if (!$presupuesto) {
            $presupuesto = array();
        }

        // IMPORTANTE:
        // Antes se obtenía el presupuesto pero
        // nunca se agregaba al objeto del formato.

        $formato->presupuesto =
            $presupuesto;


        // =====================================================
        // 9. AGREGAR RESULTADO
        // =====================================================

        $result[] = $formato;


        // =====================================================
        // RESPUESTA EXITOSA
        // =====================================================

        $this->estado =
            new Exception_Object(
                1,
                'Datos del Formato 6 obtenidos correctamente.'
            );

        $this->estado->setLastID(
            $formato6Codigo
        );


        // =====================================================
        // CERRAR CONEXIÓN
        // =====================================================

        try {

            $dbc->closeAll();

        } catch (Exception $e) {

        }


    } catch (Exception $e) {

        if (
            isset($dbc) &&
            $dbc != null
        ) {

            try {

                $dbc->closeAll();

            } catch (Exception $error) {

            }
        }


        $this->estado =
            new Exception_Object(
                -3,
                'Error al obtener el reporte del Formato 6: '
                . $e->getMessage()
            );

        $this->estado->setLastID(-3);
    }


    // =====================================================
    // RESPUESTA FINAL
    // =====================================================

    $resultados = new stdClass();

    $resultados->data =
        new stdClass();


    $resultados->data->success =
        $this->estado->getLastID() >= 1
        ? true
        : false;


    $resultados->data->message =
        $this->estado->getMessage();


    $resultados->data->estado =
        $this->estado->getCode();


    $resultados->data->item =
        $result;


    if ($this->isHTML == true) {

        header(
            'Content-type: application/json; charset=utf-8'
        );

        echo json_encode(
            $resultados
        );

    } else {

        return $resultados;
    }
}


public function getformato1CursoDefinido($d){

    try {

        $result = array();

        // =====================================================
        // CONSULTAR FORMATOS 1 CON CURSO DEFINIDO
        // =====================================================

        $get_Dataa = "
        SELECT

            f1.formato1_codigo,

            f1.formato1_curso_definido,

            f1.formato1_curso_definido_fecha

        FROM formato1 f1

        WHERE f1.formato1_curso_definido IS NOT NULL
        AND f1.formato1_curso_definido <> ''
        AND f1.formato1_estado = 'Activo'

        ORDER BY f1.formato1_codigo DESC
        ";

        // =====================================================
        // INICIAR CONEXIÓN
        // =====================================================

        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo == 0) {

            // =====================================================
            // EJECUTAR CONSULTA
            // =====================================================

            $dbc->query($get_Dataa);

            $dbc->execute();

            $tabla = $dbc->getTabla();

            // =====================================================
            // VERIFICAR RESULTADOS
            // =====================================================

            if ($dbc->rowCount() > 0) {

                foreach ($tabla as $row) {

                    $item = new stdClass();

                    $item->formato1_codigo =
                        $row['formato1_codigo'];

                    $item->formato1_curso_definido =
                        $row['formato1_curso_definido'];

                    $item->formato1_curso_definido_fecha =
                        $row['formato1_curso_definido_fecha'];

                    $result[] = $item;
                }

                // =====================================================
                // CONSULTA CORRECTA
                // =====================================================

                $this->estado =
                    new Exception_Object(1, '');

                $this->estado->setLastID(1);

            } else {

                // =====================================================
                // NO HAY FORMATOS 1
                // =====================================================

                $this->estado =
                    new Exception_Object(
                        -1,
                        'No se encontraron Formatos 1 con curso definido.'
                    );

                $this->estado->setLastID(-1);
            }

        } else {

            // =====================================================
            // ERROR DE CONEXIÓN
            // =====================================================

            $this->estado =
                new Exception_Object(
                    -2,
                    'Error no es posible abrir la conexión.'
                );

            $this->estado->setLastID(-2);
        }

        // =====================================================
        // CERRAR CONEXIÓN
        // =====================================================

        try {

            $dbc->closeAll();

        } catch (Exception $e) {
        }

    } catch (Exception $e) {

        // =====================================================
        // ERROR GENERAL
        // =====================================================

        $this->estado =
            new Exception_Object(
                -3,
                'No es posible leer los datos requeridos.'
            );

        $this->estado->setLastID(-3);
    }


    // =====================================================
    // PREPARAR RESPUESTA
    // =====================================================

    $resultados = new stdClass();

    $resultados->data = new stdClass();

    $resultados->data->success =
        $this->estado->getLastID() >= 1 ? True : false;

    $resultados->data->message =
        $this->estado->getMessage();

    $resultados->data->estado =
        $this->estado->getCode();

    $resultados->data->item =
        $result;


    // =====================================================
    // DEVOLVER RESPUESTA
    // =====================================================

    try {

        if ($this->isHTML == true) {

            header('Content-type: application/json');

            echo json_encode($resultados);

        } else {

            return $resultados;

        }

    } catch (Exception $e) {

        if ($this->isHTML == true) {

            header('Content-type: application/json');

        } else {

            return $e;

        }
    }
}


public function updateformato6($d)
{

    $codigo = $d->formato6_codigo;

    try {

        $result = array();

        // =====================================================
        // CONEXIÓN
        // =====================================================

        $dbc = $this->getInitDatabase();

        if ($dbc->getEstado()->codigo != 0) {

            $this->estado =
                new Exception_Object(
                    -2,
                    'Error no es posible abrir la conexión.'
                );

            $this->estado->setLastID(-2);

        } else {

            // =====================================================
            // INICIAR TRANSACCIÓN
            // =====================================================

            $dbc->beginTransaction();


            // =====================================================
            // ACTUALIZAR FORMATO 6
            // =====================================================

            $update = "
                UPDATE formato6
                SET
                    formato1_codigo = :formato1_codigo,
                    formato6_fecha_elaboracion = :fechaElaboracion,
                    formato6_requerimiento = :requerimiento,
                    formato6_unidad_responsable = :unidadResponsable,
                    formato6_instructores = :instructores,
                    formato6_beneficiarios = :beneficiarios,
                    formato6_paralelo = :paralelo,
                    formato6_modalidad = :modalidad,
                    formato6_area = :area,
                    formato6_carga_horaria = :cargaHoraria,

                    inscripcion_matricula_desde =
                        :inscripcion_matricula_desde,

                    inscripcion_matricula_hasta =
                        :inscripcion_matricula_hasta,

                    formato6_lugar = :lugar,
                    formato6_prerrequisitos = :prerrequisitos,
                    formato6_tipo_certificado = :tipoCertificado,
                    formato6_inversion = :inversion,

                    formato6_introduccion = :formato6_introduccion,
                    formato6_justificacion = :formato6_justificacion,
                    formato6_objetivo_general = :formato6_objetivo_general,
                    formato6_objetivos_especificos =
                        :formato6_objetivos_especificos,
                    formato6_metodologia = :formato6_metodologia,
                    formato6_planificacion_contenidos =
                        :formato6_planificacion_contenidos,
                    formato6_evaluacion = :formato6_evaluacion,
                    formato6_acreditacion = :formato6_acreditacion

                WHERE formato6_codigo = :formato6_codigo
                AND formato6_estado = 'Activo'
            ";

            $dbc->query($update);


            // =====================================================
            // DATOS PRINCIPALES
            // =====================================================

            $dbc->bind(
                ":formato6_codigo",
                $codigo
            );

            $dbc->bind(
                ":formato1_codigo",
                $d->formato1_codigo
            );

            $dbc->bind(
                ":fechaElaboracion",
                $d->fechaElaboracion
            );

            $dbc->bind(
                ":requerimiento",
                $d->requerimiento
            );

            $dbc->bind(
                ":unidadResponsable",
                $d->unidadResponsable
            );

            $dbc->bind(
                ":instructores",
                $d->instructores
            );

            $dbc->bind(
                ":beneficiarios",
                $d->beneficiarios
            );

            $dbc->bind(
                ":paralelo",
                $d->paralelo
            );

            $dbc->bind(
                ":modalidad",
                $d->modalidad
            );

            $dbc->bind(
                ":area",
                $d->area
            );

            $dbc->bind(
                ":cargaHoraria",
                $d->cargaHoraria
            );


            // =====================================================
            // FECHAS DE INSCRIPCIÓN
            // =====================================================

            $dbc->bind(
                ":inscripcion_matricula_desde",
                isset($d->inscripcionMatriculaDesde)
                    ? $d->inscripcionMatriculaDesde
                    : null
            );

            $dbc->bind(
                ":inscripcion_matricula_hasta",
                isset($d->inscripcionMatriculaHasta)
                    ? $d->inscripcionMatriculaHasta
                    : null
            );


            // =====================================================
            // DATOS ADICIONALES
            // =====================================================

            $dbc->bind(
                ":lugar",
                $d->lugar
            );

            $dbc->bind(
                ":prerrequisitos",
                $d->prerrequisitos
            );

            $dbc->bind(
                ":tipoCertificado",
                $d->tipoCertificado
            );

            $dbc->bind(
                ":inversion",
                $d->inversion
            );


            // =====================================================
            // CONTENIDO GENERAL
            // =====================================================

            $dbc->bind(
                ":formato6_introduccion",
                $d->introduccion
            );

            $dbc->bind(
                ":formato6_justificacion",
                $d->justificacion
            );

            $dbc->bind(
                ":formato6_objetivo_general",
                $d->objetivos->general
            );

            $dbc->bind(
                ":formato6_objetivos_especificos",
                json_encode(
                    $d->objetivos->especificos,
                    JSON_UNESCAPED_UNICODE
                )
            );

            $dbc->bind(
                ":formato6_metodologia",
                $d->metodologiaCurso
            );

            $dbc->bind(
                ":formato6_planificacion_contenidos",
                $d->planificacionContenidos
            );

            $dbc->bind(
                ":formato6_evaluacion",
                $d->evaluacion
            );

            $dbc->bind(
                ":formato6_acreditacion",
                $d->acreditacionCalificacion
            );


            // =====================================================
            // EJECUTAR UPDATE PRINCIPAL
            // =====================================================

            $dbc->execute();


            // =====================================================
            // ELIMINAR CONTENIDOS ANTERIORES
            // =====================================================

            $deleteContenidos = "
                DELETE FROM planificacion_contenidos_formato6
                WHERE formato6_codigo = :formato6_codigo
            ";

            $dbc->query($deleteContenidos);

            $dbc->bind(
                ":formato6_codigo",
                $codigo
            );

            $dbc->execute();


            // =====================================================
            // GUARDAR CONTENIDOS ACTUALES
            // =====================================================

            if (
                isset($d->modulos) &&
                is_array($d->modulos)
            ) {

                foreach ($d->modulos as $index => $modulo) {

                    // El ID del módulo será 1, 2, 3...
                    $moduloId = $index + 1;

                    // Verificar que existan contenidos
                    if (
                        !isset($modulo->contenidos) ||
                        !is_array($modulo->contenidos)
                    ) {
                        continue;
                    }

                    foreach ($modulo->contenidos as $contenido) {

                        // Ignorar contenidos vacíos
                        if (
                            $contenido === null ||
                            trim((string)$contenido) === ''
                        ) {
                            continue;
                        }

                        $insertContenido = "
                            INSERT INTO planificacion_contenidos_formato6 (
                                formato6_codigo,
                                modulo_id,
                                contenido
                            )
                            VALUES (
                                :formato6_codigo,
                                :modulo_id,
                                :contenido
                            )
                        ";

                        $dbc->query($insertContenido);

                        $dbc->bind(
                            ":formato6_codigo",
                            $codigo
                        );

                        $dbc->bind(
                            ":modulo_id",
                            $moduloId
                        );

                        $dbc->bind(
                            ":contenido",
                            trim((string)$contenido)
                        );

                        $dbc->execute();
                    }
                }
            }


            // =====================================================
            // ELIMINAR PRESUPUESTO ANTERIOR
            // =====================================================

            $deletePresupuesto = "
                DELETE FROM presupuesto_formato6
                WHERE formato6_codigo = :formato6_codigo
            ";

            $dbc->query($deletePresupuesto);

            $dbc->bind(
                ":formato6_codigo",
                $codigo
            );

            $dbc->execute();


            // =====================================================
            // GUARDAR PRESUPUESTO NUEVO
            // =====================================================

            if (
                isset($d->presupuesto) &&
                is_array($d->presupuesto)
            ) {

                foreach ($d->presupuesto as $fila) {

                    $filaNormalizada =
                        $this->normalizarFilaPresupuesto($fila);


                    $insertPresupuesto = "
                        INSERT INTO presupuesto_formato6 (
                            formato6_codigo,
                            partida,
                            descripcion,
                            valor,
                            total
                        )
                        VALUES (
                            :formato6_codigo,
                            :partida,
                            :descripcion,
                            :valor,
                            :total
                        )
                    ";

                    $dbc->query($insertPresupuesto);

                    $dbc->bind(
                        ":formato6_codigo",
                        $codigo
                    );

                    $dbc->bind(
                        ":partida",
                        $filaNormalizada['partida']
                    );

                    $dbc->bind(
                        ":descripcion",
                        $filaNormalizada['descripcion']
                    );

                    $dbc->bind(
                        ":valor",
                        $filaNormalizada['valor']
                    );

                    $dbc->bind(
                        ":total",
                        $filaNormalizada['total']
                    );

                    $dbc->execute();
                }
            }


            // =====================================================
            // ELIMINAR HORARIOS ANTERIORES
            // =====================================================

            $deleteHorario = "
                DELETE FROM horario_ejecucion
                WHERE formato6_codigo = :formato6_codigo
            ";

            $dbc->query($deleteHorario);

            $dbc->bind(
                ":formato6_codigo",
                $codigo
            );

            $dbc->execute();


            // =====================================================
            // GUARDAR HORARIOS ACTUALES
            // =====================================================

            if (
                isset($d->modulos) &&
                is_array($d->modulos)
            ) {

                foreach ($d->modulos as $modulo) {

                    // =============================================
                    // EJECUCIÓN GENERAL
                    // =============================================

                    $ejecucionDesde =
                        isset($d->ejecucionDesde)
                        ? $d->ejecucionDesde
                        : null;

                    $ejecucionHasta =
                        isset($d->ejecucionHasta)
                        ? $d->ejecucionHasta
                        : null;


                    // =============================================
                    // DATOS DEL MÓDULO
                    // =============================================

                    $moduloNombre =
                        isset($modulo->nombre)
                        ? $modulo->nombre
                        : '';

                    $moduloDesde =
                        isset($modulo->desde)
                        ? $modulo->desde
                        : null;

                    $moduloHasta =
                        isset($modulo->hasta)
                        ? $modulo->hasta
                        : null;


                    // =============================================
                    // VERIFICAR HORARIOS
                    // =============================================

                    if (
                        !isset($modulo->horario) ||
                        !is_array($modulo->horario)
                    ) {
                        continue;
                    }


                    foreach ($modulo->horario as $horario) {

                        if (
                            !isset($horario->dias) ||
                            !is_array($horario->dias) ||
                            count($horario->dias) == 0
                        ) {
                            continue;
                        }


                        // =========================================
                        // CREAR JSON DE DÍAS Y HORAS
                        // =========================================

                        $diasHorarios = array();

                        foreach ($horario->dias as $dia) {

                            $diasHorarios[] = array(
                                'dia' => $dia,

                                'horaDesde' =>
                                    isset($horario->horaDesde)
                                    ? $horario->horaDesde
                                    : '',

                                'horaHasta' =>
                                    isset($horario->horaHasta)
                                    ? $horario->horaHasta
                                    : ''
                            );
                        }


                        // =========================================
                        // INSERTAR HORARIO
                        // =========================================

                        $insertHorario = "
                            INSERT INTO horario_ejecucion (
                                formato6_codigo,
                                ejecucion_desde,
                                ejecucion_hasta,
                                modulo_nombre,
                                modulo_desde,
                                modulo_hasta,
                                tipo_actividad,
                                dias_horarios
                            )
                            VALUES (
                                :formato6_codigo,
                                :ejecucion_desde,
                                :ejecucion_hasta,
                                :modulo_nombre,
                                :modulo_desde,
                                :modulo_hasta,
                                :tipo_actividad,
                                :dias_horarios
                            )
                        ";

                        $dbc->query($insertHorario);

                        $dbc->bind(
                            ":formato6_codigo",
                            $codigo
                        );

                        $dbc->bind(
                            ":ejecucion_desde",
                            $ejecucionDesde
                        );

                        $dbc->bind(
                            ":ejecucion_hasta",
                            $ejecucionHasta
                        );

                        $dbc->bind(
                            ":modulo_nombre",
                            $moduloNombre
                        );

                        $dbc->bind(
                            ":modulo_desde",
                            $moduloDesde
                        );

                        $dbc->bind(
                            ":modulo_hasta",
                            $moduloHasta
                        );

                        $dbc->bind(
                            ":tipo_actividad",
                            isset($horario->tipo)
                            ? $horario->tipo
                            : ''
                        );

                        $dbc->bind(
                            ":dias_horarios",
                            json_encode(
                                $diasHorarios,
                                JSON_UNESCAPED_UNICODE
                            )
                        );

                        $dbc->execute();
                    }
                }
            }


            // =====================================================
            // CONFIRMAR TRANSACCIÓN
            // =====================================================

            $dbc->endTransaction();


            // =====================================================
            // RESPUESTA
            // =====================================================

            $this->estado =
                new Exception_Object(
                    1,
                    'Formato 6, contenidos, presupuesto y horarios actualizados correctamente.'
                );

            $this->estado->setLastID(1);

            $result[] = array(
                'formato6_codigo' => $codigo
            );
        }


        // =====================================================
        // CERRAR CONEXIÓN
        // =====================================================

        try {

            $dbc->closeAll();

        } catch (Exception $e) {
        }


    } catch (Exception $e) {

        // =====================================================
        // ROLLBACK
        // =====================================================

        if (
            isset($dbc) &&
            $dbc != null
        ) {

            try {

                $dbc->cancelTransaction();

            } catch (Exception $error) {
            }

            try {

                $dbc->closeAll();

            } catch (Exception $error) {
            }
        }


        // =====================================================
        // ERROR
        // =====================================================

        $this->estado =
            new Exception_Object(
                -3,
                'Error al actualizar el Formato 6: '
                . $e->getMessage()
            );

        $this->estado->setLastID(-3);
    }


    // =====================================================
    // RESPUESTA FINAL
    // =====================================================

    $resultados = new stdClass();

    $resultados->data = new stdClass();

    $resultados->data->success =
        $this->estado->getLastID() >= 1
        ? true
        : false;

    $resultados->data->message =
        $this->estado->getMessage();

    $resultados->data->estado =
        $this->estado->getCode();

    $resultados->data->item =
        $result;


    if ($this->isHTML == true) {

        header(
            'Content-type: application/json'
        );

        echo json_encode($resultados);

    } else {

        return $resultados;
    }
}

public function insertFormato5($datos)
{
    $dbc = null;
    $result = array();

    try {
        $formato6Codigo = isset($datos->formato6Codigo) ? (int) $datos->formato6Codigo : 0;
        $camposNumericos = array('dominioTematica', 'dominioAula', 'habilidadesBlandas', 'notaEntrevista');
        $participantes = isset($datos->participantes) && is_array($datos->participantes)
            ? $datos->participantes
            : array($datos);

        if ($formato6Codigo <= 0 || count($participantes) === 0) {
            throw new Exception('Selecciona el curso y agrega al menos una evaluación.');
        }

        $edicionIndividual = false;
        foreach ($participantes as $participante) {
            $cedula = isset($participante->cedula) ? trim((string) $participante->cedula) : '';
            if ($cedula === '') {
                throw new Exception('Selecciona una cédula registrada en cada evaluación.');
            }
            if (isset($participante->formato5Codigo) && (int) $participante->formato5Codigo > 0) {
                $edicionIndividual = true;
            }
            foreach ($camposNumericos as $campo) {
                if (!isset($participante->$campo) || !is_numeric($participante->$campo)) {
                    throw new Exception('Completa todos los puntajes con valores numéricos.');
                }
            }
        }
        if ($edicionIndividual && count($participantes) !== 1) {
            throw new Exception('Edita una entrevista a la vez.');
        }

        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }

        $dbc->beginTransaction();
        $dbc->query("SELECT f1.formato1_codigo
            FROM formato6 f6
            INNER JOIN formato1 f1 ON f1.formato1_codigo = f6.formato1_codigo
            WHERE f6.formato6_codigo = :formato6_codigo
              AND f6.formato6_estado = 'Activo'
              AND f1.formato1_curso_definido IS NOT NULL
              AND TRIM(f1.formato1_curso_definido) <> ''
            LIMIT 1");
        $dbc->bind(':formato6_codigo', $formato6Codigo);
        if (!$dbc->single()) {
            throw new Exception('El curso seleccionado no está disponible.');
        }

        if (!$edicionIndividual) {
            $dbc->query("DELETE FROM formato5
                WHERE formato6_codigo = :formato6_codigo");
            $dbc->bind(':formato6_codigo', $formato6Codigo);
            $dbc->execute();
        }

        foreach ($participantes as $participante) {
            $cedula = trim((string) $participante->cedula);
            $dbc->query("SELECT USUARIO_NOMBRES, USUARIO_APELLIDOS
                FROM usuarios
                WHERE USUARIO_IDENTIFICACION = :cedula
                  AND USUARIO_ESTADO = 'ACTIVO'
                LIMIT 1");
            $dbc->bind(':cedula', $cedula);
            $usuario = $dbc->single();
            if (!$usuario) {
                throw new Exception('La cédula seleccionada no corresponde a un usuario activo.');
            }

            $observaciones = isset($participante->observaciones) ? trim((string) $participante->observaciones) : '';
            $formato5Codigo = isset($participante->formato5Codigo) ? (int) $participante->formato5Codigo : 0;

            if ($formato5Codigo > 0) {
                $dbc->query("SELECT formato5_codigo
                    FROM formato5
                    WHERE formato5_codigo = :formato5_codigo
                      AND formato6_codigo = :formato6_codigo
                    LIMIT 1");
                $dbc->bind(':formato5_codigo', $formato5Codigo);
                $dbc->bind(':formato6_codigo', $formato6Codigo);
                if (!$dbc->single()) {
                    throw new Exception('La entrevista que intentas editar no existe para el curso seleccionado.');
                }

                $dbc->query("UPDATE formato5 SET
                    formato5_cedula = :cedula,
                    formato5_nombres = :nombres,
                    formato5_apellidos = :apellidos,
                    formato5_dominio_tematica = :dominio_tematica,
                    formato5_dominio_aula = :dominio_aula,
                    formato5_habilidades_blandas = :habilidades_blandas,
                    formato5_nota_entrevista = :nota_entrevista,
                    formato5_observaciones = :observaciones
                    WHERE formato5_codigo = :formato5_codigo
                      AND formato6_codigo = :formato6_codigo");
                $dbc->bind(':formato5_codigo', $formato5Codigo);
                $dbc->bind(':formato6_codigo', $formato6Codigo);
            } else {
                $dbc->query("INSERT INTO formato5 (
                    formato6_codigo,
                    formato5_cedula,
                    formato5_nombres,
                    formato5_apellidos,
                    formato5_dominio_tematica,
                    formato5_dominio_aula,
                    formato5_habilidades_blandas,
                    formato5_nota_entrevista,
                    formato5_observaciones
                ) VALUES (
                    :formato6_codigo,
                    :cedula,
                    :nombres,
                    :apellidos,
                    :dominio_tematica,
                    :dominio_aula,
                    :habilidades_blandas,
                    :nota_entrevista,
                    :observaciones
                )");
                $dbc->bind(':formato6_codigo', $formato6Codigo);
            }

            $dbc->bind(':cedula', $cedula);
            $dbc->bind(':nombres', $usuario['USUARIO_NOMBRES']);
            $dbc->bind(':apellidos', $usuario['USUARIO_APELLIDOS']);
            $dbc->bind(':dominio_tematica', $participante->dominioTematica);
            $dbc->bind(':dominio_aula', $participante->dominioAula);
            $dbc->bind(':habilidades_blandas', $participante->habilidadesBlandas);
            $dbc->bind(':nota_entrevista', $participante->notaEntrevista);
            $dbc->bind(':observaciones', $observaciones);
            $dbc->execute();

            if ($formato5Codigo <= 0) {
                $formato5Codigo = (int) $dbc->lastInsertId();
                if ($formato5Codigo <= 0) {
                    throw new Exception('No se pudo obtener el código de una evaluación del Formato 5.');
                }
            }
            $result[] = array('formato5_codigo' => $formato5Codigo);
        }
        $dbc->endTransaction();
        $mensaje = $edicionIndividual
            ? 'Entrevista actualizada correctamente.'
            : 'Las entrevistas anteriores del curso fueron reemplazadas correctamente.';
        $this->estado = new Exception_Object(1, $mensaje);
        $this->estado->setLastID(count($result));
    } catch (Exception $e) {
        if ($dbc !== null && $dbc->inTransaction()) {
            $dbc->cancelTransaction();
        }
        $this->estado = new Exception_Object(-1, 'No se pudo guardar el Formato 5: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

public function getFormato5()
{
    $dbc = null;
    $result = array();

    try {
        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }

        $dbc->query("SELECT f5.*,
                (
                    SELECT COUNT(*)
                    FROM formato5 f5_anterior
                    WHERE f5_anterior.formato6_codigo = f5.formato6_codigo
                      AND f5_anterior.formato5_codigo <= f5.formato5_codigo
                ) AS formato5_numero_entrevista,
                f6.formato6_fecha_elaboracion,
                f6.formato6_requerimiento,
                f6.formato6_modalidad,
                f6.formato6_area,
                f1.formato1_codigo_curso,
                f1.formato1_curso_definido,
                f1.formato1_fecha_ejecucion_desde,
                f1.formato1_fecha_ejecucion_hasta
            FROM formato5 f5
            INNER JOIN formato6 f6 ON f6.formato6_codigo = f5.formato6_codigo
            INNER JOIN formato1 f1 ON f1.formato1_codigo = f6.formato1_codigo
            ORDER BY f5.formato5_codigo DESC");
        $result = $dbc->resultset();
        $this->estado = new Exception_Object(1, 'Consulta realizada correctamente.');
        $this->estado->setLastID(1);
    } catch (Exception $e) {
        $this->estado = new Exception_Object(-1, 'No se pudieron consultar los Formatos 5: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
    $resultados->data->rcount = count($result);

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

public function getUsuariosFormato5()
{
    $dbc = null;
    $result = array();

    try {
        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }

        $dbc->query("SELECT USUARIO_IDENTIFICACION AS cedula,
                USUARIO_NOMBRES AS nombres,
                USUARIO_APELLIDOS AS apellidos
            FROM usuarios
            WHERE USUARIO_ESTADO = 'ACTIVO'
              AND USUARIO_IDENTIFICACION IS NOT NULL
              AND TRIM(USUARIO_IDENTIFICACION) <> ''
            ORDER BY USUARIO_APELLIDOS, USUARIO_NOMBRES");
        $result = $dbc->resultset();
        $this->estado = new Exception_Object(1, 'Consulta realizada correctamente.');
        $this->estado->setLastID(1);
    } catch (Exception $e) {
        $this->estado = new Exception_Object(-1, 'No se pudieron consultar los usuarios: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
    $resultados->data->rcount = count($result);

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

public function insertFormato13($datos)
{
    $dbc = null;
    $result = array();

    try {
        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }

        $dbc->beginTransaction();
        $formato6Codigo = $this->valorFormato13($datos, 'formato6Codigo');
        $dbc->query("SELECT f1.formato1_codigo_curso
            FROM formato6 f6
            LEFT JOIN formato1 f1
                ON f1.formato1_codigo = f6.formato1_codigo
            WHERE f6.formato6_codigo = :formato6_codigo
            LIMIT 1");
        $dbc->bind(':formato6_codigo', $formato6Codigo);
        $cursoRelacionado = $dbc->single();
        $codigoCurso = $cursoRelacionado
            ? $cursoRelacionado['formato1_codigo_curso']
            : null;

        $publicacionesAdicionales = $this->normalizarListaPublicacionesFormato13(
            isset($datos->publicacionesRedSocial) ? $datos->publicacionesRedSocial : array()
        );
        $dbc->query("INSERT INTO formato13 (
            formato13_linea_grafica_institucional,
            formato13_alianza_convenio,
            formato13_identificadores,
            formato13_aspectos_considerar,
            formato13_otros,
            formato6_codigo,
            formato1_codigo_curso,
            tipo_medio
        ) VALUES (
            :linea_grafica,
            :alianza_convenio,
            :identificadores,
            :aspectos_considerar,
            :otros,
            :formato6_codigo,
            :formato1_codigo_curso,
            :tipo_medio
        )");
        $dbc->bind(':linea_grafica', $datos->lineaGraficaInstitucional);
        $dbc->bind(':alianza_convenio', $datos->alianzaConvenio);
        $dbc->bind(':identificadores', $this->valorFormato13($datos, 'identificadores'));
        $dbc->bind(':aspectos_considerar', $datos->aspectosConsiderar);
        $dbc->bind(':otros', $this->valorFormato13($datos, 'otros'));
        $dbc->bind(':formato6_codigo', $formato6Codigo);
        $dbc->bind(':formato1_codigo_curso', $codigoCurso);
        $dbc->bind(':tipo_medio', $this->valorFormato13($datos, 'tipoMedio'));
        $dbc->execute();

        $formato13Codigo = (int) $dbc->lastInsertId();
        if ($formato13Codigo <= 0) {
            throw new Exception('No se pudo obtener el código del Formato 13.');
        }
        $publicacionPrincipal = array(
            'tipoMedio' => $this->valorFormato13($datos, 'tipoMedio'),
            'fechaPublicacion' => $this->valorFormato13($datos, 'fechaPublicacion'),
            'urlRedSocial' => $this->valorFormato13($datos, 'urlRedSocial'),
            'tiposRecurso' => $this->valorFormato13($datos, 'tiposRecurso'),
            'tipoPublicacion' => $this->valorFormato13($datos, 'tipoPublicacion'),
            'medioUta' => $this->valorFormato13($datos, 'medioUta', 'NO'),
            'medioUtaUrl' => $this->valorFormato13($datos, 'medioUtaUrl'),
            'impreso' => $this->valorFormato13($datos, 'impreso', 'NO'),
            'copiasImpresas' => $this->valorFormato13($datos, 'copiasImpresas')
        );
        $this->insertarPublicacionesFormato13(
            $dbc,
            $formato13Codigo,
            array_merge(array($publicacionPrincipal), $publicacionesAdicionales)
        );

        $dbc->endTransaction();
        $result[] = array('formato13_codigo' => $formato13Codigo);
        $this->estado = new Exception_Object(1, 'Formato 13 guardado correctamente.');
        $this->estado->setLastID($formato13Codigo);
    } catch (Exception $e) {
        if ($dbc !== null && $dbc->inTransaction()) {
            $dbc->cancelTransaction();
        }
        $this->estado = new Exception_Object(-1, 'No se pudo guardar el Formato 13: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
    $resultados->data->rcount = count($result);

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

private function insertarPublicacionesFormato13($dbc, $formato13Codigo, $publicaciones)
{
    foreach ($publicaciones as $indice => $publicacion) {
        $tiposMedio = isset($publicacion['tiposMedio']) ? $publicacion['tiposMedio'] : array();
        if (is_string($tiposMedio)) {
            $tiposMedio = json_decode($tiposMedio, true);
        }
        $tipoMedio = isset($publicacion['tipoMedio'])
            ? $publicacion['tipoMedio']
            : (is_array($tiposMedio) && count($tiposMedio) > 0 ? $tiposMedio[0] : null);
        $tipoRecurso = isset($publicacion['tiposRecurso']) ? $publicacion['tiposRecurso'] : null;
        if (is_array($tipoRecurso)) {
            $tipoRecurso = json_encode($tipoRecurso, JSON_UNESCAPED_UNICODE);
        }

        $tipoMedioCodigo = null;
        if ($tipoMedio !== null && $tipoMedio !== '') {
            $dbc->query("SELECT tipo_medio_codigo
                FROM formato13_tipo_medio
                WHERE tipo_medio_nombre = :tipo_medio_nombre");
            $dbc->bind(':tipo_medio_nombre', $tipoMedio);
            $medio = $dbc->single();
            if (!$medio) {
                throw new Exception('El tipo de medio seleccionado no está registrado.');
            }
            $tipoMedioCodigo = (int) $medio['tipo_medio_codigo'];
        }

        $dbc->query("INSERT INTO formato13_publicacion (
            formato13_codigo,
            orden_publicacion,
            tipo_medio_codigo,
            tipo_medio_nombre,
            fecha_publicacion,
            url_publicacion,
            tipo_recurso,
            tipo_publicacion,
            medio_uta,
            medio_uta_url,
            impreso,
            copias_impresas
        ) VALUES (
            :formato13_codigo,
            :orden_publicacion,
            :tipo_medio_codigo,
            :tipo_medio_nombre,
            :fecha_publicacion,
            :url_publicacion,
            :tipo_recurso,
            :tipo_publicacion,
            :medio_uta,
            :medio_uta_url,
            :impreso,
            :copias_impresas
        )");
        $dbc->bind(':formato13_codigo', $formato13Codigo);
        $dbc->bind(':orden_publicacion', $indice + 1);
        $dbc->bind(':tipo_medio_codigo', $tipoMedioCodigo);
        $dbc->bind(':tipo_medio_nombre', $tipoMedio);
        $dbc->bind(':fecha_publicacion', isset($publicacion['fechaPublicacion']) ? $publicacion['fechaPublicacion'] : null);
        $dbc->bind(':url_publicacion', isset($publicacion['urlRedSocial']) ? $publicacion['urlRedSocial'] : null);
        $dbc->bind(':tipo_recurso', $tipoRecurso);
        $dbc->bind(':tipo_publicacion', isset($publicacion['tipoPublicacion']) ? $publicacion['tipoPublicacion'] : null);
        $dbc->bind(':medio_uta', isset($publicacion['medioUta']) ? $publicacion['medioUta'] : 'NO');
        $dbc->bind(':medio_uta_url', isset($publicacion['medioUtaUrl']) ? $publicacion['medioUtaUrl'] : null);
        $dbc->bind(':impreso', isset($publicacion['impreso']) ? $publicacion['impreso'] : 'NO');
        $dbc->bind(':copias_impresas', isset($publicacion['copiasImpresas']) ? $publicacion['copiasImpresas'] : null);
        $dbc->execute();
    }
}

private function insertarPublicacionesCuadroFormato13($dbc, $tabla, $formato13Codigo, $principal, $adicionales, $columnas, $valoresPredeterminados = array())
{
    $idPrincipal = 0;
    $publicaciones = array_merge(array($principal), $adicionales);

    foreach ($publicaciones as $indice => $publicacion) {
        $campos = array('formato13_codigo' => $formato13Codigo);
        foreach ($columnas as $columna => $propiedad) {
            $valor = isset($publicacion[$propiedad]) && $publicacion[$propiedad] !== ''
                ? $publicacion[$propiedad]
                : (isset($valoresPredeterminados[$columna]) ? $valoresPredeterminados[$columna] : null);
            $campos[$columna] = $valor;
        }

        $codigo = $this->insertarCuadroFormato13($dbc, $tabla, $campos);
        if ($indice === 0) {
            $idPrincipal = $codigo;
        }
    }

    if ($idPrincipal <= 0) {
        throw new Exception('No se pudo guardar la publicación principal del cuadro ' . $tabla . '.');
    }

    return $idPrincipal;
}

private function obtenerPublicacionesCuadroFormato13($dbc, $tabla, $codigoCuadro, $columnas)
{
    $nombresColumnas = array_merge(array('formato13_codigo', $codigoCuadro), array_keys($columnas));
    $dbc->query('SELECT ' . implode(', ', $nombresColumnas)
        . ' FROM ' . $tabla
        . ' WHERE formato13_codigo IS NOT NULL'
        . ' ORDER BY formato13_codigo, ' . $codigoCuadro);
    $filas = $dbc->resultset();
    $publicaciones = array();

    foreach ($filas as $fila) {
        $formato13Codigo = $fila['formato13_codigo'];
        if (!isset($publicaciones[$formato13Codigo])) {
            $publicaciones[$formato13Codigo] = array();
        }

        $publicacion = array('_codigoCuadro' => $fila[$codigoCuadro]);
        foreach ($columnas as $columna => $propiedad) {
            $publicacion[$propiedad] = $fila[$columna];
        }
        $publicaciones[$formato13Codigo][] = $publicacion;
    }

    return $publicaciones;
}

private function filtrarPublicacionesAdicionalesFormato13($publicaciones, $codigoPrincipal)
{
    $adicionales = array();

    foreach ($publicaciones as $publicacion) {
        if ((string) $publicacion['_codigoCuadro'] === (string) $codigoPrincipal) {
            continue;
        }

        unset($publicacion['_codigoCuadro']);
        $adicionales[] = $publicacion;
    }

    return $adicionales;
}

private function insertFormato13Legacy($datos)
{
    $dbc = null;
    $result = array();

    try {
        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }

        $dbc->beginTransaction();

        $publicacionesPaginaWeb = $this->normalizarListaPublicacionesFormato13(
            isset($datos->publicacionesPaginaWeb) ? $datos->publicacionesPaginaWeb : array()
        );
        $publicacionesRedSocial = $this->normalizarListaPublicacionesFormato13(
            isset($datos->publicacionesRedSocial) ? $datos->publicacionesRedSocial : array()
        );
        $publicacionesVideo = $this->normalizarListaPublicacionesFormato13(
            isset($datos->publicacionesVideo) ? $datos->publicacionesVideo : array()
        );
        $mediosUta = $this->normalizarListaPublicacionesFormato13(
            isset($datos->mediosUtaAdicionales) ? $datos->mediosUtaAdicionales : array()
        );

        $paginaWebCodigo = $this->insertarCuadroFormato13($dbc, 'formato13_pagina_web', array(
            'fecha_publicacion' => $this->valorFormato13($datos, 'paginaWebFechaPublicacion'),
            'tipo_publicacion' => $this->valorFormato13($datos, 'paginaWebTipoPublicacion'),
            'banner' => $this->valorFormato13($datos, 'paginaWebBanner', 'NO'),
            'miniatura' => $this->valorFormato13($datos, 'paginaWebMiniatura', 'NO'),
            'zoom' => $this->valorFormato13($datos, 'paginaWebZoom', 'NO'),
            'articulo' => $this->valorFormato13($datos, 'paginaWebArticulo', 'NO'),
            'url' => $this->valorFormato13($datos, 'paginaWebUrl'),
            'publicaciones_adicionales' => json_encode($publicacionesPaginaWeb, JSON_UNESCAPED_UNICODE)
        ));

        $redSocialCodigo = $this->insertarCuadroFormato13($dbc, 'formato13_red_social', array(
            'fecha_publicacion' => $this->valorFormato13($datos, 'fechaPublicacion'),
            'tipo_publicacion' => $this->valorFormato13($datos, 'tipoPublicacion'),
            'post' => $this->valorFormato13($datos, 'redSocialPost', 'NO'),
            'post_url' => $this->valorFormato13($datos, 'redSocialPostUrl'),
            'carrusel' => $this->valorFormato13($datos, 'redSocialCarrusel', 'NO'),
            'carrusel_url' => $this->valorFormato13($datos, 'redSocialCarruselUrl'),
            'reel' => $this->valorFormato13($datos, 'redSocialReel', 'NO'),
            'reel_url' => $this->valorFormato13($datos, 'redSocialReelUrl'),
            'otro' => $this->valorFormato13($datos, 'otroRedSocial'),
            'url_red_social' => $this->valorFormato13($datos, 'urlRedSocial'),
            'publicaciones_adicionales' => json_encode($publicacionesRedSocial, JSON_UNESCAPED_UNICODE)
        ));

        $videoCodigo = $this->insertarCuadroFormato13($dbc, 'formato13_videos', array(
            'fecha_publicacion' => $this->valorFormato13($datos, 'videoFechaPublicacion'),
            'tipo_publicacion' => $this->valorFormato13($datos, 'videoTipoPublicacion'),
            'television' => $this->valorFormato13($datos, 'television', 'NO'),
            'video_45s' => $this->valorFormato13($datos, 'video45s', 'NO'),
            'video_2_min' => $this->valorFormato13($datos, 'video2Min', 'NO'),
            'video_2_min_explicacion' => $this->valorFormato13($datos, 'video2MinExplicacion'),
            'url_red_social' => $this->valorFormato13($datos, 'videoUrlRedSocial'),
            'publicaciones_adicionales' => json_encode($publicacionesVideo, JSON_UNESCAPED_UNICODE)
        ));

        $medioUtaCodigo = $this->insertarCuadroFormato13($dbc, 'formato13_medio_uta', array(
            'fecha_publicacion' => $this->valorFormato13($datos, 'medioUtaFechaPublicacion'),
            'url' => $this->valorFormato13($datos, 'medioUtaUrl'),
            'publicaciones_adicionales' => json_encode($mediosUta, JSON_UNESCAPED_UNICODE)
        ));

        $dbc->query("INSERT INTO formato13 (
            formato13_linea_grafica_institucional,
            formato13_alianza_convenio,
            formato13_identificadores,
            formato13_aspectos_considerar,
            formato13_otros,
            formato13_pagina_web_codigo,
            formato13_red_social_codigo,
            formato13_video_codigo,
            formato13_medio_uta_codigo
        ) VALUES (
            :linea_grafica,
            :alianza_convenio,
            :identificadores,
            :aspectos_considerar,
            :otros,
            :pagina_web_codigo,
            :red_social_codigo,
            :video_codigo,
            :medio_uta_codigo
        )");
        $dbc->bind(':linea_grafica', $datos->lineaGraficaInstitucional);
        $dbc->bind(':alianza_convenio', $datos->alianzaConvenio);
        $dbc->bind(':identificadores', $this->valorFormato13($datos, 'identificadores'));
        $dbc->bind(':aspectos_considerar', $datos->aspectosConsiderar);
        $dbc->bind(':otros', $this->valorFormato13($datos, 'otros'));
        $dbc->bind(':pagina_web_codigo', $paginaWebCodigo);
        $dbc->bind(':red_social_codigo', $redSocialCodigo);
        $dbc->bind(':video_codigo', $videoCodigo);
        $dbc->bind(':medio_uta_codigo', $medioUtaCodigo);
        $dbc->execute();

        $formato13Codigo = (int) $dbc->lastInsertId();
        if ($formato13Codigo <= 0) {
            throw new Exception('No se pudo obtener el código del Formato 13.');
        }

        $dbc->endTransaction();
        $result[] = array('formato13_codigo' => $formato13Codigo);
        $this->estado = new Exception_Object(1, 'Formato 13 guardado correctamente.');
        $this->estado->setLastID($formato13Codigo);
    } catch (Exception $e) {
        if ($dbc !== null && $dbc->inTransaction()) {
            $dbc->cancelTransaction();
        }
        $this->estado = new Exception_Object(-1, 'No se pudo guardar el Formato 13: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
    $resultados->data->rcount = count($result);

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

private function valorFormato13($datos, $propiedad, $predeterminado = null)
{
    if (!isset($datos->$propiedad) || $datos->$propiedad === '') {
        return $predeterminado;
    }

    return $datos->$propiedad;
}

private function insertarCuadroFormato13($dbc, $tabla, $campos)
{
    $columnas = array_keys($campos);
    $parametros = array();
    foreach ($columnas as $columna) {
        $parametros[] = ':' . $columna;
    }

    $consulta = 'INSERT INTO ' . $tabla . ' (' . implode(', ', $columnas) . ') VALUES ('
        . implode(', ', $parametros) . ')';
    $dbc->query($consulta);
    foreach ($campos as $columna => $valor) {
        $dbc->bind(':' . $columna, $valor);
    }
    $dbc->execute();

    return (int) $dbc->lastInsertId();
}

private function insertFormato13Anterior($datos)
{
    $dbc = null;
    $result = array();

    try {
        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }
        $dbc->beginTransaction();

        $dbc->query("INSERT INTO formato13 (
            formato13_linea_grafica_institucional,
            formato13_alianza_convenio,
            formato13_identificadores,
            formato13_aspectos_considerar,
            formato13_otros,
            formato13_pagina_web_banner,
            formato13_pagina_web_miniatura,
            formato13_pagina_web_zoom,
            formato13_pagina_web_articulo,
            formato13_pagina_web_url,
            formato13_pagina_web_fecha_publicacion,
            formato13_pagina_web_tipo_publicacion,
            formato13_red_social_fecha_publicacion,
            formato13_red_social_tipo_publicacion,
            formato13_red_social_post,
            formato13_red_social_post_url,
            formato13_red_social_carrusel,
            formato13_red_social_carrusel_url,
            formato13_red_social_reel,
            formato13_red_social_reel_url,
            formato13_red_social_otro,
            formato13_red_social_url,
            formato13_television,
            formato13_video_fecha_publicacion,
            formato13_video_tipo_publicacion,
            formato13_video_45s,
            formato13_video_2_min,
            formato13_video_2_min_explicacion,
            formato13_video_url_red_social,
            formato13_pagina_web_adicionales,
            formato13_red_social_adicionales,
            formato13_video_adicionales,
            formato13_medio_uta_fecha_publicacion,
            formato13_medio_uta_url,
            formato13_medio_uta_adicionales
        ) VALUES (
            :linea_grafica,
            :alianza_convenio,
            :identificadores,
            :aspectos_considerar,
            :otros,
            :pagina_web_banner,
            :pagina_web_miniatura,
            :pagina_web_zoom,
            :pagina_web_articulo,
            :pagina_web_url,
            :pagina_web_fecha_publicacion,
            :pagina_web_tipo_publicacion,
            :fecha_publicacion,
            :tipo_publicacion,
            :red_social_post,
            :red_social_post_url,
            :red_social_carrusel,
            :red_social_carrusel_url,
            :red_social_reel,
            :red_social_reel_url,
            :red_social_otro,
            :red_social_url,
            :television,
            :video_fecha_publicacion,
            :video_tipo_publicacion,
            :video_45s,
            :video_2_min,
            :video_2_min_explicacion,
            :video_url_red_social,
            :pagina_web_adicionales,
            :red_social_adicionales,
            :video_adicionales,
            :medio_uta_fecha_publicacion,
            :medio_uta_url,
            :medio_uta_adicionales
        )");
        $dbc->bind(':linea_grafica', $datos->lineaGraficaInstitucional);
        $dbc->bind(':alianza_convenio', $datos->alianzaConvenio);
        $dbc->bind(':identificadores', isset($datos->identificadores) ? $datos->identificadores : null);
        $dbc->bind(':aspectos_considerar', $datos->aspectosConsiderar);
        $dbc->bind(':otros', isset($datos->otros) ? $datos->otros : null);
        $dbc->bind(':pagina_web_banner', isset($datos->paginaWebBanner) && $datos->paginaWebBanner === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':pagina_web_miniatura', isset($datos->paginaWebMiniatura) && $datos->paginaWebMiniatura === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':pagina_web_zoom', isset($datos->paginaWebZoom) && $datos->paginaWebZoom === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':pagina_web_articulo', isset($datos->paginaWebArticulo) && $datos->paginaWebArticulo === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':pagina_web_url', isset($datos->paginaWebUrl) && $datos->paginaWebUrl !== '' ? $datos->paginaWebUrl : null);
        $dbc->bind(':pagina_web_fecha_publicacion', isset($datos->paginaWebFechaPublicacion) && $datos->paginaWebFechaPublicacion !== '' ? $datos->paginaWebFechaPublicacion : null);
        $dbc->bind(':pagina_web_tipo_publicacion', isset($datos->paginaWebTipoPublicacion) && $datos->paginaWebTipoPublicacion !== '' ? $datos->paginaWebTipoPublicacion : null);
        $dbc->bind(':fecha_publicacion', isset($datos->fechaPublicacion) && $datos->fechaPublicacion !== '' ? $datos->fechaPublicacion : null);
        $dbc->bind(':tipo_publicacion', isset($datos->tipoPublicacion) && $datos->tipoPublicacion !== '' ? $datos->tipoPublicacion : null);
        $dbc->bind(':red_social_post', isset($datos->redSocialPost) && $datos->redSocialPost === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':red_social_post_url', isset($datos->redSocialPostUrl) && $datos->redSocialPostUrl !== '' ? $datos->redSocialPostUrl : null);
        $dbc->bind(':red_social_carrusel', isset($datos->redSocialCarrusel) && $datos->redSocialCarrusel === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':red_social_carrusel_url', isset($datos->redSocialCarruselUrl) && $datos->redSocialCarruselUrl !== '' ? $datos->redSocialCarruselUrl : null);
        $dbc->bind(':red_social_reel', isset($datos->redSocialReel) && $datos->redSocialReel === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':red_social_reel_url', isset($datos->redSocialReelUrl) && $datos->redSocialReelUrl !== '' ? $datos->redSocialReelUrl : null);
        $dbc->bind(':red_social_otro', isset($datos->otroRedSocial) && $datos->otroRedSocial !== '' ? $datos->otroRedSocial : null);
        $dbc->bind(':red_social_url', isset($datos->urlRedSocial) && $datos->urlRedSocial !== '' ? $datos->urlRedSocial : null);
        $dbc->bind(':television', isset($datos->television) && $datos->television === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':video_fecha_publicacion', isset($datos->videoFechaPublicacion) && $datos->videoFechaPublicacion !== '' ? $datos->videoFechaPublicacion : null);
        $dbc->bind(':video_tipo_publicacion', isset($datos->videoTipoPublicacion) && $datos->videoTipoPublicacion !== '' ? $datos->videoTipoPublicacion : null);
        $dbc->bind(':video_45s', isset($datos->video45s) && in_array($datos->video45s, array('VIVENCIAL', 'INFORMATIVO'), true) ? $datos->video45s : 'NO');
        $dbc->bind(':video_2_min', isset($datos->video2Min) && $datos->video2Min === 'SI' ? 'SI' : 'NO');
        $dbc->bind(':video_2_min_explicacion', isset($datos->video2MinExplicacion) && $datos->video2MinExplicacion !== '' ? $datos->video2MinExplicacion : null);
        $dbc->bind(':video_url_red_social', isset($datos->videoUrlRedSocial) && $datos->videoUrlRedSocial !== '' ? $datos->videoUrlRedSocial : null);
        $dbc->bind(':pagina_web_adicionales', null);
        $dbc->bind(':red_social_adicionales', null);
        $dbc->bind(':video_adicionales', null);
        $dbc->bind(':medio_uta_fecha_publicacion', isset($datos->medioUtaFechaPublicacion) && $datos->medioUtaFechaPublicacion !== '' ? $datos->medioUtaFechaPublicacion : null);
        $dbc->bind(':medio_uta_url', isset($datos->medioUtaUrl) && $datos->medioUtaUrl !== '' ? $datos->medioUtaUrl : null);
        $dbc->bind(':medio_uta_adicionales', null);
        $dbc->execute();

        $codigo = (int) $dbc->lastInsertId();
        if ($codigo <= 0) {
            throw new Exception('No se pudo obtener el código del Formato 13.');
        }

        $publicacionesPaginaWeb = array_merge(
            array(array(
                'fechaPublicacion' => isset($datos->paginaWebFechaPublicacion) ? $datos->paginaWebFechaPublicacion : null,
                'tipoPublicacion' => isset($datos->paginaWebTipoPublicacion) ? $datos->paginaWebTipoPublicacion : null,
                'banner' => isset($datos->paginaWebBanner) ? $datos->paginaWebBanner : null,
                'miniatura' => isset($datos->paginaWebMiniatura) ? $datos->paginaWebMiniatura : null,
                'zoom' => isset($datos->paginaWebZoom) ? $datos->paginaWebZoom : null,
                'articulo' => isset($datos->paginaWebArticulo) ? $datos->paginaWebArticulo : null,
                'url' => isset($datos->paginaWebUrl) ? $datos->paginaWebUrl : null
            )),
            $this->normalizarListaPublicacionesFormato13(isset($datos->publicacionesPaginaWeb) ? $datos->publicacionesPaginaWeb : array())
        );

        $publicacionesRedSocial = array_merge(
            array(array(
                'fechaPublicacion' => isset($datos->fechaPublicacion) ? $datos->fechaPublicacion : null,
                'tipoPublicacion' => isset($datos->tipoPublicacion) ? $datos->tipoPublicacion : null,
                'post' => isset($datos->redSocialPost) ? $datos->redSocialPost : null,
                'postUrl' => isset($datos->redSocialPostUrl) ? $datos->redSocialPostUrl : null,
                'carrusel' => isset($datos->redSocialCarrusel) ? $datos->redSocialCarrusel : null,
                'carruselUrl' => isset($datos->redSocialCarruselUrl) ? $datos->redSocialCarruselUrl : null,
                'reel' => isset($datos->redSocialReel) ? $datos->redSocialReel : null,
                'reelUrl' => isset($datos->redSocialReelUrl) ? $datos->redSocialReelUrl : null,
                'otro' => isset($datos->otroRedSocial) ? $datos->otroRedSocial : null,
                'urlRedSocial' => isset($datos->urlRedSocial) ? $datos->urlRedSocial : null
            )),
            $this->normalizarListaPublicacionesFormato13(isset($datos->publicacionesRedSocial) ? $datos->publicacionesRedSocial : array())
        );

        $publicacionesVideo = array_merge(
            array(array(
                'fechaPublicacion' => isset($datos->videoFechaPublicacion) ? $datos->videoFechaPublicacion : null,
                'tipoPublicacion' => isset($datos->videoTipoPublicacion) ? $datos->videoTipoPublicacion : null,
                'television' => isset($datos->television) ? $datos->television : null,
                'video45s' => isset($datos->video45s) ? $datos->video45s : null,
                'video2Min' => isset($datos->video2Min) ? $datos->video2Min : null,
                'video2MinExplicacion' => isset($datos->video2MinExplicacion) ? $datos->video2MinExplicacion : null,
                'urlRedSocial' => isset($datos->videoUrlRedSocial) ? $datos->videoUrlRedSocial : null
            )),
            $this->normalizarListaPublicacionesFormato13(isset($datos->publicacionesVideo) ? $datos->publicacionesVideo : array())
        );

        $publicacionesMedioUta = array_merge(
            array(array(
                'fechaPublicacion' => isset($datos->medioUtaFechaPublicacion) ? $datos->medioUtaFechaPublicacion : null,
                'url' => isset($datos->medioUtaUrl) ? $datos->medioUtaUrl : null
            )),
            $this->normalizarListaPublicacionesFormato13(isset($datos->mediosUtaAdicionales) ? $datos->mediosUtaAdicionales : array())
        );

        $this->insertarPublicacionesRelacionadasFormato13($dbc, $codigo, 'formato13_publicacion_pagina_web', $publicacionesPaginaWeb, array(
            'fecha_publicacion' => 'fechaPublicacion',
            'tipo_publicacion' => 'tipoPublicacion',
            'banner' => 'banner',
            'miniatura' => 'miniatura',
            'zoom' => 'zoom',
            'articulo' => 'articulo',
            'url' => 'url'
        ));
        $this->insertarPublicacionesRelacionadasFormato13($dbc, $codigo, 'formato13_publicacion_red_social', $publicacionesRedSocial, array(
            'fecha_publicacion' => 'fechaPublicacion',
            'tipo_publicacion' => 'tipoPublicacion',
            'post' => 'post',
            'post_url' => 'postUrl',
            'carrusel' => 'carrusel',
            'carrusel_url' => 'carruselUrl',
            'reel' => 'reel',
            'reel_url' => 'reelUrl',
            'otro' => 'otro',
            'url_red_social' => 'urlRedSocial',
            'tipos_medio' => 'tiposMedio',
            'tipos_recurso' => 'tiposRecurso',
            'medio_uta' => 'medioUta',
            'medio_uta_url' => 'medioUtaUrl',
            'impreso' => 'impreso',
            'copias_impresas' => 'copiasImpresas'
        ));
        $this->insertarPublicacionesRelacionadasFormato13($dbc, $codigo, 'formato13_publicacion_video', $publicacionesVideo, array(
            'fecha_publicacion' => 'fechaPublicacion',
            'tipo_publicacion' => 'tipoPublicacion',
            'television' => 'television',
            'video_45s' => 'video45s',
            'video_2_min' => 'video2Min',
            'video_2_min_explicacion' => 'video2MinExplicacion',
            'url_red_social' => 'urlRedSocial'
        ));
        $this->insertarPublicacionesRelacionadasFormato13($dbc, $codigo, 'formato13_publicacion_medio_uta', $publicacionesMedioUta, array(
            'fecha_publicacion' => 'fechaPublicacion',
            'url' => 'url'
        ));

        $dbc->endTransaction();
        $result[] = array('formato13_codigo' => $codigo);
        $this->estado = new Exception_Object(1, 'Formato 13 guardado correctamente.');
        $this->estado->setLastID($codigo);
    } catch (Exception $e) {
        if ($dbc !== null && $dbc->inTransaction()) {
            $dbc->cancelTransaction();
        }
        $this->estado = new Exception_Object(-1, 'No se pudo guardar el Formato 13: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
    $resultados->data->rcount = count($result);

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

private function normalizarListaPublicacionesFormato13($publicaciones)
{
    if (!is_array($publicaciones)) {
        return array();
    }

    $normalizadas = array();
    foreach ($publicaciones as $publicacion) {
        if (is_object($publicacion)) {
            $normalizadas[] = get_object_vars($publicacion);
        } elseif (is_array($publicacion)) {
            $normalizadas[] = $publicacion;
        }
    }

    return $normalizadas;
}

private function insertarPublicacionesRelacionadasFormato13($dbc, $codigo, $tabla, $publicaciones, $columnas)
{
    if (count($publicaciones) === 0) {
        return;
    }

    $nombresColumnas = array_keys($columnas);
    $parametros = array(':formato13_codigo', ':orden_publicacion');
    foreach ($nombresColumnas as $columna) {
        $parametros[] = ':' . $columna;
    }

    $insert = 'INSERT INTO ' . $tabla . ' (formato13_codigo, orden_publicacion, '
        . implode(', ', $nombresColumnas) . ') VALUES (' . implode(', ', $parametros) . ')';

    foreach ($publicaciones as $indice => $publicacion) {
        $dbc->query($insert);
        $dbc->bind(':formato13_codigo', $codigo);
        $dbc->bind(':orden_publicacion', $indice + 1);
        foreach ($columnas as $columna => $propiedad) {
            $valor = isset($publicacion[$propiedad]) && $publicacion[$propiedad] !== ''
                ? $publicacion[$propiedad]
                : null;
            $dbc->bind(':' . $columna, $valor);
        }
        $dbc->execute();
    }
}

private function obtenerPublicacionesRelacionadasFormato13($dbc, $tabla, $columnas)
{
    $dbc->query('SELECT * FROM ' . $tabla . ' ORDER BY formato13_codigo, orden_publicacion');
    $filas = $dbc->resultset();
    $publicaciones = array();

    foreach ($filas as $fila) {
        if ((int) $fila['orden_publicacion'] === 1) {
            continue;
        }

        $codigo = $fila['formato13_codigo'];
        if (!isset($publicaciones[$codigo])) {
            $publicaciones[$codigo] = array();
        }

        $publicacion = array();
        foreach ($columnas as $columna => $propiedad) {
            $publicacion[$propiedad] = $fila[$columna];
        }
        $publicaciones[$codigo][] = $publicacion;
    }

    return $publicaciones;
}

public function getFormato13()
{
    $dbc = null;
    $result = array();

    try {
        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }

        $dbc->query("SELECT formato13.*,
            formato6.formato6_fecha_elaboracion,
            formato6.formato6_requerimiento,
            formato6.formato6_modalidad,
            formato6.formato6_area,
            formato1.formato1_curso_definido,
            formato1.formato1_codigo_curso,
            formato1.formato1_fecha_ejecucion_desde,
            formato1.formato1_fecha_ejecucion_hasta
            FROM formato13
            LEFT JOIN formato6
                ON formato6.formato6_codigo = formato13.formato6_codigo
            LEFT JOIN formato1
                ON formato1.formato1_codigo = formato6.formato1_codigo
            ORDER BY formato13.formato13_codigo DESC");
        $result = $dbc->resultset();

        $dbc->query("SELECT * FROM formato13_publicacion
            ORDER BY formato13_codigo, orden_publicacion");
        $filasPublicaciones = $dbc->resultset();
        $publicacionesPorFormato = array();
        foreach ($filasPublicaciones as $fila) {
            $codigo = $fila['formato13_codigo'];
            if (!isset($publicacionesPorFormato[$codigo])) {
                $publicacionesPorFormato[$codigo] = array();
            }
            $publicacionesPorFormato[$codigo][] = $fila;
        }

        foreach ($result as &$formato) {
            $codigo = $formato['formato13_codigo'];
            $filas = isset($publicacionesPorFormato[$codigo]) ? $publicacionesPorFormato[$codigo] : array();
            $principal = count($filas) > 0 ? array_shift($filas) : array();

            $formato['formato13_red_social_fecha_publicacion'] = isset($principal['fecha_publicacion']) ? $principal['fecha_publicacion'] : null;
            $formato['formato13_red_social_tipo_publicacion'] = isset($principal['tipo_publicacion']) ? $principal['tipo_publicacion'] : null;
            $formato['formato13_red_social_url'] = isset($principal['url_publicacion']) ? $principal['url_publicacion'] : null;
            $formato['formato13_red_social_tipos_recurso'] = isset($principal['tipo_recurso']) ? $principal['tipo_recurso'] : null;
            $formato['formato13_red_social_medio_uta'] = isset($principal['medio_uta']) ? $principal['medio_uta'] : 'NO';
            $formato['formato13_red_social_medio_uta_url'] = isset($principal['medio_uta_url']) ? $principal['medio_uta_url'] : null;
            $formato['formato13_red_social_impreso'] = isset($principal['impreso']) ? $principal['impreso'] : 'NO';
            $formato['formato13_red_social_copias_impresas'] = isset($principal['copias_impresas']) ? $principal['copias_impresas'] : null;
            $formato['fecha_publicacion'] = $formato['formato13_red_social_fecha_publicacion'];
            $formato['url_publicacion'] = $formato['formato13_red_social_url'];
            $formato['tipo_recurso'] = $formato['formato13_red_social_tipos_recurso'];
            $formato['tipo_publicacion'] = $formato['formato13_red_social_tipo_publicacion'];
            $formato['medio_uta'] = $formato['formato13_red_social_medio_uta'];
            $formato['medio_uta_url'] = $formato['formato13_red_social_medio_uta_url'];
            $formato['impreso'] = $formato['formato13_red_social_impreso'];
            $formato['copias_impresas'] = $formato['formato13_red_social_copias_impresas'];

            $publicacionesAdicionales = array();
            foreach ($filas as $filaAdicional) {
                $publicacionesAdicionales[] = array(
                    'tipoMedioCodigo' => $filaAdicional['tipo_medio_codigo'],
                    'tipoMedio' => $filaAdicional['tipo_medio_nombre'],
                    'tiposMedio' => json_encode($filaAdicional['tipo_medio_nombre'] ? array($filaAdicional['tipo_medio_nombre']) : array(), JSON_UNESCAPED_UNICODE),
                    'fechaPublicacion' => $filaAdicional['fecha_publicacion'],
                    'urlRedSocial' => $filaAdicional['url_publicacion'],
                    'tiposRecurso' => $filaAdicional['tipo_recurso'],
                    'tipoPublicacion' => $filaAdicional['tipo_publicacion'],
                    'medioUta' => $filaAdicional['medio_uta'],
                    'medioUtaUrl' => $filaAdicional['medio_uta_url'],
                    'impreso' => $filaAdicional['impreso'],
                    'copiasImpresas' => $filaAdicional['copias_impresas']
                );
            }

            $publicacionesLegacy = isset($principal['publicaciones_legacy'])
                ? json_decode($principal['publicaciones_legacy'], true)
                : array();
            if (is_array($publicacionesLegacy)) {
                $publicacionesAdicionales = array_merge($publicacionesAdicionales, $publicacionesLegacy);
            }

            $formato['publicacionesRedSocialRelacionadas'] = $publicacionesAdicionales;
            $formato['publicacionesPaginaWebRelacionadas'] = array();
            $formato['publicacionesVideoRelacionadas'] = array();
            $formato['mediosUtaRelacionados'] = array();
        }
        unset($formato);

        $this->estado = new Exception_Object(1, 'Consulta realizada correctamente.');
        $this->estado->setLastID(1);
    } catch (Exception $e) {
        $this->estado = new Exception_Object(-1, 'No se pudieron consultar los Formatos 13: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
    $resultados->data->rcount = count($result);

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

public function getTiposMedioFormato13()
{
    $dbc = null;
    $result = array();

    try {
        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }

        $dbc->query("SELECT tipo_medio_codigo, tipo_medio_nombre
            FROM formato13_tipo_medio
            ORDER BY tipo_medio_codigo");
        $result = $dbc->resultset();
        $this->estado = new Exception_Object(1, 'Tipos de medio consultados correctamente.');
        $this->estado->setLastID(1);
    } catch (Exception $e) {
        $this->estado = new Exception_Object(-1, 'No se pudieron consultar los tipos de medio: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
    $resultados->data->rcount = count($result);

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

private function getFormato13Legacy()
{
    $dbc = null;
    $result = array();

    try {
        $dbc = $this->getInitDatabase();
        if ($dbc->getEstado()->codigo != 0) {
            throw new Exception('No fue posible conectar con la base de datos.');
        }

        $dbc->query("SELECT formato13.*,
            pagina_web.fecha_publicacion AS _pagina_web_fecha,
            pagina_web.tipo_publicacion AS _pagina_web_tipo,
            pagina_web.banner AS _pagina_web_banner,
            pagina_web.miniatura AS _pagina_web_miniatura,
            pagina_web.zoom AS _pagina_web_zoom,
            pagina_web.articulo AS _pagina_web_articulo,
            pagina_web.url AS _pagina_web_url,
            pagina_web.publicaciones_adicionales AS _pagina_web_adicionales,
            red_social.fecha_publicacion AS _red_social_fecha,
            red_social.tipo_publicacion AS _red_social_tipo,
            red_social.post AS _red_social_post,
            red_social.post_url AS _red_social_post_url,
            red_social.carrusel AS _red_social_carrusel,
            red_social.carrusel_url AS _red_social_carrusel_url,
            red_social.reel AS _red_social_reel,
            red_social.reel_url AS _red_social_reel_url,
            red_social.otro AS _red_social_otro,
            red_social.url_red_social AS _red_social_url,
            red_social.tipos_medio AS _red_social_tipos_medio,
            red_social.tipos_recurso AS _red_social_tipos_recurso,
            red_social.medio_uta AS _red_social_medio_uta,
            red_social.medio_uta_url AS _red_social_medio_uta_url,
            red_social.impreso AS _red_social_impreso,
            red_social.copias_impresas AS _red_social_copias_impresas,
            red_social.publicaciones_adicionales AS _red_social_adicionales,
            videos.fecha_publicacion AS _video_fecha,
            videos.tipo_publicacion AS _video_tipo,
            videos.television AS _video_television,
            videos.video_45s AS _video_45s,
            videos.video_2_min AS _video_2_min,
            videos.video_2_min_explicacion AS _video_2_min_explicacion,
            videos.url_red_social AS _video_url,
            videos.publicaciones_adicionales AS _video_adicionales,
            medio_uta.fecha_publicacion AS _medio_uta_fecha,
            medio_uta.url AS _medio_uta_url,
            medio_uta.publicaciones_adicionales AS _medio_uta_adicionales
            FROM formato13
            LEFT JOIN formato13_pagina_web AS pagina_web
                ON pagina_web.pagina_web_codigo = formato13.formato13_pagina_web_codigo
            LEFT JOIN formato13_red_social AS red_social
                ON red_social.red_social_codigo = formato13.formato13_red_social_codigo
            LEFT JOIN formato13_videos AS videos
                ON videos.video_codigo = formato13.formato13_video_codigo
            LEFT JOIN formato13_medio_uta AS medio_uta
                ON medio_uta.medio_uta_codigo = formato13.formato13_medio_uta_codigo
            ORDER BY formato13.formato13_codigo DESC");
        $result = $dbc->resultset();

        $webPorFormato = $this->obtenerPublicacionesCuadroFormato13($dbc, 'formato13_pagina_web', 'pagina_web_codigo', array(
            'fecha_publicacion' => 'fechaPublicacion',
            'tipo_publicacion' => 'tipoPublicacion',
            'banner' => 'banner',
            'miniatura' => 'miniatura',
            'zoom' => 'zoom',
            'articulo' => 'articulo',
            'url' => 'url'
        ));
        $redesPorFormato = $this->obtenerPublicacionesCuadroFormato13($dbc, 'formato13_red_social', 'red_social_codigo', array(
            'fecha_publicacion' => 'fechaPublicacion',
            'tipo_publicacion' => 'tipoPublicacion',
            'post' => 'post',
            'post_url' => 'postUrl',
            'carrusel' => 'carrusel',
            'carrusel_url' => 'carruselUrl',
            'reel' => 'reel',
            'reel_url' => 'reelUrl',
            'otro' => 'otro',
            'url_red_social' => 'urlRedSocial'
        ));
        $videosPorFormato = $this->obtenerPublicacionesCuadroFormato13($dbc, 'formato13_videos', 'video_codigo', array(
            'fecha_publicacion' => 'fechaPublicacion',
            'tipo_publicacion' => 'tipoPublicacion',
            'television' => 'television',
            'video_45s' => 'video45s',
            'video_2_min' => 'video2Min',
            'video_2_min_explicacion' => 'video2MinExplicacion',
            'url_red_social' => 'urlRedSocial'
        ));
        $mediosUtaPorFormato = $this->obtenerPublicacionesCuadroFormato13($dbc, 'formato13_medio_uta', 'medio_uta_codigo', array(
            'fecha_publicacion' => 'fechaPublicacion',
            'url' => 'url'
        ));

        foreach ($result as &$formato) {
            $codigo = $formato['formato13_codigo'];
            $camposCuadro = array(
                '_pagina_web_fecha' => 'formato13_pagina_web_fecha_publicacion',
                '_pagina_web_tipo' => 'formato13_pagina_web_tipo_publicacion',
                '_pagina_web_banner' => 'formato13_pagina_web_banner',
                '_pagina_web_miniatura' => 'formato13_pagina_web_miniatura',
                '_pagina_web_zoom' => 'formato13_pagina_web_zoom',
                '_pagina_web_articulo' => 'formato13_pagina_web_articulo',
                '_pagina_web_url' => 'formato13_pagina_web_url',
                '_red_social_fecha' => 'formato13_red_social_fecha_publicacion',
                '_red_social_tipo' => 'formato13_red_social_tipo_publicacion',
                '_red_social_post' => 'formato13_red_social_post',
                '_red_social_post_url' => 'formato13_red_social_post_url',
                '_red_social_carrusel' => 'formato13_red_social_carrusel',
                '_red_social_carrusel_url' => 'formato13_red_social_carrusel_url',
                '_red_social_reel' => 'formato13_red_social_reel',
                '_red_social_reel_url' => 'formato13_red_social_reel_url',
                '_red_social_otro' => 'formato13_red_social_otro',
                '_red_social_url' => 'formato13_red_social_url',
                '_red_social_tipos_medio' => 'formato13_red_social_tipos_medio',
                '_red_social_tipos_recurso' => 'formato13_red_social_tipos_recurso',
                '_red_social_medio_uta' => 'formato13_red_social_medio_uta',
                '_red_social_medio_uta_url' => 'formato13_red_social_medio_uta_url',
                '_red_social_impreso' => 'formato13_red_social_impreso',
                '_red_social_copias_impresas' => 'formato13_red_social_copias_impresas',
                '_video_fecha' => 'formato13_video_fecha_publicacion',
                '_video_tipo' => 'formato13_video_tipo_publicacion',
                '_video_television' => 'formato13_television',
                '_video_45s' => 'formato13_video_45s',
                '_video_2_min' => 'formato13_video_2_min',
                '_video_2_min_explicacion' => 'formato13_video_2_min_explicacion',
                '_video_url' => 'formato13_video_url_red_social',
                '_medio_uta_fecha' => 'formato13_medio_uta_fecha_publicacion',
                '_medio_uta_url' => 'formato13_medio_uta_url'
            );
            foreach ($camposCuadro as $alias => $campo) {
                if (isset($formato[$alias])) {
                    $formato[$campo] = $formato[$alias];
                }
            }

            $adicionalesWeb = isset($formato['_pagina_web_adicionales'])
                ? json_decode($formato['_pagina_web_adicionales'], true)
                : null;
            $adicionalesSociales = isset($formato['_red_social_adicionales'])
                ? json_decode($formato['_red_social_adicionales'], true)
                : null;
            $adicionalesVideos = isset($formato['_video_adicionales'])
                ? json_decode($formato['_video_adicionales'], true)
                : null;
            $adicionalesMediosUta = isset($formato['_medio_uta_adicionales'])
                ? json_decode($formato['_medio_uta_adicionales'], true)
                : null;

            $formato['publicacionesPaginaWebRelacionadas'] = $this->filtrarPublicacionesAdicionalesFormato13(
                isset($webPorFormato[$codigo]) ? $webPorFormato[$codigo] : array(),
                $formato['formato13_pagina_web_codigo']
            );
            if (count($formato['publicacionesPaginaWebRelacionadas']) === 0 && is_array($adicionalesWeb)) {
                $formato['publicacionesPaginaWebRelacionadas'] = $adicionalesWeb;
            } elseif (count($formato['publicacionesPaginaWebRelacionadas']) === 0) {
                $formato['publicacionesPaginaWebRelacionadas'] = json_decode(isset($formato['formato13_pagina_web_adicionales']) ? $formato['formato13_pagina_web_adicionales'] : '[]', true);
            }

            $formato['publicacionesRedSocialRelacionadas'] = $this->filtrarPublicacionesAdicionalesFormato13(
                isset($redesPorFormato[$codigo]) ? $redesPorFormato[$codigo] : array(),
                $formato['formato13_red_social_codigo']
            );
            if (count($formato['publicacionesRedSocialRelacionadas']) === 0 && is_array($adicionalesSociales)) {
                $formato['publicacionesRedSocialRelacionadas'] = $adicionalesSociales;
            } elseif (count($formato['publicacionesRedSocialRelacionadas']) === 0) {
                $formato['publicacionesRedSocialRelacionadas'] = json_decode(isset($formato['formato13_red_social_adicionales']) ? $formato['formato13_red_social_adicionales'] : '[]', true);
            }

            $formato['publicacionesVideoRelacionadas'] = $this->filtrarPublicacionesAdicionalesFormato13(
                isset($videosPorFormato[$codigo]) ? $videosPorFormato[$codigo] : array(),
                $formato['formato13_video_codigo']
            );
            if (count($formato['publicacionesVideoRelacionadas']) === 0 && is_array($adicionalesVideos)) {
                $formato['publicacionesVideoRelacionadas'] = $adicionalesVideos;
            } elseif (count($formato['publicacionesVideoRelacionadas']) === 0) {
                $formato['publicacionesVideoRelacionadas'] = json_decode(isset($formato['formato13_video_adicionales']) ? $formato['formato13_video_adicionales'] : '[]', true);
            }

            $formato['mediosUtaRelacionados'] = $this->filtrarPublicacionesAdicionalesFormato13(
                isset($mediosUtaPorFormato[$codigo]) ? $mediosUtaPorFormato[$codigo] : array(),
                $formato['formato13_medio_uta_codigo']
            );
            if (count($formato['mediosUtaRelacionados']) === 0 && is_array($adicionalesMediosUta)) {
                $formato['mediosUtaRelacionados'] = $adicionalesMediosUta;
            } elseif (count($formato['mediosUtaRelacionados']) === 0) {
                $formato['mediosUtaRelacionados'] = json_decode(isset($formato['formato13_medio_uta_adicionales']) ? $formato['formato13_medio_uta_adicionales'] : '[]', true);
            }
        }
        unset($formato);

        $this->estado = new Exception_Object(1, 'Consulta realizada correctamente.');
        $this->estado->setLastID(1);
    } catch (Exception $e) {
        $this->estado = new Exception_Object(-1, 'No se pudieron consultar los Formatos 13: ' . $e->getMessage());
        $this->estado->setLastID(-1);
    }

    if ($dbc !== null) {
        $dbc->closeAll();
    }

    $resultados = new stdClass();
    $resultados->data = new stdClass();
    $resultados->data->success = $this->estado->getLastID() > 0;
    $resultados->data->message = $this->estado->getMessage();
    $resultados->data->estado = $this->estado->getCode();
    $resultados->data->item = $result;
    $resultados->data->rcount = count($result);

    if ($this->isHTML) {
        header('Content-type: application/json');
        echo json_encode($resultados);
    } else {
        return $resultados;
    }
}

}//fin


    ?>
