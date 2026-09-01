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
var_dump($e);
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
var_dump($e);
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
    var_dump($e);
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
var_dump($e);
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
   formato1_fecha_ejecucion,
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
   :formato1_fecha_ejecucion,
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
            $dbc->bind(":formato1_fecha_ejecucion",$filtros->fformato1_fecha_ejecucion);
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
   var_dump($e);
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
   var_dump($e);
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
        f1.formato1_institucion,
        f1.formato1_persona_contacto,
        f1.formato1_direccion,
        f1.formato1_telefono,
        f1.formato1_correo,
        f1.formato1_tematicas,
        f1.formato1_mes_ejecucion,
        f1.formato1_numero_personas,
        f1.formato1_modalidad,
        mc.modalidad_nombre,
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

        GROUP_CONCAT(DISTINCT tt.tematicat_nombre SEPARATOR ', ') AS tematicas_tentativas,
        GROUP_CONCAT(DISTINCT it.instructorest_nombre SEPARATOR ', ') AS instructores_tentativos,
        GROUP_CONCAT(DISTINCT cf.consecuencia_descripcion SEPARATOR ', ') AS consecuencias

    FROM formato1 f1

    LEFT JOIN modalidad_capacitacion mc
        ON f1.formato1_modalidad = mc.modalidad_codigo

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
        f1.formato1_institucion,
        f1.formato1_persona_contacto,
        f1.formato1_direccion,
        f1.formato1_telefono,
        f1.formato1_correo,
        f1.formato1_tematicas,
        f1.formato1_mes_ejecucion,
        f1.formato1_numero_personas,
        f1.formato1_modalidad,
        mc.modalidad_nombre,
        f1.formato1_carga_horaria,
        f1.formato1_instructores_tentativos,
        f1.formato1_fecha_ejecucion,
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
             $item->formato1_fecha_ejecucion = 'NO HAY REGISTROS';

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
var_dump($e);
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
                mc.modalidad_nombre,
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
            LEFT JOIN modalidad_capacitacion mc
                ON f1.formato1_modalidad = mc.modalidad_codigo
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
                mc.modalidad_nombre,
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
        var_dump($e);

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


}//fin







    ?>
