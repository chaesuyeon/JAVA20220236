const check_xss = (input) => {
    // DOMPurify 라이브러리 로드 (CDN 사용)
    const DOMPurify = window.DOMPurify;

    // 입력 값을 DOMPurify로 sanitize
    const sanitizedInput = DOMPurify.sanitize(input);

    // Sanitized된 값과 원본 입력 값 비교
    if (sanitizedInput !== input) {
        // XSS 공격 가능성 발견 시 에러 처리
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }

    // Sanitized된 값 반환
    return sanitizedInput;
};

function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) +
                      "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");

    if (cookie !== "") {
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] === name) {
                return cookie_name[1];
            }
        }
    }
    return;
}

function login_count() {
    let count = getCookie("login_cnt");
    if (!count) count = 0;
    count = parseInt(count) + 1;
    setCookie("login_cnt", count, 1);
    console.log("로그인 횟수: " + count);
}

// 로그아웃 시 호출
function logout_count() {
    let count = getCookie("logout_cnt");
    if (!count) count = 0;
    count = parseInt(count) + 1;
    setCookie("logout_cnt", count, 1);
    console.log("로그아웃 횟수: " + count);
}

// 로그인 실패 시 호출
function login_failed() {
    let fail = getCookie("fail_cnt");
    if (!fail) fail = 0;
    fail = parseInt(fail) + 1;
    setCookie("fail_cnt", fail, 1);

    if (fail >= 3) {
        alert("로그인 3회 실패. 로그인이 제한됩니다.");
        document.getElementById("login_btn").disabled = true;
    } else {
        alert("로그인 실패 횟수: " + fail);
    }
}

function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if(get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
    session_check(); // 세션 유무 검사
    }
}

function init_logined(){
    if(sessionStorage){
    decrypt_text(); // 복호화 함수
    }
    else{
    alert("세션 스토리지 지원 x");
    }
}
    



const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const c = '아이디, 패스워드를 체크합니다';
    alert(c);

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);
    const idsave_check = document.getElementById('idSaveCheck');


    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        return false;
    }

    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        return false;
    }

    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        return false;
    }

    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        return false;
    }

    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
    const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    if (!sanitizedEmail) {
        return false;
    }

    if (!sanitizedPassword) {
        return false;
    }

    if(idsave_check.checked == true) { // 아이디 체크 o
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1); // 1일 저장
        alert("쿠키 값 :" + emailValue);
        }
        else{ // 아이디 체크 x
        setCookie("id", emailValue.value, 0); //날짜를 0 - 쿠키 삭제
    } 

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    
    session_set(); // 세션 생성
    loginForm.submit();
};

window.onload = () => {
    document.getElementById("login_btn").addEventListener('click', check_input);
};
