var express = require('express');
var router = express.Router();

var indexController = require('../controllers/indexController.js');


/* General Pages*/
router.get('/',  indexController.home_get );
router.get('/float',indexController.floatship_page_get);
//router.get('/addfloat',indexController.float_add_page);
router.post('/float/:name/:password',indexController.float_get);
//router.post('/addfloat/:name/:password',indexController.float_add);
router.post('/addfloat',indexController.float_add);

module.exports = router;
