module.exports = {
  apps: [
    {
      name: "node_core_api",
      instances: 0,
      exec_mode: "cluster",
      script: "./src/index.mjs"
    }
  ]
}