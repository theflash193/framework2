var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var widget = forms.widgets;

var userForms = forms.create({
	username: fields.string({required: true, label: 'Username'}),
	password: fields.password({required: true}),
	confirm: fields.password({
		required: true,
		validators: [validators.matchField('password')]
	}),
	email: fields.email({required: true})
	// personal: {
	// 	name: fields.string({required: true, label: 'Name'}),
	// 	email: fields.email({required: true, label: 'Email'}),
	// 	address: {
	// 		address1: fields.string({required: true, label: 'address1'}),
	// 		address2: fields.string({label: 'address2'}),
	// 		city: fields.string({required: true, label: 'City'}),
	// 		state: fields.string({required: true, label: 'State'}),
	// 		zip: fields.string({required: true, label: 'Zip'})
	// 	}
	// }
});

var bootstrapField = function (name, object) {
    object.widget.classes = object.widget.classes || [];
    object.widget.classes.push('form-control');

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="alert alert-error help-block">' + object.error + '</div>' : '';

    var validationclass = object.value && !object.error ? 'has-success' : '';
    validationclass = object.error ? 'has-error' : validationclass;

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group ' + validationclass + '">' + label + widget + error + '</div>';
};

UserForms = exports.UserForms = userForms;
exports.bootstrapField = bootstrapField;