PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.MainScreen = MainScreen;

	/**
	 * 
	 * 
	 * @class PROJECT.pool.poolScreens.MainScreen
	 */
	function MainScreen() {
		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
		var CreateUpdatePoolScreen = PROJECT.pool.poolScreens.CreateUpdatePoolScreen;

		var _container = null;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("mainSeg.xml", null, _init);
		}

		function _init(data) {
			_container = $('#' + PoolConstants.GLOBAL_CONTAINER_DIV);
			_container.html(data);
			$("#createPool").click(_createPool);
		}

		function _createPool(e) {
			var screen = new CreateUpdatePoolScreen(PoolConstants.RIGHT_CONTENT);
			screen.render();
		}
	}

})();