const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const News = require("../models/news");

const DUMMY_NEWS = [
  {
    id: "n1",
    date: "27.05.2022",
    time: "15:01",
    newsText: "Lorem ipsum",
  },
  {
    id: "n2",
    date: "27.05.2022",
    time: "16:30",
    newsText: "Lorem ipsum dolor sit amet",
  },
];

const createNews = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Geçersiz girdi! Lütfen kontrol edin!", 422));
  }

  const { date, time, newsText } = req.body;
  const createdNews = new News({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    newsText: newsText,
  });

  try {
    await createdNews.save();
  } catch (err) {
    const error = new HttpError(
      "Yeni haber oluşturulurken bir hata oluştu!",
      500
    );
    return next(error);
  }

  res.status(201).json({ news: createNews });
};

const getNewsById = async (req, res, next) => {
  const newsId = req.params.nid; // nid: news id
  // const news = DUMMY_NEWS.find((n) => {
  //   return n.id === newsId;
  // });

  let news;
  try {
    news = await News.findById(newsId);
  } catch (err) {
    const error = new HttpError("Bir sorun oluştu: Haber bulunamadı!", 500);
    return next(error);
  }

  if (!news) {
    return next(new HttpError("Sayfa görüntülenemedi!", 404));
  }

  res.json({ news: news.toObject({ getters: true }) });
};

exports.getNewsById = getNewsById;
exports.createNews = createNews;
