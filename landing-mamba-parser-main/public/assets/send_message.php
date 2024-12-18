<?php

$token = '6713508038:AAHaY9fOgiw6IdYeZNgGObFlgCj9RgvAiU8';
$chat_id = '5691424847';


$phone = $_POST['tg'];
$photo = $_FILES['photo'];


if(isset($photo) && $photo['error'] == 0) {
    $url = "https://api.telegram.org/bot$token/sendPhoto";
    $postFields = [
        'chat_id' => $chat_id,
        'caption' => $phone,
        'photo' => new CURLFile($photo['tmp_name'])
    ];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: multipart/form-data']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $response = curl_exec($ch);
    curl_close($ch);
} 
else {
    $url = "https://api.telegram.org/bot$token/sendMessage?chat_id=$chat_id&text=$phone";
    file_get_contents($url);
}

header("Location: /index.html#alert");

?>