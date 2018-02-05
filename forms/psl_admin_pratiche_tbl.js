/**
 * @properties={typeid:24,uuid:"AE032A86-7EBD-498F-A4DD-F00FBFEE1DA1"}
 * @AllowToRunInFind
 */
function updateValuelist()
{
	var dataset;
	
	/** @type {JSFoundSet<>} */
	var fs = psl_pratiche_to_psl_pratiche_escludi_corrente;
	
	if (fs && fs.getSize() > 0)
	{
		dataset = databaseManager.convertToDataSet(fs, ['descrizione', 'id_pratica']);
		forms.psl_admin_moduli_tbl.enableCopy();
	}
	else
	{
		dataset = databaseManager.createEmptyDataSet(0, 2);
		forms.psl_admin_moduli_tbl.disableCopy();
	}
	
	application.setValueListItems('vls_pratiche', dataset);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C6D31413-C55C-4E9B-9A38-639CD42361A6"}
 */
function onAction$btn_delete(event) 
{
	var answer = globals.ma_utl_showYesNoQuestion('i18n:ma.msg.delete.related', 'i18n:ma.lbl.delete');
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
 * @properties={typeid:24,uuid:"8387033F-4659-49A3-9B4F-FDACEA395723"}
 */
function onAction$btn_new(event) 
{
	foundset.newRecord();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C347676C-C0A9-4815-AE19-DA1FF5F6B60B"}
 */
function onAction$btn_deleteall(event) 
{
	var selection = getSelectedRecords();
	if (selection.length > 0)
	{
		var answer = globals.ma_utl_showYesNoQuestion('i18n:ma.msg.delete_all', 'i18n:ma.lbl.delete_all');
		if(!answer)
			return;

		databaseManager.setAutoSave(false);
		databaseManager.startTransaction();
		
		try
		{
			getSelectedRecords().forEach(function(record){ foundset.deleteRecord(record); });
			
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
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D23E6DE9-0F5F-4D08-9D35-13EAE2A4B0F4"}
 */
function onRecordSelection(event) 
{
	psl_pratiche_to_psl_moduli && psl_pratiche_to_psl_moduli.loadAllRecords();
	updateValuelist();
}
