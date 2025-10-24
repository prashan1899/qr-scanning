const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');

router.get('/', buildingController.getBuildings);
router.post('/count', buildingController.updateCount);

module.exports = router;