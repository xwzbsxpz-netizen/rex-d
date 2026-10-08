WidgetMetadata = {
  id: "tv.rex.directors",
  title: "精选导演",
  version: "1.7.0",
  requiredVersion: "0.0.1",
  description: "15位精选导演",
  author: "xwzbsxpz-netizen",
  site: "https://github.com/xwzbsxpz-netizen/rex-d",
  detailCacheDuration: 86400,
  modules: [
    {
      id: "loadList",
      title: "Directors",
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


/**
 * 导演列表
 *
 * 每一位导演本身是一个 URL 类型的入口。
 *
 * 例如：
 *
 * David Fincher
 *      ↓
 * director:7467
 *
 * Martin Scorsese
 *      ↓
 * director:1032
 */
async function loadList(params) {
  return DIRECTORS.map((director) => {
    const link = "director:" + director.id;
    const image = imageUrl(director.image);

    return {
      id: link,
      type: "url",

      title: director.name,

      // 导演自己的图片
      posterPath: image,
      backdropPath: image,

      // 点击后交给 loadDetail()
      link: link
    };
  });
}


/**
 * 导演作品列表
 *
 * 点击某位导演以后：
 *
 * director:id
 *      ↓
 * person/id/combined_credits
 *      ↓
 * cast + crew
 *      ↓
 * 只保留 movie
 *      ↓
 * 去重
 *      ↓
 * 返回这个导演参与过的所有电影
 */
async function loadDetail(link) {
  const key = String(link || "");

  // 不是我们的导演链接，直接忽略
  if (!key.startsWith("director:")) {
    return null;
  }

  // 提取 TMDB person ID
  const id = Number(
    key.slice("director:".length)
  );

  if (!Number.isFinite(id)) {
    return null;
  }


  /**
   * 获取导演完整影视参与记录
   *
   * combined_credits 中包含：
   *
   * cast
   * crew
   *
   * 这里两个都读取。
   */
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


  const works = [];

  // 防止同一部电影同时出现在 cast / crew 中
  const seen = {};


  /**
   * 处理电影
   *
   * cast 和 crew 使用完全相同的处理逻辑，
   * 最终合并成一个电影列表。
   */
  function addMovie(item) {
    if (!item || !item.id) {
      return;
    }

    // 只要电影
    //
    // 不显示 TV
    // 不显示 TV Movie
    // 不显示其他媒体类型
    if (item.media_type !== "movie") {
      return;
    }

    const workKey = "movie:" + item.id;

    // 去重
    if (seen[workKey]) {
      return;
    }

    seen[workKey] = true;


    works.push({
      id: item.id,

      // TMDB 内置详情
      type: "tmdb",

      mediaType: "movie",

      title:
        item.title ||
        item.name ||
        "",

      posterPath:
        item.poster_path || null,

      backdropPath:
        item.backdrop_path || null,

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


  /**
   * =========================
   * Cast
   * =========================
   *
   * 导演如果同时在某些电影里担任演员，
   * 这些电影也会被纳入。
   */
  if (Array.isArray(credits.cast)) {
    for (const item of credits.cast) {
      addMovie(item);
    }
  }


  /**
   * =========================
   * Crew
   * =========================
   *
   * 不限制 department。
   *
   * 不限制 job。
   *
   * 只要 TMDB 的 crew 中有这部电影，
   * 就把它作为这个人的参与电影加入。
   */
  if (Array.isArray(credits.crew)) {
    for (const item of credits.crew) {
      addMovie(item);
    }
  }


  /**
   * =========================
   * 按上映日期排序
   * =========================
   *
   * 新片在前。
   *
   * 没有上映日期的电影放到最后。
   */
  works.sort((a, b) => {
    const dateA = String(a.releaseDate || "");
    const dateB = String(b.releaseDate || "");

    if (!dateA && !dateB) {
      return 0;
    }

    if (!dateA) {
      return 1;
    }

    if (!dateB) {
      return -1;
    }

    return dateB.localeCompare(dateA);
  });


  /**
   * 直接返回电影数组。
   *
   * 不返回：
   *
   * person
   * biography
   * profile_path
   * relatedItems
   *
   * 因此点击导演后不会再进入
   * “大卫·芬奇个人详情页”。
   */
  return works;
}
