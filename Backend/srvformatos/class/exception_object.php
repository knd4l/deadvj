<?php
class Exception_Object{
    public $codigo;
    public $error;
    public $lastid;

    public function __construct($code,$message){
        $this->codigo=$code;
        $this->error=$message;
    }

    public function setLastID($id) {$this->lastid=$id;}
    public function getLastID() {return $this->lastid;}
    public function getCode(){return $this->codigo;}
    public function getMessage(){return $this->error;}

    public function getJSon(){
        $tmp = new stdClass();
        $tmp->error = $this->codigo;
        $tmp->message = $this->error;
        $tmp->lastid = $this->lastid;
        return json_encode($tmp);
        }
}
?>
