WidgetMetadata = {
  id: "tv.rex.directors",
  title: "精选导演",
  version: "1.4.0",
  requiredVersion: "0.0.1",
  description: "15位精选导演",
  author: "xwzbsxpz-netizen",
  site: "https://github.com/xwzbsxpz-netizen/rex-d",
  
  // 恢复规范强制要求的 modules 数组
  modules: [
    {
      id: "loadList",
      title: "Featured Directors",
      functionName: "loadList",
      cacheDuration: 86400,
      params: []
    }
  ]
};

const GITHUB_BASE = "https://raw.githubusercontent.com/xwzbsxpz-netizen/rex-d/main/";

const DIRECTORS = [
  { id: 7467, name: "David Fincher", image: "F0D3A6EC-27D5-4E8E-8534-5DD70A21E194.png" },
  { id: 1032, name: "Martin Scorsese", image: "DC97837C-246A-4DE6-906E-3805F33885BA.png" },
  { id: 21684, name: "Bong Joon-ho", image: "C1720B30-044A-4806-A174-795C891DBB1E.png" },
  { id: 137427, name: "Denis Villeneuve", image: "A3FF88C1-4F0D-4FFE-AB43-0E5EAEBAB7E5.png" },
  { id: 488, name: "Steven Spielberg", image: "A16FB9CD-61E9-4338-9DDC-72E30908642D.png" },
  { id: 5655, name: "Wes Anderson", image: "87137BC2-7623-42FE-8844-4C5BA248A566.png" },
  { id: 12453, name: "Wong Kar-wai", image: "7ADC0F26-E55A-440D-A0E8-1F04E2AE599E.png" },
  { id: 138, name: "Quentin Tarantino", image: "622D5640-F5FD-44EA-A8B9-0FF573BA10F2.png" },
  { id: 240, name: "Stanley Kubrick", image: "4B534917-2209-4D80-9756-496EFF627178.png" },
  { id: 663, name: "Brian De Palma", image: "44982E9E-774E-480F-8636-5B8F43406A2E.png" },
  { id: 525, name: "Christopher Nolan", image: "334AC1E0-9B22-4E49-AD1B-C0C8FEA32CE7.png" },
  { id: 2636, name: "Alfred Hitchcock", image: "2964E7B1-C1C0-4640-A89C-99C23F8A6B32.png" },
  { id: 578, name: "Ridley Scott", image: "20AE0819-A804-4A59-88EB-35DFAE4E2B82.png" },
  { id: 2710, name: "James Cameron", image: "0AFEFF6D-E1DE-462B-A89C-C4A69DD7B8C4.png" },
  { id: 608, name: "Hayao Miyazaki", image: "05DD4577-A3F8-4FD4-97C3-99CE9BF4CBB6.png" }
];

async function loadList(params) {
  return DIRECTORS.map(director => ({
    id: director.id,
    
    // 核心修改：弃用 url，声明为原生 tmdb 人物类型，触发系统内置聚合机制
    type: "tmdb",
    mediaType: "person", 
    title: director.name,
    
    // 同时赋予两个字段，确保在宽列表或竖列表中都能加载出你的自定义图片
    backdropPath: GITHUB_BASE + director.image,
    posterPath: GITHUB_BASE + director.image
  }));
}
