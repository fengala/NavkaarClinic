// models/timeslotModel.js
import mongoose from 'mongoose';

const timeslotSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
});

const Timeslot = mongoose.model('Timeslot', timeslotSchema);

export default Timeslot;
