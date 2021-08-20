/**
 * Primary file for extracting proper schema structured objects
 */

import dataToString from "../../helpers/date";
import User from "../../models/user";

/**
 * Get usser object with schema typeing
 * @param id
 */

const getUser = async (id: string) => {
  try {
    const user: any = await User.findById(id);
    return {
      ...user._doc,
      _id: user.id,
      createdAt: dataToString(user._doc.createdAt),
      updatedAt: dataToString(user._doc.updatedAt),
    };
  } catch (e) {
    throw new Error(e);
  }
};

const transformUser = (user: any) => {
  return {
    ...user._doc,
    _id: user.id,
    createdAt: dataToString(user._doc.createdAt),
    updatedAt: dataToString(user._doc.updatedAt),
  };
};

export { getUser, transformUser };
