<?php
include_once PAGE_URL . '/class/config.php';
include_once PAGE_URL . '/class/exception_object.php';
//include_once 'usuarios.php';

class Database {
	private $host = DB_HOST;
	private $user = DB_USER;
	private $pass = DB_PASS;
	private $dbname = DB_NAME;
	private $dbh;
	private $estado;
	private $stmt;
	PRIVATE $varrayp;

	function __construct() {

		$dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname . ';charset=utf8';
		$options = array(
			PDO::ATTR_PERSISTENT => true,
			PDO::MYSQL_ATTR_FOUND_ROWS => true,
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8' COLLATE 'utf8_spanish2_ci'",
		);

		try {
			$this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
			$this->estado = new Exception_Object(0, 'Conectado');
			$this->varrayp = array();
		} catch (PDOException $e) {
			//var_dump($e);
			// $this->error = $e->getMessage();
			$this->estado = new Exception_Object(1001, 'error de datos');
		}
	}

	public function init() {

		$dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname . ';charset=utf8';
		$options = array(
			PDO::ATTR_PERSISTENT => true,
			PDO::MYSQL_ATTR_FOUND_ROWS => true,
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8' COLLATE 'utf8_spanish2_ci'",
		);

		try {
			$this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
			$this->estado = new Exception_Object(0, 'Conectado');
			$this->varrayp = array();
		} catch (PDOException $e) {
			//var_dump($e);
			// $this->error = $e->getMessage();
			$this->estado = new Exception_Object(1001, 'error de datos');
		}
	}

	public function initDatabase($database = 'deadv_formatos') {

		$this->setDatabase($database);

		$dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname . ';charset=utf8';
		$options = array(
			PDO::ATTR_PERSISTENT => true,
			PDO::MYSQL_ATTR_FOUND_ROWS => true,
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8' COLLATE 'utf8_spanish2_ci'",
		);

		try {
			$this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
			$this->estado = new Exception_Object(0, 'Conectado');
		} catch (PDOException $e) {
			var_dump($e);
			// $this->error = $e->getMessage();
			$this->estado = new Exception_Object(1001, 'error de datos');
		}
	}

	public function getEstado() {return $this->estado;}

	public function query($query) {
		$this->stmt = $this->dbh->prepare($query);
	}

	public function testConeccion() {

		$dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname . ";charset=utf8";
		$options = array(
			PDO::ATTR_PERSISTENT => true,
			PDO::MYSQL_ATTR_FOUND_ROWS => true,
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8' COLLATE 'utf8_spanish2_ci'",
		);

		try {
			$this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
			$this->estado = new Exception_Object(0, 'Conectado');
		} catch (PDOException $e) {
			$this->estado = new Exception_Object(1001, 'error de datos');
		}
		$this->dbh = null;
	}

	public function setDatabase($database = 'deadv_formatos') {
		$this->dbname = $database;
	}
	public function getDatabase() {
		return $this->dbname;
	}

	public function setHost($hostname = 'localhost') {
		$this->host = $hostname;
	}
	public function getHost() {
		return $this->host;
	}

	public function setUserName($user = 'root') {
		$this->user = $user;
	}
	public function getUserName() {
		return $this->user;
	}

	public function setPassWord($password = '') {
		$this->pass = $password;
	}
	public function getPassWord() {
		return $this->pass;
	}

	public function bind($param, $value, $type = null) {

		if (is_null($type)) {
			switch (true) {
			case is_int($value):
				$type = PDO::PARAM_INT;
				break;
			case is_bool($value):
				$type = PDO::PARAM_BOOL;
				break;
			case is_null($value):
				$type = PDO::PARAM_NULL;
				break;
			default:
				$type = PDO::PARAM_STR;
			}
		}

		// var_dump($this->stmt);
		/* echo "param<br>";
	        var_dump($param);
	        echo "value <br>";
	        var_dump($value);
	        echo "type <br>";
	        var_dump($type);
*/

		$item = new stdClass();

		$item->param = $param;
		$item->value = $value;
		$item->type = $type;

		$this->varrayp[] = $item;

		$this->stmt->bindValue($param, $value, $type);
	}

	public function execute() {
		return $this->stmt->execute();
	}

	public function resultset() {
		$this->execute();
		return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function ejecutar() {
		return $this->stmt->execute();
	}

	public function getTabla() {
		$this->execute();
		return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getTable() {
		$this->execute();
		return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Table() {
		$this->execute();
		return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	public function single() {
		$this->execute();
		return $this->stmt->fetch(PDO::FETCH_ASSOC);
	}
	public function getRow() {
		$this->execute();
		return $this->stmt->fetch(PDO::FETCH_ASSOC);
	}
	public function rowCount() {
		return $this->stmt->rowCount();
	}
	public function Count() {
		return $this->stmt->rowCount();
	}
	public function lastInsertId() {
		return $this->dbh->lastInsertId();
	}
	public function lastId() {
		return $this->dbh->lastInsertId();
	}
	public function beginTransaction() {
		return $this->dbh->beginTransaction();
	}
	public function endTransaction() {
		return $this->dbh->commit();
	}
	public function cancelTransaction() {
		return $this->dbh->rollBack();
	}
	public function debugDumpParams() {
		return $this->stmt->debugDumpParams();
	}

	public function closeAll() {
		try {
			$this->stmt = null;
			$this->dbh = null;

		} catch (Exception $e) {
			return false;
		}

		return true;
	}

	public function getParams() {
		return $this->varrayp;
	}

	public function cleanParams()
	{
		$this->varrayp = array();
	}
	public function clean()
	{
		$this->varrayp = array();
	}
}
?>
