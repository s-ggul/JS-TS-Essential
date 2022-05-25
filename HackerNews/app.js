const ajax = new XMLHttpRequest();
const container = document.getElementById('root');
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url){
    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

// ajax.open('GET', NEWS_URL, false);
// 세번째 파라미터 옵션은 => true인 경우 비동기로 가져온다는 의미이고 
// false라면 동기적으로 가져오겠다는 의미이다.
// ajax.send(); // 실제 요청을 보내는 함수

// const newsFeed = JSON.parse(ajax.response);
// response로 받아온 때에는 Json의 형태이긴 하지만 string으로 되어있다.
// 따라서 JSON(객체)형태로 변환해줘야한다.
// 응답으로 온 형식이 JSON형태의 문자열인 경우에만 객체로 바꿀 수 있다.
const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

    

window.addEventListener('hashchange', function(){
    const id = location.hash.substring(1); // 첫번째 문자인 #을 제외한 id 값만을 추출
    // location 객체는 브라우저가 기본으로 제공해주는 객체인데, 
    // 주소와 관련한 다양한 정보를 제공한다.
    // 여기서 해시는 주소에 붙어있고 , location 객체에 hash라고하는 속성으로 데이터를 넘겨줌
    
    // ajax.open('GET', CONTENTS_URL.replace('@id', id), false);
    // ajax.send();

    // const newContents = JSON.parse(ajax.response);
    
    const newContents = getData(CONTENTS_URL.replace('@id',id));
    const title = document.createElement('h1');

    title.innerText = newContents.title;

    content.appendChild(title);
});



for(let i = 0; i < 10; i++)
{
    const div = document.createElement('div');
    // innerHTML을 활용하기 위해 DOM 객체를 일단은 생성 임시용 div 태그
    
    div.innerHTML = `<li>
                        <a href='#${newsFeed[i].id}'>
                        ${newsFeed[i].title} (${newsFeed[i].comments_count})         
                        </a>
                    </li>`
    
    ul.appendChild(div.firstElementChild);
    // div.firstElementChild === div.children[0]
}

container.appendChild(ul);
container.appendChild(content);

/* 
a 태그에 넣어놓은 #을 해시라고 하는데     
해시는 일종의 북마크로 페이지 내에서
어떤 앵커태그의 name이라고 하는 속성과 같은 해시명이 들어오면 그 위치로 바로 스크롤링 되게 만든 기능
여기서 해시가 바뀔때 발생하는 이벤트가 'hashchange'라고하는 이벤트이다. 
이를 이용하면 이벤트를 한번만 등록하여 어떤 링크, 어떤 타이틀이 클릭된 것을 파악하고 사용할 수 있다.
hashchange는 window 객체에서 발생한다.
*/

