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
		var _data = {};

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("myRequestsPage.xml", null,
					_init);
		}

		function _init(data) {
			_container = $('#' + _containerElemId);
			_container.html(data);

			objRef.get(PoolConstants.GET_SENT_REQUESTS_COMMAND, [ {},
					_renderRequests, _fetchingFailed ]);
		}

		function _renderRequests(data) {
			var sentReqdata = null;
			var recvReqdata = null;

			if (data) {
				sentReqdata = data["sentRequests"];
				recvReqdata = data["receivedRequests"];
			}
			_renderSentRequests(sentReqdata);
			_renderReceivedRequests(recvReqdata);
			$(".requestTable a").click(_showCarPoolMap);
		}

		function _fetchingFailed() {
		}
		
		function _showCarPoolMap(e) {
			var target = $(e.target);
			var reqData = _data[$(target).attr("requestId")];

			if (reqData) {
				_openDialog(reqData["carPoolId"], reqData["pickupLattitude"],
						reqData["pickupLongitude"]);
			}
		}

		function _renderReceivedRequests(data) {

			var html = "";
			var valArray = data;

			if (valArray != null) {

				html = "<table class='requestTable'><thead><tr><th>SNo.</th><th>From User</th><th>Pickup Time</th><th>Request Date</th><th>Accept/Reject</th></tr></thead><tbody>";

				for (var i = 0; i < valArray.length; i++) {
					var row = valArray[i];

					_data[row["requestId"]] = row;

					var date = new Date(1970, 0, 1);
					date.setSeconds(row["createDate"]);

					html = html + "<tr>";
					html = html + "<td><a requestId=" + row["requestId"] + "  id='" + row["carPoolId"]
							+ "' href='javascript:void(0)' >" + i + "</a></td>";

					html = html + "<td>" + row["fullName"] + "</td>";
					html = html + "<td>"
							+ _convertSecondsToTime(row["startTime"]) + "</td>";
					html = html + "<td>" + date.toString() + "</td>";
					html = html
							+ "<td>"
							+ '<button requestId="'	+ row["requestId"] 	+ '" id="acceptRequest" type="button">Accept</button>  <button requestId="'	+ row["requestId"] 	+ '" id="rejectRequest" type="button">Reject</button> '
							+ "</td>";
					html = html + "</tr>";
				}
			}
			html = html + "</tbody></table>";
			$("#receivedRequests").html(html);
			_applyEffect();
			
			$("button#acceptRequest").click(_acceptRequest);
			$("button#rejectRequest").click(_rejectRequest);
		}

		function _acceptRequest(e) {
			var target = $(e.target);
			var reqData = _data[$(target).attr("requestId")];

			if (reqData) {

				var params = {};
				params["requestId"] = reqData["requestId"];
				objRef.post(PoolConstants.ACCEPT_JOIN_REQUEST_COMMAND, [
						params, _acceptedSuccessful, _acceptedFailed ]);

				function _acceptedSuccessful() {
					$(".requestTable button[requestId='"+ reqData["requestId"] + "']").attr("disabled", "disabled");

					$(".requestTable button[requestId='"+ reqData["requestId"] + "']").parent().html("Accepted");
				}
				
				function _acceptedFailed() {
				}
			}
		}

		function _rejectRequest(e) {
			var target = $(e.target);
			var reqData = _data[$(target).attr("requestId")];

			if (reqData) {

				var params = {};
				params["requestId"] = reqData["requestId"];
				objRef.post(PoolConstants.REJECT_JOIN_REQUEST_COMMAND, [
						params, _rejectSuccessful, _rejectFailed ]);

				function _rejectSuccessful() {
					$(".requestTable button[requestId='"+ reqData["requestId"] + "']").attr("disabled", "disabled");
					$(".requestTable button[requestId='"+ reqData["requestId"] + "']").parent().html("Rejected");
				
				
				}
				
				function _rejectFailed() {
				}
			}
		}

		function _renderSentRequests(data) {

			var html = "";
			var valArray = data;

			if (valArray != null) {

				html = "<table class='requestTable'><thead><tr><th>SNo.</th><th>Car Pool Owner</th><th>Pickup Time</th><th>Request Date</th><th>Status</th></tr></thead><tbody>";

				for (var i = 0; i < valArray.length; i++) {
					var row = valArray[i];
					_data[row["requestId"]] = row;

					var date = new Date(1970, 0, 1);
					date.setSeconds(row["createDate"]);

					html = html + "<tr>";
					html = html + "<td><a requestId=" + row["requestId"] + " id='" + row["carPoolId"]
							+ "' href='javascript:void(0)' >" + i + "</a></td>";

					html = html + "<td>" + row["ownerName"] + "</td>";
					html = html + "<td>"
							+ _convertSecondsToTime(row["startTime"]) + "</td>";
					html = html + "<td>" + date.toString() + "</td>";
					html = html + "<td>" + _getStatus(row["status"]) + "</td>";
					html = html + "</tr>";
				}
			}
			html = html + "</tbody></table>";
			$("#sentRequests").html(html);
			_applyEffect();
		}
		
		function _showCarPoolMap(e) {
			var target = $(e.target);
			var reqData = _data[$(target).attr("requestId")];

			if (reqData) {
				_openDialog(reqData["carPoolId"], reqData["pickupLattitude"],
						reqData["pickupLongitude"]);
			}
		}

		function _getStatus(status) {
			if (!status) {
				return "Pending"
			}
			return (row["status"] == 1 ? 'Accepted' : 'Rejected');
		}

		function _applyEffect() {

			$('.tabs .tab-links a').on(
					'click',
					function(e) {
						var currentAttrValue = jQuery(this).attr('href');
						// Show/Hide Tabs
						jQuery('.tabs ' + currentAttrValue).show().siblings()
								.hide();
						// Change/remove current tab to active
						jQuery(this).parent('li').addClass('active').siblings()
								.removeClass('active');
						e.preventDefault();
					});
		}

		function _openDialog(carpoolId, pickupLattitude, pickupLongitude) {
			SegmentLoader.getInstance().getSegment("mapDialog.xml", null,
					initDialog);

			function initDialog(data) {
				$("body").append(data);
				var dialogId = "dialogId";			

				var params = {};
				params["poolId"] = carpoolId;
				params["readOnly"] = true;
				var screen = new PROJECT.pool.poolScreens.CreateUpdatePoolScreen(
						dialogId, params);	
				
				$("#dialogId").dialog({
					height : 700,
					width : 800,
					draggable : false,
					modal : false,
					open : function() {
						$('.ui-widget-overlay').addClass('custom-overlay');
					},
					close : function() {
						$('.ui-widget-overlay').removeClass('custom-overlay');
						screen.destroy();
						$(this).dialog('close');
						 $(this).remove();
						 $("#dialog").remove();
					}
				});

				screen.render();

				screen.markPoint(pickupLattitude, pickupLongitude);
			}
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