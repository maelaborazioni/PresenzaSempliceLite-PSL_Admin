/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1ABE9106-0D42-434B-94DD-38A0B5605F86",variableType:4}
 */
var copy_from = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A3C017C3-584C-42F7-9BDC-5D5C384407DD"}
 */
var html = null;

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8464C0DB-ADD3-4ED1-AF46-CFF312DC5FBA"}
 */
function onLoad(event) 
{
	_super.onLoad(event);
}

/**
 * @properties={typeid:24,uuid:"E6072CDC-1AF9-40DE-96A4-5B6663533051"}
 */
function setHtml()
{
	var fileUrlId = plugins.WebClientUtils.getElementMarkupId(elements.fld_fileurl);
	var callback  = plugins.WebClientUtils.generateCallbackScript(showFileDialog);
	
	html = scopes.string.Format(
			 '<script type="text/javascript">\
				 $(document).ready(function()\
				 {\
				 	$("#@0").click(function(event){ alert("ciao"); });\
				 });\
			  </script>'
			, fileUrlId
			, callback);
}


/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C0DDD718-2395-466B-81C3-BC3A1A144F6A"}
 */
function onDataChange$chk_ammetteupload(oldValue, newValue, event) 
{
	// Update chk_uploadobbligatorio status
	upload_obbligatorio = newValue && upload_obbligatorio;		// unset if not enabled, leave as-is otherwise
	elements.chk_uploadobbligatorio.enabled = newValue == 1;	// disable if upload is not available
	
	return true;
}

/**
 * @private
 *
 * @properties={typeid:24,uuid:"4EDC5E5B-34FB-4AC6-95A0-D6B2220EC0D2"}
 */
function showFileDialog() 
{
	plugins.file.showFileOpenDialog(uploadFile);
}

/**
 * @param {Array<plugins.file.JSFile>} files
 *
 * @properties={typeid:24,uuid:"7EE82CBA-8458-4515-9F38-F6A99BDE29C7"}
 */
