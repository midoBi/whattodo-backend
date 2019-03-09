const express = require('express');
const scrapCtrl = require('../controllers/scrap.controller');

const router = express.Router();
module.exports = router;


router.route('/')
    .get(scrap);

function scrap(req, res ) {
    scrapCtrl.scrap(req, res,(err, result) => {
        if(!err) {
            res.json(result);
        }else {
            res.json({error : err});
        }
    })
}