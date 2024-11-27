import HttpException from './http.exception';

export default class AccessDeniedException extends HttpException {
  constructor(message: string = 'Access denied') {
    super(403, message);
  }
}