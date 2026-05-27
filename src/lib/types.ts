// Contains types that we'll use when doing CRUD-operations.
// How to use:
// To specify the correct return type for a CRUD function,
// you write like this:
//
// async function example(): Promise<Result<[data type to be used]>> {
//     const data = "testestest";
//     return { success: true, data: data };
// }

type SuccessResult<T> = {
    success: true;
    data: T;
};

type ErrorResult<T = string> = {
    success: false;
    error: T;
};

type Result<TData, TError = string> = SuccessResult<TData> | ErrorResult<TError>;

export type { SuccessResult, ErrorResult, Result };
