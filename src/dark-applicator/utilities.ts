import $ from "jquery"

/**
 * Elementが所属しているクラスのCSSの変更を恒久的に適用する関数
 * 
 * @param {JQuery<HTMLElement>} element 変更したいHTMLElement
 * @param {string} property CSSの内容({}は不要)
 * @param {string} pseudoClass 疑似クラス(必要な場合のみ, ":"は不要)
 * @param {number} classNumber 何番目のクラスに適用するかの値(手動指定する場合のみ、デフォルトは最後尾(最優先のクラス))
 */
 export function classCSSPatcher(element: any, property: any, pseudoClass: any, classNumber: any) {
  //所属しているクラス一覧を取得し、クラス名の一文字目に.を付け、配列化
  const elementClassArrary = ("." + element.attr("class").split(' ').join(' .')).split(' ');

  //クラスの番号を決定する
  let className = null;
  if (classNumber) {
    className = elementClassArrary[classNumber];
  } else {
    //指定されていない場合は最後尾(最優先)のクラスに設定する
    className = elementClassArrary[elementClassArrary.length - 1]
  }

  //headにstyleを追加
  if (pseudoClass) {
    //疑似クラスが必要な場合
    $("head").append("<style> " + className + ":" + pseudoClass + " { " + property + " }</style>");
  } else {
    $("head").append("<style> " + className + " { " + property + " }</style>");
  }
}

/**
 * ホーム系のページにおいて、URLの変更を検知し、検知後にapplyDarkHomePageを実行する関数
 */
export function URLTracker() {
  const HTMLbody = $("body")[0];

  //bodyの中身に変化があったときに実行
  const observer = new MutationObserver(records => {
    chrome.storage.local.get("nowPage", function (data: any) {
      const path = location.pathname;
      //URLが変わった時に実行するもの
      if (!(data.nowPage == path)) {
        //クラスにCSSを適用する時に必要なelementを探して、作られた時にapplyDarkNewHomeCentor()を実行
        if (path.match(/questions\/new/)) {
          Home_needElementSearcher("form > div > div:nth-child(2) > div:nth-child(1)");
        } else if (path.match(/questions\/\d+/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)");
        } else if (path.match(/questions/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > a");
        } else if (path.match(/lessons/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div > div > div:nth-child(1) > div > a");
        } else if (path.match(/home/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > a > div > div:nth-child(2) > div:nth-child(3) > div > div");
        } else if (path.match(/genres/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > h1")
        } else if (path.match(/setting/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3)");
        } else if (path.match(/notices|courses\/\d+\/chapters/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div:nth-child(2) > div > div > a > div");
        } else if (path.match(/package/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > ul:nth-child(2) > li > a");
        } else if (path.match(/my_course/)) {
          Home_needElementSearcher("#root > div > div > div > div:nth-child(1) > div > div:nth-child(2) >  div:nth-child(1) > div > div > div > div > button");
        } else if (path.match(/courses/)) {
          Home_needElementSearcher("#root > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)");
        } else {
          location.reload();
        }
        chrome.storage.local.set({ 'nowPage': path });
      }
    });
  });

  //bodyの変化の監視を開始
  observer.observe(HTMLbody, {
    childList: true
  });
}

/**
 *  [Home系ページ用] 入力されたパスにelementが作られた時に、applyDarkHomePage()を実行する関数 
 */
 export function Home_needElementSearcher(obj: any) {
  let interval: any = null;
  let err = false;
  //100ms毎に存在するか確認、存在するか10秒待っても出なかったら停止
  interval = setInterval(function () {
    if ($(obj).length) {
      try {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'applyDarkNewHomeCentor'.
        applyDarkNewHomeCentor();
      } catch { err = true; }
      if (!err) {
        clearInterval(interval);
      }
    }
  }, 100);
  setTimeout(function () {
    clearInterval(interval);
  }, 10000);
}

/**
 * 上部のバーにダークモードを適用する関数
 */
 export function applyDarkTopBar() {
  const topBar = $("#root > div > div > div").eq(0);

  //ダークモード適用
  const apply = () => {
    
    classCSSPatcher(topBar, "background-color: #222222;",false,false);
    //各種リンクの文字色を白にする
    const topBarButtons = topBar.find("div > div > div > a");
    topBarButtons.css("color", "#FFFFFF");
    classCSSPatcher(topBarButtons,"color: #FFFFFF",false,false);
    //アカウント設定などが選択できる場所にダークモード適用
    const userProfile = topBar.find("div > div > div > div").eq(3);
    classCSSPatcher(userProfile, "background-color: #202124;",false,false);
    classCSSPatcher(userProfile.find("div:nth-child(1)"), "color: #FFFFFF;",false,false); 
    classCSSPatcher(userProfile.find("div:nth-child(2) > a"), "background-color: #383838;", "hover",false);
    classCSSPatcher(userProfile.find("div:nth-child(3) > a"), "background-color: #383838;", "hover",false);
  }
  //初回実行
  apply();

  //バーが変化した時に実行するコード
  const observer = new MutationObserver(records => {
    //改めてダークモード適用
    apply();
  });
  //バーの中身の変化の監視を開始
  observer.observe(topBar[0], {
    attributes: true,
    attributeFilter: ['class']
  });
}