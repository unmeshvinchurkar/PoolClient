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
			_poolTable.onRowClick(_openPool);
			_poolTable.clear();
			_poolTable.addRows(data);
		}

		function _renderPoolsFailed(data) {
			data = data;
		}

		function _openPool(poolId) {
			var params = {};
			params["poolId"] = poolId;
			objRef.navigateTo(PoolConstants.CREATE_UPDATE_POOL_SCREEN, params);
		}
	}

	function CarPoolTable(id) {
		var that = this;
		var _jTable = null;
		var _id = id;
		var _callBackFun = null;

		that.addRow = addRow;
		that.addRows = addRows;
		that.destroy = destroy;
		that.clear = clear;
		that.onRowClick = onRowClick;

		_initialize();

		function onRowClick(callBack) {
			_callBackFun = callBack;
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
								// "dom" : '<"top">rt<"bottom"ilp><"clear">',
								"aoColumns" : [
										{
											'sTitle' : "SN",
											'sWidth' : '5%',
											'mDataProp' : "carpoolName" // dummy
										// property
										},
										{
											'sTitle' : "Start Address",
											'sWidth' : '30%',
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
											'sWidth' : '30%',
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
											'sTitle' : "Start Time",
											'sWidth' : '5%',
											'sType' : 'string-case',
											'mDataProp' : 'startTime',
											"bUseRendered" : true,
											'fnRender' : function(o) {
												return o.aData["startTime"];
											}
										},
										{
											'sTitle' : "Start Date",
											'sWidth' : '5%',
											'sType' : 'string-case',
											'mDataProp' : 'startDate',
											"bUseRendered" : true,
											'fnRender' : function(o) {
												return o.aData["startDate"];
											}
										},
										{
											'sTitle' : "End Date",
											'sWidth' : '5%',
											'sType' : 'string-case',
											'mDataProp' : 'endDate',
											"bUseRendered" : true,
											'fnRender' : function(o) {
												return o.aData["endDate"];
											}
										},
										{
											'sTitle' : "Delete",
											'sWidth' : '5%',
											'sType' : 'string-case',
											'mDataProp' : 'carPoolId',
											"bUseRendered" : true,
											'fnRender' : function(o) {
												return "<input id ='"
														+ o.aData["carPoolId"]
														+ "' type='button'>Delete</input>";
											}
										} ],
								"bInfo" : false,
								"bFilter" : false,
								"pagingType" : "full_numbers",
								"iDisplayLength" : 25,
								"bLengthChange" : false,
								// "bJQueryUI" : true,
								"aaSorting" : [ [ 1, "asc" ] ],
								"fnRowCallback" : function(nRow, aData,
										iDisplayIndex, iDisplayIndexFull) {
									// Populate index column
									var index = iDisplayIndex + 1;
									$("td:first", nRow).html(
											"<a href ='javascript:void(0)' id='"
													+ aData["carPoolId"]
													+ "' >" + index + "</a>");

									$(nRow).find("td:first > a")
											.click(
													function() {
														_callBackFun($(this)
																.attr("id"));
													});

									return nRow;
								},

								"fnCreatedRow" : function(nRow, aData,
										iDataIndex) {
									// $(nRow).find("td:first >
									// a").click(function(){alert(iDataIndex)});
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