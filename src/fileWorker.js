/* eslint-disable no-restricted-globals */
self.onmessage = function(event) {

    const file = event.data;

    const reader = new FileReader();
  
    reader.onloadend = function() {

      self.postMessage({ result: reader.result });
    };
  
    reader.onerror = function(error) {

      self.postMessage({ error: error.message });
    };
  
    reader.readAsDataURL(file);
  };
  /* eslint-enable no-restricted-globals */
  