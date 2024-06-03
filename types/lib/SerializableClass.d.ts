import Class from "abitbol";

export class SerializableClass extends Class {

    __init__(params: unknown): void;

    get id(): string;

    getId(): string;

    serialize(): any;

    unserialize(data: any): void;

    apply(data: any): void;

    clone(): any;

    static $unserialize(data: any): any;

    static $register(class_: any): void;

    static $addSerializer(name: string, functions: any): void;
}

