PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.CreateUpdatePoolScreen = CreateUpdatePoolScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(CreateUpdatePoolScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * 
	 * 
	 * @class PROJECT.pool.map.GooglePoolMap
	 */
	function CreateUpdatePoolScreen(containerElemId, params) {

		CreateUpdatePoolScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
		var PoolUtil = PROJECT.pool.util.PoolUtil.getInstance();

		var _USER_ROW = '<tr "><td><img id="{imageId}" class="" src="{ImageSrc}" alt="" /></td> <td class="text-center"><strong>{name}</<strong></td><td class="text-center"><strong>{email}</<strong></td><td class="text-center">{phoneNo}</td><td class="text-center"><strong>{tripCost}</<strong></td><td class="text-center"><strong>{pickupDistance}</<strong></td></tr>';

		var _containerElemId = containerElemId;
		var _container = null;
		var _carPoolId = params ? params["poolId"] : null;
		var _isReadOnly = params ? params["readOnly"] : false;

		if (_carPoolId) {
			_isReadOnly = true;
		}

		var _geocoder = null;

		/* Public Properties */
		objRef.render = render;
		objRef.markPoint = markPoint;
		objRef.destroy = destroy;

		var _map;
		var _directionsService;
		var _directionRenderer;
		var _markers = [];

		var _autocomplete = null;
		var _srcMarker = null;
		var _destMarker = null;
		var _infowindow = null;

		var _fromDateElem = null;
		var _toDateElem = null;
		var _startTimeElem = null;
		var _route = null;
		var _srcAddress = null;
		var _destAddress = null;
		var _poolPath = null;

		function destroy() {
			$('#' + _containerElemId).html(" ");

		}

		function render() {
			SegmentLoader.getInstance().getSegment("createPoolSeg.xml", null,
					_initAndLoadVehicle);
		}

		function _initAndLoadVehicle(htmlData) {
			_container = $('#' + _containerElemId);
			_container.html(htmlData);

			// Fetch Vehicle details
			objRef.get(PoolConstants.GET_VEHICLE_COMMAND, [ {},
					handleVehicleSuccess, handleVehicleFailure ]);

			function handleVehicleSuccess(data) {
				_init();
				$("#vehicleId").html(data.registrationNo);
				$("#vehicleId").click(function() {
					_showVehicleDetails(data)
				});
			}

			function handleVehicleFailure() {
				_isReadOnly = true;
				_init();
				("#vehicleId").hide();

				$("#messegePanel").css("display", "block");
				$("#messegePanel")
						.html(
								"Please go to <strong>Register Vehicle</strong> tab and register vehicle for creating pool");

			}
		}

		function _showVehicleDetails(data) {

			SegmentLoader.getInstance().getSegment("mapDialog.xml", null,
					initDialog);

			function initDialog(data) {
				$("body").append(data);
				var dialogId = "dialogId";

				var screen = new PROJECT.pool.poolScreens.ManageVehiclesScreen(
						dialogId, true);

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
						// screen.destroy();
						$(this).dialog('close');
						$(this).remove();
						$("#dialogId").remove();
					}
				});
				screen.render();
			}
		}

		function _init() {

			if (!_isReadOnly) {
				$("#savePoolButton").click(_handleSave);
			} else {
				$("#savePoolButton").remove();
			}

			_fromDateElem = $("#fromDate");
			_toDateElem = $("#toDate");
			_startTimeElem = $('#startTime');

			$(_fromDateElem).datepicker(
					{
						dateFormat : 'dd-mm-yy',
						showOtherMonths : true,
						selectOtherMonths : true,
						changeYear : true,
						defaultDate : new Date(),
						minDate : new Date(),
						onClose : function(selectedDate) {
							$(_toDateElem).datepicker("option", "minDate",
									selectedDate);
						}
					});

			$(_toDateElem).datepicker(
					{
						dateFormat : 'dd-mm-yy',
						showOtherMonths : true,
						selectOtherMonths : true,
						changeYear : true,
						'defaultDate' : new Date(),
						minDate : new Date(),
						onClose : function(selectedDate) {
							$(_fromDateElem).datepicker("option", "maxDate",
									selectedDate);
						}
					});

			$(_startTimeElem).timepicker({
				'step' : 15,
				'disableTextInput' : true,
				'forceRoundTime' : true
			});

			$(_fromDateElem).datepicker("setDate", new Date());
			$(_toDateElem).datepicker("setDate", new Date());

			$(_startTimeElem).timepicker('setTime', new Date());
			_directionRenderer = new google.maps.DirectionsRenderer({
				suppressMarkers : true,
				draggable : true
			});

			if (!_isReadOnly) {
				_directionRenderer
						.addListener('directions_changed',
								function() {
									var directions = _directionRenderer
											.getDirections();
									if (directions) {
										_drawRoute(directions.routes[0]);
									}
								});
			}

			_geocoder = new google.maps.Geocoder();
			_directionsService = new google.maps.DirectionsService();

			var mapOptions = {
				zoom : 13,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			_map = new google.maps.Map(document.getElementById('map-canvas'),
					mapOptions);
			_directionRenderer.setMap(_map);

			if (!_carPoolId) {
				$.get("http://ipinfo.io", function(response) {

					var latLngArry = response.loc.split(",");
					var latLng = new google.maps.LatLng(latLngArry[0],
							latLngArry[1]);
					_map.setCenter(latLng);
				}, "jsonp");
			}

			if (!_isReadOnly) {

				// Create the search box and link it to the UI element.
				var input = (document.getElementById('pac-input'));
				_map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				var input1 = (document.getElementById('pac-input1'));
				_map.controls[google.maps.ControlPosition.TOP_CENTER]
						.push(input1);

				// $(input).tooltip();
				// $(input1).tooltip();

				_autocomplete = new google.maps.places.Autocomplete(input);
				_autocomplete.bindTo('bounds', _map);

				var _autocomplete1 = new google.maps.places.Autocomplete(input1);
				_autocomplete1.bindTo('bounds', _map);

				_infowindow = new google.maps.InfoWindow();

				google.maps.event.addListener(_map, 'click', function(event) {
					_placeMarker(event.latLng);
				});

				google.maps.event.addListener(_autocomplete, 'place_changed',
						function() {
							_navToPlace(_autocomplete)
						});
				google.maps.event.addListener(_autocomplete1, 'place_changed',
						function() {
							_navToPlace(_autocomplete1)
						});
			} else {
				var input = (document.getElementById('pac-input'));
				$(input).remove();
				var input1 = (document.getElementById('pac-input1'));
				$(input1).remove();
			}

			if (_carPoolId) {
				_loadPoolData(_carPoolId);
			}

			if (_isReadOnly) {
				$(_fromDateElem).attr("disabled", "disabled");
				$(_toDateElem).attr("disabled", "disabled");
				$(_startTimeElem).attr("disabled", "disabled");
				$("#totalSeats").attr("disabled", "disabled");
				$("#bucksPerKm").attr("disabled", "disabled");
			}
		}

		function _loadPoolData(poolId) {

			objRef.fetch(poolId, drawPool);

			function drawPool(data) {

				if (data.noOfAvblSeats) {
					$("#totalSeats").val(data.noOfAvblSeats);
				}

				if (data.bucksPerKm) {
					$("#bucksPerKm").val(data.bucksPerKm);
				}

				if (data.startDate) {
					$(_fromDateElem).datepicker("setDate",
							new Date(data.startDate * 1000));
				}

				if (data.endDate) {
					$(_toDateElem).datepicker("setDate",
							new Date(data.endDate * 1000));
				}

				if (data.startTime) {
					var now = new Date();
					var d = new Date(now.getFullYear(), now.getMonth(), now
							.getDay(), 0, 0, 0, 0);

					$(_startTimeElem).timepicker('setTime',
							new Date(d.getTime() + data.startTime * 1000));
				}

				_srcAddress = data.srcArea;
				_destAddress = data.destArea;

				var srcLoc = new google.maps.LatLng(data.srcLattitude,
						data.srcLongitude);
				var destLoc = new google.maps.LatLng(data.destLattitude,
						data.destLongitude);

				_srcMarker = new google.maps.Marker({
					position : srcLoc,
					map : _map,
					label : "START"
				});

				_destMarker = new google.maps.Marker({
					position : destLoc,
					map : _map,
					label : "END"
				});

				var bounds = new google.maps.LatLngBounds(srcLoc, destLoc);
				_map.fitBounds(bounds);

				var coordinates = [];
				var geoPoints = data.geoPoints;

				var bounds = new google.maps.LatLngBounds();
				for (var i = 0; i < geoPoints.length; i++) {
					var latLong = new google.maps.LatLng(geoPoints[i].latitude,
							geoPoints[i].longitude);

					coordinates.push(latLong);
					bounds.extend(latLong);
				}

				_poolPath = new google.maps.Polyline({
					path : coordinates,
					geodesic : true,
					strokeColor : '#FF0000',
					strokeOpacity : 1.0,
					strokeWeight : 2
				});

				_poolPath.setMap(_map);

				_map.fitBounds(bounds);

				var subscriptions = data.subscriptionDetails;

				if (subscriptions) {
					for (var i = 0; i < subscriptions.length; i++) {
						var sub = subscriptions[i];
						objRef
								.markPoint(
										sub["pickupLattitude"],
										sub["pickupLongitute"],
										sub["firstName"],
										PoolUtil
												.convertSecondsToTime(sub["pickupTime"]));
					}
					_drawSubUserDetails(subscriptions);
				}
			}
		}

		function _drawSubUserDetails(subDataArray) {
			
			

			if (subDataArray != null && subDataArray.length > 0) {

               var table = $("#users").show();
               var tableBody = table.find("tbody");
				for (var i = 0; i < subDataArray.length; i++) {
					var data = subDataArray[i];

					var rowHtml = null;

					if (!data["contactNo"]) {
						data["contactNo"] = "_";
					}

					if (data["profileImagePath"]) {

						rowHtml = _USER_ROW.replace("{ImageSrc}",
								objRef.SERVER_URL + "images/"
										+ data["profileImagePath"]);

					} else {
						rowHtml = _USER_ROW.replace("{ImageSrc}",
								"framework\style\images\no_image.jpg");
					}

					rowHtml = rowHtml.replace("{name}", data["name"]).replace(
							"{phoneNo}", data["contactNo"]).replace("{email}",
							data["email"]).replace("{imageId}", data["userId"])
							.replace("{tripCost}", data["tripCost"]);
					rowHtml = rowHtml.replace("{pickupDistance}", data["pickupDistance"] +" km");

					$(tableBody).append(rowHtml);
				}

				$(table).on("click", "img", function() {
					_showUserDetails(this.id)
				});
			}
		}

		function _showUserDetails(userId) {

			SegmentLoader.getInstance().getSegment("mapDialog.xml", null,
					initDialog);

			function initDialog(data) {
				$("body").append(data);
				var dialogId = "dialogId";

				var screen = new PROJECT.pool.poolScreens.UserProfileScreen(
						dialogId, userId, true);

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
						// screen.destroy();
						$(this).dialog('close');
						$(this).remove();
						$("#dialogId").remove();
					}
				});
				screen.render();
			}

		}

		function markPoint(lattitude, longitude, userName, pickupTime) {
			var latLng = {};

			var content = userName ? userName : "";
			content = pickupTime ? content + ", Pickup: " + pickupTime
					: content

			latLng["lat"] = lattitude;
			latLng["lng"] = longitude;
			var marker = new google.maps.Marker({
				position : latLng,
				label : content,
				title : content,
				map : _map,
				icon : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
			});

			var infowindow = new google.maps.InfoWindow({
				content : content
			});
			infowindow.open(_map, marker);

			if (content) {

				google.maps.event.addListener(marker, 'click', function() {
					var infowindow = new google.maps.InfoWindow({
						content : content
					});
					infowindow.open(_map, marker);
				});
			}

		}

		function _placeMarker(location, labelStr) {

			var marker = new google.maps.Marker({
				position : location,
				map : _map
			});

			if (!_srcMarker) {
				_srcMarker = marker;
				marker.setLabel("START");
			} else if (!_destMarker) {
				_destMarker = marker;
				marker.setLabel("END");
				_calcRoute(_srcMarker.getPosition(), _destMarker.getPosition());
			} else if (!_srcMarker && !_destMarker) {
				_srcMarker = marker;
				marker.setLabel("START");
				_destMarker = null;
			} else if (_srcMarker && _destMarker) {
				_clearMap();
				marker.setMap(null);
			}
		}

		function _clearMap() {

			if (_srcMarker) {
				_srcMarker.setMap(null);
				_srcMarker = null;
			}

			if (_destMarker) {
				_destMarker.setMap(null);
				_destMarker = null;
			}

			_directionRenderer.set('directions', null);

			if (_poolPath) {
				_poolPath.setMap(null);
			}

			$.get("http://ipinfo.io", function(response) {
				var latLngArry = response.loc.split(",");
				var latLng = new google.maps.LatLng(latLngArry[0],
						latLngArry[1]);
				_map.setCenter(latLng);
			}, "jsonp");
		}

		function _calcRoute(startPos, destpos) {

			var startDate = $(_fromDateElem).datepicker("getDate");
			var timeinSeconds = $(_startTimeElem).timepicker(
					'getSecondsFromMidnight');

			var departureTime = startDate.getTime() + timeinSeconds * 1000;

			var request = {
				origin : startPos,
				destination : destpos,
				travelMode : google.maps.TravelMode.DRIVING,
				unitSystem : google.maps.UnitSystem.METRIC,
				drivingOptions : {
					departureTime : new Date(departureTime),
					trafficModel : google.maps.TrafficModel.BEST_GUESS
				}
			// ,key:"AIzaSyDM9TTxSkYXKz6F1XtOod-Nr8Q_wlRaNs4"
			};

			_directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					_route = response.routes[0];
					_drawRoute(_route);
					_directionRenderer.setDirections(response);

				} else {
					_route = null;
				}
			});

		}

		function _drawRoute(route) {

			// Place new markers on the MAP
			var legs = route.legs;
			var startLeg = legs[0];
			var endLeg = legs[legs.length - 1];

			var startStep = startLeg.steps[0];
			var endStep = endLeg.steps[endLeg.steps.length - 1];

			var startLoc = startStep["start_location"];
			var endLoc = endStep["end_location"];

			// Re-create src and dest markers
			_srcMarker.setMap(null);
			_destMarker.setMap(null);

			_srcMarker = new google.maps.Marker({
				position : startLoc,
				map : _map
			});

			_destMarker = new google.maps.Marker({
				position : endLoc,
				map : _map
			});

			_srcAddress = _route.legs[0].start_address;
			_destAddress = _route.legs[_route.legs.length - 1].end_address;
		}

		function _handleSave(e) {

			if (_srcMarker == null || _destMarker == null) {
				objRef.errorMsg("msg_div",
						"Please mark both source and destination points.");
				return;
			}

			var startDate = $(_fromDateElem).datepicker("getDate");
			var endDate = $(_toDateElem).datepicker("getDate");
			var timeinSeconds = $(_startTimeElem).timepicker(
					'getSecondsFromMidnight');
			var route = _route;
			var totalNoOfSeats = $("#totalSeats").val();
			var bucksPerKm = $("#bucksPerKm").val();

			var params = {};
			params["startDate"] = startDate.getTime();
			params["endDate"] = endDate.getTime();
			params["startTime"] = timeinSeconds;
			params["bucksPerKm"] = bucksPerKm;
			params["excludeWeekend"] = $("#excludeWeekend").is(":checked");

			// Remove instructions which contain special characters

			if (route) {
				var totalDistance = _getTotalDistance(route);
				params["totalDistance"] = totalDistance;

				var legs = route["legs"];
				for (var i = 0; i < legs.length; i++) {
					var leg = legs[i];
					var steps = leg["steps"];
					for (var j = 0; j < steps.length; j++) {

						steps[j].instructions = '';
						var obj = {};
						obj["lat"] = steps[j]["start_point"].lat();
						obj["lng"] = steps[j]["start_point"].lng();
						steps[j]["start_point"] = obj;

						obj = {};
						obj["lat"] = steps[j]["end_point"].lat();
						obj["lng"] = steps[j]["end_point"].lng();
						steps[j]["end_point"] = obj;

						var path = steps[j].path;

						for (var k = 0; k < path.length; k++) {
							var obj = {};
							obj["lat"] = path[k].lat();
							obj["lng"] = path[k].lng();
							path[k] = obj;
						}
					}
				}
			}

			params["route"] = route ? _escape(JSON.stringify(route))
					: undefined;
			params["vehicleId"] = "1";

			if (_carPoolId) {
				params["carPoolId"] = _carPoolId;
			} else {
				params["totalSeats"] = totalNoOfSeats;
			}

			params["srcArea"] = _srcAddress;
			params["destArea"] = _destAddress;

			objRef.fireCommand(PoolConstants.CREATE_POOL_COMMAND, [ params,
					_saveSuccess, _saveError ]);
		}

		function _escape(text) {
			return text.replace(/(\r\n|\n|\r|(\n)+)/gm, "").replace(/[\b]/g,
					' ').replace(/\\n/g, ' ').replace(/[\f]/g, ' ').replace(
					/[\n]/g, ' ').replace(/[\r]/g, ' ').replace(/nbsp;/g, ' ');

		}

		function _saveSuccess(data) {
			_carPoolId = data;
			objRef.successMsg("msg_div", "Successfully created pool!!");
		}

		function _saveError(data) {
			objRef.errorMsg("msg_div", "Sorry!! couldn't create pool");
		}

		function _navToPlace(autocomplete) {

			var place = autocomplete.getPlace();
			if (!place.geometry) {
				window
						.alert("Autocomplete's returned place contains no geometry");
				return;
			}

			// If the place has a geometry, then present it
			// on a map.
			if (place.geometry.viewport) {
				_map.fitBounds(place.geometry.viewport);
			} else {
				_map.setCenter(place.geometry.location);
				_map.setZoom(17); // Why 17? Because it
				// looks good.
			}
		}

		function _getTotalDistance(route) {
			var total = 0;
			var myroute = route;
			for (var i = 0; i < myroute.legs.length; i++) {
				total += myroute.legs[i].distance.value;
			}
			total = total / 1000.0;

			return total;
		}

	}

})();