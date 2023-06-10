const { getDB } = require('../config/db');

const insertBooking = async (req, res) => {
    try{
        const db = getDB();
        const { availabilityId, user } = req.body;
        const availabilityRef = await db.collection('availabilities').doc(availabilityId)
        const availability = await availabilityRef.get();
        if (!availability.exists) {
            return res.status(404).send({message: 'Sorry! It looks like this time is not available.'})
        }
        const { date, time, available } = availability.data();
        if (!available) {
            return res.status(400).send({message: 'Sorry! It looks like this time is not available.'})
        }
        if(!user || !user.firstName || !user.lastName || !user.email || !user.phone) {
            return res.status(400).send({message: 'It looks like you\'re missing some information. Please try again.'})
        }
        const booking = {
            date,
            time,
            user_fname: user.firstName,
            user_lname: user.lastName,
            user_email: user.email,
            user_phone: user.phone,
            isWaiverSigned: false,
            isCancelled: false,
            isCompleted: false,
            createdAt: new Date(),
        }
        const bookingRef = await db.collection('bookings').add(booking);
        await availabilityRef.update({
            available: false,
            bookingId: bookingRef.id
        });
        const bookingDoc = await bookingRef.get();
        return res.status(200).send({data: { booking: bookingDoc.data() }, message: 'Booking created successfully. Your booking ID is ' + bookingRef.id + '. Please keep this for your records.'});
    } catch (err) {
        return res.status(500).send({message: 'Oops! It looks like there was an error creating booking. Please try again later. (Error code: 236)'});
    }
}

const getBookings = async (req, res) => {
    try{
        const db = getDB();
        const bookingsRef = await db.collection('bookings').where('user', '==', user_id).get();
        const bookings = [];
        bookingsRef.forEach((doc) => {
            bookings.push({
                id: doc.id,
                ...doc.data()
            });
        })
        return res.status(200).send(bookings);
    } catch (err) {
        return res.status(500).send({message: 'Oops! It looks like there was an error getting bookings. Please try again later. (Error code: 253)'});
    }
}

const getBooking = async (req, res) => {
    try{
        const db = getDB();
        const { booking_id } = req.params;
        const bookingRef = await db.collection('bookings').doc(booking_id).get();
        if (!bookingRef.exists) {
            return res.status(404).send({message: 'Sorry! It looks like this booking does not exist.'})
        }
        return res.status(200).send({data: { booking: bookingRef.data() }});
    } catch (err) {
        return res.status(500).send({message: 'Oops! It looks like there was an error getting booking. Please try again later. (Error code: 270)'});
    }
}




module.exports = {
    insertBooking,
    getBookings,
    getBooking
}