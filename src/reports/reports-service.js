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
    },

    removeDupesReduce: (arr) => {
        let report = arr.reduce((acc, cur) => {
          let curFact = cur.reportedFact;
          if (!acc.hasOwnProperty(curFact.fact_id)) {
            acc[curFact.fact_id] = curFact;
            acc[curFact.fact_id].number_of_reports = 1;
          } else {
            acc[curFact.fact_id].number_of_reports += 1;
          }
          return acc;
        },{});
        return Object.keys(report).map(key => report[key]);
      }
    
};

module.exports = ReportsService;

// let reportData = [
//     {
//       "report_id": 1,
//       "date_created": "2020-06-06T00:00:00.000Z",
//       "report_status": "Approved",
//       "reportedFact": {
//         "fact_id": 1,
//         "title": "The Sky is Blue",
//         "text": "The ocean is blue because of the water",
//         "user_id": 2,
//         "fact_status": "Approved",
//         "dated_submitted": "2020-06-05T00:00:00+00:00",
//         "date_approved": "2020-06-18T00:00:00+00:00"
//       }
//     },
//     {
//       "report_id": 1,
//       "date_created": "2020-06-06T00:00:00.000Z",
//       "report_status": "Approved",
//       "reportedFact": {
//         "fact_id": 1,
//         "title": "The Sky is Blue",
//         "text": "The ocean is blue because of the water",
//         "user_id": 2,
//         "fact_status": "Approved",
//         "dated_submitted": "2020-06-05T00:00:00+00:00",
//         "date_approved": "2020-06-18T00:00:00+00:00"
//       }
//     },
//     {
//       "report_id": 1,
//       "date_created": "2020-06-06T00:00:00.000Z",
//       "report_status": "Approved",
//       "reportedFact": {
//         "fact_id": 9001,
//         "title": "The Sky is Blue",
//         "text": "The ocean is blue because of the water",
//         "user_id": 2,
//         "fact_status": "Approved",
//         "dated_submitted": "2020-06-05T00:00:00+00:00",
//         "date_approved": "2020-06-18T00:00:00+00:00"
//       }
//     }
//     ];
    
//     const removeDupesReduce = (arr) => {
//       let report = arr.reduce((acc, cur) => {
//         let curFact = cur.reportedFact;
//         if (!acc.hasOwnProperty(curFact.fact_id)) {
//           acc[curFact.fact_id] = curFact;
//           acc[curFact.fact_id].number_of_reports = 1;
//         } else {
//           acc[curFact.fact_id].number_of_reports += 1;
//         }
//         return acc;
//       },{});
//       return Object.keys(report).map(key => report[key]);
//     };
    
//     // console.log(removeDupes(reportData));
    
//     removeDupesReduce(reportData);