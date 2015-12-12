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

		MyRequestsScreen.superclass.constructor.call(this);

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
			objRef.get(PoolConstants.GET_SENT_REQUESTS_COMMAND, [ {},
					_renderRequests, _fetchingFailed ]);
		}

		function _renderRequests(data) {

			_container = $('#' + _containerElemId);

			var html = "<table class='sentRequestTable'><thead><tr><th>SNo.</th><th>Car Pool Owner</th><th>Pickup Time</th><th>Request Date</th><th>Status</th></tr></thead><tbody>";
			var valArray = data;

			if (valArray != null) {
				for (var i = 0; i < valArray.length; i++) {
					var row = valArray[i];
					html = html + "<tr>";
					html = html + "<td>" + i + "</td>";
					html = html + "<td>" + row["ownerName"] + "</td>";
					html = html + "<td>" + row["startTime"] + "</td>";
					html = html + "<td>" + row["createDate"] + "</td>";
					html = html + "<td>" + (row["status"] == 1 ? 'Accepted' : 'Rejected') + "</td>";
					html = html + "</tr>";
				}
			}
			html = html + "</tbody></table>";
			$(_container).html(html);
		}

		function _fetchingFailed() {
		}
	}
})();