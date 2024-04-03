import {request} from "express";

export class RoleDto {
    roles: "admin" | "user";
    cookie: string;
    request: any;
}