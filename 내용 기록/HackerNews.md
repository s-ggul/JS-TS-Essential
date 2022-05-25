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
- 여기서 해시는 주소에 붙어있고, location객테에 hash속성을 이용해서 데이터를 넘겨준다.
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