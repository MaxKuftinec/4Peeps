import openai
import base64

client = openai.OpenAI(api_key="API_KEY")

def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode("utf-8")

# Encode images for OpenAI API
def report_from_openai(figma_bytes, ui_bytes, marked_img_base64, report):
	figma_img_base64 = encode_image(figma_bytes)
	ui_img_base64 = encode_image(ui_bytes)
	
	# Construct the API request for OpenAI
	response = client.chat.completions.create(
			model="gpt-4-vision-preview",
			messages=[
					{"role": "system", "content": "You are an expert UI/UX reviewer. Analyze the given images and provide a detailed report on discrepancies."},
					{"role": "user", "content": [
							{"type": "text", "text": "Here are two UI screenshots and a marked image highlighting discrepancies. Please generate a detailed report on the differences."},
							{"type": "image", "image": figma_img_base64},
							{"type": "image", "image": ui_img_base64},
							{"type": "image", "image": marked_img_base64},
							{"type": "text", "text": f"Here is a preliminary report from our detection system: {report}"}
					]}
			],
			temperature=0.2
	)
	
	return (response.choices[0].message.content)