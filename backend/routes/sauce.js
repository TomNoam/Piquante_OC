const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl);
// router.post('/', sauceCtrl.createSauce);
// router.get('/:id', sauceCtrl.getOneSauce);
// router.put('/:id', sauceCtrl.modifySauce);
// router.delete('/:id', sauceCtrl.deleteSauce);

module.exports = router;