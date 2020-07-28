const Job = require("../models/Job")

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}
    let filterByLevel = {}
    let filterByLanguages = {}
    if (req.query.level) {
      filterByLevel = {
        'level': {
          $in: [req.query.level]
        },

      }
    }

    if (req.query.languages) {
      filterByLanguages = {
        'languages': {
          $in: [req.query.languages]
        }

      }
    }
    let filter = {
      ...filterByLanguages,
      ...filterByLevel

    }

    if (endIndex < await model.countDocuments(
        filter
      ).exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    results.totalPages = Math.ceil(await model.countDocuments(
      filter
    ).exec() / limit) || 1
    try {
      if (model === Job) {
        results.jobs = await model.find(
            filter
          ).limit(limit).skip(startIndex)
          .sort({
            createdAt: -1
          })
          // .populate(
          //   'companyId'

          // )

          .exec()

      }

      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({
        message: e.message
      })
    }
  }
}
module.exports = paginatedResults;