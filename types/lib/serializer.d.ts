export function addSerializer(name: string, functions: any): void;

export function getSerializerFromObject(object: unknown): any;

export function objectSerializer(object: unknown): any;

export function objectUnserializer(object: unknown): any;

export const serializers: Record<string, any>;

