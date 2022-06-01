## Hacker News 공부 내용

--- 

<br />

```js
ajax.open('GET', NEWS_URL, false);
// 세번째 파라미터 옵션은 => true인 경우 비동기로 가져온다는 의미이고 
// false라면 동기적으로 가져오겠다는 의미이다.
ajax.send(); // 실제 요청을 보내는 함수

const newsFeed = JSON.parse(ajax.response);
// response로 받아온 때에는 Json의 형태이긴 하지만 string으로 되어있다.
// 따라서 JSON(객체)형태로 변환해줘야한다.
// 응답으로 온 형식이 JSON형태의 문자열인 경우에만 객체로 바꿀 수 있다.
```

- ajax.open()을 이용해 요청할 내용을 명시하고 send()를 통해 요청을 시도할 수 있다.
- ajax.open()의 인자로는 `1. 요청 방식`, `2. Url`, `3. 비동기여부(true면 비동기)` 
- ajax.send()를 수행하면 ajax.response에 응답결과가 저장되고, 그 결과는 Json의 형태이긴 하나 string으로 되어있다. 따라서 JSON 형태로 바꿔주기 위해 JSON.parse()를 이용한다. 
- 단, 응답으로 온 형식이 JSON 형태의 문자열인 경우에만 객체로 바꿀 수 있다.


<br />


```js
window.addEventListener('hashchange', function(){
    const id = location.hash.substring(1); 
    // substring => 첫번째 문자인 #을 제외한 id 값만을 추출
    // location 객체는 브라우저가 기본으로 제공해주는 객체인데, 
    // 주소와 관련한 다양한 정보를 제공한다.
    // 여기서 해시는 주소에 붙어있고 , location 객체에 hash라고하는 속성으로 데이터를 넘겨줌
    
    ajax.open('GET', CONTENTS_URL.replace('@id', id), false);
    ajax.send();

    const newContents = JSON.parse(ajax.response);
    
    const title = document.createElement('h1');

    title.innerText = newContents.title;

    content.appendChild(title);
});
```

- `location` 객체는 브라우저가 기본으로 제공해주는 객체인데, 주소와 관련한 다양한 정보를 제공한다.
- 여기서 해시는 주소에 붙어있고, location객체에 hash속성을 이용해서 데이터를 넘겨준다.
  - `★` `해시`와 `location` 에 대해서 자세히 알아보자. `★`

<br />

```js
for(let i = 0; i < 10; i++)
{
    const div = document.createElement('div');
    // innerHTML을 활용하기 위해 DOM 객체를 일단은 생성 임시용 div 태그
    
    div.innerHTML = `<li>
                        <a href='#${newsFeed[i].id}'>
                        ${newsFeed[i].title} (${newsFeed[i].comments_count})         
                        </a>
                    </li>`
    
    /* 
    a 태그에 넣어놓은 #을 해시라고 하는데     
    해시는 일종의 북마크로 페이지 내에서
    어떤 앵커태그의 name이라고 하는 속성과 같은 해시명이 들어오면 그 위치로 바로 스크롤링 되게 만든 기능
    여기서 해시가 바뀔때 발생하는 이벤트가 'hashchange'라고하는 이벤트이다. 
    이를 이용하면 이벤트를 한번만 등록하여 어떤 링크, 어떤 타이틀이 클릭된 것을 파악하고 사용할 수 있다.
    hashchange는 window 객체에서 발생한다.
    */

    ul.appendChild(div.firstElementChild);
    // div.firstElementChild === div.children[0]
}

container.appendChild(ul);
container.appendChild(content);
```

- `innerHTML`을 사용하기 위해 임시 `div태그`를 이용해 원하는 형태의 HTML 문자열을 넣어주고 마지막에 `ul태그`에는 `div태그`의 `첫번째 자식`만을 붙인다.(`div`를 임시로 쓰고 마지막에 떼어내는 느낌)

<br />

#### 코드 수정 (중복 코드)

기존 코드 

![기존코드](./img/HackerNews%20%EA%B8%B0%EC%A1%B4%20%EC%BD%94%EB%93%9C.PNG)

![수정코드](./img/HackerNews%20%EC%88%98%EC%A0%95%ED%9B%84%20%EC%BD%94%EB%93%9C.PNG)

