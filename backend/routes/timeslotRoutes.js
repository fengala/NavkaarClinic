// routes/timeslotRoutes.js
import express from 'express';
import Timeslot from '../models/timeslotModel.js';
import moment from 'moment'; 

const router = express.Router();

router.post('/add', async (req, res) => {
    const { date, time } = req.body;

    // Use moment to parse date and time
    const dateTime = moment(`${date}T${time}`);

    // Check if the date is on a weekend
    if (dateTime.day() === 0 || dateTime.day() === 6) {
        return res.status(400).json({ message: 'Cannot schedule timeslots on weekends.' });
    }

    // Check if the time is within the allowed range (8:00 AM to 8:00 PM)
    const hour = dateTime.hour();
    if (hour < 8 || hour > 20) {
        return res.status(400).json({ message: 'Timeslot must be between 8:00 AM and 8:00 PM.' });
    }

    try {
        const newTimeslot = new Timeslot({ date, time });
        await newTimeslot.save();
        res.status(201).json({ message: 'Timeslot added successfully!', timeslot: newTimeslot });
    } catch (error) {
        console.error('Failed to add timeslot:', error);
        res.status(500).json({ message: 'Failed to add timeslot.' });
    }
});


router.post('/get', async (req, res) => {
    const { filter, startDate, endDate, startTime, endTime } = req.body;
    let query = {};

    if (filter === 'available') {
        query.isBooked = false;
    } else if (filter === 'booked') {
        query.isBooked = true;
    }

    if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
        query.date = { $gte: startDate };
    } else if (endDate) {
        query.date = { $lte: endDate };
    }

    if (startTime && endTime) {
        query.time = { $gte: startTime, $lte: endTime };
    } else if (startTime) {
        query.time = { $gte: startTime };
    } else if (endTime) {
        query.time = { $lte: endTime };
    }

    try {
        const timeslots = await Timeslot.find(query);
        const availableCount = await Timeslot.countDocuments({ ...query, isBooked: false });
        const bookedCount = await Timeslot.countDocuments({ ...query, isBooked: true });
        res.json({ timeslots, availableCount, bookedCount });
    } catch (error) {
        console.error('Error fetching timeslots:', error);
        res.status(500).send('Internal server error');
    }
});


router.post('/update-availability', async (req, res) => {
    const { slotId, newAvailability } = req.body;

    try {
        const updatedTimeslot = await Timeslot.findByIdAndUpdate(
            slotId,
            { isBooked: newAvailability },
            { new: true }
        );

        if (updatedTimeslot) {
            res.status(200).json({ message: 'Timeslot availability updated successfully!', updatedTimeslot });
        } else {
            res.status(404).json({ message: 'Timeslot not found.' });
        }
    } catch (error) {
        console.error('Failed to update timeslot availability:', error);
        res.status(500).json({ message: 'Failed to update timeslot availability.' });
    }
});

// Delete a timeslot
router.delete('/delete/:slotId', async (req, res) => {
    try {
        const { slotId } = req.params;
        await Timeslot.findByIdAndDelete(slotId);
        res.status(200).json({ message: 'Timeslot deleted successfully' });
    } catch (error) {
        console.error('Error deleting timeslot:', error);
        res.status(500).json({ message: 'Failed to delete timeslot' });
    }
});



router.post('/reports', async (req, res) => {
    const { startDate, endDate, startTime, endTime } = req.body;
    let query = {};

    // Date filtering
    if (startDate || endDate) {
        query.date = {};
        if (startDate) {
            query.date.$gte = new Date(startDate);
        }
        if (endDate) {
            query.date.$lte = new Date(endDate);
        }
    }

    // Time filtering
    if (startTime || endTime) {
        query.time = {};
        if (startTime) {
            query.time.$gte = startTime;
        }
        if (endTime) {
            query.time.$lte = endTime;
        }
    }

    try {
        // Counting the available and booked timeslots within the given filters
        const available = await Timeslot.countDocuments({ ...query, isBooked: false });
        const booked = await Timeslot.countDocuments({ ...query, isBooked: true });

        res.json({ success: true, data: { available, booked } });
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).send('Internal server error');
    }
});

export default router;