import { Request } from "express";

export type RequestWithBodyType<T> = Request<{}, {}, T>;
export type RequestWithQueryType<T> = Request<{}, {}, {}, T>;
export type RequestWithParamsType<T> = Request<T>;
export type RequestWithParamsAndBodyType<T, B> = Request<T, {}, B>;

