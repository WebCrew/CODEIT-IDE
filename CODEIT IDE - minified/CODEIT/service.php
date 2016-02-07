<?php error_reporting(E_ALL);
ini_set('display_errors', 'On');

// check if this file is imported by index__.php or not

if (!defined('SESSION_OBJECT_NAME')) exit;
require_once ('../codeit_php/CODEIT_FileManager.php');

function printResponse($_state, $_message = ' ', $_data = ' ')
	{
	header('Content-Type: text/xml');
	header('Cache-Control: no-cache');
	header('Cache-Control: no-store', false);
	echo '<?xml version="1.0" encoding="UTF-8" ?><responseData><state>' . $_state . '</state><message>' . $_message . '</message><data>' . $_data . '</data></responseData>';
	exit;
	}

function sanitizeString($_strValue)
	{
	return filter_var($_strValue, FILTER_SANITIZE_STRING);
	}

function sanitizeFilePath($_strValue)
	{
	$sanitized = sanitizeString($_strValue);
	$pos = strrpos($sanitized, "./");
	if ($pos === false) return $sanitized;
	exit;
	}

function listFiles($_pathDir)
	{
	$fileManager = new CODEIT_FileManager();
	$sourceDir = USER_HARD_DISK_ROOT;
	if ($_pathDir != '') $sourceDir = USER_HARD_DISK_ROOT . '/' . $_pathDir;
	$files = $fileManager->getFileListAsArray($sourceDir);
	if ($files === false) exit;
	foreach($files as $record)
		{
		$record['path'] = str_replace(USER_HARD_DISK_ROOT . '/', '', $record['path']);
		if ($record['type'] == 'dir')
			{
?>
<li draggable="true" ondragover="codeit_app.fileBrowserPanel.onDragOverNode( event );" ondragleave="codeit_app.fileBrowserPanel.onDragLeaveNode( event );" ondragstart="codeit_app.fileBrowserPanel.onDragStartNode( event );" itemType="dir" class="collapsedNode unselectedNode" title="<?php
			echo $record['path'] ?>" ondrop="codeit_app.fileBrowserPanel.onDropOnNode( event );" >
<a>&nbsp;</a><div class="treeViewItemIcon_<?php
			echo $record['type'] ?>" ><?php
			echo $record['name'] ?></div>
<ul></ul>
</li>
<?php
			}
		  else
			{
?>
<li draggable="true" ondragover="codeit_app.fileBrowserPanel.onDragOverNode( event );" ondragleave="codeit_app.fileBrowserPanel.onDragLeaveNode( event );" ondragstart="codeit_app.fileBrowserPanel.onDragStartNode( event );"  itemType="file" class="unselectedNode" title="<?php
			echo $record['path'] ?>"  >
<a>&nbsp;</a><div class="treeViewItemIcon_<?php
			echo $record['type'] ?>" ><?php
			echo $record['name'] ?></div>
</li>
<?php
			}
		}
	}

/*
function getFile()
{
if( ! isset($_POST['pathFile']) )exit;
if( $_POST['pathFile'] == "" )exit;

$userHd = USER_HARD_DISK_ROOT;
$sourceFile = $userHd.'/'.$_POST['pathFile'];

if ( is_file($sourceFile) ) echo file_get_contents( $sourceFile ) ;
exit;
}

*/

function getFile()
	{
	if (!isset($_POST['filePath'])) exit;
	if ($_POST['filePath'] == "") exit;
	$filePath = sanitizeFilePath($_POST['filePath']);
	$sourceFile = USER_HARD_DISK_ROOT . '/' . $filePath;
	if (is_file($sourceFile)) echo file_get_contents($sourceFile);
	exit;
	}

function saveFile()
	{
	if (!isset($_POST['filePath'])) exit;
	if ($_POST['filePath'] == "") exit;
	if (!isset($_POST['fileData'])) exit;
	$filePath = sanitizeFilePath($_POST['filePath']);
	$fullFilePath = USER_HARD_DISK_ROOT . '/' . $filePath;
	$fileManager = new CODEIT_FileManager();
	$result = $fileManager->saveFile($fullFilePath, stripslashes($_POST['fileData']));
	if ($result === true)
		{
		printResponse('SUCCESS');
		}
	  else
		{
		printResponse('ERROR', STR('An error occurred during file saving!'));
		}

	exit;
	}

function createDir()
	{
	if (!isset($_POST['parentDirPath'])) exit;
	$parentDirPath = sanitizeFilePath($_POST['parentDirPath']);
	$parentDirPath = USER_HARD_DISK_ROOT . '/' . $parentDirPath;
	$fileManager = new CODEIT_FileManager();
	$result = $fileManager->createDir($parentDirPath, 'new folder');
	if ($result === true)
		{
		printResponse('SUCCESS');
		}
	  else
		{
		printResponse('ERROR');
		}

	exit;
	}

