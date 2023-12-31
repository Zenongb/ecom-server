import { genSalt, hash, compare } from "bcrypt"

export const hashPwd = async (pwd) => {
  try {
    const salt = await genSalt(10)
    return await hash(pwd, salt)
  } catch (err) {
    throw new Error("error trying to hash password", {cause: err})
  }
}

export const comparePwd = async (plainPwd, hashedPwd) => {
  try {
    return await compare(plainPwd, hashedPwd)
  } catch (err) {
    throw new Error("error trying to hash password", {cause: err})
  }
}
