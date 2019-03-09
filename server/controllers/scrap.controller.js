const config = require('../config/config');
const cheerio = require('cheerio');
const request = require('request');
const Activity = require('../models/activity.model');

module.exports = {
    scrap
}

function scrap(req, res, cb) {
    if (config.url) {
        request(config.url, async (err, response, html) => {
            if (err) {
                cb(err)
            }
            if (!err && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const carouselPopular = $('#carouselPopular');
                const items = carouselPopular.find('.item');
                const activities = [];
                if (items && items.length) {
                    items.each((i, el) => {

                        const activity = new Activity();
                        const article = $(el).find('.zoneExperience2');
                        const figure = $(article).find('figure');
                        const activityDuration = $(figure).find('.figureCarousel-p').text();
                        const activityTag = $(figure).find('span') ? $(figure).find('span') : null;
                        let tag;
                        if (activityTag && activityTag.hasClass('tag-carousel')) {
                            tag = {
                                "title": activityTag.text(),
                                "color": activityTag.attr('style') ? extractColor(activityTag.attr('style')) : "#E02D46"
                            }
                        }
                        const activityImg = $(figure).find('img').attr('src');
                        const hasPromotion = $(article).find('.ribbon-small') ? $(article).find('.ribbon-small').text() : null;
                        const detailActivity = $(article).find('.details')
                        const activityTitle = $(detailActivity).find('h3').text();
                        const reviews = $(detailActivity).find('.nbReviewsCar').text();
                        const row = $(detailActivity).find('.row');
                        const price = $($(row).children("div")[1]).text();
                        const target = "https://whattodo.ma" + ($($(article).find('a')).attr('href'));

                        activity.title = activityTitle;
                        activity.price = price;
                        activity.image = activityImg;
                        activity.reviews = reviews;
                        activity.tag = tag;
                        activity.hasPromotion = hasPromotion ? hasPromotion : null;
                        activity.target = target;


                        activities.push(activity);
                    })
                    if (activities.length) {
                        try {
                            let result = await Activity.insertMany(activities).exec();
                            if (result) {
                                cb(null, {
                                    message: "load successfully "
                                })
                            } else {
                                cb('Error create multiple document')
                            }
                        } catch (error) {
                            cb(error)

                        }
                    } else {
                        cb(null, {
                            message: "No Data stored []"
                        })
                    }
                }

            }
        })
    }
}

function extractColor(str) {
    return str.split(':')[1];
}