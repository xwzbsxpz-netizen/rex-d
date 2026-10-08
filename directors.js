WidgetMetadata = {
  id: "tv.rex.module.directors",
  title: "精选导演",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  author: "xwzbsxpz-netizen",
  type: "home"
};

const GITHUB_BASE_URL = "https://raw.githubusercontent.com/xwzbsxpz-netizen/rex-d/main/";

const DIRECTORS_LIST = [
  { tmdbId: 525, name: "Christopher Nolan", filename: "20261008-012442(1).png" },
  { tmdbId: 137427, name: "Denis Villeneuve", filename: "20261008-012442(2).png" },
  { tmdbId: 7467, name: "David Fincher", filename: "20261008-012442(3).png" },
  { tmdbId: 138, name: "Quentin Tarantino", filename: "20261008-012442(4).png" },
  { tmdbId: 2710, name: "James Cameron", filename: "20261008-012442(5).png" },
  { tmdbId: 488, name: "Steven Spielberg", filename: "20261008-012442(6).png" },
  { tmdbId: 578, name: "Ridley Scott", filename: "20261008-012442(7).png" },
  { tmdbId: 2636, name: "Alfred Hitchcock", filename: "20261008-012442(8).png" },
  { tmdbId: 1032, name: "Martin Scorsese", filename: "20261008-012442(9).png" },
  { tmdbId: 240, name: "Stanley Kubrick", filename: "20261008-012442(10).png" },
  { tmdbId: 663, name: "Brian De Palma", filename: "20261008-012442(11).png" },
  { tmdbId: 5655, name: "Wes Anderson", filename: "20261008-012442(12).png" },
  { tmdbId: 21684, name: "Bong Joon-ho", filename: "20261008-012442(13).png" },
  { tmdbId: 608, name: "Hayao Miyazaki", filename: "20261008-012442(14).png" },
  { tmdbId: 12453, name: "Wong Kar-wai", filename: "20261008-012442(15).png" }
];

async function getHomeSections() {
  return [
    {
      id: "section_directors",
      title: "Featured Directors",
      style: "landscape",
      aspectRatio: 1.78,
      items: DIRECTORS_LIST.map(item => ({
        id: `person_${item.tmdbId}`,
        title: item.name,
        backdropPath: GITHUB_BASE_URL + item.filename,
        type: "person",
        action: "open_person",
        target: "rex://person/detail", 
        params: {
          id: item.tmdbId,
          name: item.name,
          role: "director"
        }
      }))
    }
  ];
}
