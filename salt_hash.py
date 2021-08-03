import os
import bcrypt
from base64 import b64encode


def get_salt(size=45):
    salt_string = b64encode(os.urandom(size)).decode('utf-8')
    return salt_string


def hash_password(plain_text_password):
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


def concat_salt_and_password(salt, password):
    return f"{salt}{password}"
