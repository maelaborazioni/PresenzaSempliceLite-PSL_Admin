/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8AB7E399-DA7E-4979-A295-64DC037BF8E0"}
 */
function onAction$btn_new(event)
{
	openEdit();
	foundset.newRecord();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6D8BBD54-00E3-4AC9-943F-0E68ABC53961"}
 */
function onAction$btn_delete(event) 
{
	var answer = globals.ma_utl_showYesNoQuestion('i18n:ma.msg.delete.related', 'i18n:ma.lbl.delete');
	if (answer)
	{
		foundset.deleteRecord();
		foundset.loadAllRecords();
		refresh();
	}
}

/**
 * @properties={typeid:24,uuid:"9BAC67AF-452A-4F1E-B74E-2224C24059BF"}
 */
function openEdit()
{
	elements.tab_categoria.tabIndex = 'edit';
}

/**
 * @properties={typeid:24,uuid:"6943847F-D9F2-4FDA-BE30-2B86747FBB4F"}
 */
function closeEdit()
{
	elements.tab_categoria.tabIndex = 'select';
}

/**
 * @param {String} [category] il codice della categoria da aggiornare
 * 
 * @properties={typeid:24,uuid:"A961F5C6-1272-486C-9EC2-CB2AF7061A16"}
 */
function refresh(category)
{
	forms.psl_admin_pratiche_categoria_select.initCategory(category || foundset.codice);
	databaseManager.refreshRecordFromDatabase(psl_categorie_to_psl_pratiche, -1);
}