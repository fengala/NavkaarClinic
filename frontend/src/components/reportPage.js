import React, { useState } from 'react';
import axios from 'axios';
import { DatePicker, TimePicker, Button, Row, Col, Statistic, Card } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ReportPage = () => {
    const [dateRange, setDateRange] = useState([]);
    const [timeRange, setTimeRange] = useState([]);
    const [reportData, setReportData] = useState(null);

    const fetchReportData = async () => {
        const [startDate, endDate] = dateRange;
        const [startTime, endTime] = timeRange.map(time => time && moment(time).format('HH:mm'));

        try {
            const { data } = await axios.post('/api/timeslots/reports', {
                startDate: startDate && startDate.format('YYYY-MM-DD'),
                endDate: endDate && endDate.format('YYYY-MM-DD'),
                startTime,
                endTime
            });
            setReportData(data.data);
        } catch (error) {
            console.error('Failed to fetch report data:', error);
            alert('Failed to fetch report data');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16}>
                <Col span={12}>
                    <RangePicker
                        format="YYYY-MM-DD"
                        onChange={setDateRange}
                    />
                </Col>
                <Col span={12}>
                    <TimePicker.RangePicker
                        format="HH:mm"
                        use12Hours
                        onChange={setTimeRange}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Button type="primary" onClick={fetchReportData}>Generate Report</Button>
            </Row>
            {reportData && (
                <Row gutter={16} style={{ marginTop: '20px' }}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Available Timeslots"
                                value={reportData.available}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Booked Timeslots"
                                value={reportData.booked}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default ReportPage;
