export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getAllPaginate = async(req) => await this.dao.getAllPaginate(req)
    getById = async(id) => await this.dao.getById(id)
    create = async(data, user) => await this.dao.create(data, user)
    update = async(id, data, user) => await this.dao.update(id, data, user)
    delete = async(id, user) => await this.dao.delete(id, user)
}