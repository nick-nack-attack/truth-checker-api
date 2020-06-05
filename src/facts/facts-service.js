const xss = require('xss');

const FactsService = {

    deleteFact(db, fact_id) {
        return db
            .from('facts')
            .where('fact_id', fact_id)
            .delete()
    },

    getAllFacts(db) {
        return db
            .from('facts')
            .select('*')
    },

    getFactById(db, fact_id) {
        return db
            .from('facts')
            .select('*')
            .where('fact_id', fact_id)
    },

    insertFact(db, fact) {
        return db
            .insert(fact)
            .into('facts')
            .returning('*')
            .then(([fact]) => fact)
            .then(fact =>
                FactsService.getFactById(db, fact.fact_id)    
            )
    },

    serializeFact(fact) {
        return {
            fact_id: fact.fact_id,
            title: xss(fact.title),
            text: xss(fact.text),
            user_id:    fact.user_id,
            status: xss(fact.status),
            date_submitted: fact.date_submitted,
            date_under_review: fact.date_under_review,
            date_approved: fact.date_approved,
            date_not_true: fact.date_not_true
        }
    },

    updateFact(db, fact_id, fields) {
        return db
            .from('facts')
            .where('fact_id', fact_id)
            .update(fields)
            .then(() => {
                FactsService.getFactById(db, fact_id)
            })
    }

};

module.exports = FactsService;