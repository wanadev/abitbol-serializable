interface ISerializer {
    serialize(value: any): any
    unserialize(value: any): any
    class?: any
}

export function addSerializer(name: string, functions: any): void;

export function getSerializerFromObject(object: unknown): ISerializer;

export function objectSerializer(object: unknown): any;

export function objectUnserializer(object: unknown): any;

export const serializers: Record<string, ISerializer>;

