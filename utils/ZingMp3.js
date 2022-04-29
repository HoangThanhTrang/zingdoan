let request = require("request-promise");
const { FileCookieStore } = require("tough-cookie-file-store");
const fs = require("fs");

const encrypt = require("./encrypt");

const URL_API = "https://zingmp3.vn";
const API_KEY = "88265e23d4284f25963e6eedac8fbfa3";
const SECRET_KEY = "2aa2d1c561e809b267f3638c4a307aab";
const VERSION = "1.3.13"
const cookiePath = "ZingMp3.json";

if (!fs.existsSync(cookiePath)) fs.closeSync(fs.openSync(cookiePath, "w"));

let cookiejar = request.jar(new FileCookieStore(cookiePath));

request = request.defaults({
  baseUrl: URL_API,
  qs: {
    apiKey: API_KEY,
  },
  gzip: true,
  json: true,
  jar: cookiejar,
});
class ZingMp3 {
  constructor() {
    this.time = null;
  }

  getFullInfo(id) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let data = await Promise.all([
          this.getInfoMusic(id),
          this.getStreaming(id),
        ]);
        resolve({ ...data[0], streaming: data[1] });
      } catch (err) {
        reject(err);
      }
    });
  }

  getSectionPlaylist(id) {
    return this.requestZing({
      path: "/api/v2/playlist/get/section-bottom",
      qs: {
        id,
      },
    });
  }

  async getDetailPlaylist(id) {
    return await this.requestZing({
      path: "/api/v2/page/get/playlist",
      qs: {
        id,
      },
    });
  }
  async getPlaylistSong(id) {
    return await this.requestZing({
      path: "/api/v2/song/get/list",
      qs: {
        count: 500,
        id,
        start: 0,
        type: 'playlist',
        version: '1.3.13'
      },
      haveParam: 2
    });
  }

  getDetailArtist(alias) {
    return this.requestZing({
      path: "/api/v2/artist/getDetail",
      qs: {
        alias,
      },
      haveParam: 1,
    });
  }

  getInfoMusic(id) {
    return this.requestZing({
      path: "/api/v2/song/getInfo",
      qs: {
        id,
      },
    });
  }

    getStreaming(id) {
    return this.requestZing({
      path: "/api/v2/song/get/streaming",
      qs: {
        id,
      },
    });
  }
  getSongRecommend(id) {
    return this.requestZing({
      path: "/api/v2/recommend/get/songs",
      qs: {
        id,
      },
    });
  }

  getHome(page = 1) {
    return this.requestZing({
      path: "/api/v2/page/get/home",
      qs: {
        page,
      },
    });
  }

  getChartHome() {
    return this.requestZing({
      path: "/api/v2/page/get/chart-home",
    });
  }

  getCategoriesHome() {
    return this.requestZing({
      path: "/api/v2/page/get/hub-home",
    });
  }

  getWeekChart(id) {
    return this.requestZing({
      path: "/api/v2/chart/getWeekChart",
      qs: { id },
    });
  }

  getNewReleaseChart() {
    return this.requestZing({
      path: "/api/v2/page/get/newrelease-chart",
    });
  }

  getTop100() {
    return this.requestZing({
      path: "/api/v2/page/get/top-100",
    });
  }

  getByGenre(id, page) {
    return this.requestZing({
      path: "/api/v2/feed/getByGenre",
      qs: {
        id,
        page,
        count: 10,
      },
    });
  }

  search(keyword) {
    return this.requestZing({
      path: "/api/v2/search/multi",
      qs: {
        q: keyword,
      },
      haveParam: 1,
    });
  }

  async getCookie() {
    if (!cookiejar._jar.store.idx["zingmp3.vn"]) await request.get("/");
  }

  // haveParam = 1 => string hash will have suffix
  requestZing({ path, qs, haveParam }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        await this.getCookie();
        let param = new URLSearchParams(qs).toString();
        let sig = this.hashParam(path, param, haveParam);

        const data = await request({
          uri: path,
          qs: {
            ...qs,
            ctime: this.time,
            sig,
          },
        });

        if (data.err) reject(data);
        resolve(data.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  //havePram = 2 : get list song in playlist

  hashParam(path, param = "", haveParam = 0) {
    this.time = Math.round((new Date).getTime() / 1e3)
    // const time = Math.round((new Date).getTime() / 1e3)

    // this.time = 1630854164;
    let strHash = `ctime=${this.time}`;
    if (haveParam === 0) strHash += param;
    if(haveParam === 2){
      const id =  new URLSearchParams(param).get('id')
      strHash = `count=500ctime=${this.time}id=${id}type=playlistversion=${VERSION}`
    }
    const hash256 = encrypt.getHash256(strHash);
    return encrypt.getHmac512(path + hash256, SECRET_KEY);
  }
}

module.exports = new ZingMp3();
