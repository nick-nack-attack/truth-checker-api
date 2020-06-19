const xss = require('xss');

const ReportsService = {

    getReports: (db) => {
        return db
            .from('reports AS rpt')
            .select(
                'rpt.report_id',
                'rpt.date_created',
                'rpt.report_status',
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                            'fact_id', fct.fact_id,
                            'title', fct.title,
                            'text', fct.text,
                            'user_id', fct.user_id,
                            'fact_status', fct.status,
                            'date_submitted', fct.date_submitted,
                            'date_approved', fct.date_approved,
                            'date_not_true', fct.date_not_true
                        )
                    ) AS "reportedFact"`
                ),
            )
            .leftJoin(
                'facts AS fct',
                'rpt.fact_id',
                'fct.fact_id'
            )
            .groupBy('rpt.report_id', 'fct.fact_id')
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