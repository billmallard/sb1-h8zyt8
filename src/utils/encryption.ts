export async function generateEncryptionKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: any, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encoder.encode(JSON.stringify(data))
  );

  const encryptedArray = new Uint8Array(encryptedData);
  return JSON.stringify({
    iv: Array.from(iv),
    data: Array.from(encryptedArray)
  });
}

export async function decryptData(encryptedString: string, key: CryptoKey): Promise<any> {
  const { iv, data } = JSON.parse(encryptedString);
  const decoder = new TextDecoder();
  
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv)
    },
    key,
    new Uint8Array(data)
  );

  return JSON.parse(decoder.decode(decryptedData));
}