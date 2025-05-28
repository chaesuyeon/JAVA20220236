// AES 암호화
function encodeByAES256(key, data) {
    try {
        const cipher = CryptoJS.AES.encrypt(
            data,
            CryptoJS.enc.Utf8.parse(key),
            {
                iv: CryptoJS.enc.Utf8.parse(""), // IV 없이 CBC 모드
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            }
        );
        return cipher.toString();
    } catch (error) {
        console.error(" 암호화 중 오류:", error);
        return "";
    }
}

// AES 복호화
function decodeByAES256(key, data) {
    try {
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
    } catch (error) {
        console.error(" 복호화 중 오류:", error);
        return "";
    }
}

//  암호화 함수
export function encrypt_text(plaintext) {
    const key = "key".padEnd(32, " "); // 32바이트로 패딩
    return encodeByAES256(key, plaintext);
}

//  복호화 함수
export function decrypt_text(encryptedText) {
    if (!encryptedText || typeof encryptedText !== "string") {
        console.warn(" 복호화할 데이터가 유효하지 않습니다:", encryptedText);
        return "";
    }

    const key = "key".padEnd(32, " ");
    const decrypted = decodeByAES256(key, encryptedText);

    if (!decrypted) {
        console.warn(" 복호화 결과가 빈 문자열입니다.");
    }

    return decrypted;
}
