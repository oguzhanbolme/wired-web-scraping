const express = require("express")
const axios = require("axios").default
const cheerio = require("cheerio")
const router = express.Router()

const SCIENCE_CATEGORY_URL = "https://www.wired.com/category/science/"

router.get("/science", async function (req, res) {
    const links = await fetchLinks(SCIENCE_CATEGORY_URL)
    const result = await fetchContents(links)
    res.json(result)
})

const fetchLinks = async (url) => {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const result = []
    $("div.primary-grid-component div.wrapper-cards div.cards-component div.cards-component__row div.card-component--left div ul li.card-component__description a").each((i, el) => {
        if (i % 3 === 0 && i < 15) {
            result.push("https://www.wired.com" + $(el).attr("href"))
        }
    })
    return result
}

const fetchContents = async (links) => {
    const result = []
    await Promise.all(links.map(async (element) => {
        const { data } = await axios.get(element)
        const $ = cheerio.load(data)
        const title = $("h1.content-header__hed").text()
        const summary = $("div div main article div header div div.content-header__accreditation div.content-header__dek").text()
        const paragraph = $("div.article__chunks div div p").text()
        const article = { "title": `${title}`, "summary": `${summary}`, "paragraph": `${paragraph}` }
        result.push(article)
    }))
    return result
}

module.exports = router