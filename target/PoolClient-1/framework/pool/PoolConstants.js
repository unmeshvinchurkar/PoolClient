
PROJECT.namespace("PROJECT.pool");

PROJECT.pool.PoolConstants = (function() {
	var objRef = {};
	objRef.REQUEST_MIME_TYPE = "text/xml";
	objRef.GLOBAL_HEADER_DIV = 'headerDiv';
	objRef.GLOBAL_CONTAINER_DIV = 'containerDiv';
	objRef.GLOBAL_LOADING_DIV = "loadingDiv";

	objRef.MAP_CONTENT = "rightMapContent"
	objRef.MODULE_PATH = "framework/pool/module/";
	objRef.APPLICATION_PATH = "framework/pool/";

	// layouts
	objRef.LAYOUT_SECTION_HEADER = "header";
	objRef.LAYOUT_SECTION_CONTENT = "content";

	// images
	objRef.COMMON_IMAGE_PATH = "framework/pool/images/";

	objRef.APPLICATION_TYPE_POOL = "POOL";

	// Landing page cached
	objRef.LANDING_PAGE = "LANDING_PAGE";

	// Delay time for showing slide up messages
	objRef.MESSAGE_DELAY_TIME = 4000;

	return objRef;
})();
