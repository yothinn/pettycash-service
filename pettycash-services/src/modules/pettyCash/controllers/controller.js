'use strict';

const { query } = require('express');

var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Pettycash = mongoose.model('Pettycash'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

const XLSX = require('xlsx');
const fs = require('fs');

exports.getList = async function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    delete req.query.pageNo;
    delete req.query.size;

    var searchText = req.query.query;


    var startDate = new Date(req.query.startDate);
    var endDate = new Date(req.query.endDate);

    let query = { $and: [] };

    // Query id
    // if (searchText) {
    //     query['$and'].push({
    //         $or: [
    //             { id: { $regex: `^${searchText}`, $options: "i" } },
    //         ]
    //     })
    // }


    // Reset query when no parameter
    if (query['$and'].length === 0) {
        query = {};
    }

    // Query created in start and end date.
    if (!isNaN(startDate.valueOf()) && !isNaN(endDate.valueOf())) {
        console.log('date valid');
        if (!endDate || (startDate > endDate)) {
            return res.status(400).send({
                status: 400,
                message: "End date equal null or start date greate than end date"
            });
        }
        query['$and'].push({
            created: { $gte: startDate, $lte: endDate }
        })
    }

    console.log(query);
    var sort = { created: -1 };

    if (pageNo < 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }

    try {
        const [_result, _count] = await Promise.all([
            Pettycash.find(req.query, query)
                .skip(size * (pageNo - 1))
                .limit(size)
                .sort(sort)
                .exec(),
            Pettycash.countDocuments(req.query).exec()
        ]);
        console.log(size);

        res.jsonp({
            status: 200,
            data: _result,
            pageIndex: pageNo,
            pageSize: size,
            totalRecord: _count,
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 400,
            message: errorHandler.getErrorMessage(err)
        });
    }


};

exports.create = function (req, res) {
    var newPettycash = new Pettycash(req.body);
    newPettycash.createby = req.user;
    newPettycash.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Pettycash.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updPettycash = _.extend(req.data, req.body);
    updPettycash.updated = new Date();
    updPettycash.updateby = req.user;
    updPettycash.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.summary = async function (req, res) {

    let sumIn = await Pettycash.aggregate([
        {
            $match: {
                status: "เงินเข้า",
            },

        },
        {
            $group: {
                _id: "$employeeId",
                total: { $sum: "$amount" }
            }
        }
    ]);

    let sumOut = await Pettycash.aggregate([
        {
            $match: {
                status: "เงินออก",
            },

        },
        {
            $group: {
                _id: "$employeeId",
                total: { $sum: "$amount" }
            }
        }
    ]);

    res.jsonp({
        data: {
            amountIn: sumIn,
            amountOut: sumOut
        }
    });



}

// exports.uploads = function (req, res) {
//     console.log(req.file.path)

//     var filePath = req.file.path
//     const workbook = XLSX.readFile(filePath);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     let dataPettyCash = XLSX.utils.sheet_to_json(worksheet);

//     for (let data of dataPettyCash) {
//         let newPettycash = new Pettycash(data);
//         newPettycash.save(function (err, data) {
//             if (err) {
//                 return res.status(400).send({
//                     status: 400,
//                     message: errorHandler.getErrorMessage(err)
//                 });
//             }
//         })
//     }
//     res.jsonp({
//         status: 200,
//     });
//     fs.unlinkSync(filePath);
// }