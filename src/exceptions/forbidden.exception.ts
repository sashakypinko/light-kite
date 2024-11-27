import HttpException from './http.exception';

export default class ForbiddenException extends HttpException {
  constructor(message: string) {
    super(403, message);
  }
}