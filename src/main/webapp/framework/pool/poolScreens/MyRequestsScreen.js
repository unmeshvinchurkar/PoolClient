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

					var date = new Date(1970, 0, 1);
					date.setSeconds(row["createDate"]);

					html = html + "<tr>";
					html = html + "<td><a id='" + row["carPoolId"]
							+ "' href='javascript:void(0)' >" + i + "</a></td>";
					
					html = html + "<td>" + row["ownerName"] + "</td>";
					html = html + "<td>"+ _convertSecondsToTime(row["startTime"]) + "</td>";
					html = html + "<td>" + date.toString() + "</td>";
					html = html + "<td>" + (row["status"] == 1 ? 'Accepted' : 'Rejected')
							+ "</td>";
					html = html + "</tr>";
				}
			}
			html = html + "</tbody></table>";
			$(_container).html(html);
		}

		function _fetchingFailed() {
		}

		function _convertSecondsToTime(timeInSeconds) {
			var unit = "AM";
			var hrs = parseInt(timeInSeconds / (3600));

			if (hrs >= 12) {
				unit = "PM";

				if (hrs >= 13) {
					hrs = hrs - 12;
				}
			}

			var remSeconds = parseInt(timeInSeconds % (3600));
			var secs = parseInt(remSeconds / 60);
			secs = secs > 9 ? secs : secs + "0";
			return hrs + ":" + secs + unit;
		}
	}
})();