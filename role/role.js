var Rbac = require('easyrole');
var rbac = new Rbac();
rbac.setRoles(['admin', 'users']);

rbac['admin'].allow('*');

rbac['users'].allow();

module.exports = rbac;