from flask import Flask

# Adjust import path for modules within the 'backend' package
# This ensures that 'backend.config.database' can be found when running the Flask app.
import sys
import os
# Add the parent directory of 'backend' to sys.path
# This allows 'from backend.config...' to work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from backend.config.database import init_db
except ImportError:
    # Fallback for cases where sys.path modification might not be enough
    # or if run in a very specific context.
    # This typically indicates a project structure or PYTHONPATH issue.
    print("Error: Could not import init_db from backend.config.database.")
    print("Ensure your PYTHONPATH is set up correctly or run from the project root.")
    # As a last resort for this specific script, try a relative import path
    # if the above doesn't work in all execution contexts (like some IDEs/debuggers)
    # However, explicit sys.path modification is generally preferred for clarity.
    if 'init_db' not in globals():
        try:
            # This relative import is less robust and depends on how the script is run.
            from config.database import init_db
            print("Used relative import for init_db successfully.")
        except ImportError:
            print("Relative import for init_db also failed.")
            sys.exit("Failed to import database configuration. Exiting.")


app = Flask(__name__)

# Initialize the database
# It's generally good practice to do this within the app context,
# especially if your init_db function interacts with app.config or extensions.
# However, since our init_db is simple and idempotent, calling it directly is okay here.
# For more complex apps, consider app.before_first_request or a CLI command.
try:
    with app.app_context():
        init_db()
    print("Database initialized successfully via app.py.")
except Exception as e:
    print(f"Error during database initialization in app.py: {e}")
    # Depending on the severity, you might want to exit or handle this error
    # For now, we'll print it and continue, as init_db itself has error handling.

@app.route('/')
def home():
    return "Welcome to the Condominio App Backend!"

if __name__ == '__main__':
    # Note: The default host is 127.0.0.1 (localhost) and default port is 5000.
    # For Docker or broader network access, you might use host='0.0.0.0'.
    app.run(debug=True, host='0.0.0.0', port=5000)
