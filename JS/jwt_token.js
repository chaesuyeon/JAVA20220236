
// JWT 비밀 키 (운영 환경에서는 더 복잡하게)
const JWT_SECRET = "your_secret_key_here";

// 토큰 생성 함수
export function generateJWT(payload) {
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
    const encodedSignature = CryptoJS.enc.Base64.stringify(signature);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

// JWT 검증
function verifyJWT(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const [encodedHeader, encodedPayload, encodedSignature] = parts;

        const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
        const calculatedSignature = CryptoJS.enc.Base64.stringify(signature);

        if (calculatedSignature !== encodedSignature) return null;

        const payload = JSON.parse(atob(encodedPayload));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            console.log("jWT 만료됨");
            return null;
        }

        return payload;
    } catch (err) {
        console.error("JWT 파싱 오류:", err);
        return null;
    }
}

// 인증 여부 확인
function isAuthenticated() {
    const token = localStorage.getItem("jwt_token");
    if (!token) return false;

    const payload = verifyJWT(token);
    console.log("검증된 payload:", payload);

    return !!payload;
}

// // 인증 검사
// export function checkAuth() {
//     const authenticated = isAuthenticated();
//     if (authenticated) {
//         alert("토큰이 검증되었습니다.");
//     } else {
//         alert("토큰 검증 실패. 인증되지 않은 접근입니다.");
//         window.location.href = "../login/login.html";
//     }
// }

export function checkAuth() {
    const authenticated = isAuthenticated();

    if (authenticated) {
        console.log("JWT 인증 성공");
    } else {
        console.warn("JWT 인증 실패 또는 만료");
        alert("토큰 검증 에러!! 인증되지 않은 접근입니다.");
        window.location.href = '../login/login.html';
    }
}

