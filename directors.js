WidgetMetadata = {
  id: "tv.rex.directors",
  title: "精选导演",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  description: "15位精选导演",
  author: "xwzbsxpz-netizen",
  site: "https://github.com/xwzbsxpz-netizen/rex-d",

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

/*
 * 图片顺序：
 *
 * 1  David Fincher
 * 2  Martin Scorsese
 * 3  Bong Joon-ho
 * 4  Denis Villeneuve
 * 5  Steven Spielberg
 * 6  Wes Anderson
 * 7  Wong Kar-wai
 * 8  Quentin Tarantino
 * 9  Stanley Kubrick
 * 10 Brian De Palma
 * 11 Christopher Nolan
 * 12 Alfred Hitchcock
 * 13 Ridley Scott
 * 14 James Cameron
 * 15 Hayao Miyazaki
 */

const DIRECTORS = [
  {
    id: 7467,
    name: "David Fincher",
    image: "05DD4577-A3F8-4FD4-97C3-99CE9BF4CBB6.png"
  },
  {
    id: 1032,
    name: "Martin Scorsese",
    image: "0AFEFF6D-E1DE-462B-A89C-C4A69DD7B8C4.png"
  },
  {
    id: 21684,
    name: "Bong Joon-ho",
    image: "20AE0819-A804-4A59-88EB-35DFAE4E2B82.png"
  },
  {
    id: 137427,
    name: "Denis Villeneuve",
    image: "2964E7B1-C1C0-4640-A89C-99C23F8A6B32.png"
  },
  {
    id: 488,
    name: "Steven Spielberg",
    image: "334AC1E0-9B22-4E49-AD1B-C0C8FEA32CE7.png"
  },
  {
    id: 5655,
    name: "Wes Anderson",
    image: "44982E9E-774E-480F-8636-5B8F43406A2E.png"
  },
  {
    id: 12453,
    name: "Wong Kar-wai",
    image: "4B534917-2209-4D80-9756-496EFF627178.png"
  },
  {
    id: 138,
    name: "Quentin Tarantino",
    image: "622D5640-F5FD-44EA-A8B9-0FF573BA10F2.png"
  },
  {
    id: 240,
    name: "Stanley Kubrick",
    image: "7ADC0F26-E55A-440D-A0E8-1F04E2AE599E.png"
  },
  {
    id: 663,
    name: "Brian De Palma",
    image: "87137BC2-7623-42FE-8844-4C5BA248A566.png"
  },
  {
    id: 525,
    name: "Christopher Nolan",
    image: "A16FB9CD-61E9-4338-9DDC-72E30908642D.png"
  },
  {
    id: 2636,
    name: "Alfred Hitchcock",
    image: "A3FF88C1-4F0D-4FFE-AB43-0E5EAEBAB7E5.png"
  },
  {
    id: 578,
    name: "Ridley Scott",
    image: "C1720B30-044A-4806-A174-795C891DBB1E.png"
  },
  {
    id: 2710,
    name: "James Cameron",
    image: "DC97837C-246A-4DE6-906E-3805F33885BA.png"
  },
  {
    id: 608,
    name: "Hayao Miyazaki",
    image: "F0D3A6EC-27D5-4E8E-8534-5DD70A21E194.png"
  }
];

function getImageUrl(filename) {
  return GITHUB_BASE + filename;
}

async function loadList(params = {}) {
  return DIRECTORS.map((director) => {
    const link = "director:" + director.id;

    return {
      id: link,
      type: "url",
      title: director.name,
      coverUrl: getImageUrl(director.image),
      link: link
    };
  });
}

async function loadDetail(link) {
  const value = String(link || "");

  if (!value.startsWith("director:")) {
    return null;
  }

  const id = Number(value.slice("director:".length));

  if (!Number.isFinite(id)) {
    return null;
  }

  const person = await Widget.tmdb.get(
    "person/" + id,
    {
      params: {
        language: "zh-CN"
      }
    }
  );

  if (!person) {
    return null;
  }

  const credits = await Widget.tmdb.get(
    "person/" + id + "/combined_credits",
    {
      params: {
        language: "zh-CN"
      }
    }
  );

  const works = [];

  if (credits && Array.isArray(credits.crew)) {
    for (const item of credits.crew) {

      if (!item || !item.id) {
        continue;
      }

      if (item.department !== "Directing") {
        continue;
      }

      if (
        item.job &&
        item.job !== "Director" &&
        item.job !== "Co-Director"
      ) {
        continue;
      }

      const mediaType =
        item.media_type === "tv"
          ? "tv"
          : "movie";

      works.push({
        id: item.id,
        type: "tmdb",
        mediaType: mediaType,
        title: item.title || item.name || "",
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        releaseDate:
          item.release_date ||
          item.first_air_date,
        rating: item.vote_average
      });
    }
  }

  return {
    id: value,
    type: "url",
    title: person.name || "",
    link: value,
    description: person.biography || "",
    relatedItems: works.slice(0, 30)
  };
}
