import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId: { type: String, required: true, ref: 'Patient' },
    slotId: { type: String, required: true, ref: 'Timeslot' },
});

appointmentSchema.index({ patientId: 1, slotId: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
