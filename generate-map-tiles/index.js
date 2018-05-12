const shell = require('shelljs')
const gm = require('gm')

/**
 * App: generate map tiles
 */
const app = argv => {
  const { zoom, source, dest } = getArgs(argv)
  Array(zoom)
    .fill()
    .reduce(
      (chain, _, zoom) =>
        chain.then(() => createZoomlevel(dest, source, 256, zoom)),
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
  process.stdout.write(
    `Creating zoom level ${zoom} (${Math.pow(Math.pow(2, zoom), 2)} tiles)... `
  )

  const dest = `${dir}/${zoom}`
  shell.mkdir('-p', dest)

  const size = Math.pow(2, zoom) * tilesize

  return resizeSource(source, dest, size)
    .then(source => createTiles(source, dest, tilesize))
    .then(() => structureXyzTiles(dest, zoom))
    .then(() => process.stdout.write('done\n'))
}

/**
 * Resize source image to required zoomlevel
 * GraphicsMagick command:
 *  gm resize source.png 256x256 zoom.png
 */
const resizeSource = (source, dest, size) => {
  const file = `${dest}/zoom.png`
  return new Promise((resolve, reject) => {
    gm(source)
      .resize(size, size)
      .write(file, err => (err ? reject(err) : resolve(file)))
  })
}

/**
 * Generate tiles by size
 * GraphicsMagick command:
 *  gm convert source.png -crop 256x256 +adjoin %d.png
 */
const createTiles = (source, dest, size) => {
  return new Promise((resolve, reject) => {
    gm(source)
      .out('-crop', `${size}x${size}`)
      .out('+adjoin')
      .write(`${dest}/%d.png`, err => (err ? reject(err) : resolve()))
  })
}

/**
 * Rename & move tiles into XYZ folder structure:
 *  dest/{zoom}/{x}/{y}
 */
const structureXyzTiles = (dest, zoom) => {
  const dimension = Math.pow(2, zoom)

  for (let y = 0; y < dimension; y++) {
    for (let x = 0; x < dimension; x++) {
      const src = `${dest}/${dimension * y + x}.png`
      shell.mkdir('-p', `${dest}/${x}`)
      shell.mv(src, `${dest}/${y}/${x}.png`)
    }
  }

  return Promise.resolve()
}

/**
 * Run app
 */
app(process.argv)
