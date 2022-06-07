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

---

<br />

#### 코드 수정 (중복 코드)

기존 코드 

![기존코드](./img/HackerNews%20%EA%B8%B0%EC%A1%B4%20%EC%BD%94%EB%93%9C.PNG)

![수정코드](./img/HackerNews%20%EC%88%98%EC%A0%95%ED%9B%84%20%EC%BD%94%EB%93%9C.PNG)

- 코드를 통해 알 수 있듯이 기존 코드에서는 ajax.open() 및 send 그리고 받아온 response를 JSON.parse()하는 과정이 중복되는 코드가 존재한다. 
- 이렇게 중복되는 코드를 하나의 함수로 처리하여 수정한 코드를 보면 훨씬 깔끔하고 유지보수 측면에서도 좋다.

<br />

---

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

---

#### 기존 DOM API방식에서 문자열방식으로 고친뒤 템플릿 방식으로 고치기

```js
function newsFeed(){
    const newsFeed = getData(NEWS_URL);
    const newsList = [];
    const maxPage = Math.ceil(newsFeed.length / 10);
    let template = `
        <div>
            <h1>Hacker News</h1>
            <ul>
                {{__news_feed__}}
            </ul>
            <div>
                <a href='#/page/{{__prev_page__}}'>이전 페이지</a>
                <a href='#/page/'{{__next_page__}}>다음 페이지</a>
            </div>
        </div>
    `;
    
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage*10; i++)
    {
        newsList.push(`<li>
                            <a href='#/show/${newsFeed[i].id}'>
                                ${newsFeed[i].title} (${newsFeed[i].comments_count})         
                            </a>
                        </li>`);   
    }
    
    template = template.replace('{{__news_feed__}}', newsList.join(''));
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
    template = template.replace('{{__next_page__}}', store.currentPage === maxPage ? store.currentPage: store.currentPage + 1);

    container.innerHTML = template;
}
```
- 기존 `newsFeed()` 함수를 DOM API를 사용하는 방식에서 문자열을 사용한 방식으로 변경하였다. 
- 다시 문자열 방식에서 템플릿 형식으로 바꾼형태가 위의 코드이다.
- 이렇게 템플릿 형식으로 바꾸게되면 기존 문자열 방식에서 보다 해당 UI의 구조가 명확하게 보인다.
- 어떤 데이터가 어디에 들어갈 것인지 마킹된 위치도 정확하게 볼 수 있다. 
- 구조적으로 더욱 명확하게 보기 위함이다. => 즉 결국에는 복잡도를 줄이기 위한 기법이다.

---

#### 템플릿 방식의 단점 
- UI 구조를 선명하게 볼 수 있다는 장점이 있는 반면, for문을 이용해서 li 태그를 따로 만들고 마킹된 값의 개수 만큼 `replace()`함수를 호출하는 모습을 확인할 수 있다. 
- 즉, 템플릿 내에 마킹된 값(데이터)의 개수가 많아지면 그만큼 `replace()`함수를 호출해야한다.
- 템플릿 방식을 완전하게 작성하려면 꽤 여러가지 기능(템플릿라이브러리)을 추가해야하는데 난이도가 높다.
- 추천하자면 `Hanldebars`라는 템플릿 라이브러리가 존재한다.
- 해커 뉴스 프로젝트를 `Handlebars`를 사용해보는 것을 적극 추천한다.
- 결과적으로 템플릿 방식은 컨셉만을 알려주기 위해 작성된 코드 구조이고, 실제로 단점이 많기에 잘 사용해야 한다. 이때 완전하게 구현하고 싶다면 `템플릿 라이브러리`를 사용해보자

---

#### UI 입히기

- UI 작업을 한다고 하면 3가지 요소가 추가적으로 들어가야한다.
  - Font
  - 아이콘
  - 디자인
