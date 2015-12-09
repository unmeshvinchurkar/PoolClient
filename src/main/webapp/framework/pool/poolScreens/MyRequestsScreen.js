PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.MyRequestsScreen = MyRequestsScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(MyRequestsScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.map.PoolCalendarScreen
	 */
	function MyRequestsScreen(containerElemId) {

		PoolCalendarScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;

		var _containerElemId = containerElemId;
		var _poolTable = null;
		var _carPoolId = null;
		var _isOwner = false;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("poolCalendar.xml", null,
					init);

			function init(data) {
				_container = $('#' + _containerElemId);
				_container.html(data);

				objRef.fireCommand(PoolConstants.MY_POOL_COMMAND, [ {},
						_renderPools, _renderPoolsFailed ]);
			}
		}
	}
})();