- 코드를 통해 알 수 있듯이 기존 코드에서는 ajax.open() 및 send 그리고 받아온 response를 JSON.parse()하는 과정이 중복되는 코드가 존재한다. 
- 이렇게 중복되는 코드를 하나의 함수로 처리하여 수정한 코드를 보면 훨씬 깔끔하고 유지보수 측면에서도 좋다.

<br />

#### 화면 처리기 (라우터)

```js
const ajax = new XMLHttpRequest();
const container = document.getElementById('root');
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
    currentPage : 1,
};
// 후에 newsFeed 뿐 아니라 detail에서 목록으로 넘어올 경우에 활용할 수 있으므로, 전역 객체로 설정하여 남겨둔다.

function getData(url){
    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

function newsFeed(){
    const newsFeed = getData(NEWS_URL);
    const newsList = [];
    const maxPage = Math.ceil(newsFeed.length / 10);
    
    newsList.push('<ul>');
    
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage*10; i++)
    {
        newsList.push(`<li>
                            <a href='#/show/${newsFeed[i].id}'>
                            ${newsFeed[i].title} (${newsFeed[i].comments_count})         
                            </a>
                        </li>`);   
    }
    
    newsList.push('</ul>');
    
    // 흔히 쓰이는 기법으로 배열을 html엘리먼트 문자열로 구성하여 DOM API의 사용횟수를 줄인다.
    
    newsList.push(`
        <div>
            <a href='#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}'>이전 페이지</a>
            <a href='#/page/${store.currentPage === maxPage ? store.currentPage: store.currentPage + 1}'>다음 페이지</a>
        </div>
    `);
    // 이전 페이지와 다음 페이지에 대한 해시를 기존 글내용과 다르게 하기 위해 /page/ 추가
    // 이전 페이지와 다음페이지에서 초과해서 넘어갈 수 없도록 방어코드를 추가
    container.innerHTML = newsList.join('');
}

function newsDetail(){
    const id = location.hash.substring(7); 
    
    const newsContent = getData(CONTENTS_URL.replace('@id',id));

    container.innerHTML = `
    <h1>${newsContent.title}</h1>
    
    <div>
        <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
    `;
}

function router(){
    const routePath = location.hash;
    // location.hash에 '#'만 들어가있는 경우에는 빈문자열을 반환한다.
    if(routePath === ''){
        newsFeed();
    }
    else if(routePath.indexOf('#/page/') >= 0){
        // indexOf는 인자로 들어온 문자열이 포함되어 있다면 0 ~ (문자열 길이-1) 까지의 인덱스를 반환한다.
        // 만일 포함되지 않았다면 -1을 반환한다.
        store.currentPage = Number(routePath.substring(7));
        newsFeed();
    }
    else{
        newsDetail();
    }
}

window.addEventListener('hashchange', router);
// 기존 hashchanger의 이벤트 함수가 newsDetail로 작성된 경우 해시가 바뀌면 무조건 글내용을 보여줘 라는 코드이다.
// 이제 hashchange의 이벤트 함수를 route로 해줌으로써 경로의 해시값이 바뀔때마다 어떤 화면으로 가는지 정해준다.

router();
```
- 라우터를 구현함에 있어서 `해시`의 역할은 중요했다.
- 각 페이지의 역할에 따라 `#/page/...` 혹은 `#/show/...`등 해시에 차이를 두고 `해시`가 바뀔때 마다 `router()` 함수가 실행되도록 구현해주었다. 
- 또한 기존에는 `appendChild`를 사용해 DOM을 직접 건드려 `element`를 추가하였는데, 이 경우를 `백틱`을 사용하여 innerHTML에 할당해주는 방식으로 변경해주었고, newsList 배열원소에 `ul` 태그를 추가해 준 뒤 `join('')`메소드를 활용하여 문자열을 만들어 주는 전략을 취할 수도 있음을 배울 수 있었다.
- 또한 `페이징`을 구현하기 위해 전역 객체인 `store`를 사용하여 `currentPage`를 선언한 뒤 해당 `currentPage`를 사용해 목록을 추가해줌으로써 상태를 관리할 수 있게 구현하였다. 
- 이전 페이지와 다음페이지에서의 버그를 잡기위해 `방어코드`를 작성하였다.
- 