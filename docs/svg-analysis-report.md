# SVG Analysis Report

## Scope

This report covers the five supplied Illustrator SVG files used for the RG oblique embroidery generator. Measurements are in SVG user units; the source files are authored as millimeter-scale artwork and are treated as millimeters by the MVP.

## Geometry Analysis

| File | ViewBox | Elements | Geometry bounds | Point count |
| --- | ---: | --- | ---: | ---: |
| `1livello-oblique-fermatura pannello-formebasi.svg` | `0 0 79.4 69.5` | 6 polylines | `0.1,0.1 -> 79.2,69.3` | 213 |
| `1livello-oblique-fermatura pannello-puntoricamo.svg` | `0 0 82.6 74.2` | 6 polylines | `0.1,0.8 -> 81.8,73.5` | 143 |
| `2livello-oblique-disegno-formebasi.svg` | `0 0 94 106.4` | 14 polylines, 1 line | `0.1,0.1 -> 93.8,106.3` | 330 |
| `2livello-oblique-disegno-puntoricamo.svg` | `0 0 94.6 107.9` | 15 polylines | `0.1,0 -> 94.6,107.8` | 912 |
| `oblique-punto-ricamo-completo.svg` | `0 0 1178.1 1018.8` | 3314 polylines | `0.1,0.1 -> 1178,1018.7` | 165846 |

Detailed bounds:

| File | Width | Height | Min X | Min Y | Max X | Max Y | Center X | Center Y | BBox W | BBox H |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Level 1 base | 79.4 | 69.5 | 0.1 | 0.1 | 79.2 | 69.3 | 39.65 | 34.7 | 79.1 | 69.2 |
| Level 1 stitch | 82.6 | 74.2 | 0.1 | 0.8 | 81.8 | 73.5 | 40.95 | 37.15 | 81.7 | 72.7 |
| Level 2 base | 94.0 | 106.4 | 0.1 | 0.1 | 93.8 | 106.3 | 46.95 | 53.2 | 93.7 | 106.2 |
| Level 2 stitch | 94.6 | 107.9 | 0.1 | 0.0 | 94.6 | 107.8 | 47.35 | 53.9 | 94.5 | 107.8 |
| Golden | 1178.1 | 1018.8 | 0.1 | 0.1 | 1178.0 | 1018.7 | 589.05 | 509.4 | 1177.9 | 1018.6 |

All files are single SVG documents exported by Adobe Illustrator. None of the supplied SVGs uses semantic layer groups; sequencing is encoded by document order of the `polyline` elements. This is important for embroidery: the generator must preserve source element order inside each duplicated module.

## Module Dimensions

Level 1 stitch module viewBox: `82.6 x 74.2`; actual stitched bounds: `81.7 x 72.7`.

Level 2 stitch module viewBox: `94.6 x 107.9`; actual stitched bounds: `94.5 x 107.8`.

The shape/base files are close but not identical to the stitch files. Stitch conversion expanded the working bounds, especially in level 2 where curved and radiating stitch sections add many more points. The MVP therefore uses the stitch SVGs as master templates and uses shape SVGs only for comparison/reference.

## Layer Analysis And Alignment

Level 1 and Level 2 use different reference systems:

- Level 1 stitch viewBox is `82.6 x 74.2`; Level 2 stitch viewBox is `94.6 x 107.9`.
- Level 1 stitched center is `40.95, 37.15`; Level 2 stitched center is `47.35, 53.9`.
- Center delta from Level 1 to Level 2 is `+6.4 mm X, +16.75 mm Y`.
- Actual bounding boxes differ by `+12.8 mm width, +35.1 mm height` for Level 2.

This means Level 1 and Level 2 cannot be aligned robustly by raw SVG origin alone. The generator introduces independent level offsets and anchor modes:

- SVG origin;
- bounding-box center;
- manual anchor.

Each placed module is positioned by its anchor. The level offsets are applied after anchor alignment so the user can correct production alignment without editing source SVGs.

## Pattern Repetition Logic

The golden file shows a repeated diagonal module system. Matching repeated starts in the golden file indicates a primary module repetition vector of about:

- `+52.6 mm` in X
- `-41.8 mm` in Y in the exported coordinate sequence

The new build specification requires generation order to start at top-left and progress downward/rightward through diagonal bands. In SVG coordinates this is represented by editable lattice vectors, with default Vector A set to `+52.6, +41.8` and Vector B set to `0, +155`. The sign of Vector A Y can be inverted to inspect the original golden coordinate progression.

Rows/bands advance after each diagonal pass. Several repeated segments also show vertical/row spacing around `155 mm`, depending on the row and clipped edge location. The MVP exposes this through independent parameters:

- Vector A X/Y: progression along one diagonal band;
- Vector B X/Y: progression between successive diagonals;
- horizontal/vertical gap and overlap;
- row shift X/Y, independent from overlap.

The engine generates full diagonal bands, not independent graphic tiles. Each diagonal band is emitted completely before the next band, and each module clone preserves the original stitch element order.

## Travel Path Logic

The golden file includes long perimeter-like and outside-panel polylines. These are intentional embroidery travel paths, not artifacts. They connect the end of one diagonal row to the start of the next row by routing outside or along the panel perimeter so later stitching can cover the travel thread.

For MVP, travel paths are generated as a separate visible layer connecting row endpoints. The initial strategy is a simple outside bounding-box route: exit from the previous row end, move to an outside corridor, then re-enter at the next row start. This preserves the concept and keeps travel paths editable. Future work should replace this with shape-aware perimeter routing.

## Relationship Between Level 1 And Level 2

Level 1 is the stabilization layer and must be generated first across the full panel. Level 2 is the visible logo layer and must be generated after level 1. The generator exports them as separate `<g>` layers and also as a combined SVG in this order:

1. Boundary/reference layer
2. Level 1 stitch clones
3. Level 1 travel paths
4. Level 2 stitch clones
5. Level 2 travel paths
6. Satin border preview

## Shape SVGs Versus Stitch SVGs

Shape SVGs contain design/base construction geometry with fewer elements and fewer points. Stitch SVGs contain embroidery-ready path geometry. Curved logo areas in level 2 are already represented by progressive stitch orientation and dense point sequences. Rebuilding those stitches would risk losing the rotational logic; the generator should clone and transform the stitch SVG elements directly.

## Golden Assembly

The golden example is a flattened final panel. It starts with a border/polyline path for a rounded rectangular panel, followed by many module stitch paths in sequence. Repeated module fragments advance through diagonal bands, with row transitions handled by travel geometry. The original SVG point order shows repeated deltas of approximately `+52.6, -41.8`; the required generator order is top-left toward bottom-right, so the implementation treats the direction as an editable lattice vector rather than a fixed hard-coded assumption. The final generator should behave similarly while remaining parametric:

- source stitch geometry is cloned, not regenerated;
- diagonal bands are processed as continuous passes;
- outside travel is preserved as an embroidery feature;
- clipping/border cleanup happens after coverage has been generated;
- level ordering stays explicit.

## MVP Decisions

The MVP implements:

- SVG import by file input and bundled examples;
- anchor-based diagonal lattice placement;
- independent Level 1 and Level 2 offsets;
- layer visibility controls;
- clipPath-based panel preview;
- separate travel path visualization;
- basic satin border preview;
- SVG and project JSON export.

Advanced production cleanup remains future work:

- exact segment splitting at panel intersections;
- minimum segment removal after clipping;
- snap-to-edge and trim-and-close cleanup modes;
- perimeter-aware travel routing;
- stitch density resampling.
