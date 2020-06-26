// Facts Router
const { Router, json } = require('express')
const FactsRouter = Router();
const jsonBodyParser = json();
const path = require('path');

// service
const FactsService = require('./facts-service');

FactsRouter
    .route('/')
    .get((req, res, next) => {
        FactsService.getAllFacts(
            req.app.get('db')
        )
        .then(fact => {
            res.json(fact.map(FactsService.serializeFact))
        })
        .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { title, user_id } = req.body;
        const date_submitted = new Date();
        // newly submitted facts default to status 'Pending'
        const status = 'Pending'; 
        const newFact = { title, user_id, status, date_submitted };

        // if a value is missing from the request body then return error
        for (const [key,value] of Object.entries(newFact))
            if (value === undefined || value === null) 
                return res.status(400).json({
                    error: `Missing ${key} in request`
                })

        FactsService.insertFact(
            req.app.get('db'),
            newFact
        )
        .then(fact => {
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/id/${fact.fact_id}`)) // alt .location(`/api/facts/id/${fact.fact_id}`)
            .json(FactsService.serializeFact(fact))
        })
        .catch(next)
    })

FactsRouter
    .route('/id/:fact_id')
    .all(checkFactExist)
    .get((req, res, next) => {
        return FactsService.serializeFact(res.json(res.fact))
    })
    .delete((req, res, next) => {
        const {fact_id} = req.params;
        FactsService.deleteFact(
            req.app.get('db'),
            fact_id
        )
        .then(() => {
            return (
                res
                    .status(204)
                    .end()
            );
        })
        .catch(next);
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const {
            title, 
            user_id,
            date_submitted,
            date_under_review,
            date_approved,
            date_not_true
        } = req.body;

        // set new status if a date has been submitted
        const statusChange = date_not_true 
            ? 'Not true' 
            : date_approved 
            ? 'Approved' 
            : date_under_review 
            ? 'Under Review' 
            : 'Pending';

        const fact = { 
            title, 
            user_id, 
            status: statusChange, 
            date_submitted, 
            date_under_review, 
            date_approved, 
            date_not_true };

        const fact_id = req.params.fact_id

        // remove any field that doesn't have a value (null)
        for (const [key, value] of Object.entries(fact)) {
            if (value == null) {
                delete fact[key] 
            } 
        };

        // set how many values there are left
        const numOfValues = Object.values(fact).filter(Boolean).length;

        // if all values are null, or title is not included, return error
        if(numOfValues === 0) {
            return (
                res
                    .status(400)
                    .json({
                        error: {
                            message: `Request body content requires 'title'`
                        }
                    })
            )
        };

        FactsService.updateFact(
            req.app.get('db'),
            fact_id,
            fact
        )
        .then(() => {
            FactsService.getFactById(
                req.app.get('db'),
                fact_id
            )
            .then(fact => {
                return res.status(201).json(fact)
            })
        })

    })

// check to see if the fact exists
async function checkFactExist(req, res, next) {
    const knexInst = req.app.get('db');
    try {
        const fact = await FactsService.getFactById(
            knexInst,
            req.params.fact_id
        )
        if(!fact) {
            return res.status(404).json({
                error: `Fact doesn't exist`
            })
        } else {
            res.fact = fact;
            next();
        }
    }
    catch(error) {
        next(error);
    }
    
};

module.exports = FactsRouter;