import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
# Need to adjust import path if backend is not directly in PYTHONPATH
# For now, assume it can be found or will be run from a context where it is.
try:
    from backend.config.database import get_db_connection, init_db
except ImportError:
    # This fallback is for the __main__ block or direct execution,
    # assuming standard project structure.
    import sys
    import os
    # Add the parent directory of 'backend' to sys.path
    # This allows 'from backend.config...' to work when running user_model.py directly
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
    from backend.config.database import get_db_connection, init_db


def create_user(username, password, role):
    """Creates a new user in the database.

    Args:
        username: The username for the new user.
        password: The plain text password for the new user.
        role: The role of the new user ('condomino', 'amministratore', 'portinaio').

    Returns:
        The ID of the newly created user on success, None on failure (e.g., username exists).
    """
    conn = get_db_connection()
    hashed_password = generate_password_hash(password)
    user_id = None
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            (username, hashed_password, role)
        )
        conn.commit()
        user_id = cursor.lastrowid
        print(f"User {username} created successfully with ID: {user_id}.")
    except sqlite3.IntegrityError:
        print(f"Error: Username '{username}' already exists.")
    except sqlite3.Error as e:
        print(f"Database error during user creation: {e}")
    finally:
        if conn:
            conn.close()
    return user_id

def get_user_by_username(username):
    """Retrieves a user from the database by their username.

    Args:
        username: The username to search for.

    Returns:
        A dictionary-like Row object representing the user if found, otherwise None.
    """
    conn = get_db_connection()
    user = None
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
    except sqlite3.Error as e:
        print(f"Database error while fetching user: {e}")
    finally:
        if conn:
            conn.close()
    return user

# Example usage:
if __name__ == '__main__':
    print("Running user_model.py example...")
    # Initialize the database (creates table if it doesn't exist)
    # This is important if running this script standalone for the first time.
    print("Initializing database for user_model example...")
    init_db()
    print("Database initialized.")

    # Create users
    print("\nAttempting to create users...")
    user1_id = create_user("alice_condomino", "condominopass", "condomino")
    user2_id = create_user("bob_admin", "adminpass", "amministratore")
    user3_id = create_user("charlie_portiere", "portierepass", "portinaio")

    # Attempt to create a duplicate user
    print("\nAttempting to create a duplicate user (expected to fail)...")
    create_user("alice_condomino", "anotherpass", "condomino")

    # Fetch and display a user
    if user1_id:
        print(f"\nFetching user 'alice_condomino' (ID: {user1_id})...")
        fetched_user = get_user_by_username("alice_condomino")
        if fetched_user:
            print(f"Found user: ID={fetched_user['id']}, Username='{fetched_user['username']}', Role='{fetched_user['role']}'")
            # Example of checking password (not typically done outside auth logic)
            is_password_correct = check_password_hash(fetched_user['password'], "condominopass")
            print(f"Password check for 'condominopass': {is_password_correct}")
        else:
            print("User 'alice_condomino' not found after creation.")

    if user2_id:
        print(f"\nFetching user 'bob_admin' (ID: {user2_id})...")
        fetched_user_admin = get_user_by_username("bob_admin")
        if fetched_user_admin:
            print(f"Found user: ID={fetched_user_admin['id']}, Username='{fetched_user_admin['username']}', Role='{fetched_user_admin['role']}'")
        else:
            print("User 'bob_admin' not found after creation.")

    print("\nUser model example finished.")
