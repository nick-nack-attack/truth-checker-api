// Reports router
const { Router, json } = require('express');
const ReportsRouter = Router();
const jsonBodyParser = json();
const path = require('path');

// services
const ReportsService = require('./reports-service');
const FactsService = require('../facts/facts-service');

// omitting auth middleware for initial mvp release

ReportsRouter
    .route('/')
    .get((req, res, next) => {
        ReportsService.getReports(
            req.app.get('db')
        )
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

        try {
            FactsService.getFactById(
                req.app.get('db'),
                newReport.fact_id
            )
            .then(() => {
                ReportsService.insertReport(
                    req.app.get('db'),
                    newReport
                )
                .then(createdReport => {
                    return (
                        res.status(201)
                        .location( (path.posix.join(req.originalUrl), `/id/${createdReport.report_id}`)) // alt `/api/reports/id/${createdReport.report_id}`)
                        .json(createdReport)
                    )
                })
                .catch(() => {
                    return (
                        res.status(404).json({
                            error: `Fact doesn't exist`
                        })
                    )
                })
            })
            .catch(err => {
                return res.status(400).json({
                    error: `Must include fact_id as integer`
                })
            })
        }
        catch {
            next()
        }

    })

ReportsRouter
    .route('/id/:report_id')
    .all(checkReportExists)
    .get((req, res, next) => {
        ReportsService.getReportById(
            req.app.get('db'),
            req.params.report_id
        )
        .then(report => {
            res.json(report)
        })
        .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { report_status } = req.body;
        const reportToUpdate = { report_status };
        const report_id = req.params.report_id;

        try {

            ReportsService.updateReport(
                req.app.get('db'),
                report_id,
                reportToUpdate
            )
            .then(report => {
                return res.status(201).json(report)
            })
            .catch(() => {
                return res.status(400).json({
                    error: `Request body must include report_status 'Processing', 'Approved', or 'Denied'`
                })
            })

        }

        catch(err) {
            console.log(err)
            next();

        }

    });

// async await for promises
async function checkReportExists(req, res, next) {
    try {
        const report = await ReportsService.getReportById(
            req.app.get('db'),
            req.params.report_id
        );
        if (!report) {
            return res.status(404).json({
                error: `Report doesn't exist`
            })
        } else {
            res.report = report;
            next();
        }
    }
    catch(error) {
        next(error);
    }
};

module.exports = ReportsRouter;