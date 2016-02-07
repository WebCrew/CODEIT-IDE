<?php error_reporting(E_ALL);
ini_set('display_errors', 'On');

// check if this file is imported by index__.php or not

if (!defined('SESSION_OBJECT_NAME')) exit;
?>

<!DOCTYPE html>
<html >
	<head>
		<title>CODEIT v1.0</title>
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Content-Language" content="<?php
echo strtolower(LANGUAGE); ?>" />
		
		<!-- MOBILE SETUP -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />
		
		<!-- APP ICONS -->
		<link rel="icon" href="themes/default/images/favicon.png" type="image/png" />
		<link rel="apple-touch-icon" href="themes/default/images/touch-icon-iphone.png" />
		<link rel="apple-touch-icon" sizes="72x72" href="themes/default/images/touch-icon-ipad.png" />
		<link rel="apple-touch-icon" sizes="114x114" href="themes/default/images/touch-icon-iphone4.png" />	
				
		<!-- CODEMIRROR -->
		<link rel="stylesheet" href="../codeit_plugins/codemirror-5.9/lib/codemirror.css">

		<!-- Two CodeMirror Styles, from which You can choose from. Activate it from CODEIT/javascript/CodeEditor_panel.js row 165 -->
		<link rel="stylesheet" href="../codeit_plugins/codemirror-5.9/theme/twilight.css">
		<link rel="stylesheet" href="../codeit_plugins/codemirror-5.9/theme/pastel-on-dark.css">

    	<script src="../codeit_plugins/codemirror-5.9/lib/codemirror.js"></script>
    	<script src="../codeit_plugins/codemirror-5.9/mode/css/css.js"></script>
    	<script src="../codeit_plugins/codemirror-5.9/mode/javascript/javascript.js"></script>
    	<script src="../codeit_plugins/codemirror-5.9/mode/xml/xml.js"></script>
    	<script src="../codeit_plugins/codemirror-5.9/mode/clike/clike.js"></script>    	    	
		<script src="../codeit_plugins/codemirror-5.9/mode/php/php.js"></script>
		<script src="../codeit_plugins/codemirror-5.9/mode/htmlmixed/htmlmixed.js"></script>


        <!-- CODEMIRROR CALLED ADDONS -->
		<link rel="stylesheet" href="../codeit_plugins/codemirror-5.9/addon/scroll/simplescrollbars.css">
        <script src="../codeit_plugins/codemirror-5.9/addon/scroll/simplescrollbars.js"></script>
    
		<!-- THEME -->
		<link rel="stylesheet" href="themes/default/css.css" />	
		
		<!-- CODEIT CORE -->	    		
		<script language="javascript" src="../codeit_javascript/core/CODEIT.js"></script>
	    <script language="javascript" src="../codeit_javascript/core/CODEIT_EventDispatcher.js"></script>
	    <script language="javascript" src="../codeit_javascript/components/CODEIT_Window.js"></script>
	    <script language="javascript" src="../codeit_javascript/components/CODEIT_PanelManager.js"></script>
	   	<script language="javascript" src="../codeit_javascript/components/CODEIT_TreeView.js"></script>
	   	<script language="javascript" src="../codeit_javascript/components/CODEIT_WidgetManager.js"></script>
	   	<script language="javascript" src="../codeit_javascript/components/CODEIT_ContextMenu.js"></script>
		<script language="javascript" src="../codeit_javascript/core/CODEIT_GlobalMouseListener.js"></script>
		 
	    <!-- APP FILES -->	   
	    <script language="javascript" src="languages/<?php
echo LANGUAGE; ?>.js"></script>
	    <script language="javascript" src="javascript/FileBrowser_panel.js"></script>
	    <script language="javascript" src="javascript/CodeEditor_panel.js"></script>
		<script language="javascript" src="javascript/CODEIT_app.js"></script>
		
	</head>

