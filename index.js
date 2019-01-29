const telegraf = require('telegraf')
const mongo = require('mongodb').MongoClient
const config = require('./config')
const text = require('./text')
const buttons = require('./buttons')
const data = require('./data')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
// const { leave } = Stage

const bot = new telegraf(data.tok)
const stage = new Stage()
bot.use(session()) // necessarily should be before handlers 
bot.use(stage.middleware())

mongo.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
    if (err) console.log(err)
    db = client.db('members')
    bot.startPolling()
})

const selectLang = new Scene('selectLang')
stage.register(selectLang)

bot.start(async ctx => {
    let userLang, userArr = await db.collection('tau').find({userId: ctx.from.id}).toArray()
    if (membersArr.length > 0) userLang = userArr[0].lang

    ctx.reply(text.start, true)
})

let langer = async(ctx, lang, name) => { // i`m using full ctx
// instead of ctx.from.id because objects in js
// are sending as link, but values - as value
    ctx.reply(ctx.from.id, text[name][lang], makeKeyboard())
}
makeKeyboard('start')
function makeKeyboard (src, parse) {
    src = buttons[src]
    if (!Array.isArray(src)) {
        sendError('Error in makeKeyboard() - empty src')
        return
    }
    let res = []
    for (let key in src) {
        res.push([src[key], src[++key]])
    }
    // res[res.length - 1][1] == undefined ? res[res.length- 1].pop() : false
    console.log(res)
    if (parse) return {reply_markup: {keyboard: res, resize_keyboard: true}}
        else return {reply_markup: {keyboard: res, resize_keyboard: true}, parse_mode: 'markdown'}
}

function sendError(err, ctx) {
    let user = (ctx !== undefined) ? '\n\nЮзер: '[ctx.from.first_name]('tg://user?id=' + ctx.from.id) : ''
    bot.telegram.sendMessage(data.myid, 'Ошибка:\n' + JSON.stringify(err) + user)
}

bot.catch(err => {
    sendError(err)
})

bot.start