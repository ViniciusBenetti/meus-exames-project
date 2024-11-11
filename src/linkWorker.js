/* eslint-disable no-restricted-globals */
self.onmessage = function(event) {
    const fileUrl = event.data;
    
    // Simulação de processamento (ex: verificação da URL)
    fetch(fileUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          self.postMessage({ success: true, url: fileUrl });
        } else {
          self.postMessage({ success: false, error: 'File not accessible' });
        }
      })
      .catch(error => {
        self.postMessage({ success: false, error: error.message });
      });
  };
  /* eslint-enable no-restricted-globals */
  