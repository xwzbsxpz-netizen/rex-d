WidgetMetadata = {
  id: "tv.rex.directors",
  title: "精选导演",
  version: "5.0.0",
  requiredVersion: "0.0.1",
  description: "15位精选导演及其参与电影",
  author: "xwzbsxpz-netizen",
  site: "https://github.com/xwzbsxpz-netizen/rex-d",
  detailCacheDuration: 86400,

  modules: [
    {
      id: "loadList",
      title: "精选导演",
      functionName: "loadList",
      cacheDuration: 86400,
      params: []
    }
  ]
};


const GITHUB_BASE =
  "https://raw.githubusercontent.com/xwzbsxpz-netizen/rex-d/main/";


const DIRECTORS = [
  {
    id: 7467,
    name: "David Fincher",
    image: "F0D3A6EC-27D5-4E8E-8534-5DD70A21E194.png"
  },
  {
    id: 1032,
    name: "Martin Scorsese",
    image: "DC97837C-246A-4DE6-906E-3805F33885BA.png"
  },
  {
    id: 21684,
    name: "Bong Joon-ho",
    image: "C1720B30-044A-4806-A174-795C891DBB1E.png"
  },
  {
    id: 137427,
    name: "Denis Villeneuve",
    image: "A3FF88C1-4F0D-4FFE-AB43-0E5EAEBAB7E5.png"
  },
  {
    id: 488,
    name: "Steven Spielberg",
    image: "A16FB9CD-61E9-4338-9DDC-72E30908642D.png"
  },
  {
    id: 5655,
    name: "Wes Anderson",
    image: "87137BC2-7623-42FE-8844-4C5BA248A566.png"
  },
  {
    id: 12453,
    name: "Wong Kar-wai",
    image: "7ADC0F26-E55A-440D-A0E8-1F04E2AE599E.png"
  },
  {
    id: 138,
    name: "Quentin Tarantino",
    image: "622D5640-F5FD-44EA-A8B9-0FF573BA10F2.png"
  },
  {
    id: 240,
    name: "Stanley Kubrick",
    image: "4B534917-2209-4D80-9756-496EFF627178.png"
  },
  {
    id: 663,
    name: "Brian De Palma",
    image: "44982E9E-774E-480F-8636-5B8F43406A2E.png"
  },
  {
    id: 525,
    name: "Christopher Nolan",
    image: "334AC1E0-9B22-4E49-AD1B-C0C8FEA32CE7.png"
  },
  {
    id: 2636,
    name: "Alfred Hitchcock",
    image: "2964E7B1-C1C0-4640-A89C-99C23F8A6B32.png"
  },
  {
    id: 578,
    name: "Ridley Scott",
    image: "20AE0819-A804-4A59-88EB-35DFAE4E2B82.png"
  },
  {
    id: 2710,
    name: "James Cameron",
    image: "0AFEFF6D-E1DE-462B-A89C-C4A69DD7B8C4.png"
  },
  {
    id: 608,
    name: "Hayao Miyazaki",
    image: "05DD4577-A3F8-4FD4-97C3-99CE9BF4CBB6.png"
  }
];


function imageUrl(filename) {
  return GITHUB_BASE + filename;
}


/*
 * ============================================
 * 首页：15 位导演海报
 * ============================================
 *
 * 每一张导演图都是独立的 posterPath。
 *
 * 点击后：
 *
 * director:7467
 * director:1032
 * director:21684
 * ...
 *
 * 会进入 loadDetail()
 */
async function loadList(params) {

  return DIRECTORS.map((director) => {

    const link =
      "director:" + director.id;

    const image =
      imageUrl(director.image);

    return {

      id: link,

      type: "url",

      title: director.name,

      /*
       * 竖版导演海报
       *
       * 官方推荐 portrait slot 使用 posterPath。
       */
      posterPath: image,

      /*
       * 通用兜底。
       */
      coverUrl: image,

      /*
       * 如果客户端当前卡片使用横图位，
       * 也仍然可以显示。
       */
      backdropPath: image,

      /*
       * 点击导演后由 loadDetail(link) 处理。
       */
      link: link

    };

  });

}


/*
 * ============================================
 * 点击导演海报
 * ============================================
 *
 * 这里不再返回：
 *
 * {
 *   title: "David Fincher",
 *   relatedItems: [...]
 * }
 *
 * 那样会生成导演人物详情页。
 *
 * 现在直接返回电影数组。
 */
async function loadDetail(link) {

  const key =
    String(link || "");

  if (!key.startsWith("director:")) {
    return null;
  }


  const id =
    Number(
      key.slice("director:".length)
    );

  if (!Number.isFinite(id)) {
    return null;
  }


  const director =
    DIRECTORS.find(
      item => item.id === id
    );

  if (!director) {
    return null;
  }


  /*
   * TMDB：
   *
   * cast + crew
   *
   * 一次性获取这个人的全部影视参与记录。
   */
  const credits =
    await Widget.tmdb.get(
      "person/" + id + "/combined_credits",
      {
        params: {
          language: "zh-CN"
        }
      }
    );


  if (!credits) {
    return [];
  }


  const movies = [];

  const seen =
    new Set();


  function addMovie(item) {

    if (!item || !item.id) {
      return;
    }


    /*
     * 只要电影。
     *
     * TV、TV Episode 等全部排除。
     */
    if (
      item.media_type !==
      "movie"
    ) {
      return;
    }


    const movieId =
      String(item.id);


    /*
     * 同一电影可能同时出现在
     * cast 和 crew。
     *
     * 所以去重。
     */
    if (seen.has(movieId)) {
      return;
    }

    seen.add(movieId);


    movies.push({

      id: item.id,

      /*
       * Forward 原生 TMDB 类型。
       */
      type: "tmdb",

      mediaType: "movie",

      title:
        item.title ||
        item.name ||
        "",

      posterPath:
        item.poster_path ||
        null,

      backdropPath:
        item.backdrop_path ||
        null,

      releaseDate:
        item.release_date ||
        "",

      rating:
        typeof item.vote_average ===
        "number"
          ? item.vote_average
          : 0,

      description:
        item.overview ||
        ""

    });

  }


  /*
   * ============================================
   * CAST
   * ============================================
   */
  if (
    Array.isArray(
      credits.cast
    )
  ) {

    for (
      const item
      of credits.cast
    ) {

      addMovie(item);

    }

  }


  /*
   * ============================================
   * CREW
   * ============================================
   *
   * 不限制：
   *
   * department
   * job
   *
   * 因为你要的是：
   *
   * “参与过的全部电影”
   */
  if (
    Array.isArray(
      credits.crew
    )
  ) {

    for (
      const item
      of credits.crew
    ) {

      addMovie(item);

    }

  }


  /*
   * ============================================
   * 排序
   * ============================================
   *
   * 最新电影在前。
   */
  movies.sort(
    (a, b) => {

      return String(
        b.releaseDate || ""
      ).localeCompare(
        String(
          a.releaseDate || ""
        )
      );

    }
  );


  /*
   * 最关键：
   *
   * 直接返回电影数组。
   *
   * Forward 会把这些当作列表项目展示。
   */
  return movies;

}
