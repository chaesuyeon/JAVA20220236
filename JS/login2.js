

import { session_set, session_get, session_check } from './session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT, checkAuth } from './jwt_token.js';

const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = `${escape(name)}=${escape(value)}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
    const cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie !== "") {
        const cookie_array = cookie.split("; ");
        for (const pair of cookie_array) {
            const [key, val] = pair.split("=");
            if (key === name) return val;
        }
    }
    return null;
}

function login_count() {
    let count = parseInt(getCookie("login_cnt")) || 0;
    setCookie("login_cnt", count + 1, 1);
    console.log("로그인 횟수:", count + 1);
}

function logout_count() {
    let count = parseInt(getCookie("logout_cnt")) || 0;
    setCookie("logout_cnt", count + 1, 1);
    console.log("로그아웃 횟수:", count + 1);
}

function login_failed() {
    let fail = parseInt(getCookie("fail_cnt")) || 0;
    fail++;
    setCookie("fail_cnt", fail, 1);
    if (fail >= 3) {
        alert("로그인 3회 실패. 로그인이 제한됩니다.");
        document.getElementById("login_btn").disabled = true;
    } else {
        alert("로그인 실패 횟수: " + fail);
    }
}

function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    const get_id = getCookie("id");
    if (get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
        session_check();
    }
}

function init_logined() {
    if (sessionStorage) {
        const encrypted = sessionStorage.getItem("Session_Storage_join");
        if (!encrypted) {
            console.warn("세션에 암호화된 회원정보 없음");
            return;
        }

        const decrypted = decrypt_text(encrypted);

        if (!decrypted || decrypted === "") { // 복호화 실패 시 빈 문자열 체크 추가
            console.warn("복호화 실패 또는 빈 데이터입니다.");
            return;
        }

        try {
            const userObj = JSON.parse(decrypted); // 복호화 후 JSON 파싱
            console.log("복호화된 회원정보:", userObj);
        } catch (err) {
            console.error("JSON 파싱 에러:", err); // JSON 파싱 에러 로깅
        }
    } else {
        alert("세션 스토리지 지원 x");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    init();
    init_logined();
});

function logout() {
    localStorage.removeItem("jwt_token");
    sessionStorage.clear();
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.href = "../index_login.html";
}

const check_input = async () => {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);

    if (!sanitizedEmail || !sanitizedPassword) return false;

    if (emailValue === '' || emailValue.length < 5) {
        alert('이메일을 올바르게 입력하세요.');
        return false;
    }

    if (passwordValue === '' || passwordValue.length < 12) {
        alert('비밀번호는 12자 이상 입력하세요.');
        return false;
    }

    if (!(/[A-Z]/.test(passwordValue) && /[a-z]/.test(passwordValue) && /[0-9]/.test(passwordValue) && /[\W_]/.test(passwordValue))) {
        alert('비밀번호는 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.');
        return false;
    }

    if (idsave_check.checked) {
        setCookie("id", emailValue, 1);
    } else {
        setCookie("id", emailValue, 0);
    }

    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600
    };
    const jwtToken = generateJWT(payload);
    localStorage.setItem('jwt_token', jwtToken);

    const encrypted = await encrypt_text(passwordValue);
    sessionStorage.setItem("Session_Storage_pass2", encrypted);

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);

    session_set();
    loginForm.submit();
};

window.onload = () => {
    document.getElementById("login_btn").addEventListener('click', check_input);
};
