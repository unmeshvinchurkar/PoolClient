PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.SearchPoolResultScreen = SearchPoolResultScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(SearchPoolResultScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * 
	 * 
	 * @class PROJECT.pool.poolScreens.SearchPoolResultScreen
	 */
	function SearchPoolResultScreen(containerElemId, searchResult) {

		SearchPoolResultScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;

		var _containerElemId = containerElemId

		var _container = null;
		var _geocoder = null;
		var _searchResult = searchResult;
		var _poolTable = null;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("searchPoolResultSeg.xml",
					null, _init);
		}

		function _init(data) {
			_container = $('#' + _containerElemId);
			_container.html(data);
			_poolTable = new CarPoolTable("poolTable");
			_poolTable.onRowClick(_onClick);
			_poolTable.addRows(_searchResult);
		}

		function _onClick(elementId, poolTable) {

			if (elementId.startsWith("_delete")) {
				var poolId = elementId.split(":")[1];
				objRef.fetch("deletepool/" + poolId,

				function(data) {
					_poolTable.deleteRow($("#" + elementId).closest('tr')
							.get(0));
				});
			} else {
				var params = {};
				params["poolId"] = elementId;
				objRef.navigateTo(PoolConstants.CREATE_UPDATE_POOL_SCREEN,
						params);
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
												'mDataProp' : 'firstName',
												"bUseRendered" : true,
												'fnRender' : function(o) {
													return "<span style='display:block;overflow:hidden;width:100%' title='"
															+ o.aData["firstName"]
															+ "'>"
															+ o.aData["firstName"]
															+ "</span>";
												}
											},
											{
												'sTitle' : "Start Time",
												'sWidth' : '5%',
												'sType' : 'string-case',
												'data' : 'startTime',
												'render' : function(cellData,
														type, rowData) {

													var unit = "AM";
													var timeInSeconds = cellData;
													var hrs = parseInt(timeInSeconds / (3600));

													if (hrs >= 12) {
														unit = "PM";

														if (hrs >= 13) {
															hrs = hrs - 12;
														}
													}

													var remSeconds = parseInt(timeInSeconds % (3600));
													var secs = parseInt(remSeconds / 60);

													secs = secs > 9 ? secs
															: secs + "0";

													return hrs + ":" + secs
															+ unit;
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