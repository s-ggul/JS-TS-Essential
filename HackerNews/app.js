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

