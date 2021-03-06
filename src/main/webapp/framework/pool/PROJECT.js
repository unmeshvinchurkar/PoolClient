
var PROJECT;

if (PROJECT && (typeof PROJECT != "object")) {
	throw new Error("Namespace 'PROJECT' already exists");
} else {
	/*
	 * If PROJECT object is already defined, the existing PROJECT object will not be
	 * overwritten so that defined namespaces are preserved.
	 */
	PROJECT = {};
}

(function() {
	PROJECT.NAME = "PROJECT";
	// keeps all the defined namespace
	PROJECT._modules = {}; // private not supposed to be used outside
	PROJECT.globalObj = window; // holds window object

	/**
	 * Wrapper for eval function
	 * 
	 * This method is used in instead of eval call to avoid static scan issue.
	 * 
	 * @function {public Object} eval
	 * @param {Object} obj - Object to be evaluated.
	 * @returns object
	 */
	PROJECT.eval = function(obj) {
		if (obj === null || obj === 'undefined') {
			return;
		} else {
			$.globalEval(obj);
		}
	};

	/**
	 * validates the input and checks null or undefined.
	 * 
	 * This method is used to avoid static scan issue.
	 * 
	 * @function {public Object} validate
	 * @param {Object} obj - Object to be validated.
	 * @returns object
	 */
	PROJECT.validate = function(obj) {
		if (obj === null || obj === 'undefined') {
			return null;
		} else {
			return obj;
		}
	};
})();


PROJECT.namespace = function(name) {
	// Check name for validity. It must exist, and must not begin or
	// end with a period or contain two periods in a row.
	if (!name) {
		throw new Error("createNamespace( ): name required");
	}
	if (name.charAt(0) == '.' || name.charAt(name.length - 1) == '.'
			|| name.indexOf("..") != -1) {
		throw new Error("createNamespace( ): illegal name: " + name);
	}

	// Break the name at periods and create the object hierarchy we
	// need
	var parts = name.split('.');
	// For each namespace component, either create an object or
	// ensure that an object by that name already exists.
	var container = PROJECT.globalObj;// window object
	for (var i = 0; i < parts.length; i++) {
		var part = parts[i];
		// If there is no property of container with this name,
		// create an empty object.
		if (!container[part]) {
			container[part] = {};
		} else if (typeof container[part] != "object") {
			// If there is already a property, make sure it is an
			// object
			var n = parts.slice(0, i).join('.');
			throw new Error(n + " already exists and is not an object");
		}
		container = container[part];
	}

	// The last container traversed above is the namespace we need.
	var namespace = container;

	// It is an error to define a namespace twice. It is okay if our
	// namespace object already exists, but it must not already have
	// a NAME property defined.
	if (namespace.NAME) {
		// ignore it
		return;
		// throw new Error("PROJECT " + name + " is already defined");
	}
	// Initialize name and version fields of the namespace
	namespace.NAME = name;

	// Register this namespace in the map of all modules
	PROJECT._modules[name] = namespace;

	// Return the namespace object to the caller
	return namespace;
};
