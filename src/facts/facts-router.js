const express = require('express')
const path = require('path')
const FactsService = require('./facts-service');

const FactsRouter = express.Router();
const jsonBodyParser = express.json();

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
        const {title, text, user_id} = req.body
        const newFact = {title, text, user_id}

        for (const [key,value] of Object.entries(newFact))
            if (value === null) 
                return res.status(400).json({
                    error: `Missing ${key} in request`
                })

        FactsService.insertFact(
            req.app.get('db'),
            newFact
        )
        .then(fact => {
            console.log(fact)
            res.status(201)
            .location(`/api/facts/id/${fact.fact_id}`)
            .json(fact)
        })
        .catch(next)
    })

FactsRouter
    .route('/id/:fact_id')
    .all(checkFactExists)
    .get((req, res, next) => {
        res.json(res.fact)
        .catch(next)
    })
    .delete((req, res, next) => {
        const {fact_id} = req.params;
        FactsService.deleteFact(
            req.app.get('db'),
            fact_id
        )
        .then(() => {
            res.status(204).end()
        })
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const {title, text, status} = req.body;
        const fact = {title, text, status};
        const numOfValues = Object.values(fact).filter(Boolean).length;

        if(numOfValues === 0) {
            return
                res.status(400).json({
                    error: {message: `Request body content requires 'title', 'text', or 'status'`}
                })
        }

        FactsService.updateFact(
            req.app.get('db'),
            req.params.fact_id
        )
        .then(fact => {
            res.status(204)
            .json(fact)
            .end()
        })

    })

async function checkFactExists(req, res, next) {
    try {
        const fact = await FactsService.getFactById(
            req.app.get('db'),
            req.params.fact_id
        )
    if(!fact)
        return res.status(404).json({
            error: `Fact doesn't exist`
        })
    res.fact = fact
    next()
    }
    catch(error) {
        next(error)
    }
}

    module.exports = FactsRouter;