function uploadFile(files)
{
	if(!files || files.length == 0)
		return;
	
	try
	{
		// Upload the file to the ftp server
		var ftp = scopes.url.ftp.PRATICHE.GetFTPClient();
		if(!ftp || !ftp.connect())
		{
			globals.ma_utl_logError(i18n.getI18NMessage('ma.err.ftp_connect', ['connect']));
			forms.psl_status_bar.setStatusError('i18n:ma.err.ftp_connect');
			
			return;
		}
		
		var file      = files[0];
		var uploadUrl = scopes.string.Format('/@0/@1', 'download', file.getName());
		
		var tempfile  = plugins.file.createTempFile(application.getUUID().toString(), '.temp');
			tempfile.setBytes(file.getBytes());
			
		ftp.put(tempfile.getAbsolutePath(), uploadUrl);
		// check that the file was indeed uploaded
		ftp.get(uploadUrl, tempfile.getAbsolutePath());
		
		var bytes = plugins.file.readFile(tempfile);
		if(!bytes || bytes.length == 0)
		{
			globals.ma_utl_logError(i18n.getI18NMessage('ma.err.ftp_put', [file.getAbsolutePath()]));
			forms.psl_status_bar.setStatusError(i18n.getI18NMessage('ma.err.ftp_put', [file.getAbsolutePath()]));
			
			return;
		}
		
		if(!plugins.file.deleteFile(tempfile))
			globals.ma_utl_logError(i18n.getI18NMessage('ma.err.file.delete', [tempfile]));
		
		if(!ftp.disconnect())
			globals.ma_utl_logError(i18n.getI18NMessage('ma.err.ftp_connect', ['disconnect']));
		
		foundset.file_url = file.getName();
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError('i18n:ma.err.ftp.upload');
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5D2DFE12-487D-4552-ACEC-FEAE7C670ABD"}
 */
function onAction$btn_delete(event)
{
	var answer = globals.ma_utl_showYesNoQuestion('i18n:ma.msg.delete', 'i18n:svy.fr.lbl.cancel');
	if (answer)
		foundset.deleteRecord();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F4CF514B-7E2B-4E10-AA86-6809FC2EDB53"}
 */
function onAction$btn_deleteall(event) 
{
	var selection = getSelectedRecords();
	if (selection.length > 0)
	{
		var answer = globals.ma_utl_showYesNoQuestion('i18n:ma.msg.delete.all', 'i18n:ma.lbl.delete_all');
		if(!answer)
			return;
		
		databaseManager.setAutoSave(false);
		databaseManager.startTransaction();
		
		try
		{
			selection.forEach(function(record){ foundset.deleteRecord(record); });
			
			if(!databaseManager.commitTransaction())
				throw databaseManager.getFailedRecords()[0].exception;
		}
		catch(ex)
		{
			databaseManager.rollbackTransaction();
			
			globals.ma_utl_logError(ex);
			forms.psl_status_bar.setStatusError();
		}
		finally
		{
			databaseManager.setAutoSave(true);
		}
	}
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CB78A522-F8A0-40A2-A5B0-BDF902488211"}
 */
function onRightClick$fld_fileurl(event) 
{

	var menu = plugins.window.createPopupMenu();
	var item = menu.addMenuItem('i18n:ma.lbl.delete');
		item.setMethod(cancellaFileDaMenu)
		item.methodArguments = [foundset.file_url];
		item.enabled = foundset.file_url !== null;
		
	menu.show(event.getSource());
}

/**
 * @SuppressWarnings(wrongparameters)
 *
 * @param _a
 * @param _b
 * @param _c
 * @param _d
 * @param fileName
 *
 * @properties={typeid:24,uuid:"52E53763-D97C-42B6-945F-A39EED474AD1"}
 */
function cancellaFileDaMenu(_a, _b, _c, _d, fileName)
{
	deleteFile(fileName);
}

/**
 * @param fileName
 *
 * @properties={typeid:24,uuid:"05326262-8D9F-4BA7-A708-A76C03BE1FAA"}
 */
function deleteFile(fileName)
{
	try
	{
		// Upload the file to the ftp server
		var ftp = scopes.url.ftp.PRATICHE.GetFTPClient();
		if(!ftp || !ftp.connect())
		{
			globals.ma_utl_logError(i18n.getI18NMessage('ma.err.ftp_connect', ['connect']));
			forms.psl_status_bar.setStatusError('i18n:ma.err.ftp_connect');
			
			return;
		}
		
		var ftpUrl = scopes.string.Format('@0/@1', 'download', fileName);
		if(!ftp.rm(ftpUrl))
		{
			globals.ma_utl_logError(i18n.getI18NMessage('ma.err.ftp.delete', [fileName]));
			forms.psl_status_bar.setStatusError(i18n.getI18NMessage('ma.err.ftp.delete', [fileName]));
			
			return;
		}
		
		if(!ftp.disconnect())
			globals.ma_utl_logError(i18n.getI18NMessage('ma.err.ftp_connect', ['disconnect']));
		
		foundset.file_url = null;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError('i18n:ma.err.ftp.upload');
	}
}

/**
 * @properties={typeid:24,uuid:"5D9B71FE-0EAC-4A58-B4FD-23523351433F"}
 */
function disableCopy()
{
	elements.cmb_copy.enabled = elements.btn_copy.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"2CE9E647-DD64-453A-B0D8-B4DB0472E754"}
 */
function enableCopy()
{
	elements.cmb_copy.enabled = elements.btn_copy.enabled = true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0368020D-ECD3-4550-ADDE-C75A210A8A0E"}
 */
function onAction$btn_new(event) 
{
	databaseManager.saveData(foundset);
	foundset.newRecord();
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5EEA9185-CE1B-4DDE-9588-A4B1AAB5914B"}
 */
function onDataChange$chk_download(oldValue, newValue, event)
{
	if(newValue == 1)
		showFileDialog();
	else
		foundset.file_url = null;
	
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"62003943-BE49-4204-A721-79C4D3518A8B"}
 * @AllowToRunInFind
 */
function onAction$btn_copy(event) 
{
	copyRecord();
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"16AD4988-87B5-4D2C-B7BD-4C026CD64093"}
 */
function copyRecord()
{
	var fs = datasources.db.ma_pratiche.psl_pratiche.getFoundSet();	
	if (fs.loadRecords(copy_from))
	{
		databaseManager.setAutoSave(false);
		databaseManager.startTransaction();
		
		var moduli = fs.psl_pratiche_to_psl_moduli;
		
		try
		{
			for(var r = 1; r <= moduli.getSize(); r++)
			{
				var copiedRecord = moduli.getRecord(r);
				var newRecord    = foundset.getRecord(foundset.newRecord());
				
				databaseManager.copyMatchingFields(copiedRecord, newRecord, ['id_pratica']);
			}
			
			if(!databaseManager.commitTransaction())
			{
				var failedRecords = databaseManager.getFailedRecords();
				// the real error is the last record...thank you servoy!!!
				throw failedRecords[failedRecords.length - 1].exception;
			}
		}
		catch(ex)
		{
			databaseManager.rollbackTransaction();
			
			var friendlyMessage = globals.ma_utl_logError(ex);
			forms.psl_status_bar.setStatusError(friendlyMessage);
		}
		finally
		{
			databaseManager.setAutoSave(true);
		}
	}
}
