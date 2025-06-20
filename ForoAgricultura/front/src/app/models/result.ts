export class Result<T = void> {
  success: boolean;
  statusCode: number;
  error: string | null;  // Permite que `error` sea null
  data: T | null;  // Permite que `data` sea null

  private constructor(success: boolean, statusCode: number, error: string | null = null, data: T | null = null) {
    this.success = success;
    this.error = error;
    this.statusCode = statusCode;
    this.data = data;
  }

  throwIfError() {
    if (!this.success) {
      throw new Error(this.error || "Unknown error");
    }
  }

  static success<T = void>(statusCode: number, data: T | null = null): Result<T> {
    return new Result(true, statusCode, null, data);
  } 

  static error<T = void>(statusCode: number, error: string | null = null): Result<T> {
    return new Result(false, statusCode, error);
  }
}

  