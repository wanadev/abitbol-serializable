"use strict";

var cloneDeepWith = require("lodash/cloneDeepWith");

var serializers = {};

function addSerializer(name, functions) {
    functions.name = name;
    serializers[name] = functions;
}

function getSerializerFromObject(object) {
    if (object &&  object.__name__ && serializers[object.__name__]) {
        return serializers[object.__name__];
    }
    for (var k in serializers) {
        if (serializers[k].class && object instanceof serializers[k].class) {
            return serializers[k];
        }
    }
    return null;
}

function objectSerializer(object) {
    return cloneDeepWith(object, function(value) {
        if (typeof value != "object") {
            return;
        }
        var serializer = getSerializerFromObject(value);
        if (!serializer) {
            return;
        }
        var result = serializer.serialize(value);
        if (!result.__name__) {
            result.__name__ = serializer.name;
        }
        return result;
    });
}

function objectUnserializer(object) {
    return cloneDeepWith(object, function(value) {
        if (typeof value != "object" || value === null) {
            return;
        }
        if (!value.__name__) {
            return;
        }
        var serializer = getSerializerFromObject(value);
        if (!serializer) {
            return;
        }
        return serializer.unserialize(value);
    });
}

module.exports = {
    serializers: serializers,
    addSerializer: addSerializer,
    getSerializerFromObject: getSerializerFromObject,
    objectSerializer: objectSerializer,
    objectUnserializer: objectUnserializer
};
