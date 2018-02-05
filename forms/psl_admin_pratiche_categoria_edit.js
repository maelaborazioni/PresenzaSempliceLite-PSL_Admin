
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * 
 * @private 
 *
 * @properties={typeid:24,uuid:"B18815A1-BA06-48FB-A5D0-F6F325E9D51D"}
 */
function onAction$btn_cancel(event) 
{
	databaseManager.revertEditedRecords(foundset);
	forms.psl_nav_admin_pratiche.closeEdit();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FDEC1DD1-E108-4C3C-B9D1-3BE8DD02BDC8"}
 */
function onAction$btn_save(event) 
{
	save();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8DC45C5F-310A-4D4A-9B43-5BEDB8A5B69A"}
 */
function onAction$(event) 
{
	// save data on enter
	save();
}

/**
 * @properties={typeid:24,uuid:"A56DEB1C-DD63-4F16-B757-DC603974D23E"}
 */
function save()
{
	forms.psl_nav_admin_pratiche.refresh();
	forms.psl_nav_admin_pratiche.closeEdit();
}