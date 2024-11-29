from flask import Flask, render_template, request, send_file
import os
from werkzeug.utils import secure_filename
from logic import handle_conversion

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['CONVERTED_FOLDER'] = 'converted'
app.config['ALLOWED_EXTENSIONS'] = {'mp3', 'wav', 'ogg', 'aac', 'png', 'jpg', 'jpeg', 'bmp', 'gif', 'txt', 'html'}

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['CONVERTED_FOLDER'], exist_ok=True)

# Utility function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert_file():
    file = request.files.get('file')
    category = request.form.get('category')
    target_format = request.form.get('format')

    # Check if file, category, and format are provided
    if not file or not category or not target_format:
        return "Please upload a file, select a category, and choose a format.", 400

    # Ensure the file has a valid extension
    if not allowed_file(file.filename):
        return "Unsupported file type. Please upload a valid file.", 400

    # Sanitize the filename before saving
    filename = secure_filename(file.filename)
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(input_path)

    try:
        # Perform the file conversion
        output_path = handle_conversion(input_path, category, target_format, app.config['CONVERTED_FOLDER'])
        if not output_path:
            return "An error occurred during the conversion.", 500
    except Exception as e:
        return f"Error during conversion: {e}", 500

    # Return the converted file for download
    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)

