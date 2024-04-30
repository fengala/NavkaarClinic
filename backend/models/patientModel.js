import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const PatientModel = mongoose.model('Patient', patientSchema);

export default PatientModel;
