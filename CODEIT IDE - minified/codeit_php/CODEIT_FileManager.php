<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');

function sortFilesByNumber($a, $b)
	{
	$splitedFileNameA = explode(".", $a['name']);
	$valueA = intval($splitedFileNameA[0]);
	$splitedFileNameB = explode(".", $b['name']);
	$valueB = intval($splitedFileNameB[0]);
	if ($valueA == $valueB) return 0;
	return ($valueA < $valueB) ? -1 : 1;
	}

function sortFilesByName($a, $b)
	{
	$sortable = array(
		strtolower($a['name']) ,
		strtolower($b['name'])
	);
	$sorted = $sortable;
	sort($sorted);
	return ($sorted[0] == $sortable[0]) ? -1 : 1;
	}

class CODEIT_FileManager

	{
	public static $ERROR = 1;

	public static $SUCCESS = 1;

	public static $FILE_EXIST = 2;

	public static $FILE_NOT_FOUND = 3;

	function codeitFileManager()
		{
		}

	function createDir($_parentDirPath, $_newDirName = 'new folder')
		{
		if (!is_dir($_parentDirPath)) return false;
		$newDirPath = $_parentDirPath . '/' . $_newDirName;
		$num = 1;
		while (is_dir($newDirPath))
			{
			$newDirPath = $_parentDirPath . '/' . $_newDirName . ' ' . $num;
			$num++;
			}

		if (mkdir($newDirPath)) return true;
		return false;
		}

	function createNewFile($_parentDirPath, $_newFileName = 'new file', $_fileExtension, $_data = '')
		{
		if (!is_dir($_parentDirPath)) return false;
		$newFilePath = $_parentDirPath . '/' . $_newFileName . '.' . $_fileExtension;
		$num = 1;
		while (is_file($newFilePath))
			{
			$newFilePath = $_parentDirPath . '/' . $_newFileName . ' ' . $num . '.' . $_fileExtension;
			$num++;
			}

		if (file_put_contents($newFilePath, $_data) === false) return false;
		chmod($newFilePath, 0744);
		return true;
		}

	function saveFile($_filePath, $_data = '')
		{
		if (file_put_contents($_filePath, $_data) === false) return false;
		return true;
		}

	function renameFile($_filePath, $_newFileName)
		{
		$pathInfo = pathinfo($_filePath);
		$renamedFilePath = $pathInfo['dirname'] . '/' . $_newFileName;
		if (is_file($_filePath) || is_dir($_filePath))
			{
			if (is_file($renamedFilePath) || is_dir($renamedFilePath)) return self::$FILE_EXIST;
			if (rename($_filePath, $renamedFilePath)) return self::$SUCCESS;
			}
		  else
			{
			return self::$FILE_NOT_FOUND;
			}

		return self::$ERROR;
		}

	function removeFile($path)
		{
		if (is_dir($path))
			{
			$this->removeDir($path);
			}
		  else
		if (is_file($path))
			{
			if (!unlink($path))
				{
				}
			}
		}

	function removeDir($path)
		{
		foreach(glob($path . '/*') as $file)
			{
			if (is_dir($file))
				{
				$this->removeDir($file);
				}
			  else
			if (is_file($file))
				{
				if (!unlink($file))
					{
					return;
					}
				}
			}

		if (!rmdir($path))
			{
			}
		}

	function duplicateFile($src, $dst, $replaceFileTarget = false, &$result)
		{

		// if src is in the first part of dest

		if (strpos($dst, $src) === 0)
			{

			// if the copy is not into the same folder

			if ($src != $dst)
				{
				$result['state'] = 'ERROR';
				$result['message'] = 'You can not copy a folder into itself or a daughter folder!';
				return;
				}
			}

		if (file_exists($dst))
			{

			// if we want replace the target

			if ($replaceFileTarget)
				{
				if ($src == $dst) return; // cna't replace self
				$this->removeFile($dst); // remove file or folder
				}
			  else
				{

				// if the copy is made into the same folder

				if ($src == $dst)
					{
					$path_parts = pathinfo($dst);
					$fileExtension = '';
					if (isset($path_parts['extension'])) $fileExtension = '.' . $path_parts['extension'];

					// append 'copy' at the end of the filename

					if (is_file($dst))
						{
						$dst = $path_parts['dirname'] . '/' . $path_parts['filename'] . ' copy' . $fileExtension;
						$num = 1;
						while (file_exists($dst))
							{
							$dst = $path_parts['dirname'] . '/' . $path_parts['filename'] . ' copy ' . $num . $fileExtension;
							$num++;
							}
						}
					  else
					if (is_dir($dst))
						{
						$dst = $path_parts['dirname'] . '/' . $path_parts['filename'] . ' copy';
						$num = 1;
						while (file_exists($dst))
							{
							$dst = $path_parts['dirname'] . '/' . $path_parts['filename'] . ' copy ' . $num;
							$num++;
							}
						}
					}
				  else
					{

					// add the paths to the list of existents files ( to send to the client for replacing request )

					$result['state'] = 'EXISTENT_FILES';
					$fileToReplace = array();
					$fileToReplace['sourcePath'] = $src;
					$fileToReplace['targetPath'] = $dst;
					array_push($result['existentFiles'], $fileToReplace);
					return;
					}
				}
			}

		if (file_exists($src))
			{
			if (is_dir($src))
				{
				if (!mkdir($dst)) exit;
				$files = scandir($src);
				foreach($files as $file)
					{
					if ($file != "." && $file != "..") $this->duplicateFile("$src/$file", "$dst/$file", $replaceFileTarget, $result);
					}
				}
			  else
			if (is_file($src))
				{
				if (!copy($src, $dst)) exit;
				}
			}
		}

	function zipFile($source, $destination)
		{
		if (!extension_loaded('zip') || !file_exists($source))
			{
			echo "NO ZIP extension_loaded";
			return false;
			}

		$zip = new ZipArchive();
		if (!$zip->open($destination, ZIPARCHIVE::CREATE))
			{

			// echo "NON ZIP open";

			return false;
			}

		$source = str_replace('\\', '/', realpath($source));
		if (is_dir($source) === true)
			{
			$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source) , RecursiveIteratorIterator::SELF_FIRST);
			foreach($files as $file)
				{
				$file = str_replace('\\', '/', $file);

				// Ignore "." and ".." folders

				if (in_array(substr($file, strrpos($file, '/') + 1) , array(
					'.',
					'..'
				))) continue;
				$file = realpath($file);
				if (is_dir($file) === true)
					{
					$zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
					}
				  else
				if (is_file($file) === true)
					{
					$zip->addFromString(str_replace($source . '/', '', $file) , file_get_contents($file));
					}
				}
			}
		  else
		if (is_file($source) === true)
			{
			$zip->addFromString(basename($source) , file_get_contents($source));
			}

		return $zip->close();
		}

	function moveFile($_sourcePath, $_targetPath, $replaceFileTarget = false)
		{
		if (!file_exists($_sourcePath)) return self::$FILE_NOT_FOUND;
		if (file_exists($_targetPath))
			{

			// if we want to replace the esistents file

			if ($replaceFileTarget)
				{
				if ($_sourcePath == $_targetPath) return self::$ERROR; // can't be removed yourself
				$this->removeFile($_targetPath);
				}
			  else
				{
				return self::$FILE_EXIST;
				}
			}

		if (@rename($_sourcePath, $_targetPath)) return self::$SUCCESS;
		return self::$ERROR;
		}

	function getFileListAsArray($dir_path, $sortFunctionName = 'sortFilesByName')
		{
		if (!is_dir($dir_path)) return false;
		if (!$dh = opendir($dir_path)) return false;
		$dirs = array();
		$files = array();
		while (($file = @readdir($dh)) == true)
			{
			if (substr($file, 0, 1) == ".") continue;
			if (substr($file, 0, 1) == "_") continue; // hide the names with _ at the start
			$file_path = $dir_path . "/" . $file;
			$file_obj = array();
			$file_obj['name'] = $file;
			$file_obj['path'] = $file_path;
			$file_obj['size'] = intval(filesize($file_path) / 1000);
			if (is_dir($file_path))
				{
				$file_obj['type'] = "dir";
				array_push($dirs, $file_obj);
				}
			  else
				{
				$file_obj['type'] = strtolower(substr(strrchr($file, ".") , 1));
				array_push($files, $file_obj);
				}
			}

		@closedir($dh);
		uasort($dirs, $sortFunctionName);
		uasort($files, $sortFunctionName);
		return array_merge($dirs, $files);
		}

	function uploadFile($target_dir, $newFileName = "", $_fileDataName = 'Filedata')
		{
		if (isset($_FILES[$_fileDataName]))
			{
			$file_size = $_FILES[$_fileDataName]["size"]; // check the weight
			$file_name = stripslashes($_FILES[$_fileDataName]['name']);
			$file_name = str_replace("'", "", $file_name);
			$file_name = str_replace("/", "", $file_name);
			$file_name = str_replace("\\", "", $file_name);
			$path_parts = pathinfo($file_name);
			$fileNameNoExtension = $path_parts['filename'];
			$fileExtension = '';
			if (isset($path_parts['extension']))
				{
				$file_name = $fileNameNoExtension . "." . $path_parts['extension'];
				}
			  else
				{
				$file_name = $fileNameNoExtension;
				}

			/*
			if( ($fileExtension == 'jpg') ||  ($fileExtension == 'jpeg') || ($fileExtension == 'gif') || ($fileExtension == 'png') || ($fileExtension == 'pdf') )
			{
			*/
			if ($newFileName != "")
				{
				$target_file = $target_dir . "/" . $newFileName;
				}
			  else
				{
				$target_file = $target_dir . "/" . $file_name;
				}

			// if( is_file($target_file) ) return; // if exist!

			if (move_uploaded_file($_FILES[$_fileDataName]['tmp_name'], $target_file) === true) return $target_file;
			/* } */
			return NULL;
			}

		return NULL;
		}

	// resize an image

	function resizeImage($filePath_source, $filePath_destination, $max_width, $max_height, $image_quality, $_backgroundColor = null, $_targetImageType = null)
		{
		$splitedFileName = explode(".", $filePath_source);
		$fileNameNoExtension = $splitedFileName[0];
		$fileExtension = strtolower($splitedFileName[count($splitedFileName) - 1]);
		if ($fileExtension == 'jpg' || $fileExtension == 'jpeg')
			{
			$src_img = imagecreatefromjpeg($filePath_source);
			}
		  else
		if ($fileExtension == 'png')
			{
			$src_img = imagecreatefrompng($filePath_source);
			}
		  else
			{
			return;
			}

		// get image size of img

		$size = @getimagesize($filePath_source);

		// image width

		$orig_x = $size[0];

		// image height

		$orig_y = $size[1];

		// $orig_x = ImageSX($src_img);
		// $orig_y = ImageSY($src_img);
		// if the source image size is smaller than the target size it keep the original size

		if ($orig_x <= $max_width && $orig_y <= $max_height)
			{
			$new_x = $orig_x;
			$new_y = $orig_y;
			}
		  else
			{
			$new_y = $max_height;
			$new_x = $orig_x / ($orig_y / $max_height);
			if ($new_x > $max_width)
				{
				$new_x = $max_width;
				$new_y = $orig_y / ($orig_x / $max_width);
				}
			}

		$dst_img = ImageCreateTrueColor($new_x, $new_y);
		if ($_backgroundColor != null)
			{
			$bgc = imagecolorallocate($dst_img, 255, 255, 255);
			imagefilledrectangle($dst_img, 0, 0, $new_x, $new_y, $bgc);
			}

		ImageCopyResampled($dst_img, $src_img, 0, 0, 0, 0, $new_x, $new_y, $orig_x, $orig_y);
		if ($_targetImageType == null)
			{
			if ($fileExtension == 'jpg' || $fileExtension == 'jpeg')
				{
				imagejpeg($dst_img, $filePath_destination, $image_quality);
				}
			  else
			if ($fileExtension == 'png')
				{
				/*
				imagesavealpha($dst_img, true);
				$bg=imagecolorallocatealpha ($dst_img, 0,0,0,127);
				imagefill($dst_img,0,0,$bg);
				*/
				imagepng($dst_img, $filePath_destination, $image_quality);
				}
			}
		  else
			{
			if ($_targetImageType == 'jpg')
				{
				imagejpeg($dst_img, $filePath_destination, $image_quality);
				}
			  else
			if ($_targetImageType == 'png')
				{
				imagepng($dst_img, $filePath_destination, $image_quality);
				}
			}

		imagedestroy($src_img);
		imagedestroy($dst_img);
		}
	}

?>
