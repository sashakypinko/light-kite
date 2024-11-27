import HttpException from './http.exception';

export default class BadRequestException extends HttpException {
  constructor(message: any) {
    super(400, message);
  }
}