const request = require('supertest');
const server = require('../app');
const mongoose = require('mongoose');
const Train = require('../models/Train');
const Station = require('../models/Station');
require('dotenv').config();

let testStartStationId; // explication de ces globales dans le test ticket
let testEndStationId;
let testTrainId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    const startStation = new Station({
        name: 'Station A',
        open_hour: '06:00',
        close_hour: '22:00',
        image: 'imageA.jpeg',
    });
    await startStation.save();
    testStartStationId = startStation._id;

    const endStation = new Station({
        name: 'Station B',
        open_hour: '06:00',
        close_hour: '22:00',
        image: 'imageB.jpeg',
    });
    await endStation.save();
    testEndStationId = endStation._id;

 
    const train = new Train({
        name: 'Train Test',
        start_station: testStartStationId,
        end_station: testEndStationId,
        time_of_departure: new Date(),
    });
    await train.save();
    testTrainId = train._id; 
});


afterAll(async () => {
    await mongoose.connection.close(); 
    server.close(); 
});
describe('Train test', () => {

    
    it('should create a new train', async () => {
        const newTrainData = {
            name: 'Nouveau Train',
            start_station: testStartStationId,
            end_station: testEndStationId,
            time_of_departure: new Date(),
        };
    
        const response = await request(server)
            .post('/trains')
            .set('Accept', 'application/json')
            .send(newTrainData); 
    
        expect(response.statusCode).toBe(200); 
        expect(response.body).toHaveProperty('message', 'Train bien ajouté.');
    });
    
    it('should fetch all trains', async () => {
        const response = await request(server).get('/trains/getAll').set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('trains');
        expect(response.body.trains.length).toBeGreaterThan(0); 
    });

    it('should fetch a specific train by ID', async () => {
        const response = await request(server).get(`/trains/${testTrainId}`).set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('train');
        expect(response.body.train._id).toBe(testTrainId.toString()); 
    });

    it('should update an existing train', async () => {
        const updatedTrainData = {
            name: 'Train Test Updated',
            start_station: testStartStationId,
            end_station: testEndStationId,
            time_of_departure: new Date(),
        };

        const response = await request(server)
            .put(`/trains/${testTrainId}`)
            .set('Accept', 'application/json')
            .send(updatedTrainData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Train bien modifié');
    });

    it('should delete an existing train', async () => {
        const response = await request(server)
            .delete(`/trains/${testTrainId}`)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Train bien supprimé');
    });
});
