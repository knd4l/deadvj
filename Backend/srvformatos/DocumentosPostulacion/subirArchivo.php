<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['archivo'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No se recibió ningún archivo.']);
    exit;
}

$file = $_FILES['archivo'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Error al cargar el archivo.']);
    exit;
}

if (strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) !== 'pdf') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Solo se permiten archivos PDF.']);
    exit;
}

$uploadsDir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads';
if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0775, true)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'No se pudo preparar el directorio de archivos.']);
    exit;
}

$originalName = basename($file['name']);
$safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', $originalName);
$storedName = uniqid('anexo_', true) . '_' . $safeName;
$targetPath = $uploadsDir . DIRECTORY_SEPARATOR . $storedName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'No se pudo guardar el archivo.']);
    exit;
}

$relativePath = '/practicas/Backend/srvformatos/DocumentosPostulacion/uploads/' . rawurlencode($storedName);
echo json_encode([
    'success' => true,
    'message' => 'Archivo subido correctamente.',
    'file' => ['name' => $originalName, 'path' => $relativePath, 'size' => $file['size']]
]);
