PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.PoolCalendarScreen = PoolCalendarScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(PoolCalendarScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.map.PoolCalendarScreen
	 */
	function PoolCalendarScreen(containerElemId) {

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
		objRef.getCarPoolId = getCarPoolId;
		objRef.setCarPoolId = setCarPoolId;

		function setCarPoolId(carPoolId) {
			_carPoolId = carPoolId;
		}

		function getCarPoolId() {
			return _carPoolId;
		}

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

		function _renderPools(data) {
			_poolTable = new CarPoolTable("poolTable");
			_poolTable.onRowClick(_showCalendar);
			_poolTable.addRows(data);
		}

		function _renderPoolsFailed() {
		}

		function _showCalendar(carPoolId, poolTable) {

			objRef.setCarPoolId(carPoolId);
			SegmentLoader.getInstance().getSegment("calendar.xml", null,
					_loadCalendar);
		}

		function _loadCalendar(data) {
			var date = new Date();
			_container = $('#' + _containerElemId);
			_container.html(data);

			var arguments = [];
			var params = {};
			params["carPoolId"] = objRef.getCarPoolId();
			params["year"] = date.getFullYear();
			params["month"] = date.getMonth() + 1;
			arguments.push(params);
			arguments.push(_drawCalendar);
			objRef.get(PoolConstants.GET_CALENDAR_COMMAND, arguments);
		}

		function _prevMonthClickHandler() {
			$('#calendar').fullCalendar('prev');
			var month = $('#calendar').fullCalendar('getDate').getMonth();
			var year = $('#calendar').fullCalendar('getDate').getYear();

			var arguments = [];
			var params = {};
			params["carPoolId"] = objRef.getCarPoolId();
			params["year"] = year;
			params["month"] = month;
			arguments.push(params);
			arguments.push(_renderMonth);
			objRef.get(PoolConstants.GET_CALENDAR_COMMAND, arguments);
		}

		function _nextsMonthClickHandler() {
			$('#calendar').fullCalendar('next');
			var month = $('#calendar').fullCalendar('getDate').getMonth();
			var year = $('#calendar').fullCalendar('getDate').getYear();

			var arguments = [];
			var params = {};
			params["carPoolId"] = objRef.getCarPoolId();
			params["year"] = year;
			params["month"] = month;
			arguments.push(params);
			arguments.push(_renderMonth);
			objRef.get(PoolConstants.GET_CALENDAR_COMMAND, arguments);
		}

		function _drawCalendar(data) {

			var date = new Date();

			$('#calendar').fullCalendar(
					{
						customButtons : {
							previousMonth : {
								text : 'Previous Month',
								click : _prevMonthClickHandler
							},
							nextMonth : {
								text : 'Next Month',
								click : _nextsMonthClickHandler
							}
						},
						header : {
							left : 'previousMonth ,nextMonth',
							center : 'title',
							right : ''
						},
						defaultDate : date.getFullYear() + "-"
								+ (date.getMonth() + 1) + "-1",
						// selectable : true,
						selectHelper : true,
						dayClick : _dayClick,
						editable : true,
						eventLimit : true,
						events : []
					});

			_renderMonth(data);
		}

		function _renderMonth(data) {
			
			var poolHolidays = data["poolHolidays"];
			var isOwner = data.isOwner;
			
			$('#calendar').fullCalendar('removeEvents');
			
			if (poolHolidays) {
				for (var i = 0; i < poolHolidays.length; i++) {

					var holiday = poolHolidays[i];
					var title = "MyHoliday";

					if (!isOwner) {
						title = "PoolHoliday";
					}

					var date = new Date(holiday.date * 1000);
					var dateStr = date.getFullYear() + '-'
							+ (date.getMonth() + 1) + '-' + date.getDate();

					var eventData = {
						id : title + dateStr,
						title : title,
						start : date,
						end : date
					};
					$('#calendar').fullCalendar('renderEvent', eventData, true);
				}
			}
		}

		function _dayClick(date, jsEvent, view) {
			date = date.toDate();
			var startDate = new Date(date.getFullYear(), date.getMonth(), date
					.getDate(), 0, 0, 0);
			var endDate = new Date(date.getFullYear(), date.getMonth(), date
					.getDate(), 0, 0, 0);

			var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1)
					+ '-' + date.getDate();

			var timeInSec = startDate.getTime() / 1000;

			var events = [];

			// Collect all events of the day
			$('#calendar').fullCalendar(
					'clientEvents',
					function(event) {
						var eventDate = event.start.toDate();
						var eventDateStr = eventDate.getFullYear() + '-'
								+ (eventDate.getMonth() + 1) + '-'
								+ eventDate.getDate();

						if (eventDateStr == dateStr
								&& event._id == "MyHoliday" + eventDateStr) {
							events.push(event);
						}
					});

			var found = false;

			for (var i = 0; i < events.length; i++) {
				var eventObj = events[i];

				$('#calendar').fullCalendar('removeEvents', function(event) {

					if (eventObj == event) {
						_unmarkHoliday(objRef.getCarPoolId(), timeInSec);
						found = true;
						return true;
					}
				});
			}

			if (!found) {
				_markHoliday(objRef.getCarPoolId(), timeInSec,
						markHolidaySuccess);

				function markHolidaySuccess() {
					var title = "MyHoliday";
					var eventData = {
						id : "MyHoliday" + dateStr,
						title : title,
						start : dateStr,
						end : dateStr
					};
					$('#calendar').fullCalendar('renderEvent', eventData, true);
				}
			}
		}

		function _markHoliday(carPoolId, timeInSec, successFunction) {
			var arguments = [];
			var params = {};
			params["carPoolId"] = carPoolId;
			params["timeInSec"] = timeInSec;
			arguments.push(params);
			arguments.push(successFunction);
			objRef.post(PoolConstants.MARK_HOLIDAY_COMMAND, arguments);
		}

		function _unmarkHoliday(carPoolId, timeInSec) {
			var arguments = [];
			var params = {};
			params["carPoolId"] = carPoolId;
			params["timeInSec"] = timeInSec;
			arguments.push(params);
			objRef.post(PoolConstants.UNMARK_HOLIDAY_COMMAND, arguments);
		}

		function CarPoolTable(id) {
			var that = this;
			var _jTable = null;
			var _id = id;
			var _callBackFun = null;

			that.addRow = addRow;
			that.addRows = addRows;
			that.destroy = destroy;
			that.onRowClick = onRowClick;

			_initialize();

			function onRowClick(callBack) {
				_callBackFun = callBack;
			}

			function deleteRow(row) {
				_jTable.fnDeleteRow(row);
			}

			function destroy() {
				try {
					if (_jTable) {
						_jTable.fnDestroy();
					}
				} catch (e) {
				}
				_jTable = null;
				$('#' + _id).html("");
			}

			function _initialize() {

				_jTable = $('#' + _id)
						.dataTable(
								{

									"aoColumns" : [
											{
												'sTitle' : "SN",
												'sWidth' : '5%',
												'mDataProp' : "carpoolName" // dummy
											// property
											},
											{
												'sTitle' : "Start Address",
												'sWidth' : '40%',
												'sType' : 'string-case',
												'mDataProp' : 'srcArea',
												"bUseRendered" : true,
												'fnRender' : function(o) {
													return "<span style='display:block;overflow:hidden;width:100%;' title='"
															+ o.aData["srcArea"]
															+ "'>"
															+ o.aData["srcArea"]
															+ "</span>";
												}
											},
											{
												'sTitle' : "End Address",
												'sWidth' : '40%',
												'sType' : 'string-case',
												'mDataProp' : 'destArea',
												"bUseRendered" : true,
												'fnRender' : function(o) {
													return "<span style='display:block;overflow:hidden;width:100%;' title='"
															+ o.aData["destArea"]
															+ "'>"
															+ o.aData["destArea"]
															+ "</span>";
												}
											},

											{
												'sTitle' : "owner Name",
												'sWidth' : '10%',
												'sType' : 'string-case',
												'mDataProp' : 'carpoolName',
												"bUseRendered" : true,
												'fnRender' : function(o) {
													return "<span style='display:block;overflow:hidden;width:100%' title='"
															+ o.aData["carpoolName"]
															+ "'>"
															+ o.aData["carpoolName"]
															+ "</span>";
												}
											},
											{
												'sTitle' : "PickUp Time",
												'sWidth' : '9%',
												'sType' : 'string-case',
												'mDataProp' : 'startTime',
												"bUseRendered" : true,
												'fnRender' : function(o) {
													return o.aData["startTime"] / (3600);
												}
											} ],
									"bInfo" : false,
									"bFilter" : false,
									"pagingType" : "full_numbers",
									"iDisplayLength" : 25,
									"bLengthChange" : false,
									"aaSorting" : [ [ 1, "asc" ] ],
									"fnRowCallback" : function(nRow, aData,
											iDisplayIndex, iDisplayIndexFull) {
										// Populate index column
										var index = iDisplayIndex + 1;
										$("td:first", nRow).html(
												"<a href ='javascript:void(0)' id='"
														+ aData["carPoolId"]
														+ "' >" + index
														+ "</a>");

										$(nRow)
												.find(
														"td:first > a, td:last > a")
												.click(
														function() {
															_callBackFun(
																	$(this)
																			.attr(
																					"id"),
																	that);
														});

										return nRow;
									}
								});

				$('#' + _id).find("tbody").on('click', 'tr', function() {

					if ($(this).hasClass('selected')) {
						$(this).removeClass('selected');
					} else {
						_jTable.$('tr.selected').removeClass('selected');
						$(this).addClass('selected');
					}

					if (_callBackFun) {
						_callBackFun(this, $(this).hasClass('selected'));
					}
				});
			}

			function addRow(data) {
				_jTable.fnAddData([ data ]);
			}

			function addRows(dataArray) {
				if (dataArray && dataArray.length > 0) {
					_jTable.fnAddData(dataArray);
				}
			}

			function clear() {
				_jTable.fnClearTable();
			}
		}
	}
})();