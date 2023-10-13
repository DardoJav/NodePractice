import EErros from "../services/errors/enums.js";

export default(error, req, res, next) => {
    switch(error.code) {
        case EErros.INVALID_TYPES_ERROR:
            res.status(400).json({ status: 'error', error: error.name, error_details: error.cause })
            break
        default:
            res.status(500).json({ status: 'error', error: 'Unhandled error' })
            break
    }
}