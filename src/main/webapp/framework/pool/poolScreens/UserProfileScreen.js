PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.UserProfileScreen = UserProfileScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(UserProfileScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.poolScreens.UserProfileScreen
	 */
	function UserProfileScreen(containerId, userId) {

		UserProfileScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
		var _container = null;
		var _containerElemId = containerId;
		var _userId = userId;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("userDetails.xml", null,
					_init);
		}

		function _init(data) {
			_container = $('#' + _containerElemId);
			_container.html(data);

			if (_userId) {
				objRef.get(PoolConstants.GET_USER_DETAILS_COMMAND + "/"
						+ _userId, [ {}, _renderUserDetails, _fetchingFailed ]);
			} else {
				objRef.get(PoolConstants.GET_CURRENT_USER_DETAILS_COMMAND, [
						{}, _renderUserDetails, _fetchingFailed ]);
			}
		}

		function _renderUserDetails(data) {
			$("#name").val(data["firstName"] + " " + data["lastName"]);
			$("#email").val(data["email"]);
			$("#gender").val(data["gender"]);
			$("#drivingLicenseNo").val(data["drivingLicense"]);
			$("#contactNo").val(data["contactNo"]);
			$("#city").val(data["city"]);
			$("#state").val(data["state"]);
			$("#country").val(data["country"]);
			$("#address").val(data["address"]);
			$("#birthday").val(data["birthday"]);
		}

		function _fetchingFailed() {
		}
	}

})();