// ✅ 수정된 로그인 JS 전체 코드입니다.
// 🔴 수정된 부분은 "// 🔴 수정" 주석으로 표시했습니다.

import { session_set } from './session.js';
import { encrypt_text } from './crypto.js';
import { generateJWT } from './jwt_token.js';

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
    if (cookie !== '') {
        const cookie_array = cookie.split('; ');
        for (const pair of cookie_array) {
            const [key, val] = pair.split('=');
            if (key === name) return val;
        }
    }
    return null;
}

function login_count() {
    let count = parseInt(getCookie('login_cnt')) || 0;
    setCookie('login_cnt', count + 1, 1);
}

function login_failed() {
    let fail = parseInt(getCookie('fail_cnt')) || 0;
    fail++;
    setCookie('fail_cnt', fail, 1);
    if (fail >= 3) {
        alert('로그인 3회 실패. 로그인이 제한됩니다.');
        document.getElementById('login_btn').disabled = true;
    } else {
        alert('로그인 실패 횟수: ' + fail);
    }
}

function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    const get_id = getCookie('id');
    if (get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
}

document.addEventListener('DOMContentLoaded', () => init());

function logout() {
    localStorage.removeItem('jwt_token');
    sessionStorage.clear();
    document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.href = '../index_login.html';
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
        setCookie('id', emailValue, 1);
    } else {
        setCookie('id', emailValue, 0);
    }

    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600
    };
    const jwtToken = generateJWT(payload);
    localStorage.setItem('jwt_token', jwtToken);

    const encrypted = await encrypt_text(passwordValue);
    sessionStorage.setItem('Session_Storage_pass2', encrypted);

    //  수정: session_set 호출 시 인자 추가
    const userObj = {
        getUserInfo: () => ({
            email: emailValue,
            password: passwordValue
        })
    };
    await session_set(userObj);

    loginForm.submit();
};

window.onload = () => {
    document.getElementById('login_btn').addEventListener('click', check_input);
};
