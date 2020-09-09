<?php

    $executionStartTime = microtime(true);
	header('Content-Type: application/json; charset=UTF-8');
    

	include("config.php");

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		
		mysqli_close($conn);

		exit;

	}	

    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $departmentID = $_POST['departmentID'];
    $id = $_POST['id'];
    $name = $_POST['name'];
	$locationID = $_POST['locationID'];


    $query = "UPDATE personnel SET firstName = '$firstName', lastName = '$lastName' ,email = '$email', departmentID = '$departmentID' WHERE id = '$id' ";
   	$queryDepartment = " 
    
    UPDATE department SET name = '$name' , locationID = '20000' WHERE id = '$id'";
	
	$resultDepartment = $conn->query($queryDepartment);
	$result = $conn->query($query);
	
	if (!$result || !$resultDepartment) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
	
    
   	$data = [];

	
    

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    
	mysqli_close($conn);

	echo json_encode($output); 

?>