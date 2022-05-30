const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_NEWS = [
  {
    id: "n1",
    date: "27.05.2022 15:01",
    text: "Lorem ipsum",
  },
  {
    id: "n2",
    date: "27.05.2022 16:00",
    text: "Lorem ipsum dolor sit amet",
  },
];

//nid: news id
router.get("/:nid", (req, res, next) => {
  const newsId = req.params.nid;
  const news = DUMMY_NEWS.find((n) => {
    return n.id === newsId;
  });
  if (!news) {
    return next(new HttpError("Sayfa görüntülenemedi.", 404));
  }
  res.json({ news: news });
});

module.exports = router;
