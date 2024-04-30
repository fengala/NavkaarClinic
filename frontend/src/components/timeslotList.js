import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Select, Button, DatePicker, TimePicker, Statistic } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const TimeslotList = () => {
    const [timeslots, setTimeslots] = useState([]);
    const [availableCount, setAvailableCount] = useState(0);
    const [bookedCount, setBookedCount] = useState(0);
    const [filter, setFilter] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTimeslots();
    }, [filter, startDate, endDate, startTime, endTime]);

    const redirectToAddTimeslot = () => {
        navigate('/add');
    };

    const fetchTimeslots = async () => {
        try {
            const response = await axios.post('/api/timeslots/get', {
                filter,
                startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
                endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
                startTime: startTime ? startTime.format('HH:mm') : null,
                endTime: endTime ? endTime.format('HH:mm') : null
            });
            setTimeslots(response.data.timeslots);
            setAvailableCount(response.data.availableCount);
            setBookedCount(response.data.bookedCount);
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        }
    };

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const handleDateChange = (date, dateString, type) => {
        type === 'start' ? setStartDate(date) : setEndDate(date);
    };

    const handleTimeChange = (time, timeString, type) => {
        type === 'start' ? setStartTime(time) : setEndTime(time);
    };

    const toggleAvailability = async (slotId, currentAvailability) => {
        try {
            await axios.post('/api/timeslots/update-availability', {
                slotId,
                newAvailability: !currentAvailability
            });
            fetchTimeslots();
        } catch ( error) {
            console.error('Error updating timeslot availability:', error);
        }
    };

    const deleteTimeslot = async (slotId) => {
        try {
            await axios.delete(`/api/timeslots/delete/${slotId}`);
            alert('Timeslot deleted successfully');
            fetchTimeslots(); // Refresh the timeslots list
        } catch (error) {
            console.error('Error deleting timeslot:', error);
            alert('Failed to delete timeslot');
        }
    };

    const formatDate = (dateObj, timeStr) => {
        // Ensure the date is treated as UTC when parsing
        const datePart = moment.utc(dateObj).format('YYYY-MM-DD');
        
        // Combine with time and specify that the format is in UTC
        const combinedDateTimeStr = `${datePart}T${timeStr}Z`; // 'Z' indicates UTC
        
        // Parse as UTC and then convert to local time for display
        const dateTime = moment.utc(combinedDateTimeStr).local();
        
        if (!dateTime.isValid()) {
            return 'Invalid datetime'; 
        }
        
        // Format in a user-friendly way, showing local time
        return dateTime.format('dddd, MMMM D, YYYY, h:mm A');
    };
    

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <Select defaultValue="" style={{ width: 200 }} onChange={handleFilterChange}>
                        <Option value="">All Timeslots</Option>
                        <Option value="available">Available</Option>
                        <Option value="booked">Booked</Option>
                    </Select>
                    <DatePicker onChange={(date, dateString) => handleDateChange(date, dateString, 'start')} placeholder="Start Date" />
                    <DatePicker onChange={(date, dateString) => handleDateChange(date, dateString, 'end')} placeholder="End Date" />
                    <TimePicker onChange={(time, timeString) => handleTimeChange(time, timeString, 'start')} use12Hours format="hh:mm A" placeholder="Start Time" />
                    <TimePicker onChange={(time, timeString) => handleTimeChange(time, timeString, 'end')} use12Hours format="hh:mm A" placeholder="End Time" />
                </div>
                <Button type="primary" onClick={redirectToAddTimeslot}>Add Timeslot</Button>
            </div>
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Available Timeslots"
                            value={availableCount}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<CheckCircleOutlined style={{ color: '#3f8600' }} />}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Booked Timeslots"
                            value={bookedCount}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<CloseCircleOutlined style={{ color: '#cf1322' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {timeslots.map((slot) => (
                    <Col span={8} key={slot._id}>
                        <Card title={`Timeslot on ${formatDate(slot.date, slot.time)}`}>
                            <p>Status: {slot.isBooked ? 'Booked' : 'Available'}</p>
                            <Button type={slot.isBooked ? 'danger' : 'primary'} onClick={() => toggleAvailability(slot._id, slot.isBooked)}>
                                {slot.isBooked ? 'Make Available' : 'Mark as Booked'}
                            </Button>
                            <Button onClick={() => deleteTimeslot(slot._id)}>Delete Timeslot</Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default TimeslotList;
