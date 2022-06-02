const ajax = new XMLHttpRequest();
const container = document.getElementById('root');
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
    currentPage : 1,
    feeds:[],
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
    let template = `
    <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
        <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
                </a>
            </div>
            </div> 
        </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
        </div>
    </div>
    `;
    
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage*10; i++)
    {
        newsList.push(`
        <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
            <div class="flex">
            <div class="flex-auto">
                <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
            </div>
            <div class="text-center text-sm">
                <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
            </div>
            </div>
            <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
                <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
                <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
                <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
            </div>  
            </div>
        </div>    
      `);   
    }
    
    template = template.replace('{{__news_feed__}}', newsList.join(''));
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
    template = template.replace('{{__next_page__}}', store.currentPage === maxPage ? store.currentPage: store.currentPage + 1);

    container.innerHTML = template;
}

function newsDetail(){
    const id = location.hash.substring(7); 
    
    const newsContent = getData(CONTENTS_URL.replace('@id',id));

    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
    `;

    // comment(댓글)의 경우 comment에 하위에 또 comment가 있는 depth 가 깊어지는 형태로 되어있어 
    // 총 comment가 몇개인지 알기 어렵다. 그러한 데이터를 처리하는데 있어 채택할 수 있는 방법을 강구한다.
    // comment의 ui를 만드는 것은 함수로 만들어야 함은 자명하다. => 댓글이 여러개다 라고 생각하면 반복해서 불리는 구조일테니 UI를 만들기위해 함수로 정의한다.
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
                // 재귀호출을 통해 해당 댓글의 댓글 대댓글... 까지 모두 달아준다.
                // 이렇게 끝을 알 수 없는 구조에 자주 사용되는 테크닉이고 익숙해져야한다.
            }
        }

        return commentString.join('');
    }

    container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
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

