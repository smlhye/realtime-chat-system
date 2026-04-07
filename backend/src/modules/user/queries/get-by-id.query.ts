import { IQuery } from "@nestjs/cqrs";

export class GetByIdQuery implements IQuery {
    constructor(
        public id: string,
    ) { }
}