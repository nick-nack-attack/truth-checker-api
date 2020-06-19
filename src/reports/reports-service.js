const xss = require('xss');

const ReportsService = {

    getAllReports: (db) => {
        return db
            .from('reports')
            .select('*')
    },

    getReportById(db, report_id) {
        return db
            .from('reports')
            .select('*')
            .where('report_id', report_id)
            .first()
    },

    insertReport: (db, report) => {
        return (
            db
                .insert(report)
                .into('reports')
                .returning('*')
                .then(([report]) => report)
                .then(report =>
                    ReportsService.getReportById(db, report.report_id)
                )
        );
    },

    updateReport: (db, report_id, fields) => {
        return db
            .from('reports')
            .where('report_id', report_id)
            .update(fields)
    }
    
};

module.exports = ReportsService;