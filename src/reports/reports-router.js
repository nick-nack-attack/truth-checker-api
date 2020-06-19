const express = require('express');
const path = require('path');
const ReportsService = require('./reports-service');

const ReportsRouter = express.Router();
const jsonBodyParser = express.json();

ReportsRouter
    .route('/')
    .get((req, res, next) => {
        ReportsService.getAllReports(
            req.app.get('db')
        )
        .then(report => {
            res.json(report)
        })
        .catch(next)
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

        if (!report_status) {
            return (
                res.status(400).json({
                    error: { message: `Request body content requires status change` }
                })
            )
        }
        if (report_status !== 'Processing' && report_status === 'Approved' && report_status !== 'Denied') {
            return (
                res.status(400).json({
                    error: { message: `Status change must be either 'Processing', 'Approved', or 'Denied'` }
                })
            )
        };
        if (reportToUpdate.length === 0) {
            return (
                res.status(400).json({
                    error: { message: `Request body content requires status change` }
                })
            )
        };
        
        ReportsService.updateReport(
            req.app.get('db'),
            report_id,
            reportToUpdate
        )
        .then(() => {
            ReportsService.getReportById(
                req.app.get('db'),
                report_id
            )
            .then(report => {
                return res.status(201).json(report)
            })
        })
        .catch(next)
    })

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
            res.report = report
            next()
        }
    }
    catch {
        next()
    }
};

module.exports = ReportsRouter;