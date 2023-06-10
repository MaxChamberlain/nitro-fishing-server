const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // if( process.env.NODE_ENV === 'development' ) {
    //     req.user_id = 'eGwtgWhVrZqWQfTtgzXT';
    //     next();
    // }
    // else{
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return res.status(403).send('Access Denied');
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            const decodedContetnt = jwt.decode(token, { complete: true });
            console.log(decodedContetnt)
            req.user = verified;
            req.user_id = decodedContetnt.payload.id;
            next();
        } catch (err) {
            res.status(400).send('Invalid Token');
        }
    // }
}

const createToken = (user_id) => {
    // sign a new jwt that lasta 12 hours
    const token = jwt.sign({ id: user_id }, process.env.TOKEN_SECRET, { expiresIn: '18h' });
    return token;
}

const createInviteToken = (user_email, companies) => {
    // sign a new jwt that lasts 3 days
    const token = jwt.sign({ email: user_email, companies: companies }, process.env.TOKEN_SECRET, { expiresIn: '3d' });
    return token;
}

module.exports = {
    verifyToken,
    createToken,
    createInviteToken
};