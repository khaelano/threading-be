type ServerResponse<T> = {
  code: number;
  result: string;
  message: string | null;
  data: T | null;
};

function ok<T>(data: T): ServerResponse<T> {
  return {
    code: 200,
    result: "OK",
    data,
  } as ServerResponse<T>;
}

function err<T>(code: number, message: string): ServerResponse<T> {
  const codeMessage: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    500: "Internal Error",
  };

  const result = codeMessage[code] || "Unknown Error";

  return {
    code,
    result,
    message,
  } as ServerResponse<T>;
}

export { ok, err };