<body>	
		
	<!-- START APP -->
	<div id="APPLICATION_LAYOUT">
	
		<div class="columnsContainer" >
			
			<div id="COLUMN_LEFT" class="column" style="width:260px;" >

				<div id="FILE_BROWSER_PANEL" class="widget" >
					<div class="header">
						<div class="title"></div>
						<ul class="toolBar">
		    				<li id="LOADING_toolButton" class=""  title="" ><a></a></li>
		    				<li id="INFO_MENU_toolButton" class="unselectedToolButton"  title="" ><a></a>
			    				<ul  class="panel popupMenu"   >
					        		<li class="popupMenuItem" id="ABOUT_APP_menuItem"   title=""><?php PrintSTR('About CODEIT...') ?></li>
					        		<li class="popupMenuItem" id="UPDATE_APP_menuItem"   title=""><?php PrintSTR('Check for updates...') ?></li>
					        		<li class="popupMenuItem" id="DOCS_APP_menuItem"   title=""><?php PrintSTR('Documentation...') ?></li>
							        <div style="clear:both"></div>
					        	</ul>
		    				</li>
		    				<li id="EXECUTE_FILE_toolButton" class="unselectedToolButton"  title="<?php PrintSTR('Play main file') ?>" ><a></a></li>
		    				<li id="CREATE_FILE_toolButton" class="unselectedToolButton"  title="" ><a></a>
			    				<ul  class="panel popupMenu"   >
					        		<li class="popupMenuItem" id="CREATE_FILE_XML_menuItem"  fileType="xml"  title=""><?php PrintSTR('New file - XML') ?></li>
					        		<li class="popupMenuItem" id="CREATE_FILE_JS_menuItem"   fileType="js" title=""><?php PrintSTR('New file - JS') ?></li>
					        		<li class="popupMenuItem" id="CREATE_FILE_PHP_menuItem"  fileType="php" title=""><?php PrintSTR('New file - PHP') ?></li>
					        		<li class="popupMenuItem" id="CREATE_FILE_CSS_menuItem"  fileType="css" title=""><?php PrintSTR('New file - CSS') ?></li>
					        		<li class="popupMenuItem" id="CREATE_FILE_HTML_menuItem" fileType="html"  title=""><?php PrintSTR('New file - HTML') ?></li>
					        		<li class="popupMenuItem" id="CREATE_FILE_LESS_menuItem"  fileType="less" title=""><?php PrintSTR('New file - LESS') ?></li>
					        		<li class="popupMenuItem" id="CREATE_FILE_MD_menuItem"  fileType="md" title=""><?php PrintSTR('New file - MD') ?></li>
					        		<li class="popupMenuItem" id="CREATE_FILE_SQL_menuItem" fileType="sql"  title=""><?php PrintSTR('New file - SQL') ?></li>
							        <div style="clear:both"></div>
					        	</ul>
		    				</li>
		    				<li id="EDIT_MENU_toolButton" class="unselectedToolButton"  title="" ><a></a>
			    				<ul  class="panel popupMenu"   >
					        		<li class="popupMenuItem" id="DEFINE_EXECUTABLE_FILE_menuItem"   title=""><?php PrintSTR('Set selection as main file') ?></li>
					        		<li class="popupMenuItem" id="CREATE_FOLDER_menuItem"   title=""><?php PrintSTR('New Folder') ?></li>
					        		<li class="popupMenuItem" id="COPY_FILE_menuItem"   title=""><?php PrintSTR('Copy file') ?></li>
					        		<li class="popupMenuItem" id="PASTE_FILE_menuItem"   title=""><?php PrintSTR('Paste file') ?></li>
					        		<li class="popupMenuItem" id="REMOVE_FILE_menuItem"   title=""><?php PrintSTR('Remove file') ?></li>
					        		<li class="popupMenuItem" id="DOWNLOAD_FILE_menuItem"   title=""><?php PrintSTR('Download file') ?></li>
 					        		<li class="popupMenuItem" id="LOGOUT_menuItem"   title=""><?php PrintSTR('Logout...') ?></li>
							        <div style="clear:both"></div>
					        	</ul>
		    				</li>
		    				<li id="EXPAND_WIDGET_toolButton" class="expandedWidgetButton"  title="Expand/Collapse widget" ><a></a></li>
		    				
						</ul>
					</div>
					<ul id="PANEL_VIEW" class="view treeView"  >
						<li class="collapsedNode  unselectedNode" itemType="dir" ondrop="codeit_app.fileBrowserPanel.onDropFilesOnFolder( event );" title="" >
							<a>&nbsp;</a>
							<div class="treeViewItemIcon_hd"><?php PrintSTR('Hard disk') ?></div>
							<ul></ul>
						</li>
						<!--
                            <li class="collapsedNode  unselectedNode" itemType="dir" ondrop="codeit_app.fileBrowserPanel.onDropFilesOnFolder( event );" title="_trash" >
							<a>&nbsp;</a>
							<div class="treeViewItemIcon_basket"><?php
