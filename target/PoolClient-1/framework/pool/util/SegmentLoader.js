PROJECT.namespace("PROJECT.pool.util");

(function() {

	/* Singleton Class Declaration */
	PROJECT.pool.util.SegmentLoader = SegmentLoader;

	/**
	 * Utility class that can be used to load the view segment files
	 * 
	 * @class PROJECT.util.SegmentLoader
	 */
	function SegmentLoader() {
		if (SegmentLoader.caller != SegmentLoader.getInstance) {
			throw new Error("This is a singleton class.");
		}

		var objRef = this;

		/* Aliases */
		var Hashtable = PROJECT.pool.util.Hashtable;
		var RMAConstants = PROJECT.pool.PoolConstants;

		/* private properties */
		var _segmentData = '';
		var _segmentCacheInst = null;
		var MODULE_PATH = "framework/pool/segments/";

		/* public properties */
		objRef.getSegment = getSegment;

		/**
		 * returns XML segment
		 * 
		 * @function {public String} getSegment
		 * @param {String}
		 *            segmentName - segment name
		 * @param {String}
		 *            modulePath - module path
		 * @returns segment
		 */
		function getSegment(segmentName, modulePath) {
			if (!modulePath) {
				modulePath = MODULE_PATH;
			}

			var location = modulePath + segmentName;
			_segmentData = _getSegmentCache().get(location);

			if (_segmentData === undefined || _segmentData === null
					|| _segmentData === '') {

				$.ajax({
					type : "GET",
					url : location,
					async : false,
					dataType : 'text',
					success : _loadSegment
				});
			}

			_getSegmentCache().put(location, _segmentData);

			return _segmentData;
		}

		function _loadSegment(responseData, status) {
			_segmentData = responseData;
		}

		function _getSegmentCache() {
			if (_segmentCacheInst == null) {
				_segmentCacheInst = new Hashtable();
			}
			return _segmentCacheInst;
		}
	}

	/**
	 * returns the singleton instance of the function
	 * 
	 * @function {public static} getInstance
	 */
	SegmentLoader.getInstance = function() {
		if (!SegmentLoader.instance) {
			SegmentLoader.instance = new SegmentLoader();
		}
		return SegmentLoader.instance;
	}
}());