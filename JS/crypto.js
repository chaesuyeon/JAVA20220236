import { session_set, session_get, session_check } from './session.js';


function encodeByAES256(key, data) {
    const cipher = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(key),
        {
            iv: CryptoJS.enc.Utf8.parse(""),       // IV 초기화 벡터
            padding: CryptoJS.pad.Pkcs7,           // 패딩
            mode: CryptoJS.mode.CBC                // 운영 모드
        }
    );
    return cipher.toString();
}

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

export function encrypt_text(password) {
    const k = "key";                            // 클라이언트 키
    const rk = k.padEnd(32, " ");               // AES256은 키 길이가 32바이트
    const b = password;
    const eb = encodeByAES256(rk, b);           // 실제 암호화
    console.log(eb);                            // 로그는 return 뒤에 있으면 안 찍힘
    return eb;
}

export function decrypt_text() {
    const k = "key";                            // 서버 키 (동일해야 복호화 가능)
    const rk = k.padEnd(32, " ");               // AES256은 키 길이가 32바이트
    const eb = session_get();                   // 세션에서 암호화된 데이터 가져옴
    const b = decodeByAES256(rk, eb);           // 실제 복호화
    console.log(b);
}

