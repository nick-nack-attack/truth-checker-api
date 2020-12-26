// Reports router
const { Router, json }          = require('express');
const ReportsRouter             = Router();
const jsonBodyParser            = json();
const path                      = require('path');

// services
const ReportsService            = require('./reports-service');
const FactsService              = require('../facts/facts-service');
const { checkReportExists }     = require('../middleware/check-if-exists');

// omitting auth middleware for initial mvp release

ReportsRouter
    .route('/')
    .get((req, res, next) => {
        ReportsService
            .getReports()
                .then(report => {
                    res.json(ReportsService.removeDupesReduce(report))
                })
                .catch(next)

    })
    .post(jsonBodyParser, (req, res, next) => {
        const { fact_id } = req.body;
        const newReport = { 
            fact_id: fact_id, 
            report_status: 'Processing' 
        };

        try { FactsService
            .getFactById(newReport.fact_id)
                .then(() => {
                    ReportsService
                        .insertReport(newReport)
                        .then(createdReport => {
                            return (
                                res
                                    .status(201)
                                    .location( (path.posix.join(req.originalUrl), `/id/${createdReport.report_id}`))
                                    .json(createdReport)
                            )
                        })
                .catch(() => {
                    return (
                        res
                            .status(404)
                            .json({
                                error: `Fact doesn't exist`
                            })
                    )
                })
            })
                .catch(err => {
                    return res
                        .status(400)
                        .json({
                            error: `Must include fact_id as integer`
                        })
                })
        } catch { next(); }

    })

ReportsRouter
    .route('/id/:report_id')
    .all(checkReportExists)
    .get((req, res, next) => {
        const reportId = req.params.report_id;
        ReportsService
            .getReportById(reportId)
                .then(report => {
                    res.json(report)
                })
                .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { report_status } = req.body;
        const reportToUpdate = { report_status };
        const reportId = req.params.report_id;

        try { ReportsService
            .updateReport(
                reportId,
                reportToUpdate,
            )
                .then(report => {
                    return res.status(201).json(report)
                })
                .catch(() => {
                    return res
                        .status(400)
                        .json({
                            error: `Request body must include report_status 'Processing', 'Approved', or 'Denied'`
                        })
                })
        } catch(err) { next(); }

    });

module.exports = ReportsRouter;