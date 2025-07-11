document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".toggle");
  const modeSwitch = document.querySelector(".mode");
  const modeText = document.querySelector(".mode-text");

  // Toggle sidebar
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    });
  }

  // Toggle dark mode
  if (modeSwitch && modeText) {
    modeSwitch.addEventListener("click", () => {
      body.classList.toggle("dark");
      modeText.textContent = body.classList.contains("dark")
        ? "Light Mode"
        : "Dark Mode";
      syncIframeDarkMode();
    });
  }

  function syncIframeDarkMode() {
    const iframe = document.getElementById('mainIframe');
    if (!iframe) return;
    try {
      const iframeBody = iframe.contentDocument.body;
      if (document.body.classList.contains('dark')) {
        iframeBody.classList.add('dark');
      } else {
        iframeBody.classList.remove('dark');
      }
    } catch (e) { }
  }

  // Parent (main window)
  const iframe = document.getElementById('my-iframe');
  iframe.contentWindow.postMessage({ theme: 'dark' }, '*');

  // Gọi hàm này mỗi khi bật/tắt dark mode
});
