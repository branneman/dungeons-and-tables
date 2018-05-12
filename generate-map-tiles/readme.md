# Generate 256px map tiles (Mercator projection)

## Usage

Specify a zoom level (0–18), a source image file path and a destination directory:

```
node index.js <zoom> <sourcefile> <destination-directory>
```

## Example

Generate `4` zoom levels of tiles from `./source.png` into `./dest`:

```
cd generate-map-tiles
node index.js 4 ./source.png ./dest
```
