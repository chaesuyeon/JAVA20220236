import { encrypt_text, decrypt_text } from './crypto.js';

// 암호화된 회원정보를 세션에 저장
export async function session_set2(signUpObj) {
    if (!sessionStorage) {
        alert("세션 스토리지를 지원하지 않는 브라우저입니다.");
        return;
    }

    const userInfo = signUpObj.getUserInfo();        // 객체 내부 값 추출
    const jsonString = JSON.stringify(userInfo);     // 문자열로 변환
    const encrypted = await encrypt_text(jsonString); // 암호화
    sessionStorage.setItem("Session_Storage_join", encrypted); // 저장
}

// 복호화된 회원정보 콘솔 출력
export async function session_get2() {
    const encrypted = sessionStorage.getItem("Session_Storage_join");

    if (!encrypted) {
        console.log("❌ 세션에 회원가입 정보가 존재하지 않습니다.");
        return;
    }

    const decrypted = await decrypt_text(encrypted);
    const userInfo = JSON.parse(decrypted);

    console.log("✅ 복호화된 회원정보:", userInfo);
}
