<?php
 
error_reporting(0);
 
/*    Your settings: */
 
$your_email_address = 'solarman.awm@gmail.com';
$your_subject = 'Email from "Walton" contact form...';
 
$sender_email = $_POST['email'];
$sender_name = $_POST['name'];
$sender_phone = $_POST['phone'];
$sender_company = $_POST['company'];
$message = $_POST['message'];

$message .= '<br><br><strong>Contact information:</strong>
			<br>Company: ' . $sender_company .
			'<br>Name:' . $sender_name . 
			'<br>Phone: ' . $sender_phone .
			'<br>Email: ' . $sender_email;

// Sent email
$headers   = array();
$headers[] = "MIME-Version: 1.0";
$headers[] = 'Content-type: text/html; charset=utf-8';
$headers[] = "From: $sender_name <$sender_email>";
$headers[] = "Reply-To: $sender_name <$sender_email>";
$headers[] = "Subject: {$your_subject}";
$headers[] = "X-Mailer: PHP/".phpversion();

header('Content Type: text/xml');
echo '<?xml version="1.0" encoding="UTF 8" standalone="yes"?>';
echo '<response>';

if (mail($your_email_address, $your_subject, $message, implode("\r\n", $headers))) {
    echo '<span>Email sent successfully!</span>';
} else {
	echo 'Can not send a request.';
}
 
echo '</response>';
die();
?>
