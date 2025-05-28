import { encrypt_text, decrypt_text } from './crypto.js';

// 🔐 세션에 암호화된 회원 정보를 저장
export async function session_set(signUpObj) {
    if (!sessionStorage) {
        alert("세션 스토리지를 지원하지 않는 브라우저입니다.");
        return;
    }

    try {
        const userInfo = signUpObj.getUserInfo();
        const jsonString = JSON.stringify(userInfo);
        const encrypted = await encrypt_text(jsonString);
        sessionStorage.setItem("Session_Storage_join", encrypted);
        console.log(" 세션 저장 성공");
    } catch (error) {
        console.error(" 세션 저장 중 오류 발생:", error);
    }
}

// 🔓 세션에서 암호화된 데이터를 꺼내 복호화
export async function session_get() {
    try {
        const encrypted = sessionStorage.getItem("Session_Storage_join");
        if (!encrypted) {
            console.warn(" 세션에 암호화된 데이터가 없습니다.");
            return;
        }

        const decrypted = await decrypt_text(encrypted);

        // 복호화 결과가 유효한 JSON인지 확인
        try {
            const userInfo = JSON.parse(decrypted);
            console.log("✅ 복호화된 회원정보:", userInfo);
        } catch (jsonError) {
            console.error("복호화된 문자열이 JSON 형식이 아닙니다:", decrypted);
        }

    } catch (error) {
        console.error("세션 복호화 중 오류:", error);
    }
}

// 세션 유효성 검사 (로그인 상태 유지 확인)
export function session_check() {
    const data = sessionStorage.getItem("Session_Storage_join");
    if (!data) {
        alert("⚠️ 세션이 만료되었거나 존재하지 않습니다.");
        location.href = "../login/login.html"; // 경로는 프로젝트 구조에 맞게 조정
    }
}
