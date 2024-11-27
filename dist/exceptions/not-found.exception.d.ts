import HttpException from './http.exception';
export default class NotFoundException extends HttpException {
    constructor(message?: string);
}
