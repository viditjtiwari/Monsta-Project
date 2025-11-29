const express = require('express');
const { create, view, details, update, changeStatus, destroy } = require('../../Controller/Admin/country.controller');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports = (server) => {

    router.post('/create', upload.none(), create);

    router.post('/view', upload.none(), view);

    router.post('/details/:id', upload.none(), details);

    router.put('/update/:id', upload.none(), update);

    router.put('/change-status', upload.none(), changeStatus);

    router.put('/delete', upload.none(), destroy);

    server.use('/api/admin/country', router);
}