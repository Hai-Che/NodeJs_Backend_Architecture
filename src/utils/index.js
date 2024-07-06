"use strict";

import pkg from "lodash";

const { pick } = pkg;
const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

export { getInfoData };
