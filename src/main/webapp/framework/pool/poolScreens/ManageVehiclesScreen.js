PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.ManageVehiclesScreen = ManageVehiclesScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(ManageVehiclesScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * 
	 * 
	 * @class PROJECT.pool.map.GooglePoolMap
	 */
	function ManageVehiclesScreen(containerElemId, params) {

		SearchPoolScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;

		var _containerElemId = containerElemId

		var _container = null;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("manageVehiclesSeg.xml",
					null, _init);
		}

		function _init(data) {

			_container = $('#' + _containerElemId);
			_container.html(data);

		}
	}
})();