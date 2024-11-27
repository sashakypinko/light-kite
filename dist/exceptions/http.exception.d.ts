export default class HttpException extends Error {
    statusCode: number;
    constructor(statusCode: number, message: any);
}
