"use strict";

import AccessService from "../services/access.service.js";
import { CREATED } from "../core/success.response.js";
class AccessController {
  signUp = async (req, res, next) => {
    // return res.status(201).json(await AccessService.signUp(req.body));
    new CREATED({
      message: "Registered Success",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

export default new AccessController();
