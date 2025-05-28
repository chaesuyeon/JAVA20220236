 // 암호화 키 생성
export async function getKey(password) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("some_salt"), // 고정된 salt
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// 암호화 함수
export async function encryptAES(plaintext, password) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey(password);
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded
    );

    // 결과를 저장할 수 있게 base64로 변환
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const ctBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
    return ivHex + ":" + ctBase64;
}

// 복호화 함수
export async function decryptAES(cipherWithIv, password) {
    const [ivHex, ctBase64] = cipherWithIv.split(":");
    const iv = new Uint8Array(ivHex.match(/.{2}/g).map(h => parseInt(h, 16)));
    const key = await getKey(password);
    const ciphertext = Uint8Array.from(atob(ctBase64), c => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}