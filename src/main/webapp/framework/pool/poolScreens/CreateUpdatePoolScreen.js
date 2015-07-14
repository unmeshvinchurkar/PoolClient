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

		var _containerElemId = containerElemId

		var _container = null;
		var _carPoolId = params ? params["poolId"] : null;
		var _geocoder = null;

		/* Public Properties */
		objRef.render = render;

		var _map;
		var _directionsService;
		var _directionsDisplay;
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

		function render() {
			SegmentLoader.getInstance().getSegment("createPoolSeg.xml", null,
					_init);
		}

		function _init(data) {

			_container = $('#' + _containerElemId);
			_container.html(data);

			$("#savePoolButton").click(_handleSave);

			_fromDateElem = $("#fromDate");
			_toDateElem = $("#toDate");
			_startTimeElem = $('#startTime');

			$(_fromDateElem).datepicker({
				showOtherMonths : true,
				selectOtherMonths : true
			});

			$(_toDateElem).datepicker({
				showOtherMonths : true,
				selectOtherMonths : true
			// , dateFormat: 'dd-mm-yyyy'
			});

			$(_startTimeElem).timepicker();

			_directionsDisplay = new google.maps.DirectionsRenderer({
				suppressMarkers : true
			});

			var rendererOptions = {
				draggable : true
			};

			_geocoder = new google.maps.Geocoder();
			_directionsService = new google.maps.DirectionsService();

			var mapOptions = {
				zoom : 7,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			_map = new google.maps.Map(document.getElementById('map-canvas'),
					mapOptions);
			_directionsDisplay.setMap(_map);

			var defaultBounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(-33.8902, 151.1759),
					new google.maps.LatLng(-33.8474, 151.2631));
			_map.fitBounds(defaultBounds);

			// Create the search box and link it to the UI element.
			var input = (document.getElementById('pac-input'));
			_map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

			_autocomplete = new google.maps.places.Autocomplete(input);
			_autocomplete.bindTo('bounds', _map);

			_infowindow = new google.maps.InfoWindow();

			google.maps.event.addListener(_map, 'click', function(event) {
				_placeMarker(event.latLng);
			});

			google.maps.event.addListener(_autocomplete, 'place_changed',
					_navToPlace);

			if (_carPoolId) {
				_loadPoolData(_carPoolId);
			}
		}

		function _loadPoolData(poolId) {

			objRef.fetch(poolId, drawPool);

			function drawPool(data) {

				var srcLoc = new google.maps.LatLng(data.srcLattitude,
						data.srcLongitude);
				var destLoc = new google.maps.LatLng(data.destLattitude,
						data.destLongitude);

				_srcMarker = new google.maps.Marker({
					position : srcLoc,
					map : _map
				});

				_destMarker = new google.maps.Marker({
					position : destLoc,
					map : _map
				});

				var bounds = new google.maps.LatLngBounds(srcLoc, destLoc);
				_map.fitBounds(bounds);

				var coordinates = [];
				var geoPoints = data.geoPoints;

				for (var i = 0; i < geoPoints.length; i++) {
					coordinates.push(new google.maps.LatLng(
							geoPoints[i].latitude, geoPoints[i].longitude));
				}

				_poolPath = new google.maps.Polyline({
					path : coordinates,
					geodesic : true,
					strokeColor : '#FF0000',
					strokeOpacity : 1.0,
					strokeWeight : 2
				});

				_poolPath.setMap(_map);
			}
		}

		function _placeMarker(location) {

			var marker = new google.maps.Marker({
				position : location,
				map : _map
			});

			if (!_srcMarker) {
				_srcMarker = marker;
			} else if (!_destMarker) {
				_destMarker = marker;
				_calcRoute(_srcMarker.getPosition(), _destMarker.getPosition());
			} else if (!_srcMarker && !_destMarker) {
				_srcMarker = marker;
				_destMarker = null;
			} else if (_srcMarker && _destMarker) {
				_srcMarker.setMap(null);
				_destMarker.setMap(null);
				_srcMarker = null;
				_destMarker = null;
				marker.setMap(null);
				// Remove existing route(polyline) on the map
				_directionsDisplay.set('directions', null);

				if (_poolPath) {
					_poolPath.setMap(null);
				}
			}
		}

		function _calcRoute(startPos, destpos) {
			var request = {
				origin : startPos,
				destination : destpos,
				travelMode : google.maps.TravelMode.DRIVING,
				unitSystem : google.maps.UnitSystem.METRIC
			// ,key:"AIzaSyDM9TTxSkYXKz6F1XtOod-Nr8Q_wlRaNs4"
			};

			_directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {

					_route = response.routes[0];

					// Place new markers on the MAP
					var route = response.routes[0];
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

					_directionsDisplay.setDirections(response);

					_getAddress("source", startLoc);
					_getAddress("destination", endLoc);

				} else {
					_route = null;
				}
			});

		}

		function _getAddress(addressType, latlng) {

			_geocoder.geocode({
				'location' : latlng
			}, function(results, status) {
				var address = "";

				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						address = results[1].formatted_address;
					} else {
						address = "Address Not AVBL";
					}
				} else {
					address = "Address Not AVBL";
				}

				if (addressType == "source") {
					_srcAddress = address;
				} else {
					_destAddress = address;
				}
			});
		}

		function _handleSave(e) {
			var startDate = $(_fromDateElem).datepicker("getDate");
			var endDate = $(_toDateElem).datepicker("getDate");
			var timeinSeconds = $(_startTimeElem).timepicker(
					'getSecondsFromMidnight');
			var route = _route;

			var params = {};
			params["startDate"] = startDate.getTime();
			params["endDate"] = endDate.getTime();
			params["startTime"] = timeinSeconds;
			params["route"] = JSON.stringify(route);
			params["vehicleId"] = "1";

			if (_carPoolId) {
				params["carPoolId"] = _carPoolId;
			}

			params["srcArea"] = _srcAddress;
			params["destArea"] = _destAddress;

			objRef.fireCommand(PoolConstants.CREATE_POOL_COMMAND, [ params,
					_saveSuccess, _saveError ]);
		}

		function _saveSuccess(data) {
			_carPoolId = data;
			alert("saved" + _carPoolId);
		}

		function _saveError() {
			alert("save failed");
		}

		function _navToPlace() {

			var place = _autocomplete.getPlace();
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

		function calcRoute() {

			var request = {
				origin : 'Sydney, NSW',
				destination : 'Sydney, NSW',
				waypoints : [ {
					location : 'Bourke, NSW'
				}, {
					location : 'Broken Hill, NSW'
				} ],
				travelMode : google.maps.TravelMode.DRIVING
			};
			_directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					// _directionsDisplay.setDirections(response);
				}
			});
		}

		function computeTotalDistance(result) {
			var total = 0;
			var myroute = result.routes[0];
			for (var i = 0; i < myroute.legs.length; i++) {
				total += myroute.legs[i].distance.value;
			}
			total = total / 1000.0;
			document.getElementById('total').innerHTML = total + ' km';
		}

	}

})();