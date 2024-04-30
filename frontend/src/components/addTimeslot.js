// // components/AddTimeslot.js
// import React, { useState } from 'react';
// import axios from 'axios';

// import { useNavigate } from 'react-router-dom';

// const AddTimeslot = () => {
//     const [date, setDate] = useState('');
//     const [time, setTime] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             await axios.post('/api/timeslots/add', { date, time });
//             alert('Timeslot added successfully!');
//             navigate('/list');
//             setDate('');
//             setTime('');
//         } catch (error) {
//             console.error('Error adding timeslot:', error);
//             alert('Failed to add timeslot.');
//         }
//     };

//     const formStyle = {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: '50px'
//     };

//     const labelStyle = {
//         marginBottom: '10px'
//     };

//     const inputStyle = {
//         marginBottom: '20px',
//         width: '200px',
//         padding: '10px',
//         borderRadius: '5px',
//         border: '1px solid #ccc'
//     };

//     const buttonStyle = {
//         cursor: 'pointer',
//         padding: '10px 20px',
//         backgroundColor: '#007bff',
//         color: 'white',
//         border: 'none',
//         borderRadius: '5px',
//         fontSize: '16px'
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <form onSubmit={handleSubmit} style={formStyle}>
//                 <div style={labelStyle}>
//                     <label>Date:</label>
//                     <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
//                 </div>
//                 <div style={labelStyle}>
//                     <label>Time:</label>
//                     <input type="time" value={time} onChange={e => setTime(e.target.value)} required style={inputStyle} />
//                 </div>
//                 <button type="submit" style={buttonStyle}>Add Timeslot</button>
//             </form>
//         </div>
//     );
// };

// export default AddTimeslot;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTimeslot = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState(''); // State to store error messages
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message on new submission

        try {
            const response = await axios.post('/api/timeslots/add', { date, time });
            if (response.status === 201) {
                alert('Timeslot added successfully!');
                navigate('/list');
                setDate('');
                setTime('');
            } else {
                throw new Error('Failed to add timeslot due to server response');
            }
        } catch (error) {
            setError('Failed to add timeslot: ' + (error.response?.data.message || error.message));
        }
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50px'
    };

    const labelStyle = {
        marginBottom: '10px'
    };

    const inputStyle = {
        marginBottom: '20px',
        width: '200px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc'
    };

    const buttonStyle = {
        cursor: 'pointer',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={labelStyle}>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
                </div>
                <div style={labelStyle}>
                    <label>Time:</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} required style={inputStyle} />
                </div>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                <button type="submit" style={buttonStyle}>Add Timeslot</button>
            </form>
        </div>
    );
};

export default AddTimeslot;
