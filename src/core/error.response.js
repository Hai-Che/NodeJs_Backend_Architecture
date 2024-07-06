"use strict";

const StatusCode = {
  Forbidden: 403,
  Conflict: 409,
};

const ReasonStatusCode = {
  Forbidden: "Bad request error",
  Conflict: "Conflict error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.Conflict,
    statusCode = StatusCode.Conflict
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.Forbidden,
    statusCode = StatusCode.Forbidden
  ) {
    super(message, statusCode);
  }
}

export { ConflictRequestError, BadRequestError };
