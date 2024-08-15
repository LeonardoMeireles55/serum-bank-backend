export class DefaultResponseDto {
  response: any;
  message: any;
  status: boolean;

  constructor(response: any, message: string | any, status: boolean) {
    this.response = response;
    this.message = message;
    this.status = status;
  }
}
