import chai from 'chai'
import supertest from 'supertest'
import { ProductService } from '../src/services/index.js';

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing E-Commerce - Ruta api/products - Method GET', function() {
    beforeEach(async function() {
        try {
            await requester.post('/session/login').send({
                email: "jorgeperez@gmail.com",
                password: "secret"
            });
        } catch(err) {}
    })
    it('Debería devolver Status 200 si existen Productos que mostrar', async () => { //por mas que haga una autenticacion, esta fallando por el passportCall('jwt')
        const response = await requester.get('/api/products');
        expect(response.status).to.equal(200)
    });
});
