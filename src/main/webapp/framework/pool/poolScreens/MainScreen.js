PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.MainScreen = MainScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(MainScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.poolScreens.MainScreen
	 */
	function MainScreen() {

		MainScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
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
			$("#myPools").click(_showMyPools);
			$("#searchPool").click(_searchPools);
			$("#manageVehicles").click(_manageVehicles);
			$("#poolCalendar").click(_poolCalendar);
			$("#logOut").click(_logout);
			$("#myRequests").click(_showMyRequests);
		}
		function _showMyRequests(e) {
			objRef.navigateTo(PoolConstants.POOL_MY_REQUESTS_SCREEN);
		}

		function _poolCalendar(e) {
			objRef.navigateTo(PoolConstants.POOL_CALENDAR_SCREEN);
		}

		function _manageVehicles(e) {
			objRef.navigateTo(PoolConstants.MANAGE_VEHICLE_SCREEN);
		}

		function _logout(e) {
			objRef.fireCommand("logout");
			objRef.navigateTo(PoolConstants.LOGIN_SCREEN);
		}

		function _createPool(e) {
			objRef.navigateTo(PoolConstants.CREATE_UPDATE_POOL_SCREEN);
		}

		function _showMyPools() {
			objRef.navigateTo(PoolConstants.MY_POOLS_SCREEN);
		}

		function _searchPools() {
			objRef.navigateTo(PoolConstants.SEARCH_POOL_SCREEN);
		}

	}
})();