function createNewFile()
	{
	if (!isset($_POST['parentDirPath'])) exit;
	if (!isset($_POST['fileType'])) exit;
	$parentDirPath = sanitizeFilePath($_POST['parentDirPath']);
	$fileType = sanitizeString($_POST['fileType']);
	$parentDirPath = USER_HARD_DISK_ROOT . '/' . $parentDirPath;
	$fileManager = new CODEIT_FileManager();
	$result = $fileManager->createNewFile($parentDirPath, 'new file', $fileType);
	if ($result === true)
		{
		printResponse('SUCCESS');
		}
	  else
		{
		printResponse('ERROR', STR('The request file can\'t be created!'));
		}

	exit;
	}

function renameFile()
	{
	if (!isset($_POST['filePath'])) exit;
	if ($_POST['filePath'] == "") exit;
	if (!isset($_POST['newFileName'])) exit;
	$filePath = sanitizeFilePath($_POST['filePath']);
	$newFileName = sanitizeString($_POST['newFileName']);
	$filePath = USER_HARD_DISK_ROOT . '/' . $filePath;
	$fileManager = new CODEIT_FileManager();
	$result = $fileManager->renameFile($filePath, $newFileName);
	if ($result == CODEIT_FileManager::$SUCCESS) printResponse('SUCCESS');
	if ($result == CODEIT_FileManager::$FILE_EXIST) printResponse('ERROR', STR('An element with the same name is already present!'));
	if ($result == CODEIT_FileManager::$FILE_NOT_FOUND) printResponse('ERROR', STR('The file was not found!'));
	if ($result == CODEIT_FileManager::$ERROR) printResponse('ERROR', STR('An error occurred during the file rename!'));
	exit;
	}

function removeFile()
	{
	if (!isset($_POST['filePath'])) exit;
	if ($_POST['filePath'] == "") exit;
	$filePath = sanitizeFilePath($_POST['filePath']);
	$filePath = USER_HARD_DISK_ROOT . '/' . $filePath;
	$fileManager = new CODEIT_FileManager();
	$fileManager->removeFile($filePath);
	printResponse('SUCCESS');
	exit;
	}

function duplicateFile()
	{
	if (!isset($_POST['sourcePath'])) exit;
	if ($_POST['sourcePath'] == "") exit;
	if (!isset($_POST['targetPath'])) exit;
	if ($_POST['targetPath'] == "") exit;
	$sourcePath = sanitizeFilePath($_POST['sourcePath']);
	$targetPath = sanitizeFilePath($_POST['targetPath']);
	$replaceFileTarget = false;
	if (isset($_POST['replaceFileTarget']) && $_POST['replaceFileTarget'] == 'true') $replaceFileTarget = true;
	$sourcePath = USER_HARD_DISK_ROOT . '/' . $sourcePath;
	$targetPath = USER_HARD_DISK_ROOT . '/' . $targetPath;
	$fileManager = new CODEIT_FileManager();
	$result = array();
	$result['state'] = 'SUCCESS';
	$result['message'] = STR('The files was copied with success.');
	$result['existentFiles'] = array();
	$fileManager->duplicateFile($sourcePath, $targetPath, $replaceFileTarget, $result);
	$xmlString = '';
	foreach($result['existentFiles'] as $file)
		{
		$file['sourcePath'] = str_replace(USER_HARD_DISK_ROOT . '/', '', $file['sourcePath']);
		$file['targetPath'] = str_replace(USER_HARD_DISK_ROOT . '/', '', $file['targetPath']);
		$xmlString.= '<fileToReplace sourcePath="' . $file['sourcePath'] . '" targetPath="' . $file['targetPath'] . '" ></fileToReplace>';
		}

	printResponse($result['state'], $result['message'], $xmlString);
	exit;
	}

