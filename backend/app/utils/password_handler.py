import bcrypt

def hash_password(password: str) -> str:
    # Hash a password for the first time
    # (Using salt generation and hashing together)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Check hashed password. Using .encode('utf-8') for both because bcrypt requires bytes.
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
