export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getAllPaginate = async(req) => await this.dao.getAllPaginate(req)
    getProductsFromCart = async(req) => await this.dao.getProductsFromCart(req)
    getById = async(id) => await this.dao.getById(id)
    create = async(data) => await this.dao.create(data)
    update = async(id, data) => await this.dao.update(id, data)
    delete = async(id) => await this.dao.delete(id)
}