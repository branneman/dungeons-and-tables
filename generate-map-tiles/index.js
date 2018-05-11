const shell = require('shelljs')
const gm = require('gm')

/**
 * Create a new set of tiles
 */
const createZoomlevel = (dir, source, tilesize, zoom) => {
  const dest = `${dir}/${zoom}`
  shell.mkdir('-p', dest)

  const size = zoom === 0 ? tilesize : Math.pow(2, zoom) * tilesize

  return resizeSource(source, dest, size).then(() =>
    createTiles(`${dest}/zoom.png`, dest, tilesize)
  )
}

/**
 * GraphicsMagick command:
 *  gm resize source.png 256x256 zoom.png
 */
const resizeSource = (source, dest, size) => {
  return new Promise((resolve, reject) => {
    gm(source)
      .resize(size, size)
      .write(`${dest}/zoom.png`, err => (err ? reject(err) : resolve()))
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
 * Generate Map Tiles
 */
const c = n =>
  createZoomlevel(`${__dirname}/dest`, `${__dirname}/test.png`, 256, n)
c(0)
  .then(() => c(1))
  .then(() => c(2))
