import sqlite3
import os

# Determine the absolute path for the database file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = os.path.join(BASE_DIR, 'data', 'condominio.db')

def get_db_connection():
    """Establishes a connection to the SQLite database.

    The connection is configured to return rows as dictionaries.
    """
    # Ensure the data directory exists
    os.makedirs(os.path.dirname(DATABASE_URL), exist_ok=True)

    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_conn=None):
    """Initializes the database by creating the users table if it doesn't exist.

    Args:
        db_conn: An optional existing database connection. If None, a new
                 connection is established.
    """
    conn_was_none = db_conn is None
    if conn_was_none:
        db_conn = get_db_connection()

    cursor = db_conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('condomino', 'amministratore', 'portinaio'))
        )
    ''')

    db_conn.commit()

    if conn_was_none:
        db_conn.close()

if __name__ == '__main__':
    print(f"Initializing database at {DATABASE_URL}...")
    init_db()
    print("Database initialized successfully.")
