const request = require('supertest');
const server = require('../app');
const mongoose = require('mongoose');
const Train = require('../models/Train');
const Station = require('../models/Station');
require('dotenv').config();

let testTrainId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    const startStation = new Station({
        name: 'Station A',
        open_hour: '06:00',
        close_hour: '22:00',
        image: 'uneimage',
    });
    await startStation.save();

    const endStation = new Station({
        name: 'Station B',
        open_hour: '06:00',
        close_hour: '22:00',
        image: 'uneimage',
    });
    await endStation.save();

    const train = new Train({
        name: 'Train Test',
        start_station: startStation._id,
        end_station: endStation._id,
        time_of_departure: new Date(),
    });
    await train.save();


    testTrainId = train._id; 
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});

describe('Ticket API', () => {


    it('should reserve a ticket successfully', async () => {
        const response = await request(server)
            .post('/tickets') 
            .set('Accept', 'application/json')
            .send({ trainId: testTrainId }); 

        console.log('Response:', response.body); 

        expect(response.statusCode).toBe(200); 
        expect(response.body).toHaveProperty('message', expect.stringContaining('Billet réservé avec succès'));
        expect(response.body).toHaveProperty('ticket');
    });



    it('should validate a ticket successfully', async () => {
        const ticketResponse = await request(server)
            .post('/tickets')
            .set('Accept', 'application/json')
            .send({ trainId: testTrainId }); 

        const ticketId = ticketResponse.body.ticket._id; 

        const validateResponse = await request(server)
            .post('/tickets/validate') 
            .set('Accept', 'application/json')
            .send({ ticketId });

        expect(validateResponse.statusCode).toBe(200);
        expect(validateResponse.body).toHaveProperty('message', 'Ticket validé avec succès, bon voyage :-)');
    });
});
