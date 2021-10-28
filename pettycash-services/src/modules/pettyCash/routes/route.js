'use strict';
var controller = require('../controllers/controller'),
    mq = require('../../core/controllers/rabbitmq'),
    policy = require('../policy/policy');
    // const multer = require('multer');
    // const config = require('../../../config/config');

    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         // console.log(file)
    //         cb(null, './src/modules/pettyCash/' + config.folder);
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.originalname);
    //     }
    //     });

    // const upload = multer({ storage: storage });

module.exports = function (app) {
    var url = '/api/pettycashs';
    var urlWithParam = '/api/pettycashs/:pettycashId';
    var urlTotal = '/api/pettycashs/total';
    // var uploads = '/api/pettycashs/uploads'

    // app.route(uploads)
    //     .post(upload.single('files'), controller.uploads);

    app.route(url)//.all(policy.isAllowed)
        .get(controller.getList)
        .post(controller.create);

    app.route(urlTotal)
        .get(controller.summary);

    app.route(urlWithParam)//.all(policy.isAllowed)
        .get(controller.read)
        .put(controller.update)
        .delete(controller.delete);

    app.param('pettycashId', controller.getByID);



    /**
     * Message Queue
     * exchange : ชื่อเครือข่ายไปรษณีย์  เช่น casan
     * qname : ชื่อสถานีย่อย สาขา
     * keymsg : ชื่อผู้รับ
     */
    // mq.consume('exchange', 'qname', 'keymsg', (msg)=>{
    //     console.log(JSON.parse(msg.content));
        
    // });
}