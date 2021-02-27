const xss = require('xss');
const { format } = require('date-fns');
const { db } = require('../database/connect');

const FactsService = {

    deleteFact: (fact_id) => {
        return db
            .from('facts')
            .where('fact_id', fact_id)
            .delete()
    },

    getAllFacts: () => {
        return db
            .from('facts')
            .select('*')
    },

    getFactById: (fact_id) => {
        return db
            .from('facts')
            .select('*')
            .where('fact_id', fact_id)
            .first()
    },

    insertFact: (fact) => {
        return db
            .insert(fact)
            .into('facts')
            .returning('*')
            .then(([returnedFact]) => returnedFact)
    },

    updateFact: (fact_id, fields) => {
        return db
            .from('facts')
            .where('fact_id', fact_id)
            .update(fields)
    },

    serializeFact: (fact) => {
        const submitted = fact.date_submitted ? format(new Date(fact.date_submitted), 'yyyy-MM-dd') : null;
        const underReview = fact.date_under_review ? format(new Date(fact.date_under_review), 'yyyy-MM-dd') : null;
        const approved = fact.date_approved ? format(new Date(fact.date_approved), 'yyyy-MM-dd') : null;
        const notTrue = fact.date_not_true ? format(new Date(fact.date_not_true), 'yyyy-MM-dd') : null;
        let factStatus = notTrue ? 'Not True' : approved ? 'Approved' : underReview ? 'Under Review' : 'Pending';
        return {
            fact_id: fact.fact_id,
            title: xss(fact.title),
            user_id: fact.user_id,
            status: factStatus,
            serial: fact.serial,
            date_submitted: submitted,
            date_under_review: underReview,
            date_approved: approved,
            date_not_true: notTrue
        }
    }

};

module.exports = FactsService;