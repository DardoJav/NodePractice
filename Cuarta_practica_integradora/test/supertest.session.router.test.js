import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing E-Commerce', () => {
    const fakerName = faker.internet.userName();
    const fakerLastName = faker.internet.userName();
    const fakerEmail = faker.internet.email();
    // const randomNumber = Math.floor(Math.random() * Math.pow(10, 10));

    describe('Test de Sessions', () => {

        it('Debe registrar un usuario', async function () {
            this.timeout(5000); // Aumento el timeout porque tarda en registrar el usuario
            const user = {
                first_name: fakerName,
                last_name: fakerLastName,
                email: fakerEmail,
                // phone: randomNumber,
                age: 30,
                role: 'user',
                password: 'secret',
                // active: false,
                cart: null,
            };

            try {
                const response = await requester.post('/session/register').send(user);
                expect(response.status).to.equal(302); // 302 porque redirige a /session/login
            } catch (error) {
                throw error;
            }
        });
    });
});
