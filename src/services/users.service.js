
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

  async registerUser(user) {
    try {
      // hasheamos pwd
      if (user.email === ADMIN_USER.mail && user.password === ADMIN_USER.pwd) {
        user.role = "admin";
      }
      if (user.password) user.password = await hashPwd(user.password);
      let createResult = await this.create(user);
      console.log("in registerUser", createResult);
      createResult = createResult.toObject()
      delete user.password
      return createResult
    } catch (err) {
      // TODO: hacer prolijo
      throw new Error(err.message)
    }
  }

  async loginUser(loginData) {
    try {
      // hasheamos pwd
      let user = await this.findOne({ email: loginData.email });
      console.log("user")
      console.log(user)
      if (!user) {
        const errNotFound = new Error("User not found!");
        errNotFound.code = "ENOENT"
        throw errNotFound
      }
      // checkear si existe password
      if (user.password) {
        if (!await comparePwd(loginData.password, user.password)) {
          const errWrongPwd = new Error("Wrong email or password");
          errWrongPwd.code = "EBADREQ"
          throw errWrongPwd
        }
      }
      user.loginHist.push(Date.now());
      await user.save()
      user = user.toObject()
      delete user.password
      return user
    } catch (err) {
      // TODO: hacer prolijo
      throw err
    }
  }

}
