WidgetMetadata = {
  id: "tv.rex.directors",
  title: "精选导演",
  version: "4.0.0",
  requiredVersion: "0.0.1",
  description: "15位精选导演及其参与电影",
  author: "xwzbsxpz-netizen",
  site: "https://github.com/xwzbsxpz-netizen/rex-d",
  detailCacheDuration: 86400,

  modules: [
    {
      id: "directorMovies",
      title: "精选导演",
      description: "选择导演查看其参与的全部电影",
      functionName: "directorMovies",
      cacheDuration: 86400,

      params: [
        {
          name: "directorId",
          title: "导演",
          type: "enumeration",
          description: "选择一位导演",
          value: "7467",

          enumOptions: [
            {
              title: "David Fincher",
              value: "7467"
            },
            {
              title: "Martin Scorsese",
              value: "1032"
            },
            {
              title: "Bong Joon-ho",
              value: "21684"
            },
            {
              title: "Denis Villeneuve",
              value: "137427"
            },
            {
              title: "Steven Spielberg",
              value: "488"
            },
            {
              title: "Wes Anderson",
              value: "5655"
            },
            {
              title: "Wong Kar-wai",
              value: "12453"
            },
            {
              title: "Quentin Tarantino",
              value: "138"
            },
            {
              title: "Stanley Kubrick",
              value: "240"
            },
            {
              title: "Brian De Palma",
              value: "663"
            },
            {
              title: "Christopher Nolan",
              value: "525"
            },
            {
              title: "Alfred Hitchcock",
              value: "2636"
            },
            {
              title: "Ridley Scott",
              value: "578"
            },
            {
              title: "James Cameron",
              value: "2710"
            },
            {
              title: "Hayao Miyazaki",
              value: "608"
            }
          ]
        }
      ]
    }
  ]
};


const DIRECTORS = [
  {
    id: 7467,
    name: "David Fincher"
  },
  {
    id: 1032,
    name: "Martin Scorsese"
  },
  {
    id: 21684,
    name: "Bong Joon-ho"
  },
  {
    id: 137427,
    name: "Denis Villeneuve"
  },
  {
    id: 488,
    name: "Steven Spielberg"
  },
  {
    id: 5655,
    name: "Wes Anderson"
  },
  {
    id: 12453,
    name: "Wong Kar-wai"
  },
  {
    id: 138,
    name: "Quentin Tarantino"
  },
  {
    id: 240,
    name: "Stanley Kubrick"
  },
  {
    id: 663,
    name: "Brian De Palma"
  },
  {
    id: 525,
    name: "Christopher Nolan"
  },
  {
    id: 2636,
    name: "Alfred Hitchcock"
  },
  {
    id: 578,
    name: "Ridley Scott"
  },
  {
    id: 2710,
    name: "James Cameron"
  },
  {
    id: 608,
    name: "Hayao Miyazaki"
  }
];


async function directorMovies(params = {}) {

  const directorId = String(params.directorId || "");

  if (!directorId) {
    return [];
  }

  const id = Number(directorId);

  if (!Number.isFinite(id)) {
    return [];
  }


  const director = DIRECTORS.find(
    item => item.id === id
  );

  if (!director) {
    return [];
  }


  const credits = await Widget.tmdb.get(
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
  const seen = new Set();


  function addMovie(item) {

    if (!item || !item.id) {
      return;
    }

    /*
     * 只要电影。
     * TV / TV episode / other media 全部排除。
     */
    if (item.media_type !== "movie") {
      return;
    }


    const movieId = String(item.id);

    if (seen.has(movieId)) {
      return;
    }

    seen.add(movieId);


    movies.push({
      id: item.id,

      /*
       * 关键：
       * 这里必须是 tmdb，
       * 点击后进入 Forward 原生 TMDB 详情。
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
        typeof item.vote_average === "number"
          ? item.vote_average
          : 0,

      description:
        item.overview ||
        ""
    });
  }


  /*
   * TMDB combined_credits.cast
   *
   * 包括演员/出演等身份。
   */
  if (Array.isArray(credits.cast)) {

    for (const item of credits.cast) {
      addMovie(item);
    }

  }


  /*
   * TMDB combined_credits.crew
   *
   * 包括导演、编剧、制片、
   * 摄影、剪辑等所有 crew 身份。
   *
   * 不再限制 department。
   */
  if (Array.isArray(credits.crew)) {

    for (const item of credits.crew) {
      addMovie(item);
    }

  }


  /*
   * 最新上映时间在前。
   *
   * 没有日期的项目排在最后。
   */
  movies.sort((a, b) => {

    const dateA = String(
      a.releaseDate || ""
    );

    const dateB = String(
      b.releaseDate || ""
    );

    return dateB.localeCompare(dateA);

  });


  return movies;
}
