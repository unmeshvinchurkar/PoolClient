
PROJECT.namespace("PROJECT.pool.util");


PROJECT.pool.util.Browser = {

	
	isIE : $.browser.msie || !!navigator.userAgent.match(/Trident/),
	
	isFirefox : $.browser.mozilla && !($.browser.msie || !!navigator.userAgent.match(/Trident/)),
	
	isWebkit : $.browser.webkit,

	
	version : $.browser.version,

	
	isIE64Bit : (($.browser.msie || navigator.userAgent.match(/Trident/)) && navigator.userAgent.indexOf("Win64") != -1 && navigator.userAgent.indexOf("x64"))
};
