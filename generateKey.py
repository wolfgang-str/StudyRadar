import secrets
import string

# Function to generate a random 32-character key
def generate_random_key(length=32):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))

secret_key = generate_random_key()
print('Generated Secret Key:', secret_key)