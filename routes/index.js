var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
	var sess;

	if (req.isAuthenticated() === false)
		res.redirect('/sign');
	role = req.session.role;
	console.log("role: %s", role);
	res.render('index', {
		Role: role,
		title: 'Intra'
	});
});

router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if (err) return (err);
		req.logout();
		res.redirect('/sign');
	})

})

module.exports = router;
