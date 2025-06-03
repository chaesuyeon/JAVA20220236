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
    session_del();
    localStorage.removeItem('jwt_token');
    document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.href = '../index_login.html';
}

function session_del() {
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert('세션 스토리지를 지원하지 않는 브라우저입니다.');
    }
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

    // 이메일 길이 제한 (10자 이하)
    if (emailValue.length > 10) {
        alert('이메일은 10자 이하로 입력해야 합니다.');
        return false;
    }

    
    // 비밀번호 길이 제한 (12~15자)
    if (passwordValue.length < 12 || passwordValue.length > 15) {
        alert('비밀번호는 12자 이상 15자 이하로 입력해야 합니다.');
        return false;
    }
    

    // 비밀번호 복잡성 검사
    if (!(/[A-Z]/.test(passwordValue) &&
          /[a-z]/.test(passwordValue) &&
          /[0-9]/.test(passwordValue) &&
          /[\W_]/.test(passwordValue))) {
        alert('비밀번호는 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.');
        return false;
    }

    // 3글자 이상 반복 금지 (ex. 아이디아이디, 123123)
    const repeat3Pattern = /(\w{3,})\1/;
    if (repeat3Pattern.test(emailValue)) {
        alert('같은 문자열이 3자 이상 반복되었습니다.');
        return false;
    }

    // 숫자 2자리 이상 반복 금지 (ex. 12아이디12)
    const numberRepeatPattern = /(\d{2,}).*?\1/;
    if (numberRepeatPattern.test(emailValue)) {
        alert('숫자 2자 이상이 반복되어 입력되었습니다.');
        return false;
    }

    // ID 저장 쿠키 설정
    if (idsave_check.checked) {
        setCookie('id', emailValue, 1);
    } else {
        setCookie('id', emailValue, 0);
    }

    // JWT 생성
    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600
    };
    const jwtToken = generateJWT(payload);
    localStorage.setItem('jwt_token', jwtToken);

    // 비밀번호 암호화 후 세션 저장
    const encrypted = await encrypt_text(passwordValue);
    sessionStorage.setItem('Session_Storage_pass2', encrypted);

    //  세션 객체 전달
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
