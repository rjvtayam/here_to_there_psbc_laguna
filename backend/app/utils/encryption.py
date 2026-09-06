import hashlib
import os

_ENCRYPTION_KEY = None


def _get_key() -> bytes:
    global _ENCRYPTION_KEY
    if _ENCRYPTION_KEY is None:
        from app.config import settings
        key_source = settings.JWT_SECRET_KEY.encode()
        _ENCRYPTION_KEY = hashlib.sha256(key_source).digest()
    return _ENCRYPTION_KEY


def encrypt_field(plaintext: str) -> str:
    if not plaintext:
        return plaintext
    key = _get_key()
    data = plaintext.encode()
    nonce = os.urandom(12)
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, data, None)
    import base64
    return base64.b64encode(nonce + ciphertext).decode()


def decrypt_field(ciphertext: str) -> str:
    if not ciphertext:
        return ciphertext
    try:
        key = _get_key()
        import base64
        raw = base64.b64decode(ciphertext)
        nonce = raw[:12]
        ct = raw[12:]
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM
        aesgcm = AESGCM(key)
        return aesgcm.decrypt(nonce, ct, None).decode()
    except Exception:
        return ciphertext
