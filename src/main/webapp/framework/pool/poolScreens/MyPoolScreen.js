PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.MyPoolScreen = MyPoolScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(MyPoolScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.poolScreens.MyPoolScreen
	 */
	function MyPoolScreen() {

		MyPoolScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
		var _container = null;
		var _poolTable = null;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance()
					.getSegment("myPoolSeg.xml", null, _init);
		}

		function _init(data) {
			_container = $('#' + PoolConstants.RIGHT_CONTENT);
			_container.html(data);

			var params = {};
			objRef.fireCommand(PoolConstants.MY_POOL_COMMAND, [ params,
					_renderPools, _renderPoolsFailed ]);
		}

		function _renderPools(data) {
			data = data;
			_poolTable = new CarPoolTable("poolTable");
			_poolTable.onRowClick(_onClick);
			_poolTable.clear();
			_poolTable.addRows(data);
		}

		function _renderPoolsFailed(data) {
			data = data;
		}

		function _onClick(elementId, poolTable) {

			if (elementId.startsWith("_delete")) {
				var poolId = elementId.split(":")[1];
				objRef.fetch("deletepool/" + poolId,

				function(data) {
					_poolTable.deleteRow($(document.getElementById(elementId)).closest('tr')
							.get(0));
				});
			} else if (elementId.startsWith("_leave")) {
				var poolId = elementId.split(":")[1];
				
				objRef.fetch("leavePool/" + poolId, function(data) {
					_poolTable.deleteRow($(document.getElementById(elementId))
							.closest('tr').get(0));
				});
			} else {
				var params = {};
				params["poolId"] = elementId;
				objRef.navigateTo(PoolConstants.CREATE_UPDATE_POOL_SCREEN,
						params);
			}
		}
	}

	function CarPoolTable(id) {
		var that = this;		
		
		var PoolUtil = PROJECT.pool.util.PoolUtil.getInstance();
		
		
		var _jTable = null;
		var _id = id;
		var _callBackFun = null;

		that.addRow = addRow;
		that.addRows = addRows;
		that.destroy = destroy;
		that.clear = clear;
		that.onRowClick = onRowClick;
		that.deleteRow = deleteRow;

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
											'sWidth' : '18%',
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
											'sWidth' : '18%',
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
											'sTitle' : "Owner Name",
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
											'sTitle' : "Pickup/Start Time",
											'sWidth' : '5%',
											'sType' : 'string-case',
											'data' : 'pickupTime',
											'render' : function(cellData, type,
													rowData) {												
												return PoolUtil.convertSecondsToTime(cellData);
											}
										},
										{
											'sTitle' : "Start Date",
											'sWidth' : '12%',
											'sType' : 'string-case',
											'data' : 'startDate',
											'render' : function(cellData, type,
													rowData) {
												
												var date = new Date(1970, 0, 1);
												date.setSeconds(cellData);												
												return PoolUtil.convertDateToString(date);
											}
										},
										{
											'sTitle' : "End Date",
											'sWidth' : '12%',
											'sType' : 'string-case',
											'data' : 'endDate',
											'render' : function(cellData) {
												var date = new Date(1970, 0, 1);
												date.setSeconds(cellData);
												return PoolUtil.convertDateToString(date);
											}
										},
										{
											'sTitle' : "Cost/Earnings per Tsrip",
											'sWidth' : '10%',
											'sType' : 'string-case',
											'data' : 'cost',
											'render' : function(cellData) {
												return cellData;
											}
										},
										{
											'sTitle' : "Delete",
											'sWidth' : '5%',
											'sType' : 'string-case',
											'mDataProp' : 'carPoolId',
											"mRender" : function(data, type,
													rowData) {
												if (rowData.isOwner) {
													return '<a href="javascript:void(0)" id="_delete:'
															+ data
															+ '">Delete</a>';
												} else {
													return '<a href="javascript:void(0)" id="_leave:'
															+ data
															+ '">Leave</a>';
												}
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
													+ "' >" + index + "</a>");

									$(nRow).find("td:first > a, td:last > a")
											.click(
													function() {
														_callBackFun($(this)
																.attr("id"),
																that);
													});

									return nRow;s
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

})();