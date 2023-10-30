export default class UserDTO {
    constructor(user) {
        this.id = user._id
        this.fullname = `${user.first_name} ${user.last_name}`
        this.email = user.email
    }
}