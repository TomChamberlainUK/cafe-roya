function setVendor(element, property, value) {
  cappedProperty = property.charAt(0).toUpperCase() + property.slice(1)
  element.style["webkit" + cappedProperty] = value;
  element.style["moz" + cappedProperty] = value;
  element.style["ms" + cappedProperty] = value;
  element.style["o" + cappedProperty] = value;
}

function throttle(callback, wait = 100) {
	let timer = null;
	return function(...args) {
		if (!timer) {
			timer = setTimeout(() => {
				callback.apply(this, args);
				timer = null;
			}, wait);
		}
	}
}

function truncateTextAtIndex(text, limit) {
  if (text.length > limit) {
		for (let i = limit; i > 0; i--) {
			if (text.charAt(i) === ' '  && (text.charAt(i - 1) != ',' || text.charAt(i - 1) != '.' || text.charAt(i - 1) != ';')) {
				return text.substring(0, i) + '...';
			}
		}
		return text.substring(0, limit) + '...';
  }
  else return text;
};