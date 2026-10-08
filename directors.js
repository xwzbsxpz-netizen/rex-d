WidgetMetadata = {
  id: "tv.rex.directors",
  title: "精选导演",
  version: "6.0.0",
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


/* =========================
   首页：15位导演
   ========================= */

async function loadList(params = {}) {

  return DIRECTORS.map((director) => {

    const image = imageUrl(director.image);

    return {
      id: "director:" + director.id,

      /*
       * 必须是 url。
       * 不使用 tmdb，避免被 Forward 当成 TMDB 人物。
       */
      type: "url",

      title: director.name,

      /*
       * 导演海报
       */
      posterPath: image,
      coverUrl: image,
      backdropPath: image,

      /*
       * 点击后交给 loadDetail()
       */
      link: "director:" + director.id
    };

  });

}


/* =========================
   导演 → 参与电影
   ========================= */

async function loadDetail(link) {

  const key = String(link || "");

  if (!key.startsWith("director:")) {
    return null;
  }

  const directorId = Number(
    key.substring("director:".length)
  );

  if (!Number.isFinite(directorId)) {
    return null;
  }

  const credits = await Widget.tmdb.get(
    "person/" + directorId + "/combined_credits",
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
  const seen = new Set();


  function addMovie(item) {

    if (!item || !item.id) {
      return;
    }

    /*
     * 只要电影
     */
    if (item.media_type !== "movie") {
      return;
    }

    const id = String(item.id);

    if (seen.has(id)) {
      return;
    }

    seen.add(id);


    movies.push({

      /*
       * TMDB电影
       */
      id: item.id,
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
        typeof item.vote_average === "number"
          ? item.vote_average
          : 0,

      description:
        item.overview ||
        ""

    });

  }


  /*
   * 演员 / 参演
   */
  if (Array.isArray(credits.cast)) {

    for (const item of credits.cast) {
      addMovie(item);
    }

  }


  /*
   * 所有幕后工作
   */
  if (Array.isArray(credits.crew)) {

    for (const item of credits.crew) {
      addMovie(item);
    }

  }


  /*
   * 最新电影在前
   */
  movies.sort((a, b) => {

    return String(
      b.releaseDate || ""
    ).localeCompare(
      String(a.releaseDate || "")
    );

  });


  return movies;

}