- 공개된 유명한 것중엔 [Font Awesome](https://fontawesome.com/)이라는 사이트가 있다.
    - 초기에는 ICON만 제공하는 사이트였는데 현재는 많은 기능이 추가되었다.
    - 적용하기 위해서는 CDN을 활용한다.
- CDN을 찾는데 도움이 되는 사이트는 [CDNJS](https://cdnjs.com/)라는 사이트가 있다.
- `Font Awesome`에서도 `TailwindCss` 처럼 클래스를 제공하고 Document를 읽어보고 활용할 수 있다. 
- 추가적으로 `Font Awesome`의 클래스명은 `fa ... ` 같은 형태를 가지고 있다.

##### 댓글, 대댓글 구현하기
```js
function newsDetail(){
    
    ... 이전 코드 생략
    
    function makeComment(comments, called = 0){ // called 의 기본값을 0으로 함으로써 초기값을 설정.
        const commentString = [];

        for(let i =0; i < comments.length; i++){
            commentString.push(`
            <div style="padding-left: ${called * 40}px;" class="mt-4">
                <div class="text-gray-400">
                    <i class="fa fa-sort-up mr-2"></i>
                    <strong>${comments[i].user}</strong> ${comments[i].time_ago}
                </div>
                <p class="text-gray-700">${comments[i].content}</p>
            </div>   
            `);

            if(comments[i].comments.length > 0){
                commentString.push(makeComment(comments[i].comments, called + 1));
            }
        }

        return commentString.join('');
    }

    container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
}

```

###### 1. comment와 같이 탐색하기 어려운 데이터를 구현함에 있어 구조 정의하기.
- comment(댓글)의 경우 comment에 하위에 또 comment가 있는 depth 가 깊어지는 형태로 되어있어 총 comment가 몇개인지 알기 어렵다. 그러한 데이터를 처리하는데 있어 채택할 수 있는 방법을 강구한다.
- comment의 ui를 만드는 것은 함수로 만들어야 함은 자명하다. => 댓글이 여러개다 라고 생각하면 반복해서 불리는 구조일테니 UI를 만들기위해 함수로 정의한다.

###### 2. 대댓글, 대대댓글 ... 데이터 탐색하기.
- 재귀호출을 통해 해당 댓글의 댓글 대댓글... 까지 모두 달아준다. => 하나의 comment를 확인할 때 만일 해당 comments의 하위에 comments 배열의 길이가 0보다 큰 경우에 재귀를 수행함.
  - 이렇게 끝을 알 수 없는 데이터 구조에서 해당 데이터를 탐색할 때 자주 사용되는 테크닉이고 익숙해져야한다.

###### 3. 하위 댓글들에 대한 padding-left 계산하기.
- 재귀 호출이 한층씩 깊어질때마다 이전 댓글의 대댓글이라는 의미이기 때문에 `makeComment()`함수의 인자로 called를 추가하여 `depth`가 몇인지 체크하고, 해당 `depth`를 이용해 `padding-left`값에 변화를 준다. 


###### 정리
- 이번 댓글 및 대댓글 구현에서 여러가지 테크닉이 나왔다. `재귀`, `대댓글, 대대댓글 별 padding-left 값 처리` 등등 익숙하지 않더라도 숙달할 수 있도록 해보자.

---

#### 읽은 글 표시하기 위해 상태 관리하기.

- 기능 요구사항으로 글을 클릭해서 들어가면 글을 읽었다는 뜻이고 UI적으로 글을 읽었는지 표시해주기 위해 (마킹해주기 위해) 어떻게 처리할 것인가? => 상태를 추가해 처리한다.

- 이에 대한 여러가지 방식이 있다.
  1. 글마다 가진 `고유의 id` 를 이용해 읽음 표시를 하는 데이터 구조를 만들어서 따로 저장해 놓는 방식
  2. 네트워크를 통해서 뉴스피드를 가져온 데이터에다가 새로운 속성하나를 추가해서 하는 방식

- 여기서는 `2번` 방식을 채택하여 구현한다.
- 후자의 방법을 선택하는 것은 기존 newsFeed를 가져옴에 있어 아래와 같이 코드를 작성하였는데 이렇게 되면 매번 `newsFeed()` 함수를 호출할 때마다 이미 가지고 있는 데이터를 다시 가져오는 비효율성이 존재한다. 

```js
function newsFeed(){
    const newsFeed = getData(NEWS_URL); // 이렇게 되면 페이지가 바뀌어도 필요없는 데이터를 또 다시 요청해서 가지고 와야한다.
    const newsList = [];
    
    ... 이하 코드 생략

}
```

- 이러한 비효율성도 없애면서 사용자가 읽었는지의 상태도 추가로 구현하기 위해 후자의 방식을 택한다.
- 
