from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

def fetch_html_css_screenshot(url):
    options = Options()
    options.add_argument("--headless")  # Run in headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    driver.get(url)
    html_content = driver.page_source

    # Take screenshot
    screenshot_path = "screenshoot.png"
    driver.save_screenshot(screenshot_path)

    # Extract CSS files
    css_links = driver.execute_script("""
        return [...document.querySelectorAll('link[rel="stylesheet"]')].map(link => link.href);
    """)

    css_content = {}
    for css_link in css_links:
        driver.get(css_link)
        css_content[css_link] = driver.page_source

    driver.quit()
    
    return {"html": html_content, "css": css_content, "screenshot": screenshot_path}

# Example usage:
url = "https://youtube.com"
result = fetch_html_css_screenshot(url)
print(result["html"])
for css_link, css in result["css"].items():
    print(f"\nCSS from {css_link}:\n{css}")
print(f"Screenshot saved at: {result['screenshot']}")
