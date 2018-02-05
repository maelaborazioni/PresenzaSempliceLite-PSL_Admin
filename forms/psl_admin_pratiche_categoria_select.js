/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"D4C92758-8D4C-449C-ADE8-6F634D158DF5"}
 */
var categoria = null;

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D84146A9-3D4D-4C83-A412-531BA5641D69"}
 */
function onLoad(event) 
{
	// inizializza l'elenco per la prima categoria disponibile
	var category = application.getValueListItems('vls_pratiche_categoria').getValue(1, 2);
	initCategory(category);
	
	plugins.WebClientUtils.setExtraCssClass(elements.cmb_categoria, 'selection');
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DAEB5509-AF62-4433-8AB5-6B753C94E34E"}
 */
function onDataChange$cmb_categoria(oldValue, newValue, event) 
{
	initCategory(newValue);
	return true;
}

/**
 * @param category
 *
 * @properties={typeid:24,uuid:"E71FBA06-2D57-4766-A70F-656C5B98CCF6"}
 * @AllowToRunInFind
 */
function initCategory(category)
{
	categoria = category;
	
	var fs = foundset;
		fs.find();
		fs.codice = category;
		
	fs.search();		
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F9D453F3-397E-46EC-BE47-629E863BDBAA"}
 */
function onAction$btn_edit(event) 
{
	forms.psl_nav_admin_pratiche.openEdit();
}
