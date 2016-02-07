<?php

// The access informations for the users.
// username and password are encrypted with md5

/*

To create your md5 password, use:

http://www.md5.cz/

Copy the the encrypted value and replace the already defined below

*/
$users = array();
$newUser = array(
	'usr' => 'Demo', // the username ( to replace with your custom username )
	'psw' => 'f0258b6685684c113bad94d91b8fa02a', // the password encrypted with md5  ( to replace with your encrypted password  )
	'root' => '../projects_root'

	// the root folder path of your files

);
/*
To create a new user just copy the following code and fill in the data.
You can create as many users as You want.
------------------------------------------------------------------------------------------------

$newUser = array
(
'usr' => '', // the username ( replace with your new custom username )
'psw' => '', // the password encrypted with md5  ( replace with a new encrypted password  )
'root' => '' // the root folder path of the new users project folder
);

------------------------------------------------------------------------------------------------
*/
array_push($users, $newUser);
?>