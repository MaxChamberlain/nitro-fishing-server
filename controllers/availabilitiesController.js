const { getDB } = require('../config/db');

const insertAvailability = async (req, res) => {
    try {
        const db = getDB();
        const { date, time, available } = req.body;
        const availabilityCheckRef = await db.collection('availabilities').where('date', '==', date).where('time', '==', time).get();
        if(availabilityCheckRef.size > 0) {
            return res.status(400).send({message: 'Oops! It looks like this availability already exists. Please try again. (Error code: 112)'});
        }
        const availability = {
            date,
            time,
            available,
            createdAt: new Date()
        }
        const availabilityRef = await db.collection('availabilities').add(availability);
        if(!availabilityRef.id) {
            return res.status(500).send({message: 'Oops! There was an error creating this availability. Please try again. (Error code: 113)'});
        }
        return res.status(200).send({message: 'Availability created successfully.'});
    } catch (err) {
        return res.status(500).send({message: 'Oops! There was an error creating this availability. Please try again. (Error code: 117)'});
    }
}

const getAvailabilities = async (req, res) => {
    try {
        const db = getDB();
        const availabilitiesRef = await db.collection('availabilities').get();
        const availabilities = [];
        availabilitiesRef.forEach((doc) => {
            availabilities.push({
                id: doc.id,
                ...doc.data()
            });
        })
        return res.status(200).send(availabilities);
    } catch (err) {
        return res.status(500).send({message: 'Oops! There was an error getting availabilities. Please try again. (Error code: 134)'});
    }
}

module.exports = {
    insertAvailability,
    getAvailabilities
}