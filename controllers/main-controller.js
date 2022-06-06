const HttpError = require("../models/http-error");

const DUMMY_NEWS = [
  {
    id: "n1",
    date: "27.05.2022",
    time: "15:01",
    text: "Lorem ipsum",
  },
  {
    id: "n2",
    date: "27.05.2022",
    time: "16:30",
    text: "Lorem ipsum dolor sit amet",
  },
];

const getNewsById = (req, res, next) => {
  const newsId = req.params.nid; //nid: news id
  const news = DUMMY_NEWS.find((n) => {
    return n.id === newsId;
  });
  if (!news) {
    return next(new HttpError("Sayfa görüntülenemedi.", 404));
  }
  res.json({ news: news });
};

exports.getNewsById = getNewsById;
