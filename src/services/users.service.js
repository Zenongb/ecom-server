
export class UserService {
  constructor(usersDao, userModel) {
    this.dao = usersDao
  }

  login(userData) {
    try {
      const user = new User(userData)
    } catch (err) {
      // los errores suben hasta el express handler
      throw err
    }

  }
}
