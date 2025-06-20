// SUPER SIMPLE WEB SERVER, INTENDED TO BE RUN ON A RASPBERRY PI!

const config = require("./config.json"),
    fastify = require("fastify")({ logger: config.logger }),
    fStatic = require("@fastify/static"),
    { exec } = require("child_process"),
    path = require("node:path")

fastify.register(fStatic, {
    root: path.join(__dirname, config.staticPath)  
})

fastify.get("/stats", function handler (request, reply) {
    var response = `--- ${config.title} ---\n\n`
    var count = 0
    config.commands.forEach((c) => {
        exec(c.command, (err, stdout, stderr) => {
            if(stderr || err) return;
            response = response + `-- ${c.title} --\n${stdout}\n`
            count = count + 1
            if(count === config.commands.length) reply.send(response)
        })
    })
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})


