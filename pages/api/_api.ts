export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
}

export type APIMetaType = {
    status: number,
    createdAt?: string,
    updatedAt?: string,
    action: string|HttpMethod
}
