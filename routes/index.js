let express = require('express');
let router = express.Router();

let index_controller = require("../controller/index_controller")
router.get('/', index_controller.index_init);

module.exports = router;
