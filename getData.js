
const { Client } = require("@notionhq/client")

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const database = process.env.NOTION_DATABASE

const loadList = async ()=>{
  const result = await notion.databases.query({ database_id: database })
  return result.results.map((item)=>{
    const {id, server} = item.properties
    return [id.rich_text[0].plain_text, server.title[0].plain_text]
  })
}
const loadDatabse = async (item)=>{
  const result = await notion.databases.query({ database_id: item[0] })
  return [result.results, item[1]]
}
const main = async ()=>{
  const list = await loadList()
  const result = []
  await Promise.all(list.map((item)=>{
    return (async ()=>{
      const database = await loadDatabse(item)
      result.push(database)
    })()
  }))
  return result
}

module.exports = main
