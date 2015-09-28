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

		function _renderPools(data) {
			_poolTable = new CarPoolTable("poolTable");
			_poolTable.onRowClick(_showCalendar);
			_poolTable.addRows(data);
		}

		function _renderPoolsFailed() {
		}

		function _showCalendar(tr, selected) {
			objRef.fetch("getCalendar", _drawCalendar);
		}
		
		
		function _drawCalendar(data){}
		

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
										$("td:first", nRow).html(index);

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