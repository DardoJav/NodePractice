
export const auth = (req, res, next) => {
    if (req.session?.user && req.session.user.username === 'admin@coderhouse.com') {
        return next()
    }
    return res.status(401).json({ status: 'fail', message: 'Auth error' })
}