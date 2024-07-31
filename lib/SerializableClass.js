"use strict";

var Class = require("abitbol");
var helpers = require("./helpers.js");

var serializer = require("./serializer.js");

/**
 * Serializable class
 *
 * @class
 * @mixes Class
 */
var SerializableClass = Class.$extend({
    __name__: "SerializableClass",

    /**
     * @constructs
     * @param {Object} params Optional params that will be applied to the class.
     */
    __init__: function(params) {
        this.apply(params);
    },

    getId: function() {
        if (!this.$data.id) {
            this.$data.id = helpers.uuid4();
        }
        return this.$data.id;
    },

    /**
     * Serialize the current instance.
     *
     * @param serialize
     */
    serialize: function() {
        var serialized = {
            __name__: this.__name__,
            id: this.id
        };
        for (var prop in this.$map.computedProperties) {
            if (this.$map.computedProperties[prop].get &&
                this.$map.computedProperties[prop].set &&
                this.$map.computedProperties[prop].annotations.serializable !== false
            ) {
                if (this.$map.computedProperties[prop].annotations.serializer) {
                    serialized[prop] = serializer.serializers[this.$map.computedProperties[prop].annotations.serializer].serialize(this[prop]);
                } else if (typeof this[prop] == "object") {
                    serialized[prop] = serializer.objectSerializer(this[prop]);
                } else {
                    serialized[prop] = this[prop];
                }
            }
        }
        return serialized;
    },

    /**
     * Deserialize given data into the current instance.
     *
     * @param {object} data The data to unserialize.
     */
    unserialize: function(data) {
        if (!data) {
            return;
        }
        if (data.__name__ !== this.__name__) {
            throw new TypeError("WrongClassUnserialization");
        }
        if (data.id) {
            this.$data.id = data.id;
        }
        for (var prop in this.$map.computedProperties) {
            if (this.$map.computedProperties[prop].get &&
                this.$map.computedProperties[prop].set &&
                (this.$map.computedProperties[prop].annotations.serializable !== false)
            ) {
                if (data[prop] === undefined) {
                    continue;
                }
                if (this.$map.computedProperties[prop].annotations.serializer) {
                    this[prop] = serializer.serializers[this.$map.computedProperties[prop].annotations.serializer].unserialize(data[prop]);
                } else if (typeof data[prop] == "object") {
                    this[prop] = serializer.objectUnserializer(data[prop]);
                } else {
                    this[prop] = data[prop];
                }
            }
        }
    },

    /**
     * Apply given data to the current instance.
     *
     * @param {object} data The data to apply.
     */
    apply: function(data) {
        if (!data) {
            return;
        }
        if (data.id) {
            this.$data.id = data.id;
        }
        for (var prop in this.$map.computedProperties) {
            if (this.$map.computedProperties[prop].get && this.$map.computedProperties[prop].set) {
                if (data[prop] !== undefined) {
                    this[prop] = data[prop];
                }
            }
        }
    },

    /**
     * Clone this instance (only serializable properties are cloned).
     */
    clone: function() {
        var data = this.serialize();
        delete data.id;  // Do not clone the id!
        return this.$class.$unserialize(data);
    },

    __classvars__: {
        "$unserialize": function(data) {
            if (!data.__name__ || !serializer.serializers[data.__name__]) {
                throw new Error("MissingSerializer");
            }
            var sc = new serializer.serializers[data.__name__].class();
            sc.unserialize(data);
            return sc;
        },

        "$register": function(class_) {
            //_classes[sClass.prototype.__name__] = sClass;
            serializer.addSerializer(class_.prototype.__name__, {
                class: class_,
                serialize: function(class_) {
                    return class_.serialize();
                },
                unserialize: function(data) {
                    return SerializableClass.$unserialize(data);
                }
            });
        },

        $addSerializer: serializer.addSerializer
    }
});

// Register the class
SerializableClass.$register(SerializableClass);

module.exports = SerializableClass;
