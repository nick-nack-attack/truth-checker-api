// if a value is missing from the request body then return error
const checkForMissingValue = async (arg, res) => {
    console.log('THIS RAN!')
        try {
            for (const [key, value] of Object.entries(arg))
                if (value === undefined || value === null)
                    return res
                        .status(400)
                        .json({
                            error: `Missing ${key} in request`
                        })
        } catch (error) {
            // log to debugger
        }
}

module.exports = { checkForMissingValue }