
/*
// AES 암호화
function encodeByAES256(key, data) {
    const cipher = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(key),
        {
            iv: CryptoJS.enc.Utf8.parse(""),        // IV는 생략 (CBC모드에서 사용)
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }
    );
    return cipher.toString(); // base64
}

// AES 복호화
function decodeByAES256(key, data) {
    const cipher = CryptoJS.AES.decrypt(
        data,
        CryptoJS.enc.Utf8.parse(key),
        {
            iv: CryptoJS.enc.Utf8.parse(""),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }
    );
    return cipher.toString(CryptoJS.enc.Utf8); // UTF-8 문자열
}

// 암호화 함수
export function encrypt_text(plaintext) {
    const key = "key".padEnd(32, " ");           // AES256은 32바이트 키 필요
    const encrypted = encodeByAES256(key, plaintext);
    return encrypted;
}

// 🔓 복호화 함수
export function decrypt_text(encryptedText) {
    const key = "key".padEnd(32, " ");
    const decrypted = decodeByAES256(key, encryptedText);
    return decrypted;
}
*/

// AES 암호화
function encodeByAES256(key, data) {
    const cipher = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(key),
        {
            iv: CryptoJS.enc.Utf8.parse(""),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }
    );
    return cipher.toString();
}

// AES 복호화
function decodeByAES256(key, data) {
    const cipher = CryptoJS.AES.decrypt(
        data,
        CryptoJS.enc.Utf8.parse(key),
        {
            iv: CryptoJS.enc.Utf8.parse(""),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }
    );
    return cipher.toString(CryptoJS.enc.Utf8);
}

// 암호화 함수
export function encrypt_text(plaintext) {
    const key = "key".padEnd(32, " ");
    return encodeByAES256(key, plaintext);
}

export function decrypt_text(encryptedText) {
    if (!encryptedText || typeof encryptedText !== "string") {
        console.error(" 복호화할 데이터가 유효하지 않습니다.");
        return "";
    }
    const key = "key".padEnd(32, " ");
    const decrypted = decodeByAES256(key, encryptedText);
    return decrypted;
}



// // 복호화 함수 (비동기화)
// export async function decrypt_text(encryptedText) {
//     const key = "key".padEnd(32, " ");
//     return decodeByAES256(key, encryptedText);
// }
