<?php
header("Access-Control-Allow-Origin: http://rubenkoops.nl, http://localhost:8000");
header("Access-Control-Allow-Credentials: true");
session_start();
$username = $_POST['username'];
$password = $_POST['password'];




if($_POST['username']){
	// Create connection
	$conn = new mysqli("rubenkoops.nl.mysql", $username, $password);
	
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
	echo "ok";
	$_SESSION['username'] = $username;
	$_SESSION['password'] = $password;
	}

mysql_connect("rubenkoops.nl.mysql",$_SESSION['username'],$_SESSION['password']);
mysql_select_db("rubenkoops_nl");
date_default_timezone_set('Europe/Amsterdam');

?>