import User from "../models/user.model.js"
import { hashPwd, comparePwd } from "../utils/hash.js";

import { ADMIN_USER } from "../config.js";

export default class UserService {
  constructor(usersDao) {
    this.dao = usersDao
  }

  async getUser(userId) {
    try {
      const userData = await this.dao.readOne({ _id: userId, populate: true })
      console.log(" in getUser, user is", userData)
      const user = new User(userData)
      return user.toPOJO() 
    } catch (err) {
      const outErr = new Error("Error al bucar el usuario", { cause: err })
      outErr.code = err?.code
      throw outErr
    }
  }

  async registerUser(user) {
    try {
      if (user.email === ADMIN_USER.mail && user.password === ADMIN_USER.pwd) {
        user.role = "admin";
      }
      user.password = await hashPwd(user.password)
      const userInst = new User(user)
      const result = await this.dao.create(userInst.toPOJO(true));
      const finalUser = new User(result)
      return finalUser.toPOJO()
    } catch (err) {
      // TODO: hacer prolijo
      throw err
    }
  }

  async loginUser(loginData) {
    try {
      console.log("login data is", loginData)
      let userData = await this.dao.readOne({ email: loginData.email });
      if (!userData) {
        const errNotFound = new Error("User not found!");
        errNotFound.code = "ENOENT"
        throw errNotFound
      }
      console.log("userData is", userData )
      const user = new User(userData)
      console.log(user.toPOJO(true))
      // checkear si existe password
      if (user.hasPwd()) {
        if (!await comparePwd(loginData.password, user.password)) {
          const errWrongPwd = new Error("Wrong email or password");
          errWrongPwd.code = "EBADREQ"
          throw errWrongPwd
        }
      }
      user.login_hist.push(Date.now());
      await this.dao.updateOne({_id: user.id}, user.toPOJO(true))
      console.log('userdata is', user)
      return user.toPOJO()
    } catch (err) {
      // TODO: hacer prolijo
      throw err
    }
  }

  async update(uid, data) {
    try {
      const res = await this.dao.updateOne({
        _id: uid,
      }, data)
      return new User(res).toPOJO()
    } catch (err) {
      throw new Error("Error al actializar usuario", {cause: err})
    }
  }

}
