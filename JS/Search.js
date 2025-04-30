document.getElementById("search_button_msg").addEventListener('click', search_message);


function search_message() {
    alert("이건 무시될 함수입니다."); // 실제로 실행되지 않음
}
function search_message() {
    let msg = "검색을 수행합니다.";
    alert(msg);

    googleSearch(); 
}

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value.trim(); 
    const bannedWords = ["시발", "병신", "새끼", "지랄", "뻐큐"]; 

    //공백 검사
    if (searchTerm.length === 0) {
        alert("검색어를 입력하세요.");
        return false;
    }

    //비속어 검사 (반복문 + 조건문 + 배열 사용)
    for (let i = 0; i < bannedWords.length; i++) {
        if (searchTerm.includes(bannedWords[i])) {
            alert("비속어는 검색할 수 없습니다.");
            return false;
        }
    }

    //조건 통과 시 구글 검색 수행
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}
