const shell = require('shelljs')
const gm = require('gm')

/**
 * App: generate map tiles
 */
const app = (argv, tilesize) => {
  const { zoom, source, dest } = getArgs(argv)
  Array(zoom)
    .fill()
    .reduce(
      (chain, _, zoom) =>
        chain.then(() => createZoomlevel(dest, source, tilesize, zoom)),
      Promise.resolve()
    )
}

/**
 * Parse CLI arguments
 */
const getArgs = argv => {
  const argc = argv.length
  return {
    zoom: Number(argv[argc - 3]),
    source: argv[argc - 2],
    dest: argv[argc - 1]
  }
}

/**
 * Create a new set of tiles
 */
const createZoomlevel = (dir, source, tilesize, zoom) => {
  console.log(
    `\nCreating zoom level ${zoom} (${Math.pow(Math.pow(2, zoom), 2)} tiles)...`
  )

  const dest = `${dir}/${zoom}`
  const canvassize = Math.pow(2, zoom) * tilesize

  return createTiles(source, dest, zoom, canvassize, tilesize)
}

/**
 * Generate all tiles for a zoom level
 */
const createTiles = (source, dest, zoom, canvassize, tilesize) => {
  const tasks = []
  const tiles = Math.pow(2, zoom)
  for (let y = 0; y < tiles; y++) {
    for (let x = 0; x < tiles; x++) {
      tasks.push({ x, y })
    }
  }

  // Reduce tasks to a Promise chain
  return tasks.reduce(
    (chain, { x, y }) =>
      chain.then(() => createTile(source, dest, canvassize, tilesize, x, y)),
    Promise.resolve()
  )
}

/**
 * Generate a single tile
 * GraphicsMagick command:
 *  gm convert in.png -resize 4096x4096 -crop 256x256+0+0 out.png
 */
const createTile = (source, dest, canvassize, tilesize, x, y) => {
  return new Promise((resolve, reject) => {
    shell.mkdir('-p', `${dest}/${y}`)
    console.log(
      ` > gm convert ${source} -resize ${canvassize}x${canvassize} -crop ${tilesize}x${tilesize}+${x *
        tilesize}+${y * tilesize}`
    )
    gm(source)
      .out('-resize', `${canvassize}x${canvassize}`)
      .out('-crop', `${tilesize}x${tilesize}+${x * tilesize}+${y * tilesize}`)
      .write(`${dest}/${y}/${x}.png`, err => (err ? reject(err) : resolve()))
  })
}

/**
 * Run app
 */
app(process.argv, 256)
