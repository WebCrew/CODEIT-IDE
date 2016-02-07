<?

// check if this file is imported by index__.php or not
if( ! defined( 'SESSION_OBJECT_NAME' ) ) exit; 
	
global $STR;
	
/*
function isValidRequestUri()   
{	 
	if( isset($_SERVER['HTTP_REFERER'])  )
	{
		$splitUrl = explode('?', $_SERVER['HTTP_REFERER'] );
		$referer = $splitUrl[0];
		if( $referer == APPLICATION_URL ) return true;		
	}				
	return false;
}
*/


function isUserLogged()
{
	if( isset( $_SESSION[ SESSION_OBJECT_NAME ] ) )
	{
		if( isset( $_SESSION[ SESSION_OBJECT_NAME ][ "logged" ] ) &&  $_SESSION[ SESSION_OBJECT_NAME ][ "logged" ] === true ) return true;		
	}
	return false;
}


/*
function isAdmin()
{
	if( isUserLogged() )
	{
		if( $_SESSION[ SESSION_OBJECT_NAME ][ 'userType' ] === 'admin' ) return true;		
	}
	return false;
}
*/



function doUserLogin()
{
	//if( ! isValidRequestUri() ) exit; // all the request must come from index_…
	
	global $users;
	// login without database
	// You can use some other way to do the login.
	
	
				
	if( ! isset( $_POST['username'])  ) exit;
	if( ! isset( $_POST['password'])  ) exit;
	
	//$usr = md5(filter_var( $_POST['username'] , FILTER_SANITIZE_STRING));
	$usr = filter_var( $_POST['username'] , FILTER_SANITIZE_STRING);
	$psw = md5(filter_var( $_POST['password'] , FILTER_SANITIZE_STRING));
	
	$logged = false;
		
	$_SESSION[ SESSION_OBJECT_NAME ] = array();
	
	foreach ($users as $user )
	{		
		if( ( $usr == $user['usr'] ) && ( $psw == $user['psw'] ))
		{							
			$_SESSION[ SESSION_OBJECT_NAME ]['logged'] = true;
			$_SESSION[ SESSION_OBJECT_NAME ]['root'] = $user['root'];
			header('Location: '.$_SERVER['REQUEST_URI']);
			exit;			
		}
	}
	
	header('Location: '.$_SERVER['REQUEST_URI']);
	
/*
	
	header('Content-Type: text/xml');
 	header ('Cache-Control: no-cache');
 	header ('Cache-Control: no-store' , false);
 	
 	
	foreach ($users as $user )
	{
		
		if( ( $usr == $user['usr'] ) && ( $psw == $user['psw'] ))
		{							
			$_SESSION[ SESSION_OBJECT_NAME ]['logged'] = true;
			$_SESSION[ SESSION_OBJECT_NAME ]['root'] = $user['root'];
			echo '<?xml version="1.0" encoding="UTF-8" ?><responseData><message>USER_LOGGED</message></responseData>' ;
			
		}else{
			echo '<?xml version="1.0" encoding="UTF-8" ?><responseData><message>USER_NO_LOGGED</message></responseData>' ;
		}
	}
*/
		
		
	exit;	
}


function doUserlogout()
{
	if(isset($_SESSION[ SESSION_OBJECT_NAME ]))
	{		
		$_SESSION[ SESSION_OBJECT_NAME ] = NULL;
		//echo 'LOGOUT SUCCESS';
		header('Location: '.$_SERVER['REQUEST_URI']);
	}
	exit;
}


function STR( $_value )
{
	global $STR;
	return $STR[ $_value ];
}

function PrintSTR( $_value )
{
	global $STR;
	echo $STR[ $_value ];
}


// load the string language
require_once( 'languages/'.LANGUAGE.'.php');


// if the user is not logged 
if( ! isUserLogged() )
{		
	// if is login action then check for existent user
	if( isset($_POST['action']) && $_POST['action']=='doUserLogin' ) doUserLogin();
	
	//else draw the login interface
	require_once( 'themes/'.THEME.'/login_interface.php');
	exit;
}


// if we are here the user is logged. We get the user root from the session
define( "USER_HARD_DISK_ROOT", $_SESSION[ SESSION_OBJECT_NAME ]['root'] );



// if POST or GET action is defined then the service.php take the control and exit after response
if( isset($_POST['action']) || isset($_GET['action']) )
{		
	require_once( 'service.php');
	exit;
}
else
{
	require_once( 'themes/'.THEME.'/application_interface.php');
}


	
?>