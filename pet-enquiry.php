<?php
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method."
    ]);
    exit;
}

/* =========================
   DATABASE CONFIG
========================= */

$host = "localhost";
$dbname = "shinepets";
$username = "root";
$password = "";

/* =========================
   GOOGLE SHEET URL
========================= */

$googleSheetUrl = "https://script.google.com/macros/s/AKfycbyT6BdVNxpOuN2bCkZsovg0KsGU9dp3mMaU6CiNbxp4BFlNWdJ2OtfbYF_H-CWJh9_U/exec";

try {
    $conn = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $pet_type = trim($_POST["pet_type"] ?? "");
    $pet_service = trim($_POST["pet_service"] ?? "");
    $message = trim($_POST["message"] ?? "");

    if (
        $name === "" ||
        $email === "" ||
        $pet_type === "" ||
        $pet_service === "" ||
        $message === ""
    ) {
        echo json_encode([
            "status" => "error",
            "message" => "Please fill all required fields."
        ]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "status" => "error",
            "message" => "Please enter a valid email address."
        ]);
        exit;
    }

    /* =========================
       SAVE TO DATABASE
    ========================= */

    $stmt = $conn->prepare("
        INSERT INTO pet_enquiries 
        (name, email, pet_type, pet_service, message) 
        VALUES 
        (:name, :email, :pet_type, :pet_service, :message)
    ");

    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":pet_type" => $pet_type,
        ":pet_service" => $pet_service,
        ":message" => $message
    ]);

    /* =========================
       SEND TO GOOGLE SHEET
    ========================= */

    $sheetData = [
        "name" => $name,
        "email" => $email,
        "pet_type" => $pet_type,
        "pet_service" => $pet_service,
        "message" => $message,
        "created_at" => date("Y-m-d H:i:s")
    ];

    $ch = curl_init($googleSheetUrl);

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($sheetData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);

    $sheetResponse = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        echo json_encode([
            "status" => "error",
            "message" => "Saved in database, but Google Sheet failed: " . $curlError
        ]);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "message" => "Enquiry submitted successfully.",
        "sheet_response" => $sheetResponse
    ]);
    exit;

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Something went wrong: " . $e->getMessage()
    ]);
    exit;
}
?>