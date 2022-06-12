const Zing = require("../utils/ZingMp3");

function route(app) {
    //[GET] get home
    app.get("/home", (req, res) => {
        const page = req.query.page;
        Zing.getHome(page).then((data) => {
            res.send(data);
        });
    });

    //[GET] get recommend song
    app.get("/recommend", (req, res) => {
        const id = req.query.id;
        Zing.getSongRecommend(id).then((data) => {
            res.send(data);
        });
    });

    //[GET] get categories
    app.get("/categories", (req, res) => {
        console.log('vao day');
        Zing.getCategoriesHome().then((data) => {
            console.log('data', data);
            res.send(data);
        });
    });

    //[GET] get streaming
    app.get("/streaming", (req, res) => {
        const id = req.query.id;
        Zing.getStreaming(id).then((data) => {
            res.send(data);
        });
    });

    //[GET] get detail playlist
    app.get("/detail-playlist", (req, res) => {
        const id = req.query.id;
        Zing.getDetailPlaylist(id).then((data) => {
            res.send(data);
        });
    });

    //[GET] get detail playlist
    app.get("/section-playlist", (req, res) => {
        const id = req.query.id;
        Zing.getSectionPlaylist(id).then((data) => {
            res.send(data);
        });
    });

    //[GET] get list song in playlist
    app.get("/song/get-list", (req, res) => {
        const id = req.query.id;
        Zing.getPlaylistSong(id).then((data) => {
            res.send(data);
        })
            .catch(() => {
                console.log('co loi');
            })
    });

    // Get top 100

    app.get("/top-100", (req, res) => {
        Zing.getTop100().then((data) => {
            res.send(data);
        })
            .catch(() => {
                console.log('co loi');
            })
    });

  app.get("/newrelease-chart", (req, res) => {
    Zing.getNewReleaseChart().then((data) => {
      res.send(data);
    })
        .catch((err) => {
          console.log('co loi', err);
        })
  });

    app.get("/hub-detail", (req, res) => {
        Zing.getCategoriesHome().then((data) => {
            res.send(data);
        })
            .catch((err) => {
                console.log('co loi', err);
            })
    });
}

module.exports = route;