function moveFile()
	{
	if (!isset($_POST['sourcePath'])) exit;
	if ($_POST['sourcePath'] == "") exit;
	if (!isset($_POST['targetPath'])) exit;
	if ($_POST['targetPath'] == "") exit;
	$sourcePath = sanitizeFilePath($_POST['sourcePath']);
	$targetPath = sanitizeFilePath($_POST['targetPath']);
	$replaceFileTarget = false;
	if (isset($_POST['replaceFileTarget']) && $_POST['replaceFileTarget'] == 'true')
		{
		$replaceFileTarget = true;
		}

	$sourcePath = USER_HARD_DISK_ROOT . '/' . $sourcePath;
	$targetPath = USER_HARD_DISK_ROOT . '/' . $targetPath;
	$fileManager = new CODEIT_FileManager();
	$result = $fileManager->moveFile($sourcePath, $targetPath, $replaceFileTarget);
	if ($result == CODEIT_FileManager::$SUCCESS) printResponse('SUCCESS');
	if ($result == CODEIT_FileManager::$FILE_EXIST)
		{
		$sourcePath = str_replace(USER_HARD_DISK_ROOT . '/', '', $sourcePath);
		$targetPath = str_replace(USER_HARD_DISK_ROOT . '/', '', $targetPath);
		$xmlString = '<fileToReplace sourcePath="' . $sourcePath . '" targetPath="' . $targetPath . '" ></fileToReplace>';
		printResponse('EXISTENT_FILES', STR('An element with the same name is already present!') , $xmlString);
		}

	if ($result == CODEIT_FileManager::$FILE_NOT_FOUND) printResponse('ERROR', STR('The file was not found!'));
	if ($result == CODEIT_FileManager::$ERROR) printResponse('ERROR', STR('An error occurred during the files move!'));
	exit;
	}

function uploadFile()
	{
	if (!isset($_POST['targetPath'])) exit;

	// if( !isset( $_POST['Filedata'] ) ) exit;

	$targetPath = sanitizeFilePath($_POST['targetPath']);
	$fullTargetPath = USER_HARD_DISK_ROOT . '/' . $targetPath;
	$fileManager = new CODEIT_FileManager();
	$uploadedFile = $fileManager->uploadFile($fullTargetPath);
	if ($uploadedFile != NULL)
		{
		printResponse('SUCCESS');
		}
	  else
		{
		printResponse('ERROR', STR('An error occurred during file upload!'));
		}

	exit;
	}

function checkForExistentFile()
	{
	if (!isset($_POST['filePath'])) exit;
	if ($_POST['filePath'] == "") exit;
	$filePath = sanitizeFilePath($_POST['filePath']);
	$fullFilePath = USER_HARD_DISK_ROOT . '/' . $filePath;
	if (file_exists($fullFilePath))
		{
		printResponse('EXISTENT_FILE');
		}
	  else
		{
		printResponse('FILE_NOT_FOUND');
		}

	exit;
	}

function runExecutableFile()
	{
	if (!isset($_GET['filePath'])) exit;
	if ($_GET['filePath'] == "") exit;
	$filePath = sanitizeFilePath($_GET['filePath']);
	$fullFilePath = USER_HARD_DISK_ROOT . '/' . $filePath;
	if (file_exists($fullFilePath)) header('Location: ' . $fullFilePath);
	exit;
	}

function downloadFile()
	{
	if (!isset($_GET['filePath'])) exit;
	if ($_GET['filePath'] == "") exit;
	$filePath = sanitizeFilePath($_GET['filePath']);
	$fullFilePath = USER_HARD_DISK_ROOT . '/' . $filePath;
	$path_parts = pathinfo($fullFilePath);
	$tempZipFile = USER_HARD_DISK_ROOT . '/_temp/' . $path_parts['filename'] . '.zip';
	if (file_exists($fullFilePath))
		{
		$fileManager = new CODEIT_FileManager();
		$uploadedFile = $fileManager->zipFile($fullFilePath, $tempZipFile);
		header('Content-type: application/zip');
		header('Content-Disposition: attachment; filename="' . $path_parts['filename'] . '"');

		// read a file and send

		readfile($tempZipFile);
		}

	exit;
	}

if (isset($_POST['action']))
	{
	if (!isUserLogged()) exit;
	$_POST['action'] = sanitizeString($_POST['action']);
	switch ($_POST['action'])
		{
	case "getFile" : getFile();
	break;

case "saveFile":
	saveFile();
	break;

case "createNewFile":
	createNewFile();
	break;

case "createDir":
	createDir();
	break;

case "renameFile":
	renameFile();
	break;

case "removeFile":
	removeFile();
	break;

case "duplicateFile":
	duplicateFile();
	break;

case "moveFile":
	moveFile();
	break;

case 'uploadFile':
	uploadFile();
	break;

case 'checkForExistentFile':
	checkForExistentFile();
	break;

case 'downloadFile':
	downloadFile();
	break;
	}
}

if (isset($_GET['action']))
	{
	if (!isUserLogged()) exit;
	$_GET['action'] = sanitizeString($_GET['action']);
	switch ($_GET['action'])
		{
	case "doUserLogout":
		doUserLogout();
		break;

	case "listFiles":
		if (!isset($_GET['pathDir'])) exit;
		listFiles(sanitizeFilePath($_GET['pathDir']));
		break;

	case "runExecutableFile":
		runExecutableFile();
		break;

	case 'downloadFile':
		downloadFile();
		break;
		}
	}

?>
