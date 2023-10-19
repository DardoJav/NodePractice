import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing E-Commerce', () => {

    describe('Test de Carts', () => {

        it('Debe crear un carrito', async () => { //Esta fallando por el passportCall('jwt')
            const result = await requester.post('/api/carts')
            expect(result._body.payload).to.have.property('_id');
        });
    });
});
