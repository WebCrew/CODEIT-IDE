<?php

// check if this file is imported by index__.php or not

if (!defined('SESSION_OBJECT_NAME')) exit;
?>

<!DOCTYPE html>
<html >
	<head>
		<title>CODEIT v1.0</title>
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Content-Language" content="<?php echo strtolower(LANGUAGE); ?>" />
		
		<!-- MOBILE SETUP -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />
		
		<!-- APP ICONS -->
		<link rel="icon" href="themes/default/images/favicon.png" type="image/png" />
		<link rel="apple-touch-icon" href="themes/default/images/touch-icon-iphone.png" />
		<link rel="apple-touch-icon" sizes="72x72" href="themes/default/images/touch-icon-ipad.png" />
		<link rel="apple-touch-icon" sizes="114x114" href="themes/default/images/touch-icon-iphone4.png" />	
    
		<!-- THEME -->
		<link rel="stylesheet" href="themes/default/css.css" />		
	</head>

<body>	
		
		<div class="loginPanel" >
			<div class="applicationLogo" style="left:20px; top:20px;" ></div>
			<form style="position:absolute; right:25px; top:36px; width:200px; text-align:right; font-size:10px;" action="?" method="post" enctype="multipart/form-data" name="loginForm" id="loginForm">
				<input type="hidden" id="action"  name="action" value="doUserLogin" />
				<label for="username">Username</label>
				<input style="width:100px; height:14px; margin-bottom:2px; border-radius:4px;" type="text" name="username" id="username" />
				<label for="password">Password</label>
				<input style="width:100px; height:14px; margin-bottom:2px; border-radius:4px;" type="password" name="password" id="password" />
			  	<input style="width:106px; height:22px;  margin-bottom:2px;" type="submit" name="submit"  value="      Login      "/>
			</form>
		</div>
							
</body>

</html>