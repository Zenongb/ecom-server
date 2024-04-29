import { AuthError } from "../errors/errors.js";

import User from "../models/user.model.js"
import { hashPwd, comparePwd } from "../utils/hash.js";

import { ADMIN_USER } from "../config/constants.config.js";
import logger from "../utils/logger.js";

export default class UserService {
  constructor(usersDao) {
    this.dao = usersDao
  }

  async getUsers(query) {
    try {
      const users = await this.dao.readMany(query)
      const usersData = users.map(u => new User(u).toPOJO())
      return usersData
    } catch (err) {
      throw err
    }
  }

  async getUser(userId) {
    try {
      const userData = await this.dao.readOne({ _id: userId, populate: true })
      const user = new User(userData)
      return user.toPOJO() 
    } catch (err) {
      if (!!err.code) throw err
      throw new Error("Error al bucar el usuario", { cause: err })
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
      if (!!err.code) throw err
      throw new Error("Error al registrar el usuario", {cause: err})
    }
  }

  async loginUser(loginData) {
    try {
      let userData = await this.dao.readOne({ email: loginData.email });
      if (!userData) {
        throw new AuthError("Incorrect user or password")
      }
      const user = new User(userData)
      logger.log("debug", `user mail ${user.mail}`)
      // checkear si existe password
      if (user.hasPwd()) {
        if (!await comparePwd(loginData.password, user.password)) {
          throw new AuthError("Incorrect user or password")
        }
      }
      user.login_hist.push(Date.now());
      await this.dao.updateOne({_id: user.id}, user.toPOJO(true))
      return user.toPOJO()
    } catch (err) {
      // TODO: hacer prolijo
      if (!!err.code) throw err
      throw new Error("Login Error", { cause: err})
    }
  }

  async update(uid, data) {
    try {
      const res = await this.dao.updateOne({
        _id: uid,
      }, data)
      return new User(res).toPOJO()
    } catch (err) {
      if (!!err.code) throw err
      throw new Error("Error al actializar usuario", {cause: err})
    }
  }

}
