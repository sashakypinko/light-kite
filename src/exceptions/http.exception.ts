export default class HttpException extends Error {
  statusCode: number;

  constructor(statusCode: number, message: any) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}