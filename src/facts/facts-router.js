// Facts Router

// variables
const { Router, json }          = require("express")
const FactsRouter               = Router();
const jsonBodyParser            = json();
const path                      = require("path");

// services
const { checkForMissingValue }  = require("../middleware/check-for-missing-value");
const { checkFactExists }       = require('../middleware/check-if-exists');
const FactsService              = require("./facts-service");
const uuid4                     = require("uuid4");

// router
FactsRouter
    .route('/')
    .get((req, res, next) => {
      FactsService
          .getAllFacts()
          .then(fact => {
            res.json(fact.map(FactsService.serializeFact))
          })
          .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {

        // set variables from request body
        const { title, user_id } = req.body;
        const date_submitted = new Date();
        const status = 'Pending'; // newly submitted facts default to status 'Pending'
        const serial = uuid4();
        const newFact = { title, user_id, status, date_submitted, serial };

      // async function to check if a value is missing
      checkForMissingValue(newFact, res);

      FactsService
          .insertFact(newFact)
          .then(fact => {
            res.status(201)
                .location(path.posix.join(req.originalUrl, `/id/${fact.fact_id}`)) // alt .location(`/api/facts/id/${fact.fact_id}`)
                .json(FactsService.serializeFact(fact))
          })
          .catch(next)
    })

FactsRouter
    .route('/id/:fact_id')
    .all(checkFactExists)
    .get((req, res, next) => {
      return FactsService.serializeFact(res.json(res.fact))
    })
    .delete((req, res, next) => {

      const {fact_id} = req.params;

      FactsService
          .deleteFact(fact_id)
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
        date_not_true
      };

      const fact_id = req.params.fact_id;

      // remove any field that doesn't have a value (null)
      for (const [key, value] of Object.entries(fact)) {
        if (value == null) {
          delete fact[key]
        }
      }


      // set how many values there are left
      const numOfValues = Object.values(fact).filter(Boolean).length;

      // if all values are null, or title is not included, return error
      if (numOfValues === 0) {
        return (
            res
                .status(400)
                .json({
                  error: {
                    message: `Request body content requires 'title'`
                  }
                })
        )
      }

      FactsService.updateFact(
          fact_id,
          fact
      )
          .then(() => {
            FactsService.getFactById(fact_id)
              .then((fact) => {
                  return res.status(201).json(fact)
                })
              .catch((err) => {
                console.log('Get Fact failed:', err)
              })
          })
          .catch((err) => {
            console.log('Update Fact failed:', err)
          })

    })

module.exports = FactsRouter;