PrintSTR('Trash') ?></div>
							<ul></ul>
						</li>
                        -->
					</ul>
					<progress id="UPLOADING_BAR" ></progress>
				</div>
				
			</div>
			
			<div id="COLUMN_RIGHT" class="column" style="left:260px; right:0px;">
				
				<div id="CODE_EDITOR_PANEL" class="widget" >
					<div class="header">
						<ul id="TAB_BAR" class="tabBar" oncontextmenu="return false;" ></ul>
						<ul class="toolBar">
							<li id="LOADING_toolButton" class=""  title="" ><a></a></li>
							<li id="SAVE_DOCUMENT_toolButton" class="unselectedToolButton"  title="" ><a></a></li>
		    				<li id="EXPAND_WIDGET_toolButton" class="expandedWidgetButton"  title="" ><a></a></li>
						</ul>
					</div>
					<div id="PANEL_VIEW" class="codeMirroView" ></div>
				</div>
				
			</div>
			
		</div>
		<!-- END COLUMNS_CONTAINER -->
		
			
		<div id="WINDOWS_CONTAINER" style="position:absolute;" >
					
			<div id="MESSAGE_WIN" class="win message_win" >
				<div id="WIN_HEAD" class="win_head">
					<div id="WIN_TITLE" class="win_title"><?php
PrintSTR('Message') ?></div>
				</div>
				<div id="WIN_CLOSE_BUTTON" class="win_close_button"></div>
				<div id="WIN_COLLAPSE_BUTTON" class="win_collapse_button"></div>
				<div id="WIN_CONTENT" class="win_content" style="" >
					<textarea id="WIN_MESSAGE_CONTENT" ></textarea>					
				</div>
				<div id="WIN_RESIZE_BUTTON" class="win_resize_button"></div>
			</div>
			
		</div>
		
		<div id="CONTEXT_MENU_CONTAINER" style="position:absolute;" oncontextmenu="return false;" >
				<ul id="ARCHIVE_CONTEXT_MENU" class="panel popupMenu"  >
	        		<li class="popupMenuItem" id="CREATE_OBJECT_AND_NODE_menuItem"   title="create new object and node child">Create Object/Node</li>
	        		<li class="popupMenuItem" id="COPY_NODE_menuItem"   title="Copy Node( reference )">Copy Node</li>
	        		<li class="popupMenuItem" id="PASTE_NODE_menuItem"   title="Paste Node( reference )">Paste Node</li>
	        		<li class="popupMenuItem" id="REMOVE_NODE_menuItem"   title="Remove Node( reference )">Remove Node</li>
			        <div style="clear:both"></div>
	        	</ul>
		</div>
		
		
		
				
	</div>
	<!-- END APP -->
	  
 	<div id="ABOUT_PANEL" class="aboutPanel" >
			<div class="versionInfo" >version 1.0</div>
			<div class="applicationLogo" ></div>
			<div class="creditsInfo" >
            <a href="http://web-crew.org" target="_blank" >CODEIT &copy; 2015-2016 by WebCrew / Andreas Holzer</a><br/>
            <a href="http://codemirror.net" target="_blank" >Extra Credits To: CodeMirror &copy; by Marijn Haverbeke</a><br/>
            <a href="https://github.com/xosystem/XOS-IDE-Framework" target="_blank" >Based On: XOS &copy; by Riccardo Della Martire</a>
</div>
		</div>
	  
</body>

</html>
