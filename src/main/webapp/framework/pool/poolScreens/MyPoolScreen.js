PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.MyPoolScreen = MyPoolScreen;

	/**
	 * 
	 * 
	 * @class PROJECT.pool.poolScreens.MyPoolScreen
	 */
	function MyPoolScreen() {
		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
		var _container = null;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance()
					.getSegment("myPoolSeg.xml", null, _init);
		}

		function _init(data) {
			_container = $('#' + PoolConstants.GLOBAL_CONTAINER_DIV);
			_container.html(data);

			PoolCommands.getInstance().execute(PoolConstants.MY_POOL_COMMAND,
					[ params, _renderPools, _renderPoolsFailed ]);
		}

		function _renderPools(data) {

		}

		function _renderPoolsFailed(data) {

		}

	}

})();