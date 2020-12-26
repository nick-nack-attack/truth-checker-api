// if a value is missing from the request body then return error
const FactsService = require('../facts/facts-service');
const ReportsService = require("../reports/reports-service");

const checkFactExists = async (req, res, next) => {
    try {
        const fact = await FactsService.getFactById( req.params.fact_id );
        if (!fact) {
            return res
                .status(400)
                .json({
                    error: `Fact doesn't exist`
                })
        } else {
            res.fact = fact;
            next();
        }
    } catch (error) {
        next(error);
    }
};

const checkReportExists = async (req, res, next) => {
    try {
        const report = await ReportsService.getReportById( req.params.report_id );
        if (!report) {
            return res
                .status(400)
                .json({
                    error: `Report doesn't exist`
                })
        } else {
            res.report = report;
            next();
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkFactExists,
    checkReportExists
}

