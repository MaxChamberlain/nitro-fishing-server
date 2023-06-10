const { getDB } = require('../config/db');
const bcrypt = require('bcrypt');
const { createToken } = require('../middlewares/jwt');

const loginUser = async (req, res) => {
    const { user_email, user_password } = req.body;
    try {
        const db = getDB();
        
        const cityRef = db.collection('users').where('user_email', '==', user_email);
        const docs = await cityRef.get();
        let user;
        if (docs.empty) {
            console.log('No such document!');
            return res.status(400).send('Credentials don\'t match any user');
        } else {
            
            docs.forEach(doc => {
                user = {
                    user_id: doc.id,
                    ...doc.data()
                }
            })
            const validPassword = await bcrypt.compare(user_password, user.user_password);
            if (!validPassword) {
                res.status(400).send('Credentials don\'t match any user');
            } else {
                delete user.user_password
                const jwt = createToken(user.user_id)
                // create a cookie that expires in 10 hours and path is set to root
                res.set('Authorization', `Bearer ${jwt}`)
                res.status(200).send(user);
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

const getUserDetails = async (req, res) => {
    const { user_id } = req;
    try {
        const db = getDB();
        
        const userRef = db.collection('users').doc(user_id);
        const docs = await userRef.get();

        if (!docs.exists) {
            res.status(400).send('User not found');
        } else {
            const user = docs.data();
            delete user.user_password
            res.status(200).send({...user, user_id: docs.id});
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

module.exports = {
    loginUser,
    getUserDetails
}