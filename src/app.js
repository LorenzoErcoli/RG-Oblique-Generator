(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const PRESET_KEY = "rg-oblique-embroidery-preset-v2";
  const MAX_DEBUG_ITEMS = 12000;
  const SCHEMA_VERSION = "0.4.0";
  const TEMPLATE_ROLE_ORDER = [
    "MASTER_OUTLINE",
    "LASER_REFERENCE",
    "PLACEMENT_REFERENCE",
    "PATTERN_REFERENCE",
    "SATIN_REFERENCE",
    "CORD_REFERENCE"
  ];
  const TEMPLATE_ROLE_LABELS = {
    MASTER_OUTLINE: "Master outline",
    LASER_REFERENCE: "Laser reference",
    PLACEMENT_REFERENCE: "Placement reference",
    PATTERN_REFERENCE: "Pattern reference",
    SATIN_REFERENCE: "Satin reference",
    CORD_REFERENCE: "Cord reference"
  };
  const TEMPLATE_ROLE_ALIASES = {
    MASTER_OUTLINE: ["master_outline", "master outline", "outline", "contour", "carta_modello", "carta modello"],
    LASER_REFERENCE: ["laser_reference", "laser reference", "laser", "holes", "buchi"],
    PLACEMENT_REFERENCE: ["placement_reference", "placement reference", "placement", "piazzamento", "fermatura_reference", "fermatura reference"],
    PATTERN_REFERENCE: ["pattern_reference", "pattern reference", "pattern", "embroidery_area", "embroidery area", "ricamo", "decorative_area", "decorative area"],
    SATIN_REFERENCE: ["satin_reference", "satin reference", "satin", "raso", "satin_area", "satin area"],
    CORD_REFERENCE: ["cord_reference", "cord reference", "cord", "cordoncino", "cord_center", "cord center"]
  };
  const EXAMPLES = {
    level0: "examples/source/0-livello-oblique-fermatura pannello-puntoricamo [Convertito].svg",
    level1: "examples/source/1livello-oblique-fermatura pannello-puntoricamo.svg",
    level2: "examples/source/2livello-oblique-disegno-puntoricamo.svg",
    holes: "examples/source/4-livello-oblique-laser-buchi-puntoricamo_.svg",
    panel: null
  };

  const defaultParams = {
    schemaVersion: SCHEMA_VERSION,
    formatWidth: 100,
    formatHeight: 100,
    formatOriginX: 0,
    formatOriginY: 0,
    overflowMarginMm: 80,
    perimeterLaneWidth: 3,
    patternTopOffset: 0,
    patternBottomOffset: 0,
    patternLeftOffset: 0,
    patternRightOffset: 0,
    laserTopOffset: 60,
    laserBottomOffset: 0,
    laserLeftOffset: 20,
    laserRightOffset: 0,
    patternBorderOffset: 0,
    placementTopOffset: 60,
    placementBottomOffset: 0,
    placementLeftOffset: 20,
    placementRightOffset: 0,
    globalPatternOffsetX: 0,
    globalPatternOffsetY: 0,
    nudgeStep: 1,
    globalOffsetBorderReferences: false,
    holeMatchTolerance: 0.5,
    travelSideStrategy: "auto",
    cordOffset: 0,
    anchorMode: "bbox_center",
    manualAnchorX: 0,
    manualAnchorY: 0,
    moduleScale: 1,
    autoFillDiagonals: false,
    autoModulesPerDiagonal: false,
    diagonalCount: 23,
    modulesPerDiagonal: 35,
    startOffsetX: 2.8,
    startOffsetY: 27.5,
    vectorAX: 18.5,
    vectorAY: -14.8,
    vectorBX: -8.45,
    vectorBY: 54.8,
    horizontalGap: 0,
    verticalGap: 0,
    horizontalOverlap: 0,
    verticalOverlap: 0,
    rowShiftX: 0,
    rowShiftY: 0,
    rotation: 0,
    enableLevel0: true,
    enableHolesLayer: true,
    level0Mode: "module",
    level0ClipMode: "keep_module_if_intersects",
    level1ClipMode: "keep_module_if_intersects",
    pruneFeaturesWithoutHoles: false,
    holePerimeterToleranceMm: 2,
    enableExclusionAreas: true,
    startLockEnabled: false,
    startLockStitchMm: 3,
    level0HoleStitchLength: 2,
    level0TravelStitchLength: 2,
    technicalMaxTravelMm: 0,
    technicalGapBreakFactor: 2.5,
    coverageSource: "level2",
    coverageResolutionMm: 0.5,
    coverageDilationMm: 2,
    coverageGapClosingMm: 0.2,
    coverageMinimumDensity: 1,
    coverageErosionMm: 0,
    minimumCoverageWidthMm: 1,
    level0CoverageFallback: "break_path",
    coverageMinimumTravelStitchLength: 2,
    visibilityWeight: 100,
    centerWeight: 80,
    turnWeight: 15,
    curvatureWeight: 10,
    lengthWeight: 5,
    pointCountWeight: 3,
    headingPersistenceWeight: 10,
    pathOrthogonalityWeight: 30,
    allowDiagonalTravel: false,
    holeEntryCandidateCount: 16,
    holeExitCandidateCount: 16,
    mergeCollinearSegments: true,
    removeRedundantTurns: true,
    minimumTurnDistanceMm: 1.5,
    travelSimplificationToleranceMm: 0.8,
    travelSmoothingEnabled: true,
    travelSmoothingStrength: 0.25,
    travelSmoothingIterations: 2,
    coveredTravelStitchLengthMm: 2,
    travelTestMode: false,
    travelTestAX: 0,
    travelTestAY: 0,
    travelTestBX: 50,
    travelTestBY: 50,
    coverageMaskPreview: false,
    coverageMaskOnly: true,
    coverageMaskOpacity: 0.55,
    coveragePreviewMaxPixels: 1200000,
    showPanelShapeOverlay: true,
    panelShapeOverlayOpacity: 1,
    panelShapeOverlayColor: "#e52421",
    panelShapeOverlayUseOriginalColors: true,
    panelShapeOverlayOnTop: true,
    level0OffsetX: -6,
    level0OffsetY: 7.9,
    level0Scale: 1,
    level0AnchorX: 0,
    level0AnchorY: 0,
    level1OffsetX: 2.2,
    level1OffsetY: 4.8,
    level2OffsetX: 0,
    level2OffsetY: 0,
    holesOffsetX: -0.4,
    holesOffsetY: 6.7,
    holesScale: 1,
    holesAnchorX: 0,
    holesAnchorY: 0,
    minimumSegmentLength: 1,
    snapToEdgeDistance: 0.5,
    cleanupTolerance: 0.25,
    cleanupMode: "strict_clip",
    minimumTravelStitchLength: 3,
    cutBorderStitchLength: 2,
    travelPathMode: "Border Following",
    travelRoutingStrategy: "shortest_valid",
    enableZigZagBorder: true,
    zigZagWidth: 2,
    zigZagDensity: 0.6,
    cordWidth: 2,
    cordDensity: 0.6,
    borderOffsetMode: "center",
    satinWidth: 4,
    satinDensity: 0.8,
    satinOffset: 0,
    pointSpacing: 6,
    innerOrOuter: "outer",
    maximumVerticesPerPath: 5000,
    validateExport: false,
    perimeterCloseTolerance: 0.1,
    perimeterLaneTolerance: 1,
    allowInternalShortcuts: false,
    routingPerimeterSource: "MASTER_OUTLINE"
  };

  const defaultLayers = {
    level0: true,
    level1: true,
    level2: true,
    holes: true,
    travel: true,
    boundary: true,
    satin: true,
    anchors: false,
    nodes: false,
    debugCleanup: false,
    debugOriginalPoints: true,
    debugDeletedPoints: true,
    debugMovedPoints: true,
    debugIntersectionPoints: true,
    debugRemovedSegments: true,
    debugValidSegments: true,
    debugBoundary: true,
    debugPerimeterLane: true,
    debugRoutingPaths: true,
    debugExitEntryPoints: true,
    debugIntraDiagonalConnectors: true,
    debugScaleBboxes: true,
    debugZigZagPeaks: true,
    debugTravelPoints: true,
    debugCoverageMap: false,
    debugCoverageMask: true,
    debugCoveredTravelOptimizer: false,
    patternPreview: true,
    decorativeBoundary: true,
    travelPathVisualization: true,
    borderPreview: true
  };

  const defaultTemplateAssignments = {
    MASTER_OUTLINE: "color:#e73433",
    LASER_REFERENCE: "color:#66b32e",
    PLACEMENT_REFERENCE: "color:#66b32e",
    PATTERN_REFERENCE: "color:#ffe601",
    SATIN_REFERENCE: "color:#ffe601",
    CORD_REFERENCE: "layer:0"
  };

  const state = {
    sources: { level0: null, level1: null, level2: null, holes: null, panel: null },
    params: { ...defaultParams },
    layers: { ...defaultLayers },
    templateAssignments: { ...defaultTemplateAssignments },
    templateReport: null,
    clipPreview: false,
    zoom: 1,
    panX: 0,
    panY: 0,
    baseViewBox: null,
    generated: null,
    debugSvg: null,
    cleanupReport: null,
    routingReport: null,
    unitReport: null,
    exportReport: null,
    autoFillReport: null,
    scaleTestReport: null
  };

  const preview = document.getElementById("preview");
  const status = document.getElementById("status");
  const statsPanel = document.getElementById("cleanupStats");
  const viewport = document.getElementById("viewport");
  const templateLayerPanel = document.getElementById("templateLayerPanel");

  function parseSvg(text, name) {
    return normalizeSvgToMm(text, name);
  }

  function parseVectorSource(text, name) {
    if (/\.dxf$/i.test(name) || /^\s*0\s+SECTION/i.test(text)) return normalizeDxfToMm(text, name);
    return normalizeSvgToMm(text, name);
  }

  function normalizeDxfToMm(text, name) {
    const pairs = dxfPairs(text);
    const unitScale = dxfUnitScale(pairs);
    const elements = [];
    for (let index = 0; index < pairs.length; index += 1) {
      if (pairs[index].code !== "0") continue;
      const type = pairs[index].value.toUpperCase();
      if (type === "LINE") {
        const entity = collectDxfEntity(pairs, index + 1);
        const x1 = dxfNumber(entity, "10");
        const y1 = dxfNumber(entity, "20");
        const x2 = dxfNumber(entity, "11");
        const y2 = dxfNumber(entity, "21");
        if ([x1, y1, x2, y2].every(Number.isFinite)) {
          elements.push({ tag: "line", points: [{ x: x1 * unitScale, y: y1 * unitScale }, { x: x2 * unitScale, y: y2 * unitScale }], closed: false });
        }
      }
      if (type === "LWPOLYLINE") {
        const entity = collectDxfEntity(pairs, index + 1);
        const points = [];
        let pendingX = null;
        entity.forEach((pair) => {
          if (pair.code === "10") pendingX = Number(pair.value);
          if (pair.code === "20" && pendingX != null) {
            points.push({ x: pendingX * unitScale, y: Number(pair.value) * unitScale });
            pendingX = null;
          }
        });
        const closed = (Math.floor(dxfNumber(entity, "70") || 0) & 1) === 1;
        if (closed && points.length && !samePoint(points[0], last(points))) points.push({ ...points[0] });
        if (points.length > 1) elements.push({ tag: "polyline", points, closed });
      }
      if (type === "POLYLINE") {
        const polyline = [];
        let closed = false;
        for (let cursor = index + 1; cursor < pairs.length; cursor += 1) {
          if (pairs[cursor].code === "70") closed = (Math.floor(Number(pairs[cursor].value) || 0) & 1) === 1;
          if (pairs[cursor].code === "0" && pairs[cursor].value.toUpperCase() === "VERTEX") {
            const vertex = collectDxfEntity(pairs, cursor + 1);
            const x = dxfNumber(vertex, "10");
            const y = dxfNumber(vertex, "20");
            if (Number.isFinite(x) && Number.isFinite(y)) polyline.push({ x: x * unitScale, y: y * unitScale });
          }
          if (pairs[cursor].code === "0" && pairs[cursor].value.toUpperCase() === "SEQEND") break;
        }
        if (closed && polyline.length && !samePoint(polyline[0], last(polyline))) polyline.push({ ...polyline[0] });
        if (polyline.length > 1) elements.push({ tag: "polyline", points: polyline, closed });
      }
      if (type === "CIRCLE") {
        const entity = collectDxfEntity(pairs, index + 1);
        const cx = dxfNumber(entity, "10");
        const cy = dxfNumber(entity, "20");
        const radius = dxfNumber(entity, "40");
        if ([cx, cy, radius].every(Number.isFinite)) {
          const steps = Math.max(24, Math.ceil((Math.PI * 2 * radius * unitScale) / Math.max(1, state.params.pointSpacing || 6)));
          const points = [];
          for (let step = 0; step <= steps; step += 1) {
            const angle = (Math.PI * 2 * step) / steps;
            points.push({ x: (cx + Math.cos(angle) * radius) * unitScale, y: (cy + Math.sin(angle) * radius) * unitScale });
          }
          elements.push({ tag: "circle", points, closed: true });
        }
      }
      if (type === "ARC") {
        const entity = collectDxfEntity(pairs, index + 1);
        const cx = dxfNumber(entity, "10");
        const cy = dxfNumber(entity, "20");
        const radius = dxfNumber(entity, "40");
        const startAngle = dxfNumber(entity, "50");
        const endAngle = dxfNumber(entity, "51");
        if ([cx, cy, radius, startAngle, endAngle].every(Number.isFinite)) {
          const sweep = normalizedArcSweep(startAngle, endAngle);
          const arcLength = Math.abs(sweep) * Math.PI / 180 * radius * unitScale;
          const steps = Math.max(6, Math.ceil(arcLength / Math.max(1, state.params.pointSpacing || 6)));
          const points = [];
          for (let step = 0; step <= steps; step += 1) {
            const angle = (startAngle + sweep * (step / steps)) * Math.PI / 180;
            points.push({ x: (cx + Math.cos(angle) * radius) * unitScale, y: (cy + Math.sin(angle) * radius) * unitScale });
          }
          elements.push({ tag: "arc", points, closed: false });
        }
      }
    }
    const bounds = measurePointSets(elements.map((item) => item.points), { x: 0, y: 0, width: 1, height: 1 });
    return {
      name,
      text,
      doc: null,
      viewBox: { x: bounds.minX, y: bounds.minY, width: bounds.width, height: bounds.height },
      declaredWidth: bounds.width,
      declaredHeight: bounds.height,
      originalWidth: bounds.width / unitScale,
      originalHeight: bounds.height / unitScale,
      originalWidthRaw: null,
      originalHeightRaw: null,
      originalWidthUnit: "dxf",
      originalHeightUnit: "dxf",
      unitScale,
      unitScaleX: unitScale,
      unitScaleY: unitScale,
      importScaleX: unitScale,
      importScaleY: unitScale,
      exportScale: 1,
      normalizationMethod: "dxf-ascii-entities-to-mm",
      fallbackUnitAssumption: dxfUnitAssumption(unitScale),
      elements,
      bounds,
      originalBoundsSvgUnits: {
        minX: bounds.minX / unitScale,
        minY: bounds.minY / unitScale,
        maxX: bounds.maxX / unitScale,
        maxY: bounds.maxY / unitScale,
        width: bounds.width / unitScale,
        height: bounds.height / unitScale
      },
      normalizedPathsMm: elements
    };
  }

  function dxfPairs(text) {
    const lines = text.replace(/\r/g, "").split("\n");
    const pairs = [];
    for (let index = 0; index < lines.length - 1; index += 2) {
      pairs.push({ code: lines[index].trim(), value: lines[index + 1].trim() });
    }
    return pairs;
  }

  function dxfUnitScale(pairs) {
    const headerIndex = pairs.findIndex((pair) => pair.code === "9" && pair.value === "$INSUNITS");
    if (headerIndex < 0) return 1;
    const unitCode = Number(pairs[headerIndex + 1]?.value || 4);
    if (unitCode === 1) return 25.4;
    if (unitCode === 2) return 304.8;
    if (unitCode === 4) return 1;
    if (unitCode === 5) return 10;
    if (unitCode === 6) return 1000;
    return 1;
  }

  function dxfUnitAssumption(unitScale) {
    if (unitScale === 1) return "DXF units treated as millimeters unless $INSUNITS declares a different supported unit.";
    return `DXF $INSUNITS conversion factor ${unitScale} mm per DXF unit.`;
  }

  function normalizedArcSweep(startAngle, endAngle) {
    let sweep = endAngle - startAngle;
    while (sweep <= 0) sweep += 360;
    return sweep;
  }

  function collectDxfEntity(pairs, start) {
    const entity = [];
    for (let index = start; index < pairs.length; index += 1) {
      if (pairs[index].code === "0") break;
      entity.push(pairs[index]);
    }
    return entity;
  }

  function dxfNumber(entity, code) {
    const pair = entity.find((item) => item.code === code);
    return pair ? Number(pair.value) : null;
  }

  function normalizeSvgToMm(text, name) {
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    const root = doc.documentElement;
    if (root.nodeName.toLowerCase() === "parsererror" || root.querySelector("parsererror")) {
      throw new Error(`Invalid SVG: ${name}`);
    }
    const viewBox = parseViewBox(root.getAttribute("viewBox"));
    const widthInfo = parseLength(root.getAttribute("width"));
    const heightInfo = parseLength(root.getAttribute("height"));
    const declaredWidth = widthInfo?.mm || null;
    const declaredHeight = heightInfo?.mm || null;
    const fallbackScale = inferUndeclaredSvgScale(root, text);
    let unitScaleX = declaredWidth ? declaredWidth / viewBox.width : null;
    let unitScaleY = declaredHeight ? declaredHeight / viewBox.height : null;
    if (unitScaleX == null && unitScaleY != null) unitScaleX = unitScaleY;
    if (unitScaleY == null && unitScaleX != null) unitScaleY = unitScaleX;
    if (unitScaleX == null) unitScaleX = fallbackScale.scaleX;
    if (unitScaleY == null) unitScaleY = fallbackScale.scaleY;
    const unitScale = declaredWidth && declaredHeight ? (unitScaleX + unitScaleY) / 2 : 1;
    const cssStyles = parseSvgCssStyles(root);
    const collected = collectSvgGeometry(root, unitScaleX, unitScaleY, cssStyles);
    const elements = collected.domElements;
    const source = {
      name,
      text,
      doc,
      viewBox,
      declaredWidth,
      declaredHeight,
      originalWidth: widthInfo?.value ?? null,
      originalHeight: heightInfo?.value ?? null,
      originalWidthRaw: root.getAttribute("width"),
      originalHeightRaw: root.getAttribute("height"),
      originalWidthUnit: widthInfo?.unit ?? null,
      originalHeightUnit: heightInfo?.unit ?? null,
      unitScale,
      unitScaleX,
      unitScaleY,
      importScaleX: unitScaleX,
      importScaleY: unitScaleY,
      exportScale: 1,
      normalizationMethod: declaredWidth || declaredHeight ? "declared-size/viewBox" : fallbackScale.method,
      fallbackUnitAssumption: fallbackScale.assumption,
      elements: []
    };
    source.elements = collected.elements;
    source.bounds = measurePointSets(source.elements.map((item) => item.points), viewBox);
    source.originalBoundsSvgUnits = measurePointSets(collected.originalPointSets, viewBox);
    source.normalizedPathsMm = source.elements;
    source.importReport = collected.report;
    source.templateLayers = extractTemplateLayers(root, unitScaleX, unitScaleY, cssStyles);
    source.pathLayers = extractPathLayers(source.elements);
    source.colorLayers = extractColorLayers(source.elements);
    source.detectedTemplateRoles = detectTemplateRoles(source.templateLayers);
    return source;
  }

  function collectSvgGeometry(root, unitScaleX, unitScaleY, cssStyles) {
    const report = emptyImportReport();
    const elements = [];
    const domElements = [];
    const originalPointSets = [];
    walkSvgTree(root, identityMatrix(), true, [], (element, matrix, visible, groupPath) => {
      const tag = element.tagName.toLowerCase();
      if (tag === "g") {
        report.groupsRead += 1;
        report.groups.push(groupReport(element, groupPath, visible));
        return;
      }
      if (!isSupportedShape(tag)) return;
      report.totalElementsFound += 1;
      report.byTag[tag] = (report.byTag[tag] || 0) + 1;
      if (!visible) {
        addIgnored(report, tag, "not visible", groupPath);
        return;
      }
      const originalPoints = extractShapePoints(element);
      if (originalPoints.length < 2) {
        addIgnored(report, tag, "no drawable points extracted", groupPath);
        return;
      }
      const transformedSvg = originalPoints.map((point) => applyMatrix(point, matrix));
      const points = transformedSvg.map((point) => ({ x: point.x * unitScaleX, y: point.y * unitScaleY }));
      const stroke = elementPaint(element, cssStyles, "stroke");
      const fill = elementPaint(element, cssStyles, "fill");
      const closed = shapeIsClosed(element, originalPoints);
      const item = {
        index: elements.length,
        tag,
        id: element.getAttribute("id") || null,
        name: element.getAttribute("data-name") || element.getAttribute("inkscape:label") || element.getAttribute("id") || null,
        points,
        closed,
        color: elementColor(element, cssStyles),
        stroke,
        fill,
        groupPath: groupPath.map((item) => item.name).join(" / ")
      };
      item.bounds = measurePointSets([points], { x: 0, y: 0, width: 1, height: 1 });
      item.area = closed ? Math.abs(polygonArea(ensureClosedLoop(points))) : 0;
      item.candidateContour = closed && item.area > 0.01;
      elements.push(item);
      domElements.push(element);
      originalPointSets.push(transformedSvg);
      if (tag === "path") {
        report.pathsImported += 1;
        if (isPaintActive(fill)) report.filledPaths += 1;
        if (isPaintActive(stroke)) report.strokedPaths += 1;
        if (closed) report.closedPaths += 1;
        else report.openPaths += 1;
        report.pathDetails.push({
          index: item.index,
          id: item.id,
          name: item.name || `Path ${item.index + 1}`,
          group: item.groupPath || "root",
          fill,
          stroke,
          closed,
          bounds: item.bounds,
          area: item.area,
          candidateContour: item.candidateContour
        });
      }
      if (tag === "polyline") report.polylinesImported += 1;
      if (tag === "polygon") report.polygonsImported += 1;
      if (tag === "line") report.linesImported += 1;
      if (tag === "rect" || tag === "circle" || tag === "ellipse") report.convertedShapes += 1;
    });
    report.importedElements = elements.length;
    report.visibleIgnored = report.ignored.filter((item) => item.reason !== "not visible").length;
    report.bounds = elements.length ? measurePointSets(elements.map((item) => item.points), { x: 0, y: 0, width: 1, height: 1 }) : null;
    report.groups.forEach((group) => {
      const contained = elements.filter((item) => item.groupPath.includes(group.name));
      group.elementsContained = contained.length;
      group.colors = Array.from(new Set(contained.map((item) => item.color)));
      group.bounds = contained.length ? measurePointSets(contained.map((item) => item.points), { x: 0, y: 0, width: 1, height: 1 }) : null;
    });
    return { elements, domElements, originalPointSets, report };
  }

  function emptyImportReport() {
    return {
      totalElementsFound: 0,
      importedElements: 0,
      pathsImported: 0,
      polylinesImported: 0,
      polygonsImported: 0,
      linesImported: 0,
      convertedShapes: 0,
      filledPaths: 0,
      strokedPaths: 0,
      closedPaths: 0,
      openPaths: 0,
      groupsRead: 0,
      ignoredCount: 0,
      visibleIgnored: 0,
      ignored: [],
      pathDetails: [],
      groups: [],
      byTag: {}
    };
  }

  function addIgnored(report, tag, reason, groupPath) {
    report.ignoredCount += 1;
    report.ignored.push({ tag, reason, group: groupPath.map((item) => item.name).join(" / ") || "root" });
  }

  function isSupportedShape(tag) {
    return ["path", "polyline", "polygon", "line", "rect", "circle", "ellipse"].includes(tag);
  }

  function walkSvgTree(node, parentMatrix, parentVisible, groupPath, onNode) {
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    const visible = parentVisible && isElementVisible(node);
    const matrix = multiplyMatrix(parentMatrix, parseTransform(node.getAttribute("transform")));
    const nextGroupPath = tag === "g" || tag === "svg"
      ? [...groupPath, { name: templateLayerName(node, groupPath.length), visible }]
      : groupPath;
    onNode(node, matrix, visible, groupPath);
    Array.from(node.children).forEach((child) => walkSvgTree(child, matrix, visible, nextGroupPath, onNode));
  }

  function groupReport(group, groupPath, visible) {
    return {
      name: templateLayerName(group, groupPath.length),
      id: group.getAttribute("id") || null,
      visible,
      elementsContained: 0,
      bounds: null,
      colors: []
    };
  }

  function extractTemplateLayers(root, unitScaleX, unitScaleY, cssStyles) {
    const groups = Array.from(root.querySelectorAll("g"));
    return groups.map((group, index) => {
      const name = templateLayerName(group, index);
      const collected = collectSvgGeometry(group, unitScaleX, unitScaleY, cssStyles);
      const elements = collected.elements;
      return {
        index,
        name,
        id: group.getAttribute("id") || null,
        normalizedName: normalizeLayerName(name),
        elements,
        color: primaryTemplateColor(elements),
        bounds: elements.length ? measurePointSets(elements.map((item) => item.points), { x: 0, y: 0, width: 1, height: 1 }) : null,
        visible: isElementVisible(group)
      };
    }).filter((layer) => layer.elements.length);
  }

  function extractColorLayers(elements) {
    const groups = new Map();
    elements.forEach((element) => {
      const color = element.color || "unknown";
      if (color === "none" || color === "transparent") return;
      if (!groups.has(color)) groups.set(color, []);
      groups.get(color).push(element);
    });
    return Array.from(groups.entries()).map(([color, items], index) => ({
      index,
      color,
      name: `Color ${color}`,
      elements: items,
      bounds: measurePointSets(items.map((item) => item.points), { x: 0, y: 0, width: 1, height: 1 })
    }));
  }

  function extractPathLayers(elements) {
    return elements
      .filter((element) => element.tag === "path")
      .map((element, index) => ({
        index,
        elementIndex: element.index,
        name: element.name || `Path ${index + 1}`,
        id: element.id,
        elements: [element],
        bounds: element.bounds || measurePointSets([element.points], { x: 0, y: 0, width: 1, height: 1 }),
        area: element.area || 0,
        closed: Boolean(element.closed),
        fill: element.fill,
        stroke: element.stroke,
        color: primaryTemplateColor([element]),
        candidateContour: Boolean(element.candidateContour),
        normalizedName: normalizeLayerName(element.name || element.id || `Path ${index + 1}`)
      }));
  }

  function primaryTemplateColor(elements) {
    const stroked = elements.find((element) => isPaintActive(element.stroke));
    if (stroked) return normalizeColor(stroked.stroke);
    const filled = elements.find((element) => isPaintActive(element.fill));
    if (filled) return normalizeColor(filled.fill);
    const colored = elements.find((element) => isPaintActive(element.color));
    return colored ? normalizeColor(colored.color) : "unknown";
  }

  function defaultPathRoleIndex(source, role) {
    const candidates = (source?.pathLayers || [])
      .filter((path) => path.candidateContour)
      .sort((a, b) => b.area - a.area);
    return candidates.length ? candidates[0].index : null;
  }

  function defaultLayerRoleIndex(source) {
    const candidates = (source?.templateLayers || [])
      .map((layer) => {
        const boundary = sourceContourBoundary({ elements: layer.elements });
        return {
          index: layer.index,
          area: boundary?.points ? Math.abs(polygonArea(boundary.points)) : 0
        };
      })
      .filter((item) => item.area > 0.01)
      .sort((a, b) => b.area - a.area);
    return candidates.length ? candidates[0].index : null;
  }

  function parseSvgCssStyles(root) {
    const styles = {};
    Array.from(root.querySelectorAll("style")).forEach((styleNode) => {
      const text = styleNode.textContent || "";
      const ruleRegex = /\.([A-Za-z0-9_-]+)\s*\{([^}]+)\}/g;
      let match = ruleRegex.exec(text);
      while (match) {
        styles[match[1]] = parseStyleDeclaration(match[2]);
        match = ruleRegex.exec(text);
      }
    });
    return styles;
  }

  function parseStyleDeclaration(value) {
    const result = {};
    String(value || "").split(";").forEach((part) => {
      const [key, raw] = part.split(":");
      if (!key || raw == null) return;
      result[key.trim().toLowerCase()] = raw.trim();
    });
    return result;
  }

  function elementColor(element, cssStyles) {
    const stroke = elementPaint(element, cssStyles, "stroke");
    const fill = elementPaint(element, cssStyles, "fill");
    return normalizeColor(stroke && stroke !== "none" ? stroke : fill);
  }

  function elementPaint(element, cssStyles, paintName) {
    let current = element;
    while (current && current.nodeType === 1) {
      const paint = directElementPaint(current, cssStyles, paintName);
      if (paint) return paint;
      current = current.parentElement;
    }
    return "unknown";
  }

  function directElementPaint(element, cssStyles, paintName) {
    const inline = parseStyleDeclaration(element.getAttribute("style"));
    const classStyles = {};
    String(element.getAttribute("class") || "").split(/\s+/).filter(Boolean).forEach((className) => {
      Object.assign(classStyles, cssStyles[className] || {});
    });
    const value = element.getAttribute(paintName) || inline[paintName] || classStyles[paintName];
    return value == null ? null : normalizeColor(value);
  }

  function normalizeColor(value) {
    if (!value) return "unknown";
    const color = String(value).trim().toLowerCase();
    if (color === "none") return "none";
    if (/^#[0-9a-f]{3}$/i.test(color)) {
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toLowerCase();
    }
    const rgb = color.match(/^rgb\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*\)$/i);
    if (rgb) {
      return `#${[rgb[1], rgb[2], rgb[3]].map((item) => clamp(Number(item), 0, 255).toString(16).padStart(2, "0")).join("")}`;
    }
    return color;
  }

  function templateLayerName(group, index) {
    return group.getAttribute("inkscape:label") ||
      group.getAttribute("data-name") ||
      group.getAttribute("aria-label") ||
      group.getAttribute("id") ||
      `Layer ${index + 1}`;
  }

  function normalizeLayerName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function detectTemplateRoles(layers) {
    const roles = {};
    TEMPLATE_ROLE_ORDER.forEach((role) => {
      const aliases = TEMPLATE_ROLE_ALIASES[role].map(normalizeLayerName);
      const candidates = layers.filter((layer) => aliases.some((alias) => layer.normalizedName === alias || layer.normalizedName.includes(alias)));
      if (candidates.length) roles[role] = candidates[0].index;
    });
    return roles;
  }

  function parseLength(value) {
    if (!value) return null;
    const match = String(value).trim().match(/^([-+]?(?:\d*\.\d+|\d+))(mm|cm|in|pt|px)?$/i);
    if (!match) return null;
    const amount = Number(match[1]);
    const unit = (match[2] || "px").toLowerCase();
    let mm = amount;
    if (unit === "cm") mm = amount * 10;
    if (unit === "in") mm = amount * 25.4;
    if (unit === "pt") mm = amount * 25.4 / 72;
    if (unit === "px") mm = amount * 25.4 / 96;
    return { value: amount, unit, mm };
  }

  function inferUndeclaredSvgScale(root, text) {
    const generatorText = text || "";
    const isIllustrator = /Adobe Illustrator|Illustrator/i.test(generatorText) || /Livello_/i.test(root.getAttribute("id") || "");
    if (isIllustrator) {
      const ptToMm = 25.4 / 72;
      return {
        scaleX: ptToMm,
        scaleY: ptToMm,
        method: "illustrator-viewbox-pt-fallback",
        assumption: "No SVG width/height declared; Adobe Illustrator viewBox units treated as PostScript points, 1pt = 25.4/72mm."
      };
    }
    return {
      scaleX: 1,
      scaleY: 1,
      method: "viewBox-as-mm-fallback",
      assumption: "No SVG width/height declared and no known authoring-unit hint found; viewBox units treated as mm."
    };
  }

  function parseViewBox(value) {
    if (!value) return { x: 0, y: 0, width: 100, height: 100 };
    const [x, y, width, height] = value.trim().split(/[\s,]+/).map(Number);
    return { x, y, width, height };
  }

  function extractShapePoints(element) {
    const tag = element.tagName.toLowerCase();
    if (tag === "rect") return rectPoints(element);
    if (tag === "circle") return circlePoints(
      Number(element.getAttribute("cx") || 0),
      Number(element.getAttribute("cy") || 0),
      Number(element.getAttribute("r") || 0),
      Number(element.getAttribute("r") || 0)
    );
    if (tag === "ellipse") return circlePoints(
      Number(element.getAttribute("cx") || 0),
      Number(element.getAttribute("cy") || 0),
      Number(element.getAttribute("rx") || 0),
      Number(element.getAttribute("ry") || 0)
    );
    return extractPoints(element);
  }

  function extractPoints(element) {
    const tag = element.tagName.toLowerCase();
    if (tag === "polyline" || tag === "polygon") return parsePointList(element.getAttribute("points"));
    if (tag === "line") {
      return [
        { x: Number(element.getAttribute("x1") || 0), y: Number(element.getAttribute("y1") || 0) },
        { x: Number(element.getAttribute("x2") || 0), y: Number(element.getAttribute("y2") || 0) }
      ];
    }
    if (tag === "path") return parsePathDataToPoints(element.getAttribute("d") || "");
    return [];
  }

  function parsePathDataToPoints(d) {
    const tokens = String(d || "").match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/g) || [];
    const points = [];
    let index = 0;
    let command = null;
    let current = { x: 0, y: 0 };
    let start = null;
    let lastCubicControl = null;
    let lastQuadraticControl = null;
    const isCommand = (value) => /^[a-zA-Z]$/.test(value || "");
    const hasNumber = () => index < tokens.length && !isCommand(tokens[index]);
    const nextNumber = () => Number(tokens[index++]);
    const add = (point) => {
      current = { x: point.x, y: point.y };
      if (!points.length || distance(last(points), current) > 0.0001) points.push({ ...current });
    };
    const relativePoint = (x, y, relative) => relative ? { x: current.x + x, y: current.y + y } : { x, y };
    const addCubic = (p0, p1, p2, p3) => {
      const steps = 24;
      for (let step = 1; step <= steps; step += 1) add(cubicPoint(p0, p1, p2, p3, step / steps));
    };
    const addQuadratic = (p0, p1, p2) => {
      const steps = 18;
      for (let step = 1; step <= steps; step += 1) add(quadraticPoint(p0, p1, p2, step / steps));
    };
    while (index < tokens.length) {
      if (isCommand(tokens[index])) command = tokens[index++];
      if (!command) break;
      const lower = command.toLowerCase();
      const relative = command === lower;
      if (lower === "z") {
        if (start) add(start);
        command = null;
        lastCubicControl = null;
        lastQuadraticControl = null;
        continue;
      }
      if (lower === "m") {
        if (!hasNumber()) continue;
        const first = relativePoint(nextNumber(), nextNumber(), relative);
        add(first);
        start = { ...first };
        command = relative ? "l" : "L";
        lastCubicControl = null;
        lastQuadraticControl = null;
        continue;
      }
      if (lower === "l") {
        while (hasNumber()) {
          add(relativePoint(nextNumber(), nextNumber(), relative));
        }
        lastCubicControl = null;
        lastQuadraticControl = null;
        continue;
      }
      if (lower === "h") {
        while (hasNumber()) {
          const x = nextNumber();
          add({ x: relative ? current.x + x : x, y: current.y });
        }
        lastCubicControl = null;
        lastQuadraticControl = null;
        continue;
      }
      if (lower === "v") {
        while (hasNumber()) {
          const y = nextNumber();
          add({ x: current.x, y: relative ? current.y + y : y });
        }
        lastCubicControl = null;
        lastQuadraticControl = null;
        continue;
      }
      if (lower === "c") {
        while (hasNumber()) {
          const p0 = { ...current };
          const p1 = relativePoint(nextNumber(), nextNumber(), relative);
          const p2 = relativePoint(nextNumber(), nextNumber(), relative);
          const p3 = relativePoint(nextNumber(), nextNumber(), relative);
          addCubic(p0, p1, p2, p3);
          lastCubicControl = p2;
          lastQuadraticControl = null;
        }
        continue;
      }
      if (lower === "s") {
        while (hasNumber()) {
          const p0 = { ...current };
          const p1 = lastCubicControl ? { x: current.x * 2 - lastCubicControl.x, y: current.y * 2 - lastCubicControl.y } : { ...current };
          const p2 = relativePoint(nextNumber(), nextNumber(), relative);
          const p3 = relativePoint(nextNumber(), nextNumber(), relative);
          addCubic(p0, p1, p2, p3);
          lastCubicControl = p2;
          lastQuadraticControl = null;
        }
        continue;
      }
      if (lower === "q") {
        while (hasNumber()) {
          const p0 = { ...current };
          const p1 = relativePoint(nextNumber(), nextNumber(), relative);
          const p2 = relativePoint(nextNumber(), nextNumber(), relative);
          addQuadratic(p0, p1, p2);
          lastQuadraticControl = p1;
          lastCubicControl = null;
        }
        continue;
      }
      if (lower === "t") {
        while (hasNumber()) {
          const p0 = { ...current };
          const p1 = lastQuadraticControl ? { x: current.x * 2 - lastQuadraticControl.x, y: current.y * 2 - lastQuadraticControl.y } : { ...current };
          const p2 = relativePoint(nextNumber(), nextNumber(), relative);
          addQuadratic(p0, p1, p2);
          lastQuadraticControl = p1;
          lastCubicControl = null;
        }
        continue;
      }
      if (lower === "a") {
        while (hasNumber()) {
          index += 5;
          add(relativePoint(nextNumber(), nextNumber(), relative));
        }
        lastCubicControl = null;
        lastQuadraticControl = null;
        continue;
      }
      while (hasNumber()) index += 1;
    }
    return points;
  }

  function cubicPoint(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return {
      x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
      y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y
    };
  }

  function quadraticPoint(p0, p1, p2, t) {
    const mt = 1 - t;
    return {
      x: mt ** 2 * p0.x + 2 * mt * t * p1.x + t ** 2 * p2.x,
      y: mt ** 2 * p0.y + 2 * mt * t * p1.y + t ** 2 * p2.y
    };
  }

  function shapeIsClosed(element, points) {
    const tag = element.tagName.toLowerCase();
    if (tag === "polygon" || tag === "rect" || tag === "circle" || tag === "ellipse") return true;
    if (tag === "path" && /z/i.test(element.getAttribute("d") || "")) return true;
    return points.length > 2 && distance(points[0], last(points)) <= 0.001;
  }

  function isPaintActive(value) {
    return Boolean(value && value !== "none" && value !== "transparent" && value !== "unknown");
  }

  function ensureClosedLoop(points) {
    if (!points?.length) return [];
    return samePoint(points[0], last(points)) ? points : [...points, { ...points[0] }];
  }

  function rectPoints(element) {
    const x = Number(element.getAttribute("x") || 0);
    const y = Number(element.getAttribute("y") || 0);
    const width = Number(element.getAttribute("width") || 0);
    const height = Number(element.getAttribute("height") || 0);
    if (width <= 0 || height <= 0) return [];
    return [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
      { x, y }
    ];
  }

  function circlePoints(cx, cy, rx, ry) {
    if (rx <= 0 || ry <= 0) return [];
    const steps = 64;
    const points = [];
    for (let index = 0; index <= steps; index += 1) {
      const angle = (Math.PI * 2 * index) / steps;
      points.push({ x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry });
    }
    return points;
  }

  function isElementVisible(element) {
    const style = parseStyleDeclaration(element.getAttribute("style"));
    const display = element.getAttribute("display") || style.display;
    const visibility = element.getAttribute("visibility") || style.visibility;
    const opacity = element.getAttribute("opacity") || style.opacity;
    return display !== "none" && visibility !== "hidden" && visibility !== "collapse" && opacity !== "0";
  }

  function identityMatrix() {
    return [1, 0, 0, 1, 0, 0];
  }

  function multiplyMatrix(a, b) {
    return [
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4],
      a[1] * b[4] + a[3] * b[5] + a[5]
    ];
  }

  function applyMatrix(point, matrix) {
    return {
      x: point.x * matrix[0] + point.y * matrix[2] + matrix[4],
      y: point.x * matrix[1] + point.y * matrix[3] + matrix[5]
    };
  }

  function parseTransform(value) {
    if (!value) return identityMatrix();
    let matrix = identityMatrix();
    const regex = /([a-z]+)\(([^)]*)\)/gi;
    let match = regex.exec(value);
    while (match) {
      const type = match[1].toLowerCase();
      const nums = (match[2].match(/[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/gi) || []).map(Number);
      let next = identityMatrix();
      if (type === "matrix" && nums.length >= 6) next = nums.slice(0, 6);
      if (type === "translate") next = [1, 0, 0, 1, nums[0] || 0, nums[1] || 0];
      if (type === "scale") next = [nums[0] ?? 1, 0, 0, nums[1] ?? nums[0] ?? 1, 0, 0];
      if (type === "rotate") {
        const angle = (nums[0] || 0) * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const rotate = [cos, sin, -sin, cos, 0, 0];
        if (nums.length >= 3) {
          const [cx, cy] = [nums[1], nums[2]];
          next = multiplyMatrix(multiplyMatrix([1, 0, 0, 1, cx, cy], rotate), [1, 0, 0, 1, -cx, -cy]);
        } else {
          next = rotate;
        }
      }
      if (type === "skewx") {
        next = [1, 0, Math.tan((nums[0] || 0) * Math.PI / 180), 1, 0, 0];
      }
      if (type === "skewy") {
        next = [1, Math.tan((nums[0] || 0) * Math.PI / 180), 0, 1, 0, 0];
      }
      matrix = multiplyMatrix(matrix, next);
      match = regex.exec(value);
    }
    return matrix;
  }

  function parsePointList(value) {
    const values = (value || "").match(/[-+]?(?:\d*\.\d+|\d+)/g) || [];
    const points = [];
    for (let index = 0; index < values.length - 1; index += 2) {
      points.push({ x: Number(values[index]), y: Number(values[index + 1]) });
    }
    return points;
  }

  function measurePointSets(pointSets, fallback) {
    let hasPoints = false;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    pointSets.forEach((points) => {
      points.forEach((point) => {
        hasPoints = true;
        if (point.x < minX) minX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
      });
    });
    if (!hasPoints) {
      return {
        minX: fallback.x,
        minY: fallback.y,
        maxX: fallback.x + fallback.width,
        maxY: fallback.y + fallback.height,
        width: fallback.width,
        height: fallback.height,
        centerX: fallback.x + fallback.width / 2,
        centerY: fallback.y + fallback.height / 2
      };
    }
    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }

  function createEl(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
    return el;
  }

  function readParams() {
    document.querySelectorAll("[data-param]").forEach((input) => {
      const key = input.dataset.param;
      if (input.type === "checkbox") state.params[key] = input.checked;
      else if (input.tagName === "SELECT" || input.type === "color" || input.type === "text") state.params[key] = input.value;
      else state.params[key] = Number(input.value);
    });
    document.querySelectorAll("[data-layer]").forEach((input) => {
      state.layers[input.dataset.layer] = input.checked;
    });
    document.querySelectorAll("[data-template-role]").forEach((select) => {
      const value = select.value;
      if (value === "") delete state.templateAssignments[select.dataset.templateRole];
      else state.templateAssignments[select.dataset.templateRole] = value;
    });
    state.clipPreview = document.getElementById("clipPreview").checked;
  }

  function applyStateToControls() {
    Object.entries(state.params).forEach(([key, value]) => {
      const input = document.querySelector(`[data-param="${key}"]`);
      if (input?.type === "checkbox") input.checked = Boolean(value);
      else if (input) input.value = value;
    });
    Object.entries(state.layers).forEach(([key, value]) => {
      const input = document.querySelector(`[data-layer="${key}"]`);
      if (input) input.checked = Boolean(value);
    });
    document.getElementById("clipPreview").checked = state.clipPreview;
    renderTemplateLayerPanel();
  }

  function renderTemplateLayerPanel() {
    if (!templateLayerPanel) return;
    const source = state.sources.panel;
    const layers = source?.templateLayers || [];
    const paths = source?.pathLayers || [];
    const colors = source?.colorLayers || [];
    if (!layers.length && !paths.length && !colors.length) {
      templateLayerPanel.textContent = "No template layers, paths, or colors detected";
      window.__rgTemplateOptions = [{ value: "", color: "unknown", name: "Nessun colore nel file", type: "auto", detail: "" }];
      window.__rgTemplateAssignments = { ...state.templateAssignments };
      return;
    }
    const report = state.templateReport;
    templateLayerPanel.innerHTML = "";
    const list = document.createElement("div");
    list.className = "template-role-list";
    const options = templateAssignmentOptions(layers, paths, colors);
    // Exposed for the simplified UI (easy.html) role pickers.
    window.__rgTemplateOptions = options;
    window.__rgTemplateAssignments = { ...state.templateAssignments };
    TEMPLATE_ROLE_ORDER.forEach((role) => {
      const row = document.createElement("div");
      row.className = "template-role-row";
      const title = document.createElement("span");
      title.textContent = TEMPLATE_ROLE_LABELS[role];
      const value = state.templateAssignments[role] !== undefined ? normalizedAssignmentValue(state.templateAssignments[role]) : "";
      const dropdown = buildTemplateAssignmentDropdown(role, options, value);
      const resolved = report?.references?.[roleKey(role)];
      const meta = document.createElement("span");
      meta.className = "template-role-meta";
      meta.textContent = resolved ? `${resolved.sourceType}${resolved.layerName ? `: ${resolved.layerName}` : ""}` : "pending";
      row.appendChild(title);
      row.appendChild(dropdown);
      row.appendChild(meta);
      list.appendChild(row);
    });
    templateLayerPanel.appendChild(list);
    const itemList = buildTemplateColorPreviewList(layers, paths, colors);
    if (itemList) templateLayerPanel.appendChild(itemList);
    if (report?.warnings?.length) {
      const warnings = document.createElement("div");
      warnings.className = "template-warnings";
      warnings.textContent = report.warnings.join(" | ");
      templateLayerPanel.appendChild(warnings);
    }
  }

  function templateAssignmentOptions(layers, paths, colors) {
    return [
      { value: "", color: "unknown", name: "Auto detect / offset fallback", type: "auto", detail: "" },
      ...layers.map((layer) => ({
        value: `layer:${layer.index}`,
        color: layer.color,
        secondaryColor: secondaryFillColor(layer.elements),
        name: layer.name,
        type: geometryTypeLabel(layer.elements),
        detail: `${round(layer.bounds.width)} x ${round(layer.bounds.height)} mm`
      })),
      ...paths.map((path) => ({
        value: `path:${path.index}`,
        color: path.color,
        secondaryColor: isPaintActive(path.fill) && path.fill !== path.color ? path.fill : null,
        name: path.name,
        type: path.closed ? "path, closed" : "path, open",
        detail: `${path.candidateContour ? "contour" : "not contour"}, area ${round(path.area)} mm2`
      })),
      ...colors.map((colorLayer) => ({
        value: `color:${colorLayer.color}`,
        color: colorLayer.color,
        name: colorLayer.name,
        type: geometryTypeLabel(colorLayer.elements),
        detail: `${colorLayer.elements.length} paths`
      }))
    ];
  }

  function buildTemplateAssignmentDropdown(role, options, value) {
    const selected = options.find((option) => option.value === value) || options[0];
    const wrapper = document.createElement("div");
    wrapper.className = "template-custom-select";
    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.dataset.templateRole = role;
    hidden.value = selected.value;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "template-select-button";
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    appendTemplateOptionContent(button, selected);
    const menu = document.createElement("div");
    menu.className = "template-select-menu";
    menu.setAttribute("role", "listbox");
    options.forEach((option) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "template-select-option";
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", option.value === selected.value ? "true" : "false");
      appendTemplateOptionContent(item, option);
      item.addEventListener("click", () => {
        hidden.value = option.value;
        readParams();
        render();
      });
      menu.appendChild(item);
    });
    button.addEventListener("click", () => {
      const open = wrapper.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
    wrapper.appendChild(hidden);
    wrapper.appendChild(button);
    wrapper.appendChild(menu);
    return wrapper;
  }

  function appendTemplateOptionContent(target, option) {
    target.textContent = "";
    const swatch = document.createElement("span");
    swatch.className = "template-color-swatch";
    if (isPaintActive(option.color)) swatch.style.background = option.color;
    else swatch.classList.add("template-color-swatch-empty");
    const color = document.createElement("span");
    color.className = "template-color-label";
    color.textContent = colorLabel(option.color);
    const name = document.createElement("span");
    name.className = "template-item-name";
    name.textContent = option.name;
    const type = document.createElement("span");
    type.className = "template-item-type";
    const secondary = isPaintActive(option.secondaryColor) ? `, fill ${option.secondaryColor}` : "";
    type.textContent = `${option.type}${secondary}`;
    target.appendChild(swatch);
    target.appendChild(color);
    target.appendChild(name);
    target.appendChild(type);
  }

  function geometryTypeLabel(elements) {
    const tags = Array.from(new Set((elements || []).map((element) => element.tag).filter(Boolean)));
    return tags.length ? tags.join("/") : "geometry";
  }

  function secondaryFillColor(elements) {
    const filled = (elements || []).find((element) => isPaintActive(element.fill) && normalizeColor(element.fill) !== normalizeColor(element.color));
    return filled ? normalizeColor(filled.fill) : null;
  }

  function normalizedAssignmentValue(value) {
    if (typeof value === "number") return `layer:${value}`;
    if (/^\d+$/.test(String(value))) return `layer:${value}`;
    return String(value);
  }

  function selectedAssignmentColor(value) {
    return String(value || "").startsWith("color:") ? String(value).slice(6) : null;
  }

  // Global rule: when placement/fixing share the SAME perimeter selection as the pattern,
  // Level 0/1 must route like the pattern (continuous perimeter travel between diagonals)
  // instead of the per-diagonal split.
  function shouldPlacementFollowPattern() {
    const placement = state.templateAssignments.PLACEMENT_REFERENCE;
    const pattern = state.templateAssignments.PATTERN_REFERENCE;
    if (!placement || !pattern) return false;
    return normalizedAssignmentValue(placement) === normalizedAssignmentValue(pattern);
  }

  function colorLabel(color) {
    return isPaintActive(color) ? color : "no color";
  }

  function buildTemplateColorPreviewList(layers, paths, colors) {
    const items = [
      ...layers.map((layer) => ({ type: "layer", value: layer.index, color: layer.color, name: layer.name, detail: layer.id || "SVG layer" })),
      ...paths.map((path) => ({ type: "path", value: path.index, color: path.color, name: path.name, detail: path.id || (path.closed ? "closed path" : "open path") })),
      ...colors.map((colorLayer) => ({ type: "color", value: colorLayer.color, color: colorLayer.color, name: colorLayer.name, detail: `${colorLayer.elements.length} paths` }))
    ];
    if (!items.length) return null;
    const wrapper = document.createElement("details");
    wrapper.className = "template-detected-list";
    const heading = document.createElement("summary");
    heading.className = "template-detected-heading";
    heading.textContent = "Detected Template Layers";
    wrapper.appendChild(heading);
    const body = document.createElement("div");
    body.className = "template-detected-body";
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "template-detected-row";
      const swatch = document.createElement("span");
      swatch.className = "template-color-swatch";
      if (isPaintActive(item.color)) swatch.style.background = item.color;
      else swatch.classList.add("template-color-swatch-empty");
      const color = document.createElement("span");
      color.className = "template-color-label";
      color.textContent = colorLabel(item.color);
      const name = document.createElement("span");
      name.className = "template-item-name";
      name.textContent = item.name;
      const role = document.createElement("span");
      role.className = "template-item-role";
      role.textContent = assignedTemplateItemRole(item.type, item.value) || "unassigned";
      row.appendChild(swatch);
      row.appendChild(color);
      row.appendChild(name);
      row.appendChild(role);
      body.appendChild(row);
    });
    wrapper.appendChild(body);
    return wrapper;
  }

  function assignedTemplateItemRole(type, value) {
    return TEMPLATE_ROLE_ORDER.find((role) => {
      const selection = roleSelectionFor(role);
      return selection.type === type && String(selection.value) === String(value);
    }) || null;
  }

  function roleKey(role) {
    if (role === "MASTER_OUTLINE") return "master";
    if (role === "LASER_REFERENCE") return "laser";
    if (role === "PLACEMENT_REFERENCE") return "placement";
    if (role === "PATTERN_REFERENCE") return "pattern";
    if (role === "SATIN_REFERENCE") return "satin";
    return "cord";
  }

  function anchorFor(source, levelName) {
    const p = state.params;
    const ax = p[`${levelName}AnchorX`];
    const ay = p[`${levelName}AnchorY`];
    if (Number.isFinite(ax) && Number.isFinite(ay) && (ax !== 0 || ay !== 0)) return { x: ax, y: ay };
    if (p.anchorMode === "manual") return { x: p.manualAnchorX, y: p.manualAnchorY };
    if (p.anchorMode === "bbox_center") return { x: source.bounds.centerX, y: source.bounds.centerY };
    return { x: source.viewBox.x * source.unitScaleX, y: source.viewBox.y * source.unitScaleY };
  }

  function scaleForLevel(levelName) {
    const value = state.params[`${levelName}Scale`];
    return Number.isFinite(value) ? value : state.params.moduleScale;
  }

  function formatBounds() {
    const p = state.params;
    const base = state.sources.panel ? state.sources.panel.bounds : {
      minX: p.formatOriginX,
      minY: p.formatOriginY,
      maxX: p.formatOriginX + p.formatWidth,
      maxY: p.formatOriginY + p.formatHeight,
      width: p.formatWidth,
      height: p.formatHeight,
      centerX: p.formatOriginX + p.formatWidth / 2,
      centerY: p.formatOriginY + p.formatHeight / 2
    };
    return rectBoundary({
      x: base.minX,
      y: base.minY,
      width: base.width,
      height: base.height
    }, "format");
  }

  function rectBoundary(rect, name = "rect") {
    const bounds = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      minX: rect.x,
      minY: rect.y,
      maxX: rect.x + rect.width,
      maxY: rect.y + rect.height
    };
    return {
      type: "rect",
      name,
      ...bounds,
      points: [
        { x: bounds.minX, y: bounds.minY },
        { x: bounds.maxX, y: bounds.minY },
        { x: bounds.maxX, y: bounds.maxY },
        { x: bounds.minX, y: bounds.maxY },
        { x: bounds.minX, y: bounds.minY }
      ]
    };
  }

  function activePatternBoundary() {
    const references = resolveTemplateReferences(true);
    if (references.master.boundary) return references.master.boundary;
    const base = formatBounds();
    const contour = sourceContourBoundary(state.sources.panel);
    if (!contour) return insetBoundary(base, {
      top: state.params.patternTopOffset,
      right: state.params.patternRightOffset,
      bottom: state.params.patternBottomOffset,
      left: state.params.patternLeftOffset
    }, "pattern");
    const offsetContour = offsetPolygonBoundary(contour, {
      top: state.params.patternTopOffset,
      right: state.params.patternRightOffset,
      bottom: state.params.patternBottomOffset,
      left: state.params.patternLeftOffset
    }, "pattern");
    return offsetContour || base;
  }

  function decorativeBoundary(pattern = activePatternBoundary()) {
    const references = resolveTemplateReferences(true);
    if (references.pattern.boundary) return references.pattern.boundary;
    const offset = Math.max(0, state.params.patternBorderOffset || 0);
    if (!offset) return { ...pattern, name: "decorative" };
    if (pattern.type === "rect") {
      return insetBoundary(pattern, { top: offset, right: offset, bottom: offset, left: offset }, "decorative");
    }
    return offsetPolygonBoundary(pattern, { top: offset, right: offset, bottom: offset, left: offset }, "decorative") || pattern;
  }

  function routingPerimeterBoundary(pattern = activePatternBoundary(), decorative = pattern) {
    const source = state.params.routingPerimeterSource || "MASTER_OUTLINE";
    if (source === "program_rectangle") return rectBoundary(formatBounds(), "routing_program_rectangle");
    const references = resolveTemplateReferences(true);
    if (source === "PATTERN_REFERENCE" && references.pattern.boundary) return { ...references.pattern.boundary, name: "routing_pattern_reference" };
    if (source === "CORD_REFERENCE" && references.cord.boundary) return { ...references.cord.boundary, name: "routing_cord_reference" };
    if (source === "MASTER_OUTLINE" && references.master.boundary) return { ...references.master.boundary, name: "routing_master_outline" };
    return decorative || pattern;
  }

  function laserBoundary(pattern = activePatternBoundary()) {
    const references = resolveTemplateReferences(true);
    if (references.laser.boundary) return references.laser.boundary;
    return insetBoundary(pattern, {
      top: state.params.laserTopOffset,
      right: state.params.laserRightOffset,
      bottom: state.params.laserBottomOffset,
      left: state.params.laserLeftOffset
    }, "laser_reference");
  }

  function placementBoundary(pattern = activePatternBoundary()) {
    const references = resolveTemplateReferences(true);
    if (references.placement.boundary) return references.placement.boundary;
    return insetBoundary(pattern, {
      top: state.params.placementTopOffset,
      right: state.params.placementRightOffset,
      bottom: state.params.placementBottomOffset,
      left: state.params.placementLeftOffset
    }, "placement_reference");
  }

  function satinBoundary(pattern = activePatternBoundary()) {
    const references = resolveTemplateReferences(true);
    return references.satin.boundary || pattern;
  }

  function cordBoundary(pattern = activePatternBoundary()) {
    const references = resolveTemplateReferences(true);
    if (references.cord.boundary) return references.cord.boundary;
    const offset = Math.max(0, state.params.cordOffset || 0);
    if (!offset) return pattern;
    return pattern.type === "rect"
      ? insetBoundary(pattern, { top: offset, right: offset, bottom: offset, left: offset }, "cord_reference")
      : offsetPolygonBoundary(pattern, { top: offset, right: offset, bottom: offset, left: offset }, "cord_reference") || pattern;
  }

  function resolveTemplateReferences(allowFallback = true) {
    const panel = state.sources.panel;
    const roles = {
      master: templateBoundaryForRole("MASTER_OUTLINE"),
      laser: templateBoundaryForRole("LASER_REFERENCE"),
      placement: templateBoundaryForRole("PLACEMENT_REFERENCE"),
      pattern: templateBoundaryForRole("PATTERN_REFERENCE"),
      satin: templateBoundaryForRole("SATIN_REFERENCE"),
      cord: templateBoundaryForRole("CORD_REFERENCE")
    };
    const warnings = [];
    if (panel?.templateLayers?.length && !roles.master.boundary) warnings.push("Missing MASTER_OUTLINE: using largest contour or rectangular fallback.");
    if (roles.master.boundary && allowFallback) {
      if (!roles.pattern.boundary) {
        roles.pattern = { sourceType: "generated offset", layerName: null, boundary: generatedPatternBoundary(roles.master.boundary) };
        warnings.push("Missing PATTERN_REFERENCE: generated from MASTER_OUTLINE using Pattern Offset.");
      }
      if (!roles.laser.boundary) {
        roles.laser = { sourceType: "generated offset", layerName: null, boundary: insetBoundary(roles.master.boundary, {
          top: state.params.laserTopOffset,
          right: state.params.laserRightOffset,
          bottom: state.params.laserBottomOffset,
          left: state.params.laserLeftOffset
        }, "laser_reference") };
      }
      if (!roles.placement.boundary) {
        roles.placement = { sourceType: "generated offset", layerName: null, boundary: insetBoundary(roles.master.boundary, {
          top: state.params.placementTopOffset,
          right: state.params.placementRightOffset,
          bottom: state.params.placementBottomOffset,
          left: state.params.placementLeftOffset
        }, "placement_reference") };
      }
      if (!roles.satin.boundary) roles.satin = { sourceType: "generated from master/pattern", layerName: null, boundary: roles.master.boundary };
      if (!roles.cord.boundary) roles.cord = { sourceType: "generated offset", layerName: null, boundary: cordBoundaryFromMaster(roles.master.boundary) };
    }
    const unassigned = panel?.templateLayers?.filter((layer) => !TEMPLATE_ROLE_ORDER.some((role) => {
      const selection = roleSelectionFor(role);
      return selection.type === "layer" && selection.value === layer.index;
    })).map((layer) => layer.name) || [];
    if (unassigned.length) warnings.push(`Unassigned template layers: ${unassigned.join(", ")}`);
    const unassignedPaths = panel?.pathLayers?.filter((path) => path.candidateContour && !TEMPLATE_ROLE_ORDER.some((role) => {
      const selection = roleSelectionFor(role);
      return selection.type === "path" && selection.value === path.index;
    })).map((path) => path.name) || [];
    if (unassignedPaths.length) warnings.push(`Unassigned candidate paths: ${unassignedPaths.join(", ")}`);
    state.templateReport = {
      schemaVersion: SCHEMA_VERSION,
      mode: panel?.templateLayers?.length ? "template layer mode" : (panel?.pathLayers?.length ? "template path mode" : "auto offset mode"),
      source: panel?.name || null,
      layers: panel?.templateLayers || [],
      paths: panel?.pathLayers || [],
      references: roles,
      warnings
    };
    return roles;
  }

  function generatedPatternBoundary(master) {
    const offset = Math.max(0, state.params.patternBorderOffset || 0);
    if (!offset) return { ...master, name: "pattern_reference" };
    return master.type === "rect"
      ? insetBoundary(master, { top: offset, right: offset, bottom: offset, left: offset }, "pattern_reference")
      : offsetPolygonBoundary(master, { top: offset, right: offset, bottom: offset, left: offset }, "pattern_reference") || master;
  }

  function cordBoundaryFromMaster(master) {
    const offset = Math.max(0, state.params.cordOffset || 0);
    if (!offset) return { ...master, name: "cord_reference" };
    return master.type === "rect"
      ? insetBoundary(master, { top: offset, right: offset, bottom: offset, left: offset }, "cord_reference")
      : offsetPolygonBoundary(master, { top: offset, right: offset, bottom: offset, left: offset }, "cord_reference") || master;
  }

  function templateBoundaryForRole(role) {
    const panel = state.sources.panel;
    const selection = roleSelectionFor(role);
    const layer = selection.type === "color"
      ? panel?.colorLayers?.find((item) => item.color === selection.value)
      : selection.type === "path"
        ? panel?.pathLayers?.find((item) => item.index === selection.value)
        : panel?.templateLayers?.find((item) => item.index === selection.value);
    if (!layer) return { sourceType: "missing", layerName: null, boundary: null };
    const boundary = sourceContourBoundary({ elements: layer.elements });
    const manualType = selection.type === "color" ? "manual color assignment" : selection.type === "path" ? "manual path assignment" : "manual layer assignment";
    const detectedType = selection.type === "path" ? "detected path" : "detected layer";
    return {
      sourceType: state.templateAssignments[role] != null ? manualType : detectedType,
      layerName: selection.type === "color" ? `Color ${layer.color}` : layer.name,
      boundary: boundary ? { ...boundary, name: role.toLowerCase() } : null
    };
  }

  function roleSelectionFor(role) {
    const assigned = state.templateAssignments[role];
    if (assigned !== undefined && assigned !== "") {
      const normalized = normalizedAssignmentValue(assigned);
      if (normalized.startsWith("color:")) return { type: "color", value: normalized.slice(6) };
      if (normalized.startsWith("path:")) return { type: "path", value: Number(normalized.slice(5)) };
      if (normalized.startsWith("layer:")) return { type: "layer", value: Number(normalized.slice(6)) };
    }
    const pathIndex = defaultPathRoleIndex(state.sources.panel, role);
    if (pathIndex != null) return { type: "path", value: pathIndex };
    const layerIndex = defaultLayerRoleIndex(state.sources.panel);
    if (layerIndex != null) return { type: "layer", value: layerIndex };
    const detected = state.sources.panel?.detectedTemplateRoles?.[role];
    return { type: "layer", value: detected };
  }

  function sourceContourBoundary(source) {
    if (!source?.elements?.length) return null;
    const candidates = source.elements
      .map((item) => normalizePerimeterLoop(item.points, state.params.perimeterCloseTolerance || 0.1))
      .filter(Boolean)
      .sort((a, b) => Math.abs(polygonArea(b)) - Math.abs(polygonArea(a)));
    const largest = candidates[0];
    if (!largest) return null;
    const boundary = boundaryFromPoints(largest, "pattern");
    // Smaller contours that sit INSIDE the largest are exclusion areas (holes in the shape):
    // used e.g. for laser holes → no holes inside these inner regions.
    const exclusions = [];
    for (let index = 1; index < candidates.length; index += 1) {
      const loop = candidates[index];
      const centroid = loop.reduce((acc, p) => ({ x: acc.x + p.x / loop.length, y: acc.y + p.y / loop.length }), { x: 0, y: 0 });
      if (pointInPolygon(centroid, largest)) exclusions.push(boundaryFromPoints(loop, "exclusion"));
    }
    if (exclusions.length) boundary.exclusions = exclusions;
    return boundary;
  }

  function normalizePerimeterLoop(points, closeTolerance = 0.1) {
    if (!points || points.length < 3) return null;
    const cleaned = [];
    points.forEach((point) => {
      const next = { x: point.x, y: point.y };
      if (!cleaned.length || distance(last(cleaned), next) > 0.001) cleaned.push(next);
    });
    if (cleaned.length < 3) return null;
    const endpointDistance = distance(cleaned[0], last(cleaned));
    if (endpointDistance > closeTolerance) return null;
    if (!samePoint(cleaned[0], last(cleaned))) cleaned.push({ ...cleaned[0] });
    const withoutTinySegments = [cleaned[0]];
    for (let index = 1; index < cleaned.length; index += 1) {
      if (distance(last(withoutTinySegments), cleaned[index]) > 0.001) withoutTinySegments.push(cleaned[index]);
    }
    if (!samePoint(withoutTinySegments[0], last(withoutTinySegments))) withoutTinySegments.push({ ...withoutTinySegments[0] });
    if (withoutTinySegments.length < 4) return null;
    if (polygonArea(withoutTinySegments) < 0) withoutTinySegments.reverse();
    if (!samePoint(withoutTinySegments[0], last(withoutTinySegments))) withoutTinySegments.push({ ...withoutTinySegments[0] });
    return withoutTinySegments;
  }

  function boundaryFromPoints(points, name) {
    const normalizedPoints = normalizePerimeterLoop(points, state.params.perimeterCloseTolerance || 0.1) || points;
    const bounds = measurePointSets([normalizedPoints], { x: 0, y: 0, width: 1, height: 1 });
    return {
      type: "polygon",
      name,
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.width,
      height: bounds.height,
      minX: bounds.minX,
      minY: bounds.minY,
      maxX: bounds.maxX,
      maxY: bounds.maxY,
      points: normalizedPoints
    };
  }

  function insetBoundary(boundary, offsets, name) {
    const minX = boundary.minX + Math.max(0, offsets.left || 0);
    const minY = boundary.minY + Math.max(0, offsets.top || 0);
    const maxX = boundary.maxX - Math.max(0, offsets.right || 0);
    const maxY = boundary.maxY - Math.max(0, offsets.bottom || 0);
    return rectBoundary({
      x: minX,
      y: minY,
      width: Math.max(1, maxX - minX),
      height: Math.max(1, maxY - minY)
    }, name);
  }

  function offsetPolygonBoundary(boundary, offsets, name) {
    const cx = (boundary.minX + boundary.maxX) / 2;
    const cy = (boundary.minY + boundary.maxY) / 2;
    const averageOffset = ((offsets.top || 0) + (offsets.right || 0) + (offsets.bottom || 0) + (offsets.left || 0)) / 4;
    if (!averageOffset) return { ...boundary, name };
    const points = boundary.points.map((point) => {
      const dx = point.x - cx;
      const dy = point.y - cy;
      const length = Math.hypot(dx, dy) || 1;
      const moved = {
        x: point.x - (dx / length) * averageOffset,
        y: point.y - (dy / length) * averageOffset
      };
      return moved;
    });
    if (points.length && !samePoint(points[0], last(points))) points.push({ ...points[0] });
    return boundaryFromPoints(points, name);
  }

  function polygonArea(points) {
    let area = 0;
    for (let index = 0; index < points.length - 1; index += 1) {
      area += points[index].x * points[index + 1].y - points[index + 1].x * points[index].y;
    }
    return area / 2;
  }

  function boundaryStartPoint(boundary, mode) {
    const p = state.params;
    if (mode === "decorative") {
      return {
        x: boundary.minX + (p.startOffsetX || 0),
        y: boundary.minY + (p.startOffsetY || 0)
      };
    }
    return {
      x: boundary.minX + (p.laserLeftOffset || 0),
      y: boundary.minY + (p.laserTopOffset || 0)
    };
  }

  function legacyFormatBounds() {
    const p = state.params;
    return {
      x: p.formatOriginX,
      y: p.formatOriginY,
      width: p.formatWidth,
      height: p.formatHeight,
      minX: p.formatOriginX,
      minY: p.formatOriginY,
      maxX: p.formatOriginX + p.formatWidth,
      maxY: p.formatOriginY + p.formatHeight
    };
  }

  function generatePlacements(source, levelName) {
    const p = state.params;
    const anchor = anchorFor(source, levelName);
    const levelScale = scaleForLevel(levelName);
    const levelOffsetX = p[`${levelName}OffsetX`] || 0;
    const levelOffsetY = p[`${levelName}OffsetY`] || 0;
    const vectorA = {
      x: p.vectorAX + p.horizontalGap - p.horizontalOverlap,
      y: p.vectorAY + p.verticalGap - p.verticalOverlap
    };
    const vectorB = {
      x: p.vectorBX + p.rowShiftX,
      y: p.vectorBY + p.rowShiftY
    };
    const autoFill = computeAutoFill(source, vectorA, vectorB, levelScale);
    const diagonalCount = levelName === "level1" && p.autoFillDiagonals ? autoFill.diagonalCount : Math.max(1, Math.floor(p.diagonalCount || 1));
    const modulesPerDiagonal = levelName === "level1" && p.autoModulesPerDiagonal ? autoFill.modulesPerDiagonal : Math.max(1, Math.floor(p.modulesPerDiagonal || 1));
    if (levelName === "level1") {
      state.params.diagonalCount = diagonalCount;
      state.params.modulesPerDiagonal = modulesPerDiagonal;
      state.autoFillReport = autoFill;
    }
    autoFill.effectiveDiagonalCount = diagonalCount;
    autoFill.effectiveModulesPerDiagonal = modulesPerDiagonal;
    const placements = [];
    const startX = autoFill.expanded.minX + p.startOffsetX + levelOffsetX;
    const startY = autoFill.expanded.minY + p.startOffsetY + levelOffsetY;
    for (let diagonal = 0; diagonal < diagonalCount; diagonal += 1) {
      const band = [];
      for (let index = 0; index < modulesPerDiagonal; index += 1) {
        const anchorX = startX + diagonal * vectorB.x + index * vectorA.x;
        const anchorY = startY + diagonal * vectorB.y + index * vectorA.y;
        band.push({
          diagonal,
          index,
          anchorX,
          anchorY,
          x: anchorX - anchor.x * levelScale,
          y: anchorY - anchor.y * levelScale,
          anchor,
          scale: levelScale
        });
      }
      placements.push(band);
    }
    return placements;
  }

  function computeAutoFill(source, vectorA, vectorB, levelScale = state.params.moduleScale) {
    const bounds = formatBounds();
    const margin = Math.max(0, state.params.overflowMarginMm || 0);
    const expanded = {
      minX: bounds.minX - margin,
      minY: bounds.minY - margin,
      maxX: bounds.maxX + margin,
      maxY: bounds.maxY + margin,
      width: bounds.width + margin * 2,
      height: bounds.height + margin * 2
    };
    const moduleSpan = Math.max(source.bounds.width, source.bounds.height, 1) * Math.max(levelScale, 0.001);
    const rawStepA = Math.hypot(vectorA.x, vectorA.y);
    const rawStepB = Math.hypot(vectorB.x, vectorB.y);
    const stepA = rawStepA >= 1 ? rawStepA : moduleSpan;
    const stepB = rawStepB >= 1 ? rawStepB : moduleSpan;
    const diagonalReach = Math.hypot(expanded.width, expanded.height) + moduleSpan * 2;
    const crossReach = expanded.width + expanded.height + moduleSpan * 2;
    const modulesPerDiagonal = Math.ceil(diagonalReach / stepA) + 6;
    const diagonalCount = Math.ceil(crossReach / stepB) + 6;
    return {
      expanded,
      overflowMarginMm: margin,
      rawVectorALength: rawStepA,
      rawVectorBLength: rawStepB,
      vectorALength: stepA,
      vectorBLength: stepB,
      moduleSpan,
      modulesPerDiagonal,
      diagonalCount,
      generatedArea: {
        width: expanded.width,
        height: expanded.height
      }
    };
  }

  function transformPoint(point, place) {
    const p = state.params;
    const scale = place.scale ?? p.moduleScale;
    const sx = point.x * scale;
    const sy = point.y * scale;
    if (!p.rotation) return { x: place.x + sx, y: place.y + sy };
    const angle = p.rotation * Math.PI / 180;
    const cx = place.anchor.x * scale;
    const cy = place.anchor.y * scale;
    const dx = sx - cx;
    const dy = sy - cy;
    return {
      x: place.x + cx + dx * Math.cos(angle) - dy * Math.sin(angle),
      y: place.y + cy + dx * Math.sin(angle) + dy * Math.cos(angle)
    };
  }

  function buildRawPolylines(source, placements, layerName) {
    const result = [];
    placements.flat().forEach((place) => {
      source.elements.forEach((item) => {
        const points = item.points.map((point) => transformPoint(point, place));
        result.push({
          layer: layerName,
          diagonal: place.diagonal,
          index: place.index,
          points
        });
      });
    });
    return result;
  }

  function renderRawImportedSvg(key) {
    const source = state.sources[key] || state.sources.panel || state.sources.level2 || state.sources.level1;
    if (!source) {
      setStatus("No imported SVG available for raw preview");
      return;
    }
    const bounds = source.bounds;
    const margin = 10;
    preview.innerHTML = "";
    setBaseViewBox(bounds.minX - margin, bounds.minY - margin, bounds.width + margin * 2, bounds.height + margin * 2);
    preview.setAttribute("width", `${round(bounds.width + margin * 2)}mm`);
    preview.setAttribute("height", `${round(bounds.height + margin * 2)}mm`);
    const raw = createEl("g", { id: "raw-imported-svg", class: "raw-imported-svg" });
    source.elements.forEach((element) => {
      raw.appendChild(createEl("polyline", {
        points: pointsAttr(element.points),
        fill: "none",
        stroke: element.color === "none" || element.color === "unknown" ? "#111" : element.color,
        "stroke-width": "0.35",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
    });
    preview.appendChild(raw);
    state.generated = preview.cloneNode(true);
    state.debugSvg = preview.cloneNode(true);
    renderImportReportOnly(source);
    setStatus(`Raw import preview: ${source.name}, ${source.elements.length} geometries`);
  }

  function renderImportReportOnly(source) {
    const report = source.importReport;
    if (!report) return;
    statsPanel.innerHTML = importReportHtml(source);
  }

  function translatePolylines(polylines, dx, dy) {
    if (!dx && !dy) return polylines.map((polyline) => ({ ...polyline, points: polyline.points.map((point) => ({ ...point })) }));
    return polylines.map((polyline) => ({
      ...polyline,
      points: polyline.points.map((point) => ({ x: point.x + dx, y: point.y + dy }))
    }));
  }

  function translatePlacements(placements, dx, dy) {
    if (!dx && !dy) return placements;
    return placements.map((band) => band.map((place) => ({
      ...place,
      anchorX: place.anchorX + dx,
      anchorY: place.anchorY + dy,
      x: place.x + dx,
      y: place.y + dy
    })));
  }

  function translateBoundary(boundary, dx, dy, name = boundary.name) {
    if (!dx && !dy) return boundary;
    return boundaryFromPoints(boundary.points.map((point) => ({ x: point.x + dx, y: point.y + dy })), name);
  }

  function patternOffsetDebug(rawBefore, rawAfter) {
    const before = measurePolylines(rawBefore);
    const after = measurePolylines(rawAfter);
    return {
      offsetX: state.params.globalPatternOffsetX,
      offsetY: state.params.globalPatternOffsetY,
      before,
      after
    };
  }

  function measurePolylines(polylines) {
    const pointSets = polylines.map((polyline) => polyline.points);
    return measurePointSets(pointSets, { x: 0, y: 0, width: 0, height: 0 });
  }

  function buildLaserExportPolylines(rawHoles, clipBounds, outerBounds, report) {
    const output = [{
      layer: "holes",
      role: "outer-object-perimeter",
      points: outerBounds.points.map((point) => ({ x: point.x, y: point.y }))
    }];
    const validIds = new Set();
    const validCenters = [];
    const validHoles = [];
    rawHoles.forEach((polyline) => {
      report.laserHolesTotal += 1;
      const bounds = measurePointSets([polyline.points], { x: 0, y: 0, width: 0, height: 0 });
      const center = { x: bounds.centerX, y: bounds.centerY };
      // Keep a hole only if it is COMPLETE (every point inside the cut perimeter) or sticks
      // out by at most `perimeterTolerance` mm — i.e. no point is farther than that outside.
      const perimeterTolerance = state.params.holePerimeterToleranceMm ?? 2;
      const withinPerimeter = polyline.points.every((point) => isInside(point, clipBounds, perimeterTolerance));
      // Exclusion areas (inner contours of the reference, e.g. a circle inside the rectangle):
      // no holes inside them — a hole is excluded if any point is more than the tolerance inside one.
      const inExclusion = state.params.enableExclusionAreas && Array.isArray(clipBounds.exclusions) && clipBounds.exclusions.some((exclusion) =>
        polyline.points.some((point) => isInside(point, exclusion, -perimeterTolerance)));
      if (withinPerimeter && !inExclusion) {
        report.laserHolesAccepted += 1;
        report.debug.laserHolesAccepted.push(center);
        validIds.add(moduleId(polyline));
        const validHole = { ...polyline, center, id: moduleId(polyline) };
        validCenters.push({ ...center, id: validHole.id, diagonal: polyline.diagonal, index: polyline.index });
        validHoles.push(validHole);
        output.push(polyline);
      } else {
        report.laserHolesRemoved += 1;
        report.laserHolesOutsideRemoved += 1;
        report.debug.laserHolesRemoved.push(center);
      }
    });
    return { polylines: output, validIds, validCenters, validHoles };
  }

  function moduleId(item) {
    return `${item.diagonal ?? 0}:${item.index ?? 0}`;
  }

  function buildProceduralLevel0(validHoles, report, coverageMap = null) {
    if (!validHoles.length) return { polylines: [], report, routingPolylines: [], intraDiagonalPolylines: [] };
    const outlineSpacing = Math.max(0.2, state.params.level0HoleStitchLength || 2);
    const travelSpacing = Math.max(0.2, state.params.level0TravelStitchLength || state.params.coveredTravelStitchLengthMm || state.params.coverageMinimumTravelStitchLength || 2);
    if (coverageMap) {
      report.coverageMapCells = coverageMap.width * coverageMap.height;
      report.coverageMapCoveredCells = coverageMap.coveredCount;
      report.coverageMapCoveragePercent = report.coverageMapCells ? report.coverageMapCoveredCells / report.coverageMapCells * 100 : 0;
      report.coverageMinimumDensity = coverageMap.coverageMinimumDensity || 1;
      report.coverageMaxDensity = coverageMap.coverageMaxDensity || 0;
      appendDebugItems(report.debug.coverageMapCells, coverageMap.debugCoveredCells);
      appendDebugItems(report.debug.coverageHeatmap, coverageMap.debugHeatmapCells);
      appendDebugItems(report.debug.coverageMaskImages, coverageMap.debugMaskImages);
      appendDebugItems(report.debug.coverageMaskRuns, coverageMap.debugMaskRuns);
    }
    const grouped = new Map();
    validHoles.forEach((hole) => {
      const key = hole.diagonal ?? 0;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(hole);
    });
    const polylines = [];

    Array.from(grouped.entries()).sort(([a], [b]) => a - b).forEach(([diagonal, holes]) => {
      const orderedHoles = [...holes].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      let points = [];
      const flushPath = () => {
        if (points.length > 1) polylines.push({ layer: "level0", diagonal, procedural: true, points });
        points = [];
      };
      orderedHoles.forEach((hole, holeIndex) => {
        let outline = resampleHoleOutline(hole.points, outlineSpacing);
        const previousPoint = points.length ? last(points) : null;
        const nextHole = orderedHoles[holeIndex + 1] || null;
        outline = rotateHoleOutlineForTravel(outline, previousPoint, nextHole?.center || null, coverageMap);
        if (outline.length < 2) {
          report.level0Warnings += 1;
          return;
        }
        report.level0GeneratedOutlines += 1;
        appendDebugItems(report.debug.level0GeneratedOutlines, [outline]);
        if (points.length) {
          const route = routeLevel0ThroughCoverageMap(last(points), outline[0], coverageMap, travelSpacing, level0EntryDirection(points));
          if (route.breakPath) {
            report.level0CoverageBrokenPaths += 1;
            report.level0CoverageFallbacks += 1;
            appendDebugItems(report.debug.coverageFailures, [outline[0]]);
            flushPath();
          } else {
          const travel = route.points;
          report.level0TravelLength += polylineLength(travel);
          if (route.covered) report.level0CoverageRoutes += 1;
          else report.level0DirectVisibleRoutes += 1;
          report.level0CoveredTravelLength += route.coveredLength || 0;
          report.level0UncoveredTravelLength += route.uncoveredLength || 0;
          report.level0DirectionChanges += route.directionChanges || 0;
          report.level0AverageCoverageDistance = weightedAverage(
            report.level0AverageCoverageDistance,
            report.level0CoverageRoutes + report.level0DirectVisibleRoutes - 1,
            route.averageCoverageDistance || 0,
            1
          );
          report.level0AverageStraightnessScore = weightedAverage(report.level0AverageStraightnessScore, report.level0CoverageRoutes + report.level0DirectVisibleRoutes - 1, route.straightnessScore || 0, 1);
          report.level0AverageSmoothnessScore = weightedAverage(report.level0AverageSmoothnessScore, report.level0CoverageRoutes + report.level0DirectVisibleRoutes - 1, route.smoothnessScore || 0, 1);
          report.level0AverageCenterCoverageScore = weightedAverage(report.level0AverageCenterCoverageScore, report.level0CoverageRoutes + report.level0DirectVisibleRoutes - 1, route.centerCoverageScore || 0, 1);
          report.level0AverageOverallTravelScore = weightedAverage(report.level0AverageOverallTravelScore, report.level0CoverageRoutes + report.level0DirectVisibleRoutes - 1, route.overallScore || 0, 1);
          report.level0MinimumCoverageDistance = minNullable(report.level0MinimumCoverageDistance, route.minimumCoverageDistance);
          if (route.fallback) report.level0CoverageFallbacks += 1;
          report.level0AverageTravelVisibilityScore = weightedAverage(
            report.level0AverageTravelVisibilityScore,
            report.level0CoverageRoutes + report.level0DirectVisibleRoutes - 1,
            route.visibilityScore,
            1
          );
          appendDebugItems(report.debug.level0TravelPaths, [travel]);
          appendDebugItems(route.covered ? report.debug.coverageTravelPaths : report.debug.visibleTravelPaths, [travel]);
          appendDebugItems(report.debug.coverageRawRoutes, route.rawPoints ? [route.rawPoints] : []);
          appendDebugItems(report.debug.coverageOptimizedRoutes, route.optimizedPoints ? [route.optimizedPoints] : []);
          appendDebugItems(report.debug.coverageUncoveredSegments, route.uncoveredSegments || []);
          appendDebugItems(report.debug.coverageLowConfidenceSegments, route.lowConfidenceSegments || []);
          appendDebugItems(report.debug.coverageDirectionChanges, route.directionChangePoints || []);
          appendDebugItems(report.debug.coverageSimplifiedPoints, route.simplifiedPoints || []);
          appendDebugItems(report.debug.coverageResampledPoints, route.points || []);
          appendDebugItems(report.debug.coverageRouteReports, [{
            covered: route.covered,
            visibilityScore: route.visibilityScore,
            coverageScore: route.coverageScore,
            straightnessScore: route.straightnessScore,
            smoothnessScore: route.smoothnessScore,
            centerCoverageScore: route.centerCoverageScore,
            overallScore: route.overallScore,
            coveredLength: route.coveredLength,
            uncoveredLength: route.uncoveredLength,
            averageCoverageDistance: route.averageCoverageDistance,
            minimumCoverageDistance: route.minimumCoverageDistance,
            directionChanges: route.directionChanges,
            minimumAngle: route.minimumAngle,
            maxSegmentLength: route.maxSegmentLength,
            rawPointsCount: route.rawPoints?.length || 0,
            orthogonalPointsCount: route.orthogonalPoints?.length || 0,
            optimizedControlPointsCount: route.optimizedPoints?.length || 0,
            finalStitchPointsCount: route.points?.length || 0,
            nonOrthogonalSegments: route.nonOrthogonalSegments || 0,
            fallback: route.fallback || null,
            length: route.routeLength,
            start: last(points),
            end: outline[0]
          }]);
          appendItems(points, travel.slice(1));
          }
        }
        appendItems(points, outline);
      });
      flushPath();
    });

    report.finalPoints = polylines.reduce((sum, polyline) => sum + polyline.points.length, 0);
    report.pathsBeforeCleanup = validHoles.length;
    report.pathsAfterCleanup = polylines.length;
    report.level0BrokenPaths = polylines.length;
    report.level0AverageStitchLength = averagePolylineSegmentLength(polylines);
    return { polylines, report, routingPolylines: [], intraDiagonalPolylines: [] };
  }

  function buildCoveredTravelTest(coverageMap, report) {
    const spacing = Math.max(0.2, state.params.level0TravelStitchLength || state.params.coveredTravelStitchLengthMm || 2);
    const start = { x: state.params.travelTestAX || 0, y: state.params.travelTestAY || 0 };
    const end = { x: state.params.travelTestBX || 0, y: state.params.travelTestBY || 0 };
    const route = routeLevel0ThroughCoverageMap(start, end, coverageMap, spacing);
    if (route.breakPath) {
      report.level0CoverageBrokenPaths += 1;
      report.level0CoverageFallbacks += 1;
      appendDebugItems(report.debug.coverageFailures, [start, end]);
      return { polylines: [], report, routingPolylines: [], intraDiagonalPolylines: [] };
    }
    report.level0TravelLength = route.routeLength || polylineLength(route.points);
    report.level0CoverageRoutes = route.covered ? 1 : 0;
    report.level0DirectVisibleRoutes = route.covered ? 0 : 1;
    report.level0CoveredTravelLength = route.coveredLength || 0;
    report.level0UncoveredTravelLength = route.uncoveredLength || 0;
    report.level0AverageCoverageDistance = route.averageCoverageDistance || 0;
    report.level0MinimumCoverageDistance = route.minimumCoverageDistance;
    report.level0AverageTravelVisibilityScore = route.visibilityScore || 0;
    report.level0AverageStraightnessScore = route.straightnessScore || 0;
    report.level0AverageSmoothnessScore = route.smoothnessScore || 0;
    report.level0AverageCenterCoverageScore = route.centerCoverageScore || 0;
    report.level0AverageOverallTravelScore = route.overallScore || 0;
    report.level0DirectionChanges = route.directionChanges || 0;
    appendDebugItems(report.debug.coverageRawRoutes, route.rawPoints ? [route.rawPoints] : []);
    appendDebugItems(report.debug.coverageOptimizedRoutes, route.optimizedPoints ? [route.optimizedPoints] : []);
    appendDebugItems(report.debug.coverageTravelPaths, route.covered ? [route.points] : []);
    appendDebugItems(report.debug.visibleTravelPaths, route.covered ? [] : [route.points]);
    appendDebugItems(report.debug.coverageUncoveredSegments, route.uncoveredSegments || []);
    appendDebugItems(report.debug.coverageLowConfidenceSegments, route.lowConfidenceSegments || []);
    appendDebugItems(report.debug.coverageDirectionChanges, route.directionChangePoints || []);
    appendDebugItems(report.debug.coverageRouteReports, [{
      travelId: "test",
      covered: route.covered,
      fallback: route.fallback || null,
      visibilityScore: route.visibilityScore,
      coverageScore: route.coverageScore,
      straightnessScore: route.straightnessScore,
      smoothnessScore: route.smoothnessScore,
      centerCoverageScore: route.centerCoverageScore,
      overallScore: route.overallScore,
      coveredLength: route.coveredLength,
      uncoveredLength: route.uncoveredLength,
      averageCoverageDistance: route.averageCoverageDistance,
      minimumCoverageDistance: route.minimumCoverageDistance,
      directionChanges: route.directionChanges,
      minimumAngle: route.minimumAngle,
      maxSegmentLength: route.maxSegmentLength,
      length: route.routeLength
    }]);
    return { polylines: [{ layer: "level0", diagonal: 0, procedural: true, travelTest: true, points: route.points }], report, routingPolylines: [], intraDiagonalPolylines: [] };
  }

  function resampleHoleOutline(points, spacing) {
    if (!points || points.length < 2) return [];
    const closed = points.map((point) => ({ x: point.x, y: point.y }));
    if (!samePoint(closed[0], last(closed))) closed.push({ ...closed[0] });
    return resamplePolylineByArcLength(closed, spacing, true);
  }

  function rotateHoleOutlineForTravel(outline, previousPoint, nextPoint, coverageMap) {
    const open = outline?.length && samePoint(outline[0], last(outline)) ? outline.slice(0, -1) : (outline || []);
    if (open.length < 3) return outline || [];
    const candidateCount = Math.max(4, Math.round(state.params.holeEntryCandidateCount || 16));
    const step = Math.max(1, Math.floor(open.length / candidateCount));
    let best = null;
    for (let index = 0; index < open.length; index += step) {
      const point = open[index];
      let score = 0;
      if (previousPoint) score += distance(point, previousPoint);
      if (nextPoint) score += distance(point, nextPoint) * 0.65;
      if (coverageMap) {
        const sample = coverageSampleAtPoint(point, coverageMap);
        score -= (sample.distance || 0) * 2;
        if (!sample.covered) score += 20;
      }
      if (!best || score < best.score) best = { index, score };
    }
    const start = best?.index || 0;
    const rotated = [...open.slice(start), ...open.slice(0, start)];
    rotated.push({ ...rotated[0] });
    return rotated;
  }

  function buildCoverageMap({ level1 = [], level2 = [], satinBounds = null, cordBounds = null, holes = [] }) {
    const sourceMode = state.params.coverageSource || "level2";
    const useLevel1 = sourceMode === "future_layers";
    const useSatin = sourceMode === "future_layers";
    const useCord = sourceMode === "future_layers";
    const pointSets = [
      ...(useLevel1 ? level1.map((item) => item.points) : []),
      ...level2.map((item) => item.points),
      ...(useSatin && satinBounds?.points ? [satinBounds.points] : []),
      ...(useCord && cordBounds?.points ? [cordBounds.points] : []),
      ...holes.map((item) => item.points)
    ].filter((points) => points?.length);
    if (!pointSets.length) return null;
    const requestedResolution = Math.max(0.05, state.params.coverageResolutionMm || 0.5);
    const edgeCompensation = state.params.coverageDilationMm || 0;
    const gapClosing = Math.max(0, state.params.coverageGapClosingMm || 0);
    const coverageRadius = requestedResolution / 2;
    const margin = coverageRadius + Math.abs(edgeCompensation) + gapClosing + Math.max(4, state.params.coverageMinimumTravelStitchLength || 2);
    const bounds = measurePointSets(pointSets, { x: 0, y: 0, width: 10, height: 10 });
    let resolution = requestedResolution;
    let width = Math.max(2, Math.ceil((bounds.width + margin * 2) / resolution));
    let height = Math.max(2, Math.ceil((bounds.height + margin * 2) / resolution));
    const maxCells = 8000000;
    if (width * height > maxCells) {
      resolution = Math.sqrt(((bounds.width + margin * 2) * (bounds.height + margin * 2)) / maxCells);
      width = Math.max(2, Math.ceil((bounds.width + margin * 2) / resolution));
      height = Math.max(2, Math.ceil((bounds.height + margin * 2) / resolution));
    }
    const map = {
      x: bounds.minX - margin,
      y: bounds.minY - margin,
      width,
      height,
      resolution,
      covered: new Uint8Array(width * height),
      density: new Uint16Array(width * height),
      distance: new Float32Array(width * height),
      requestedResolution,
      coverageRadius,
      edgeCompensation,
      gapClosing,
      coverageMinimumDensity: Math.max(1, Math.round(state.params.coverageMinimumDensity || 1)),
      coverageMaxDensity: 0,
      debugCoveredCells: [],
      debugHeatmapCells: [],
      debugMaskImages: [],
      debugMaskRuns: []
    };
    [...(useLevel1 ? level1 : []), ...level2].forEach((polyline) => rasterizeCoveragePolyline(map, polyline.points, coverageRadius));
    if (useSatin && satinBounds?.points) rasterizeCoveragePolyline(map, satinBounds.points, Math.max(coverageRadius, state.params.satinWidth || 4));
    if (useCord && cordBounds?.points) rasterizeCoveragePolyline(map, cordBounds.points, Math.max(coverageRadius, state.params.cordWidth || 2));
    applyCoverageDensityThreshold(map);
    if (gapClosing >= resolution) {
      map.covered = morphCoverage(map, gapClosing, "dilate");
      map.covered = morphCoverage(map, gapClosing, "erode");
    }
    if (edgeCompensation >= resolution) map.covered = morphCoverage(map, edgeCompensation, "dilate");
    if (edgeCompensation <= -resolution) map.covered = morphCoverage(map, Math.abs(edgeCompensation), "erode");
    if (state.params.coverageErosionMm > 0) map.covered = morphCoverage(map, state.params.coverageErosionMm, "erode");
    if (state.params.minimumCoverageWidthMm > 0 && state.params.coverageSource === "future_layers") {
      map.covered = morphCoverage(map, state.params.minimumCoverageWidthMm / 2, "erode");
      map.covered = morphCoverage(map, state.params.minimumCoverageWidthMm / 2, "dilate");
    }
    computeCoverageDistanceTransform(map);
    map.coveredCount = 0;
    const sampleStep = Math.max(1, Math.ceil(Math.sqrt((width * height) / 2500)));
    for (let y = 0; y < height; y += 1) {
      let runStart = null;
      for (let x = 0; x < width; x += 1) {
        const idx = y * width + x;
        if (map.covered[idx]) {
          if (runStart == null) runStart = x;
          map.coveredCount += 1;
          if (x % sampleStep === 0 && y % sampleStep === 0) {
            const point = cellToWorld(map, x, y);
            map.debugCoveredCells.push(point);
            if (map.distance[idx] > map.resolution * 2) map.debugHeatmapCells.push(point);
          }
        } else if (runStart != null) {
          map.debugMaskRuns.push(maskRunToRect(map, runStart, x - 1, y));
          runStart = null;
        }
      }
      if (runStart != null) map.debugMaskRuns.push(maskRunToRect(map, runStart, width - 1, y));
    }
    map.debugMaskImages = [coverageMapToImage(map)];
    return map;
  }

  function coverageMapToImage(map) {
    const maxPixels = Math.max(100000, state.params.coveragePreviewMaxPixels || 1200000);
    const scale = Math.min(1, Math.sqrt(maxPixels / Math.max(1, map.width * map.height)));
    const canvasWidth = Math.max(1, Math.round(map.width * scale));
    const canvasHeight = Math.max(1, Math.round(map.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d", { alpha: true });
    const image = ctx.createImageData(canvasWidth, canvasHeight);
    for (let y = 0; y < canvasHeight; y += 1) {
      const sourceY = Math.min(map.height - 1, Math.floor(y / scale));
      for (let x = 0; x < canvasWidth; x += 1) {
        const sourceX = Math.min(map.width - 1, Math.floor(x / scale));
        const covered = map.covered[sourceY * map.width + sourceX];
        const idx = (y * canvasWidth + x) * 4;
        if (covered) {
          image.data[idx] = 0;
          image.data[idx + 1] = 0;
          image.data[idx + 2] = 0;
          image.data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(image, 0, 0);
    return {
      href: canvas.toDataURL("image/png"),
      x: map.x,
      y: map.y,
      width: map.width * map.resolution,
      height: map.height * map.resolution,
      pixelWidth: canvasWidth,
      pixelHeight: canvasHeight
    };
  }

  function maskRunToRect(map, x1, x2, y) {
    return {
      x: map.x + (x1 - 0.5) * map.resolution,
      y: map.y + (y - 0.5) * map.resolution,
      width: (x2 - x1 + 1) * map.resolution,
      height: map.resolution
    };
  }

  function rasterizeCoveragePolyline(map, points, radiusMm) {
    if (!points || points.length < 2) return;
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const minCell = worldToCell(map, { x: Math.min(a.x, b.x) - radiusMm, y: Math.min(a.y, b.y) - radiusMm });
      const maxCell = worldToCell(map, { x: Math.max(a.x, b.x) + radiusMm, y: Math.max(a.y, b.y) + radiusMm });
      for (let cy = clamp(minCell.y, 0, map.height - 1); cy <= clamp(maxCell.y, 0, map.height - 1); cy += 1) {
        for (let cx = clamp(minCell.x, 0, map.width - 1); cx <= clamp(maxCell.x, 0, map.width - 1); cx += 1) {
          if (distanceToSegment(cellToWorld(map, cx, cy), a, b) <= radiusMm) {
            const cellIndex = cy * map.width + cx;
            map.density[cellIndex] = Math.min(65535, map.density[cellIndex] + 1);
          }
        }
      }
    }
  }

  function applyCoverageDensityThreshold(map) {
    const minimumDensity = Math.max(1, Math.round(map.coverageMinimumDensity || 1));
    map.covered.fill(0);
    map.coverageMaxDensity = 0;
    for (let index = 0; index < map.density.length; index += 1) {
      const density = map.density[index];
      if (density > map.coverageMaxDensity) map.coverageMaxDensity = density;
      if (density >= minimumDensity) map.covered[index] = 1;
    }
  }

  function morphCoverage(map, radiusMm, mode) {
    if (radiusMm <= 0) return map.covered;
    const output = new Uint8Array(map.width * map.height);
    const distanceMap = mode === "dilate"
      ? coverageDistanceToState(map, 1)
      : coverageDistanceToState(map, 0);
    for (let index = 0; index < map.covered.length; index += 1) {
      if (mode === "dilate") output[index] = map.covered[index] || distanceMap[index] <= radiusMm ? 1 : 0;
      else output[index] = map.covered[index] && distanceMap[index] > radiusMm ? 1 : 0;
    }
    return output;
  }

  function coverageDistanceToState(map, targetValue) {
    const distanceMap = new Float32Array(map.width * map.height);
    const inf = 1e9;
    for (let index = 0; index < map.covered.length; index += 1) {
      distanceMap[index] = map.covered[index] === targetValue ? 0 : inf;
    }
    const diag = Math.SQRT2 * map.resolution;
    const straight = map.resolution;
    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        const idx = y * map.width + x;
        let value = distanceMap[idx];
        if (x > 0) value = Math.min(value, distanceMap[idx - 1] + straight);
        if (y > 0) value = Math.min(value, distanceMap[idx - map.width] + straight);
        if (x > 0 && y > 0) value = Math.min(value, distanceMap[idx - map.width - 1] + diag);
        if (x < map.width - 1 && y > 0) value = Math.min(value, distanceMap[idx - map.width + 1] + diag);
        distanceMap[idx] = value;
      }
    }
    for (let y = map.height - 1; y >= 0; y -= 1) {
      for (let x = map.width - 1; x >= 0; x -= 1) {
        const idx = y * map.width + x;
        let value = distanceMap[idx];
        if (x < map.width - 1) value = Math.min(value, distanceMap[idx + 1] + straight);
        if (y < map.height - 1) value = Math.min(value, distanceMap[idx + map.width] + straight);
        if (x < map.width - 1 && y < map.height - 1) value = Math.min(value, distanceMap[idx + map.width + 1] + diag);
        if (x > 0 && y < map.height - 1) value = Math.min(value, distanceMap[idx + map.width - 1] + diag);
        distanceMap[idx] = value;
      }
    }
    return distanceMap;
  }

  function computeCoverageDistanceTransform(map) {
    const inf = 1e9;
    for (let index = 0; index < map.covered.length; index += 1) map.distance[index] = map.covered[index] ? inf : 0;
    const diag = Math.SQRT2 * map.resolution;
    const straight = map.resolution;
    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        const idx = y * map.width + x;
        if (!map.covered[idx]) continue;
        let value = map.distance[idx];
        if (x > 0) value = Math.min(value, map.distance[idx - 1] + straight);
        if (y > 0) value = Math.min(value, map.distance[idx - map.width] + straight);
        if (x > 0 && y > 0) value = Math.min(value, map.distance[idx - map.width - 1] + diag);
        if (x < map.width - 1 && y > 0) value = Math.min(value, map.distance[idx - map.width + 1] + diag);
        map.distance[idx] = value;
      }
    }
    for (let y = map.height - 1; y >= 0; y -= 1) {
      for (let x = map.width - 1; x >= 0; x -= 1) {
        const idx = y * map.width + x;
        if (!map.covered[idx]) continue;
        let value = map.distance[idx];
        if (x < map.width - 1) value = Math.min(value, map.distance[idx + 1] + straight);
        if (y < map.height - 1) value = Math.min(value, map.distance[idx + map.width] + straight);
        if (x < map.width - 1 && y < map.height - 1) value = Math.min(value, map.distance[idx + map.width + 1] + diag);
        if (x > 0 && y < map.height - 1) value = Math.min(value, map.distance[idx + map.width - 1] + diag);
        map.distance[idx] = value;
      }
    }
  }

  function level0EntryDirection(points) {
    if (!points || points.length < 2) return null;
    const from = points[points.length - 2];
    const to = points[points.length - 1];
    if (!from || !to || distance(from, to) < 0.001) return null;
    return vectorToCoverageDirectionIndex(to.x - from.x, to.y - from.y);
  }

  function vectorToCoverageDirectionIndex(dx, dy) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    let best = null;
    const length = Math.hypot(dx, dy) || 1;
    dirs.forEach(([dirX, dirY], index) => {
      const score = (dx * dirX + dy * dirY) / (length * Math.hypot(dirX, dirY));
      if (!best || score > best.score) best = { index, score };
    });
    return best?.index ?? null;
  }

  function routeLevel0ThroughCoverageMap(from, to, map, spacing, entryDirection = null) {
    const fallback = state.params.level0CoverageFallback || "break_path";
    if (!map) return fallbackCoverageRoute(from, to, spacing, "no_coverage_map");
    const start = nearestCoveredCell(map, worldToCell(map, from), Math.ceil(14 / map.resolution));
    const end = nearestCoveredCell(map, worldToCell(map, to), Math.ceil(14 / map.resolution));
    if (!start || !end) return fallbackCoverageRoute(from, to, spacing, "endpoint_outside_coverage", map);
    const startWorld = cellToWorld(map, start.x, start.y);
    const endWorld = cellToWorld(map, end.x, end.y);
    const directOrthogonal = bestCoveredOrthogonalRoute(startWorld, endWorld, map);
    if (directOrthogonal) return coveredRouteResult(from, to, directOrthogonal, directOrthogonal, map, spacing);
    let cells = astarCoverageRoute(map, start, end, from, to, entryDirection);
    if (!cells.length && !state.params.allowDiagonalTravel) cells = astarCoverageRoute(map, start, end, from, to, entryDirection, true);
    if (!cells.length) return fallbackCoverageRoute(from, to, spacing, "no_covered_path", map);
    const centralRaw = cells.map((cell) => cellToWorld(map, cell.x, cell.y));
    return coveredRouteResult(from, to, centralRaw, centralRaw, map, spacing);
  }

  function coveredRouteResult(from, to, rawCentralPoints, debugRawPoints, map, spacing) {
    const optimized = optimizeCoveredTravelPath(removeConsecutiveDuplicates(rawCentralPoints), map, spacing);
    const stats = coverageRouteStats(optimized.points, map);
    const validated = validateCoveredTravelStats(stats);
    if (!validated.valid) return fallbackCoverageRoute(from, to, spacing, validated.reason, map);
    const finalPoints = stitchRouteWithCoveredConnectors(from, to, optimized.points, map, spacing);
    if (!finalPoints.length) return fallbackCoverageRoute(from, to, spacing, "endpoint_connector_outside_coverage", map);
    return {
      points: finalPoints,
      rawPoints: [{ ...from }, ...debugRawPoints, { ...to }],
      orthogonalPoints: optimized.orthogonalPoints,
      optimizedPoints: optimized.optimizedPoints,
      simplifiedPoints: optimized.simplifiedPoints,
      covered: stats.coveredPercent >= 99,
      fallback: null,
      ...stats
    };
  }

  function stitchRouteWithCoveredConnectors(from, to, centralPoints, map, spacing) {
    const points = removeConsecutiveDuplicates(centralPoints || []);
    if (!points.length) return [];
    if (!endpointConnectorCovered(from, points[0], map, "start")) return [];
    if (!endpointConnectorCovered(last(points), to, map, "end")) return [];
    const route = removeConsecutiveDuplicates([{ ...from }, ...points, { ...to }]);
    return resampleTravelPath(route, spacing);
  }

  function endpointConnectorCovered(a, b, map, side) {
    const length = distance(a, b);
    if (length < 0.0001) return true;
    const sampleCount = Math.max(2, Math.ceil(length / Math.max(0.1, map.resolution * 0.5)));
    const edgeAllowance = Math.min(1.2, length * 0.35);
    for (let sampleIndex = 0; sampleIndex <= sampleCount; sampleIndex += 1) {
      const t = sampleIndex / sampleCount;
      const distFromStart = t * length;
      const distFromEnd = (1 - t) * length;
      if (side === "start" && distFromStart <= edgeAllowance) continue;
      if (side === "end" && distFromEnd <= edgeAllowance) continue;
      if (!coverageSampleAtPoint(interpolate(a, b, t), map).covered) return false;
    }
    return true;
  }

  function bestCoveredOrthogonalRoute(start, end, map) {
    const orthogonalCandidates = [
      [{ ...start }, { x: end.x, y: start.y }, { ...end }],
      [{ ...start }, { x: start.x, y: end.y }, { ...end }]
    ];
    const diagonalCandidate = [{ ...start }, { ...end }];
    const candidates = [...orthogonalCandidates, diagonalCandidate]
      .map((points) => removeConsecutiveDuplicates(points))
      .filter((points) => polylineCoveredEnough(points, map, 99));
    if (!candidates.length) return null;
    return candidates.sort((a, b) => {
      const aStats = coverageRouteStats(a, map);
      const bStats = coverageRouteStats(b, map);
      return (aStats.nonOrthogonalSegments - bStats.nonOrthogonalSegments) ||
        (bStats.averageCoverageDistance - aStats.averageCoverageDistance) ||
        (polylineLength(a) - polylineLength(b));
    })[0];
  }

  function validateCoveredTravelStats(stats) {
    const fallback = state.params.level0CoverageFallback || "break_path";
    if (stats.coveredPercent >= 99) return { valid: true };
    if (fallback === "direct_warning_only") return { valid: true };
    if (fallback === "allow_short_uncovered_bridge") {
      const maxBridge = Math.max(5, Math.abs(state.params.coverageDilationMm || 0) * 2, (state.params.coverageMinimumTravelStitchLength || 2) * 2);
      if ((stats.uncoveredLength || 0) <= maxBridge) return { valid: true };
    }
    return { valid: false, reason: `coverage_below_threshold:${round(stats.coveredPercent)}%` };
  }

  function fallbackCoverageRoute(from, to, spacing, reason, map = null) {
    return { points: [], breakPath: true, covered: false, fallback: reason, visibilityScore: 100000, routeLength: 0 };
  }

  function bestFallbackOrthogonalRoute(from, to, map) {
    const candidates = [
      [{ ...from }, { x: to.x, y: from.y }, { ...to }],
      [{ ...from }, { x: from.x, y: to.y }, { ...to }]
    ].map(removeConsecutiveDuplicates);
    if (!map) return candidates[0];
    return candidates.sort((a, b) => {
      const aStats = coverageRouteStats(a, map);
      const bStats = coverageRouteStats(b, map);
      return (aStats.uncoveredLength - bStats.uncoveredLength) ||
        (bStats.averageCoverageDistance - aStats.averageCoverageDistance) ||
        (polylineLength(a) - polylineLength(b));
    })[0];
  }

  function relaxedOrthogonalFallbackRoute(from, to, map) {
    const start = worldToCell(map, from);
    const end = worldToCell(map, to);
    if (start.x < 0 || start.y < 0 || start.x >= map.width || start.y >= map.height) return null;
    if (end.x < 0 || end.y < 0 || end.x >= map.width || end.y >= map.height) return null;
    const cells = relaxedAstarCoverageRoute(map, start, end);
    if (!cells.length) return null;
    const raw = cells.map((cell) => cellToWorld(map, cell.x, cell.y));
    const cleaned = cleanRelaxedFallbackPoints(removeConsecutiveDuplicates([{ ...from }, ...raw, { ...to }]), map);
    return cleaned.length > 1 ? cleaned : null;
  }

  function relaxedAstarCoverageRoute(map, start, end) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const directionCount = dirs.length + 1;
    const cellCount = map.width * map.height;
    const best = new Float32Array(cellCount * directionCount);
    best.fill(Infinity);
    const previous = new Int32Array(cellCount * directionCount);
    previous.fill(-1);
    const open = new BinaryHeap((a, b) => a.f - b.f);
    const startCellIdx = start.y * map.width + start.x;
    const endCellIdx = end.y * map.width + end.x;
    const startStateIdx = startCellIdx * directionCount + dirs.length;
    const searchBounds = astarSearchBounds(map, start, end);
    best[startStateIdx] = 0;
    open.push({ stateIdx: startStateIdx, cellIdx: startCellIdx, x: start.x, y: start.y, dir: dirs.length, g: 0, f: 0 });
    const maxExpansions = Math.min(26000, Math.max(3500, searchBounds.area * directionCount));
    let expansions = 0;
    let reachedState = -1;
    while (open.length && expansions < maxExpansions) {
      const current = open.pop();
      if (current.cellIdx === endCellIdx) {
        reachedState = current.stateIdx;
        break;
      }
      if (current.g > best[current.stateIdx]) continue;
      expansions += 1;
      dirs.forEach(([dx, dy], dirIndex) => {
        const nx = current.x + dx;
        const ny = current.y + dy;
        if (nx < searchBounds.minX || nx > searchBounds.maxX || ny < searchBounds.minY || ny > searchBounds.maxY) return;
        const nextIdx = ny * map.width + nx;
        const nextStateIdx = nextIdx * directionCount + dirIndex;
        const step = relaxedCoverageStepCost(map, current, { idx: nextIdx, dir: dirIndex }, dirs);
        const nextScore = best[current.stateIdx] + step;
        if (nextScore >= best[nextStateIdx]) return;
        best[nextStateIdx] = nextScore;
        previous[nextStateIdx] = current.stateIdx;
        open.push({
          stateIdx: nextStateIdx,
          cellIdx: nextIdx,
          x: nx,
          y: ny,
          dir: dirIndex,
          g: nextScore,
          f: nextScore + heuristicCell(nx, ny, end.x, end.y) * 4
        });
      });
    }
    return reachedState >= 0 ? reconstructCellPath(previous, reachedState, map.width, directionCount) : [];
  }

  function relaxedCoverageStepCost(map, current, next, dirs) {
    const covered = map.covered[next.idx];
    const safeDistance = covered ? Math.max(map.resolution * 0.1, map.distance[next.idx]) : 0;
    let turnPenalty = 0;
    if (current.dir >= 0 && current.dir < dirs.length) {
      const [pdx, pdy] = dirs[current.dir];
      const [dx, dy] = dirs[next.dir];
      const dot = clamp((pdx * dx + pdy * dy) / (Math.hypot(pdx, pdy) * Math.hypot(dx, dy)), -1, 1);
      turnPenalty = Math.acos(dot) / Math.PI;
    }
    return map.resolution * 4 +
      (covered ? 0 : 800) +
      (covered ? 12 / safeDistance : 0) +
      turnPenalty * 35;
  }

  function cleanRelaxedFallbackPoints(points, map) {
    let current = removeConsecutiveDuplicates(points || []);
    current = mergeCollinearTravelPoints(current, map);
    return current;
  }

  function fallbackVisibleRoute(points, reason, map = null) {
    if (map) {
      const stats = coverageRouteStats(points, map);
      return {
        points,
        covered: false,
        fallback: reason,
        ...stats,
        visibilityScore: stats.visibilityScore + 100000
      };
    }
    const length = polylineLength(points);
    return {
      points,
      covered: false,
      fallback: reason,
      visibilityScore: length * 100000,
      routeLength: length,
      coveredLength: 0,
      uncoveredLength: length,
      averageCoverageDistance: 0,
      minimumCoverageDistance: 0,
      coverageScore: 0,
      straightnessScore: 0,
      smoothnessScore: 0,
      centerCoverageScore: 0,
      overallScore: 0,
      directionChanges: 0,
      minimumAngle: null,
      maxSegmentLength: length
    };
  }

  function nearestCoveredCell(map, cell, radiusCells) {
    let best = null;
    const targetSafeWidth = Math.max(map.resolution, state.params.minimumCoverageWidthMm || 1);
    for (let radius = 0; radius <= radiusCells; radius += 1) {
      for (let y = cell.y - radius; y <= cell.y + radius; y += 1) {
        for (let x = cell.x - radius; x <= cell.x + radius; x += 1) {
          if (x < 0 || y < 0 || x >= map.width || y >= map.height) continue;
          const idx = y * map.width + x;
          if (!map.covered[idx]) continue;
          const d = Math.hypot(x - cell.x, y - cell.y) * map.resolution;
          const safeDistance = map.distance[idx] || 0;
          const edgePenalty = Math.max(0, targetSafeWidth - safeDistance) * 4;
          const centerBonus = safeDistance * 0.75;
          const score = d + edgePenalty - centerBonus;
          if (!best || score < best.score) best = { x, y, d, score };
        }
      }
      if (best && radius * map.resolution >= Math.max(targetSafeWidth, map.resolution * 2)) return best;
    }
    return best;
  }

  function astarCoverageRoute(map, start, end, worldStart = null, worldEnd = null, entryDirection = null, forceDiagonal = false) {
    const open = new BinaryHeap((a, b) => a.f - b.f);
    const allowDiagonal = forceDiagonal || Boolean(state.params.allowDiagonalTravel);
    const dirs = allowDiagonal
      ? [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
      : [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const directionCount = dirs.length + 1;
    const cellCount = map.width * map.height;
    const size = cellCount * directionCount;
    const best = new Float32Array(size);
    best.fill(Infinity);
    const previous = new Int32Array(size);
    previous.fill(-1);
    const startDir = Number.isInteger(entryDirection) && entryDirection >= 0 && entryDirection < dirs.length ? entryDirection : dirs.length;
    const startCellIdx = start.y * map.width + start.x;
    const endCellIdx = end.y * map.width + end.x;
    const startStateIdx = startCellIdx * directionCount + startDir;
    best[startStateIdx] = 0;
    open.push({ stateIdx: startStateIdx, cellIdx: startCellIdx, x: start.x, y: start.y, dir: startDir, f: 0, g: 0 });
    const searchBounds = astarSearchBounds(map, start, end);
    let expansions = 0;
    const maxExpansions = Math.min(22000, Math.max(2500, searchBounds.area * directionCount));
    let reachedState = -1;
    while (open.length && expansions < maxExpansions) {
      const current = open.pop();
      if (current.cellIdx === endCellIdx) {
        reachedState = current.stateIdx;
        break;
      }
      if (current.g > best[current.stateIdx]) continue;
      expansions += 1;
      dirs.forEach(([dx, dy], dirIndex) => {
        const nx = current.x + dx;
        const ny = current.y + dy;
        if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) return;
        if (nx < searchBounds.minX || nx > searchBounds.maxX || ny < searchBounds.minY || ny > searchBounds.maxY) return;
        const nextIdx = ny * map.width + nx;
        if (!map.covered[nextIdx]) return;
        const nextStateIdx = nextIdx * directionCount + dirIndex;
        const step = coverageStepCost(map, current, { x: nx, y: ny, idx: nextIdx, dir: dirIndex }, dirs, worldStart, worldEnd);
        const nextScore = best[current.stateIdx] + step;
        if (nextScore >= best[nextStateIdx]) return;
        best[nextStateIdx] = nextScore;
        previous[nextStateIdx] = current.stateIdx;
        open.push({
          stateIdx: nextStateIdx,
          cellIdx: nextIdx,
          x: nx,
          y: ny,
          dir: dirIndex,
          g: nextScore,
          f: nextScore + heuristicCell(nx, ny, end.x, end.y) * (state.params.lengthWeight || 5)
        });
      });
    }
    if (reachedState >= 0) return reconstructCellPath(previous, reachedState, map.width, directionCount);
    return [];
  }

  function astarSearchBounds(map, start, end) {
    const routeDistanceMm = Math.hypot(start.x - end.x, start.y - end.y) * map.resolution;
    const marginMm = clamp(routeDistanceMm * 0.6 + 12, 14, 55);
    const margin = Math.ceil(marginMm / map.resolution);
    const minX = clamp(Math.min(start.x, end.x) - margin, 0, map.width - 1);
    const maxX = clamp(Math.max(start.x, end.x) + margin, 0, map.width - 1);
    const minY = clamp(Math.min(start.y, end.y) - margin, 0, map.height - 1);
    const maxY = clamp(Math.max(start.y, end.y) + margin, 0, map.height - 1);
    return {
      minX,
      maxX,
      minY,
      maxY,
      area: Math.max(1, (maxX - minX + 1) * (maxY - minY + 1))
    };
  }

  function coverageStepCost(map, current, next, dirs) {
    const lengthWeight = state.params.lengthWeight || 5;
    const visibilityWeight = state.params.visibilityWeight || 100;
    const centerWeight = state.params.centerWeight || 20;
    const turnWeight = state.params.turnWeight || 15;
    const curvatureWeight = state.params.curvatureWeight || 10;
    const pointCountWeight = state.params.pointCountWeight || 3;
    const headingWeight = state.params.headingPersistenceWeight || 10;
    const orthogonalityWeight = state.params.pathOrthogonalityWeight || 30;
    const [dx, dy] = dirs[next.dir];
    const stepLength = (dx && dy ? Math.SQRT2 : 1) * map.resolution;
    const safeDistance = Math.max(map.resolution * 0.1, map.distance[next.idx]);
    const targetSafeWidth = Math.max(map.resolution, state.params.minimumCoverageWidthMm || 1);
    const visibilityPenalty = safeDistance >= targetSafeWidth ? 0 : 1 - safeDistance / targetSafeWidth;
    const centerPenalty = 1 / (safeDistance * safeDistance);
    let turnPenalty = 0;
    if (current.dir >= 0 && current.dir < dirs.length) {
      const [pdx, pdy] = dirs[current.dir];
      const dot = clamp((pdx * dx + pdy * dy) / (Math.hypot(pdx, pdy) * Math.hypot(dx, dy)), -1, 1);
      const angle = Math.acos(dot);
      turnPenalty = angle / Math.PI;
    }
    return lengthWeight * stepLength +
      visibilityWeight * visibilityPenalty +
      centerWeight * centerPenalty * map.resolution +
      turnWeight * turnPenalty +
      curvatureWeight * turnPenalty * turnPenalty +
      headingWeight * turnPenalty +
      orthogonalityWeight * (dx && dy ? 1 : 0) +
      pointCountWeight;
  }

  function reconstructCellPath(previous, idx, width, directionCount = 1) {
    const cells = [];
    let current = idx;
    while (current >= 0) {
      const cellIdx = directionCount > 1 ? Math.floor(current / directionCount) : current;
      cells.push({ x: cellIdx % width, y: Math.floor(cellIdx / width) });
      current = previous[current];
    }
    return cells.reverse();
  }

  function optimizeCoveredTravelPath(rawPoints, map, spacing) {
    const tolerance = Math.max(0, state.params.travelSimplificationToleranceMm || 0.8);
    const orthogonal = orthogonalSimplifyCoverageSafe(rawPoints, map);
    const simplified = simplifyCoverageSafe(orthogonal, map, tolerance);
    let optimized = simplified;
    if (state.params.travelSmoothingEnabled && state.params.allowDiagonalTravel) {
      optimized = smoothCoverageSafe(
        optimized,
        map,
        clamp(state.params.travelSmoothingStrength || 0.25, 0, 0.9),
        Math.max(0, Math.round(state.params.travelSmoothingIterations || 2))
      );
    }
    optimized = cleanTravelControlPoints(optimized, map);
    const resampled = resampleTravelPath(removeConsecutiveDuplicates(optimized), spacing);
    return { points: resampled, optimizedPoints: optimized, simplifiedPoints: simplified, orthogonalPoints: orthogonal };
  }

  function orthogonalSimplifyCoverageSafe(points, map) {
    if (!points || points.length <= 2) return points || [];
    const result = [points[0]];
    let segmentStart = points[0];
    let currentAxis = null;
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const point = points[index];
      const dx = Math.abs(point.x - previous.x);
      const dy = Math.abs(point.y - previous.y);
      const axis = dx >= dy ? "h" : "v";
      if (!currentAxis) currentAxis = axis;
      if (axis !== currentAxis) {
        result.push({ ...previous });
        segmentStart = previous;
        currentAxis = axis;
      } else if (!segmentCoverageStats(segmentStart, point, map).covered) {
        result.push({ ...previous });
        segmentStart = previous;
      }
    }
    result.push(last(points));
    const cleaned = cleanTravelControlPoints(removeConsecutiveDuplicates(result), map);
    return polylineCoveredEnough(cleaned, map, 99) ? cleaned : points;
  }

  function cleanTravelControlPoints(points, map) {
    let current = removeConsecutiveDuplicates(points || []);
    if (state.params.mergeCollinearSegments !== false) current = mergeCollinearTravelPoints(current, map);
    if (state.params.removeRedundantTurns !== false) current = removeShortRedundantTurns(current, map);
    return current;
  }

  function mergeCollinearTravelPoints(points, map) {
    if (points.length <= 2) return points;
    const result = [points[0]];
    for (let index = 1; index < points.length - 1; index += 1) {
      const a = last(result);
      const b = points[index];
      const c = points[index + 1];
      if (nearlyCollinear(a, b, c) && segmentCoverageStats(a, c, map).covered) continue;
      result.push(b);
    }
    result.push(last(points));
    return result;
  }

  function removeShortRedundantTurns(points, map) {
    if (points.length <= 3) return points;
    const minTurnDistance = Math.max(0, state.params.minimumTurnDistanceMm || 1.5);
    const result = [...points];
    let changed = true;
    while (changed) {
      changed = false;
      for (let index = 1; index < result.length - 1; index += 1) {
        const a = result[index - 1];
        const b = result[index];
        const c = result[index + 1];
        if (Math.min(distance(a, b), distance(b, c)) > minTurnDistance) continue;
        if (!segmentCoverageStats(a, c, map).covered) continue;
        result.splice(index, 1);
        changed = true;
        break;
      }
    }
    return result;
  }

  function nearlyCollinear(a, b, c) {
    const area = Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
    const base = Math.max(0.001, distance(a, c));
    return area / base < 0.15;
  }

  function simplifyCoverageSafe(points, map, tolerance) {
    if (!points || points.length <= 2 || tolerance <= 0) return points || [];
    const result = douglasPeucker(points, tolerance);
    return polylineCoveredEnough(result, map, 99) ? result : points;
  }

  function douglasPeucker(points, tolerance) {
    if (points.length <= 2) return points.map((point) => ({ ...point }));
    let maxDistance = 0;
    let maxIndex = 0;
    const start = points[0];
    const end = last(points);
    for (let index = 1; index < points.length - 1; index += 1) {
      const d = distanceToSegment(points[index], start, end);
      if (d > maxDistance) {
        maxDistance = d;
        maxIndex = index;
      }
    }
    if (maxDistance <= tolerance) return [{ ...start }, { ...end }];
    const left = douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
    const right = douglasPeucker(points.slice(maxIndex), tolerance);
    return [...left.slice(0, -1), ...right];
  }

  function smoothCoverageSafe(points, map, strength, iterations) {
    let current = points.map((point) => ({ ...point }));
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      if (current.length <= 2) break;
      const next = [current[0]];
      for (let index = 1; index < current.length - 1; index += 1) {
        const prev = current[index - 1];
        const point = current[index];
        const following = current[index + 1];
        next.push({
          x: point.x * (1 - strength) + ((prev.x + following.x) / 2) * strength,
          y: point.y * (1 - strength) + ((prev.y + following.y) / 2) * strength
        });
      }
      next.push(last(current));
      if (!polylineCoveredEnough(next, map, 99)) break;
      current = next;
    }
    return current;
  }

  function polylineCoveredEnough(points, map, minPercent) {
    return coverageRouteStats(points, map).coveredPercent >= minPercent;
  }

  function coverageRouteStats(points, map) {
    const length = polylineLength(points);
    let coveredLength = 0;
    let uncoveredLength = 0;
    let distanceSum = 0;
    let samples = 0;
    let minDistance = null;
    let maxSegmentLength = 0;
    let nonOrthogonalSegments = 0;
    const uncoveredSegments = [];
    const lowConfidenceSegments = [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      if (Math.abs(a.x - b.x) > 0.01 && Math.abs(a.y - b.y) > 0.01) nonOrthogonalSegments += 1;
      const segment = segmentCoverageStats(a, b, map);
      const segmentLength = segment.length;
      maxSegmentLength = Math.max(maxSegmentLength, segmentLength);
      if (segment.covered) {
        coveredLength += segmentLength;
        distanceSum += segment.distanceSum;
        minDistance = minNullable(minDistance, segment.minDistance);
        samples += segment.samples;
        if (segment.minDistance < Math.max(map.resolution, state.params.minimumCoverageWidthMm || 1)) lowConfidenceSegments.push([{ ...a }, { ...b }]);
      } else {
        coveredLength += segment.coveredLength;
        uncoveredLength += segment.uncoveredLength;
        distanceSum += segment.distanceSum;
        samples += segment.samples;
        uncoveredSegments.push([{ ...a }, { ...b }]);
        minDistance = minNullable(minDistance, segment.minDistance ?? 0);
      }
    }
    const turnStats = travelTurnStats(points);
    const coveredPercent = length ? coveredLength / length * 100 : 0;
    const avgDistance = samples ? distanceSum / samples : 0;
    const coverageScore = clamp(coveredPercent, 0, 100);
    const centerCoverageScore = clamp((avgDistance / Math.max(0.1, state.params.minimumCoverageWidthMm || 1)) * 50, 0, 100);
    const straightDistance = points.length > 1 ? distance(points[0], last(points)) : 0;
    const straightnessScore = length ? clamp((straightDistance / length) * 100, 0, 100) : 100;
    const smoothnessScore = clamp(100 - turnStats.directionChanges * 8 - (turnStats.minimumAngle == null ? 0 : Math.max(0, 45 - turnStats.minimumAngle)), 0, 100);
    const visibilityScore = uncoveredLength * 100000 + length * 10 - avgDistance;
    const overallScore = clamp(
      coverageScore * 0.4 + centerCoverageScore * 0.25 + straightnessScore * 0.15 + smoothnessScore * 0.2,
      0,
      100
    );
    return {
      routeLength: length,
      coveredLength,
      uncoveredLength,
      coveredPercent,
      averageCoverageDistance: avgDistance,
      minimumCoverageDistance: minDistance,
      visibilityScore,
      coverageScore,
      centerCoverageScore,
      straightnessScore,
      smoothnessScore,
      overallScore,
      directionChanges: turnStats.directionChanges,
      directionChangePoints: turnStats.points,
      minimumAngle: turnStats.minimumAngle,
      maxSegmentLength,
      nonOrthogonalSegments,
      uncoveredSegments,
      lowConfidenceSegments,
      breakPath: false
    };
  }

  function segmentCoverageStats(a, b, map) {
    const length = distance(a, b);
    if (length < 0.0001) {
      const sample = coverageSampleAtPoint(a, map);
      return {
        length: 0,
        covered: sample.covered,
        coveredLength: 0,
        uncoveredLength: 0,
        distanceSum: sample.covered ? sample.distance : 0,
        minDistance: sample.covered ? sample.distance : 0,
        samples: sample.covered ? 1 : 0
      };
    }
    const sampleCount = Math.max(2, Math.ceil(length / Math.max(0.1, map.resolution * 0.5)));
    let coveredSamples = 0;
    let distanceSum = 0;
    let minDistance = null;
    for (let sampleIndex = 0; sampleIndex <= sampleCount; sampleIndex += 1) {
      const sample = coverageSampleAtPoint(interpolate(a, b, sampleIndex / sampleCount), map);
      if (sample.covered) {
        coveredSamples += 1;
        distanceSum += sample.distance;
        minDistance = minNullable(minDistance, sample.distance);
      } else {
        minDistance = minNullable(minDistance, 0);
      }
    }
    const coveredRatio = coveredSamples / (sampleCount + 1);
    const covered = coveredSamples === sampleCount + 1;
    return {
      length,
      covered,
      coveredLength: length * coveredRatio,
      uncoveredLength: length * (1 - coveredRatio),
      distanceSum,
      minDistance,
      samples: coveredSamples
    };
  }

  function coverageSampleAtPoint(point, map) {
    const cell = worldToCell(map, point);
    const inside = cell.x >= 0 && cell.y >= 0 && cell.x < map.width && cell.y < map.height;
    const idx = inside ? cell.y * map.width + cell.x : -1;
    return {
      covered: inside && !!map.covered[idx],
      distance: inside ? map.distance[idx] : 0
    };
  }

  function travelTurnStats(points) {
    let directionChanges = 0;
    let minimumAngle = null;
    const turnPoints = [];
    for (let index = 1; index < points.length - 1; index += 1) {
      const a = points[index - 1];
      const b = points[index];
      const c = points[index + 1];
      const ab = { x: b.x - a.x, y: b.y - a.y };
      const bc = { x: c.x - b.x, y: c.y - b.y };
      const abLen = Math.hypot(ab.x, ab.y);
      const bcLen = Math.hypot(bc.x, bc.y);
      if (abLen < 0.001 || bcLen < 0.001) continue;
      const dot = clamp((ab.x * bc.x + ab.y * bc.y) / (abLen * bcLen), -1, 1);
      const angle = Math.acos(dot) * 180 / Math.PI;
      const continuityAngle = 180 - angle;
      minimumAngle = minimumAngle == null ? continuityAngle : Math.min(minimumAngle, continuityAngle);
      if (angle > 12) {
        directionChanges += 1;
        turnPoints.push({ ...b });
      }
    }
    return { directionChanges, minimumAngle, points: turnPoints };
  }

  function worldToCell(map, point) {
    return {
      x: Math.round((point.x - map.x) / map.resolution),
      y: Math.round((point.y - map.y) / map.resolution)
    };
  }

  function cellToWorld(map, x, y) {
    return { x: map.x + x * map.resolution, y: map.y + y * map.resolution };
  }

  function distanceToSegment(point, a, b) {
    return distance(point, closestPointOnSegment(point, a, b));
  }

  function heuristicCell(x, y, tx, ty) {
    return Math.hypot(x - tx, y - ty);
  }

  class BinaryHeap {
    constructor(compare) {
      this.items = [];
      this.compare = compare;
    }
    get length() {
      return this.items.length;
    }
    push(item) {
      this.items.push(item);
      this.bubbleUp(this.items.length - 1);
    }
    pop() {
      const top = this.items[0];
      const end = this.items.pop();
      if (this.items.length) {
        this.items[0] = end;
        this.sinkDown(0);
      }
      return top;
    }
    bubbleUp(index) {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.compare(this.items[index], this.items[parent]) >= 0) break;
        [this.items[index], this.items[parent]] = [this.items[parent], this.items[index]];
        index = parent;
      }
    }
    sinkDown(index) {
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (left < this.items.length && this.compare(this.items[left], this.items[smallest]) < 0) smallest = left;
        if (right < this.items.length && this.compare(this.items[right], this.items[smallest]) < 0) smallest = right;
        if (smallest === index) break;
        [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
        index = smallest;
      }
    }
  }

  function removeConsecutiveDuplicates(points) {
    const output = [];
    points.forEach((point) => {
      if (!output.length || distance(last(output), point) > 0.001) output.push({ ...point });
    });
    return output;
  }

  function averagePolylineSegmentLength(polylines) {
    let total = 0;
    let count = 0;
    polylines.forEach((polyline) => {
      for (let index = 0; index < polyline.points.length - 1; index += 1) {
        total += distance(polyline.points[index], polyline.points[index + 1]);
        count += 1;
      }
    });
    return count ? total / count : 0;
  }

  function resamplePolylineByArcLength(points, spacing, closed = false) {
    if (!points || points.length < 2) return [];
    const clean = points.filter((point, index, items) => index === 0 || !samePoint(point, items[index - 1]));
    if (clean.length < 2) return clean;
    if (closed && !samePoint(clean[0], last(clean))) clean.push({ ...clean[0] });
    const total = polylineLength(clean);
    if (total <= 0) return [];
    const segmentCount = closed ? Math.max(3, Math.round(total / Math.max(0.1, spacing))) : Math.max(1, Math.round(total / Math.max(0.1, spacing)));
    const stepLength = total / segmentCount;
    const output = [];
    const limit = closed ? segmentCount : segmentCount + 1;
    for (let index = 0; index < limit; index += 1) {
      output.push(pointAtPolylineDistance(clean, Math.min(total, index * stepLength)));
    }
    if (closed) output.push({ ...output[0] });
    return output;
  }

  function pointAtPolylineDistance(points, targetDistance) {
    let covered = 0;
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const length = distance(a, b);
      if (covered + length >= targetDistance) {
        const t = length ? (targetDistance - covered) / length : 0;
        return interpolate(a, b, clamp(t, 0, 1));
      }
      covered += length;
    }
    return { ...last(points) };
  }

  // Feature/passage pruning (L0/L1): walk a placed polyline; when a sub-path loops back
  // onto an earlier point it is a "feature" (circle / zig-zag rosette). Keep the loop only
  // if a valid hole sits near its centre; otherwise collapse it (drop the loop, bridge the
  // junction) so the connecting passage survives. Non-loop points (passages) are always kept.
  function pruneFeaturesByHoles(points, validCenters, tolerance) {
    if (!Array.isArray(points) || points.length < 4) return points;
    const loopTol = 0.4;
    const stack = []; // { x, y, prot } — prot marks points of a kept (on-hole) feature
    for (let k = 0; k < points.length; k += 1) {
      const p = points[k];
      let found = -1;
      for (let s = stack.length - 2; s >= 0; s -= 1) {
        if (!stack[s].prot && distance(stack[s], p) <= loopTol) { found = s; break; }
      }
      if (found >= 0 && stack.length - found + 1 >= 4) {
        let cx = p.x, cy = p.y;
        for (let s = found; s < stack.length; s += 1) { cx += stack[s].x; cy += stack[s].y; }
        const n = stack.length - found + 1;
        const center = { x: cx / n, y: cy / n };
        const nearHole = validCenters.some((hole) => distance(center, hole) <= tolerance);
        if (nearHole) {
          for (let s = found; s < stack.length; s += 1) stack[s].prot = true;
          stack.push({ x: p.x, y: p.y, prot: true });
        } else {
          let hasProtected = false;
          for (let s = found; s < stack.length; s += 1) { if (stack[s].prot) { hasProtected = true; break; } }
          if (hasProtected) stack.push({ x: p.x, y: p.y, prot: false }); // don't collapse over a kept feature
          else stack.length = found + 1;
        }
      } else {
        stack.push({ x: p.x, y: p.y, prot: false });
      }
    }
    return stack.map((o) => ({ x: o.x, y: o.y }));
  }

  function pruneLayerFeaturesByHoles(polylines, validCenters, tolerance) {
    const output = [];
    polylines.forEach((polyline) => {
      const points = pruneFeaturesByHoles(polyline.points, validCenters, tolerance);
      if (points.length >= 2) output.push({ ...polyline, points });
    });
    return output;
  }

  function filterPolylinesByValidHoles(polylines, validIds, validCenters, layerName, report) {
    const kept = [];
    const tolerance = Math.max(0, state.params.holeMatchTolerance || 0.5);
    polylines.forEach((polyline) => {
      const id = moduleId(polyline);
      const bounds = measurePointSets([polyline.points], { x: 0, y: 0, width: 0, height: 0 });
      const center = { x: bounds.centerX, y: bounds.centerY };
      const spatialMatch = validCenters.some((hole) => distance(center, hole) <= tolerance);
      if (validIds.has(id) || spatialMatch) {
        kept.push(polyline);
        if (layerName === "level0") report.level0ElementsKeptByHole += 1;
        if (layerName === "level1") report.level1ElementsKeptByHole += 1;
        const matched = validCenters.find((hole) => hole.id === id || distance(center, hole) <= tolerance);
        if (matched) report.debug.holeMatches.push([center, matched]);
      } else {
        if (layerName === "level0") report.level0ElementsRemovedByHole += 1;
        if (layerName === "level1") report.level1ElementsRemovedByHole += 1;
      }
    });
    return kept;
  }

  function applyModuleClipMode(polylines, bounds, mode, layerName, report) {
    if (mode === "strict_clip") {
      const cleaned = cleanupPolylines(polylines, bounds);
      return { polylines: cleaned.polylines, report: cleaned.report };
    }
    const groups = new Map();
    polylines.forEach((polyline) => {
      const id = moduleId(polyline);
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(polyline);
    });
    const kept = [];
    groups.forEach((items) => {
      const keep = mode === "keep_only_if_fully_inside"
        ? moduleFullyInside(items, bounds)
        : moduleIntersectsBoundary(items, bounds);
      if (keep) {
        appendItems(kept, items);
        if (layerName === "level0") report.level0ModulesKeptByClipMode += 1;
        if (layerName === "level1") report.level1ModulesKeptByClipMode += 1;
      } else {
        if (layerName === "level0") report.level0ModulesRemovedByClipMode += 1;
        if (layerName === "level1") report.level1ModulesRemovedByClipMode += 1;
      }
    });
    report.pathsBeforeCleanup = polylines.length;
    report.pathsAfterCleanup = kept.length;
    report.finalPoints = kept.reduce((sum, item) => sum + item.points.length, 0);
    return { polylines: kept, report };
  }

  function moduleFullyInside(items, bounds) {
    return items.every((item) => item.points.every((point) => isInside(point, bounds, state.params.cleanupTolerance || 0)));
  }

  function moduleIntersectsBoundary(items, bounds) {
    return items.some((item) => {
      if (item.points.some((point) => isInside(point, bounds, state.params.cleanupTolerance || 0))) return true;
      for (let index = 0; index < item.points.length - 1; index += 1) {
        if (clipSegmentToBoundary(item.points[index], item.points[index + 1], bounds).length) return true;
      }
      return false;
    });
  }

  function runSingleModuleScaleTest() {
    if (!state.sources.level1) {
      setStatus("Load a Level 1 module before running scale test");
      return null;
    }
    readParams();
    const source = state.sources.level1;
    const raw = source.elements.map((item) => ({
      layer: "level1",
      diagonal: 0,
      index: 0,
      points: item.points.map((point) => ({ x: point.x, y: point.y }))
    }));
    const exportedBounds = measurePointSets(raw.map((item) => item.points), source.bounds);

    const report = buildScaleTestReport(source, exportedBounds);
    state.scaleTestReport = report;
    renderSingleModuleImportPreview(source, raw, exportedBounds);
    setStatus(`Scale test ${report.testPassed ? "passed" : "failed"}: ΔW ${round(report.widthDifferenceMm)} mm, ΔH ${round(report.heightDifferenceMm)} mm`);
    return report;
  }

  function renderSingleModuleImportPreview(source, rawPolylines, exportedBounds) {
    const margin = 10;
    preview.innerHTML = "";
    setBaseViewBox(source.bounds.minX - margin, source.bounds.minY - margin, source.bounds.width + margin * 2, source.bounds.height + margin * 2);
    preview.setAttribute("width", `${round(source.bounds.width + margin * 2)}mm`);
    preview.setAttribute("height", `${round(source.bounds.height + margin * 2)}mm`);
    preview.appendChild(buildPolylineGroup("single-module-import-test", rawPolylines, "layer-level1"));
    const debug = createEl("g", { id: "single-module-scale-debug" });
    debug.appendChild(createEl("rect", {
      x: source.bounds.minX,
      y: source.bounds.minY,
      width: source.bounds.width,
      height: source.bounds.height,
      fill: "none",
      stroke: "#00a56a",
      "stroke-width": "0.3"
    }));
    debug.appendChild(createEl("rect", {
      x: exportedBounds.minX,
      y: exportedBounds.minY,
      width: exportedBounds.width,
      height: exportedBounds.height,
      fill: "none",
      stroke: "#d22",
      "stroke-width": "0.3",
      "stroke-dasharray": "2 1"
    }));
    preview.appendChild(debug);
    state.generated = preview.cloneNode(true);
    state.debugSvg = preview.cloneNode(true);
  }

  function buildScaleTestReport(source, exportedBounds) {
    const widthDifferenceMm = exportedBounds.width - source.bounds.width;
    const heightDifferenceMm = exportedBounds.height - source.bounds.height;
    const scaleRatioX = source.bounds.width ? exportedBounds.width / source.bounds.width : null;
    const scaleRatioY = source.bounds.height ? exportedBounds.height / source.bounds.height : null;
    const displayedBounds = exportedBounds;
    const declaredVsImportedWidthDiff = source.declaredWidth ? source.bounds.width - source.declaredWidth : null;
    const declaredVsImportedHeightDiff = source.declaredHeight ? source.bounds.height - source.declaredHeight : null;
    const declaredSizeAvailable = Boolean(source.declaredWidth && source.declaredHeight);
    const declaredSizeMatches = !declaredSizeAvailable ||
      (Math.abs(declaredVsImportedWidthDiff) <= 0.01 && Math.abs(declaredVsImportedHeightDiff) <= 0.01);
    return {
      source: source.name,
      testName: "Single Module Import Test",
      toleranceMm: 0.01,
      normalizationMethod: source.normalizationMethod,
      declaredWidthMm: source.declaredWidth,
      declaredHeightMm: source.declaredHeight,
      declaredSizeAvailable,
      importedBboxWidthMm: source.bounds.width,
      importedBboxHeightMm: source.bounds.height,
      displayedBboxWidthMm: displayedBounds.width,
      displayedBboxHeightMm: displayedBounds.height,
      originalModuleBboxWidthMm: source.bounds.width,
      originalModuleBboxHeightMm: source.bounds.height,
      exportedModuleBboxWidthMm: exportedBounds.width,
      exportedModuleBboxHeightMm: exportedBounds.height,
      declaredVsImportedWidthDiffMm: declaredVsImportedWidthDiff,
      declaredVsImportedHeightDiffMm: declaredVsImportedHeightDiff,
      widthDifferenceMm,
      heightDifferenceMm,
      scaleRatioX,
      scaleRatioY,
      importScaleX: source.importScaleX,
      importScaleY: source.importScaleY,
      generationScale: 1,
      exportScale: source.exportScale,
      finalScaleFromOriginalSvgUnitsX: source.importScaleX * 1 * source.exportScale,
      finalScaleFromOriginalSvgUnitsY: source.importScaleY * 1 * source.exportScale,
      finalScaleAfterImportX: 1 * source.exportScale,
      finalScaleAfterImportY: 1 * source.exportScale,
      declaredSizeMatches,
      importedDisplayedExportedMatch: Math.abs(widthDifferenceMm) <= 0.01 && Math.abs(heightDifferenceMm) <= 0.01,
      testPassed: declaredSizeMatches && Math.abs(widthDifferenceMm) <= 0.01 && Math.abs(heightDifferenceMm) <= 0.01
    };
  }

  function emptyReport() {
    return {
      originalPoints: 0,
      finalPoints: 0,
      deletedPoints: 0,
      movedPoints: 0,
      intersectionsCreated: 0,
      shortSegmentsRemoved: 0,
      borderConnectionsGenerated: 0,
      intraDiagonalConnectionsGenerated: 0,
      blockedDiagonalPassages: 0,
      routingFailures: 0,
      laserHolesTotal: 0,
      laserHolesAccepted: 0,
      laserHolesRemoved: 0,
      laserHolesIncompleteRemoved: 0,
      laserHolesOutsideRemoved: 0,
      level0ElementsKeptByHole: 0,
      level0ElementsRemovedByHole: 0,
      level0ModulesKeptByClipMode: 0,
      level0ModulesRemovedByClipMode: 0,
      level0GeneratedOutlines: 0,
      level0AverageStitchLength: 0,
      level0TravelLength: 0,
      level0CoverageRoutes: 0,
      level0DirectVisibleRoutes: 0,
      level0AverageTravelVisibilityScore: 0,
      coverageMapCells: 0,
      coverageMapCoveredCells: 0,
      coverageMapCoveragePercent: 0,
      coverageMapResolutionMm: 0,
      coverageMapRequestedResolutionMm: 0,
      coverageMapRadiusMm: 0,
      coverageEdgeCompensationMm: 0,
      coverageGapClosingMm: 0,
      coverageMinimumDensity: 1,
      coverageMaxDensity: 0,
      coveragePreviewPixels: 0,
      level0CoveredTravelLength: 0,
      level0UncoveredTravelLength: 0,
      level0AverageCoverageDistance: 0,
      level0MinimumCoverageDistance: null,
      level0AverageStraightnessScore: 0,
      level0AverageSmoothnessScore: 0,
      level0AverageCenterCoverageScore: 0,
      level0AverageOverallTravelScore: 0,
      level0DirectionChanges: 0,
      level0CoverageFallbacks: 0,
      level0CoverageBrokenPaths: 0,
      level0BrokenPaths: 0,
      level0Warnings: 0,
      routingContoursFound: 0,
      routingClosedContours: 0,
      routingPerimeterArea: 0,
      routingPerimeterLength: 0,
      routingPerimeterVertices: 0,
      invalidInternalShortcutsBlocked: 0,
      cutSegmentsDetected: 0,
      cutExitReentryPairs: 0,
      cutRoutesCreated: 0,
      cutRoutesFailed: 0,
      cutRoutesLongSegments: 0,
      cutPathsReconnected: 0,
      level1ElementsKeptByHole: 0,
      level1ElementsRemovedByHole: 0,
      level1ModulesKeptByClipMode: 0,
      level1ModulesRemovedByClipMode: 0,
      longestDiagonalIndex: 0,
      symmetricRoutingFirstHalf: 0,
      symmetricRoutingSecondHalf: 0,
      perimeterRoutingLength: 0,
      pathsBeforeCleanup: 0,
      pathsAfterCleanup: 0,
      borderLength: 0,
      zigZagPeaks: 0,
      totalTravelPathLength: 0,
      averageTravelStitchLength: 0,
      minTravelStitchLengthFound: null,
      maxTravelStitchLengthFound: null,
      minLengthFound: null,
      pathsSplit: 0,
      validSegments: 0,
      removedSegments: 0,
      debug: {
        originalPoints: [],
        deletedPoints: [],
        movedPoints: [],
        intersectionPoints: [],
        validSegments: [],
        removedSegments: [],
        routingPaths: [],
        travelPoints: [],
        travelSegments: [],
        intraDiagonalConnectors: [],
        zigZagPeaks: [],
        zigZagValleys: [],
        exitPoints: [],
        entryPoints: [],
        reconstructedConnections: [],
        blockedDiagonalPassages: [],
        laserHolesRemoved: [],
        laserHolesIncomplete: [],
        laserHolesAccepted: [],
        holeMatches: [],
        level0GeneratedOutlines: [],
        level0TravelPaths: [],
        coverageMapCells: [],
        coverageMaskImages: [],
        coverageMaskRuns: [],
        coverageHeatmap: [],
        coverageRawRoutes: [],
        coverageOptimizedRoutes: [],
        coverageTravelPaths: [],
        visibleTravelPaths: [],
        coverageUncoveredSegments: [],
        coverageLowConfidenceSegments: [],
        coverageDirectionChanges: [],
        coverageSimplifiedPoints: [],
        coverageResampledPoints: [],
        coverageFailures: [],
        coverageRouteReports: [],
        selectedRoutingContour: [],
        perimeterProjectionPoints: [],
        cutGeneratedRoutes: [],
        cutRouteExitPoints: [],
        cutRouteReentryPoints: [],
        routingCandidates: []
      }
    };
  }

  function mergeReports(target, source) {
    Object.keys(target).forEach((key) => {
      if (key === "debug") return;
      if (key === "minLengthFound") {
        if (target.minLengthFound === null) target.minLengthFound = source.minLengthFound;
        else if (source.minLengthFound !== null) target.minLengthFound = Math.min(target.minLengthFound, source.minLengthFound);
      } else if (key === "level0MinimumCoverageDistance") {
        target.level0MinimumCoverageDistance = minNullable(target.level0MinimumCoverageDistance, source.level0MinimumCoverageDistance);
      } else if (typeof target[key] === "number") {
        target[key] += source[key] || 0;
      }
    });
    Object.keys(target.debug).forEach((key) => appendDebugItems(target.debug[key], source.debug[key]));
  }

  function appendDebugItems(target, source) {
    if (!source || !source.length || target.length >= MAX_DEBUG_ITEMS) return;
    const remaining = MAX_DEBUG_ITEMS - target.length;
    const count = Math.min(remaining, source.length);
    for (let index = 0; index < count; index += 1) {
      target.push(source[index]);
    }
  }

  function appendItems(target, source) {
    if (!source || !source.length) return;
    for (let index = 0; index < source.length; index += 1) {
      target.push(source[index]);
    }
  }

  function cleanupPolylines(polylines, bounds, options = {}) {
    const report = emptyReport();
    const cleaned = [];
    report.pathsBeforeCleanup = polylines.length;
    polylines.forEach((polyline) => {
      const local = cleanupPolyline(polyline, bounds, options);
      appendItems(cleaned, local.polylines);
      mergeReports(report, local.report);
    });
    report.pathsAfterCleanup = cleaned.length;
    return { polylines: cleaned, report };
  }

  function reconnectCutFragmentsOnBoundary(polylines, bounds) {
    const report = emptyReport();
    const grouped = new Map();
    polylines.forEach((polyline) => {
      const key = `${polyline.layer}:${polyline.diagonal ?? 0}:${polyline.index ?? 0}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(polyline);
    });
    const output = [];
    grouped.forEach((items) => {
      const ordered = [...items];
      if (ordered.length < 2) {
        appendItems(output, ordered);
        return;
      }
      report.cutSegmentsDetected += ordered.length - 1;
      let merged = { ...ordered[0], splitFragment: null, cutReconnected: false, points: ordered[0].points.map((point) => ({ ...point })) };
      let reconnected = false;
      for (let index = 1; index < ordered.length; index += 1) {
        const previousEnd = last(merged.points);
        const nextStart = ordered[index].points[0];
        if (isBoundaryCutPair(previousEnd, nextStart, bounds)) {
          const cutRoute = cutGeneratedBorderRoute(previousEnd, nextStart, bounds, state.params.cutBorderStitchLength || 2, report);
          if (cutRoute.points.length > 1) {
            if (!samePoint(last(merged.points), cutRoute.points[0])) merged.points[merged.points.length - 1] = cutRoute.points[0];
            appendItems(merged.points, cutRoute.points.slice(1));
            appendItems(merged.points, ordered[index].points.slice(1));
            report.cutPathsReconnected += 1;
            reconnected = true;
            merged.cutReconnected = true;
            continue;
          }
        }
        if (reconnected) output.push(merged);
        else output.push(ordered[index - 1]);
        merged = { ...ordered[index], points: ordered[index].points.map((point) => ({ ...point })) };
        reconnected = false;
      }
      output.push(merged);
    });
    report.pathsBeforeCleanup = polylines.length;
    report.pathsAfterCleanup = output.length;
    return { polylines: output, report };
  }

  function isBoundaryCutPair(a, b, bounds) {
    const tolerance = Math.max(0.2, state.params.perimeterLaneTolerance || 1);
    return distanceToBoundary(a, bounds) <= tolerance && distanceToBoundary(b, bounds) <= tolerance;
  }

  function isBoundaryCutConnectorCandidate(previousItem, item, from, to, bounds) {
    if (!previousItem || !item || !bounds) return false;
    if (previousItem.index === item.index) return false;
    const hasCutMetadata = previousItem.splitFragment != null ||
      item.splitFragment != null ||
      previousItem.cutReconnected ||
      item.cutReconnected;
    if (!hasCutMetadata) return false;
    const stitch = state.params.cutBorderStitchLength || 2;
    const tolerance = Math.max(
      state.params.perimeterLaneTolerance || 1,
      stitch + (state.params.cleanupTolerance || 0.25),
      state.params.minimumSegmentLength || 1
    );
    return distanceToBoundary(from, bounds) <= tolerance && distanceToBoundary(to, bounds) <= tolerance;
  }

  function cleanupPolyline(polyline, bounds, options = {}) {
    const p = state.params;
    const report = emptyReport();
    const output = [];
    const adjusted = polyline.points.map((point) => {
      report.originalPoints += 1;
      report.debug.originalPoints.push(point);
      if (isInside(point, bounds, p.cleanupTolerance)) return point;
      if (p.cleanupMode !== "strict_clip") {
        const snapped = snapToRect(point, bounds, p.snapToEdgeDistance);
        if (snapped) {
          report.movedPoints += 1;
          report.debug.movedPoints.push(snapped);
          return snapped;
        }
      }
      report.deletedPoints += 1;
      report.debug.deletedPoints.push(point);
      return point;
    });

    let current = [];
    let splitCount = 0;
    for (let index = 0; index < adjusted.length - 1; index += 1) {
      const a = adjusted[index];
      const b = adjusted[index + 1];
      const clippedSegments = clipSegmentToBoundary(a, b, bounds);
      if (!clippedSegments.length) {
        report.removedSegments += 1;
        report.debug.removedSegments.push([a, b]);
        if (current.length > 1) {
          cleanedPush(cleanedFrom(current, polyline), report);
          current = [];
          splitCount += 1;
        }
        continue;
      }
      clippedSegments.forEach((clipped, segmentIndex) => {
        const length = distance(clipped.a, clipped.b);
        report.minLengthFound = report.minLengthFound === null ? length : Math.min(report.minLengthFound, length);
        if (length < p.minimumSegmentLength) {
          report.shortSegmentsRemoved += 1;
          report.removedSegments += 1;
          report.debug.removedSegments.push([clipped.a, clipped.b]);
          return;
        }
        if (!samePoint(clipped.a, a)) {
          report.intersectionsCreated += 1;
          report.debug.intersectionPoints.push(clipped.a);
        }
        if (!samePoint(clipped.b, b)) {
          report.intersectionsCreated += 1;
          report.debug.intersectionPoints.push(clipped.b);
        }
        report.validSegments += 1;
        report.debug.validSegments.push([clipped.a, clipped.b]);
        if (segmentIndex > 0 || !current.length || !samePoint(last(current), clipped.a)) {
          if (current.length > 1) {
            cleanedPush(cleanedFrom(current, polyline), report);
            splitCount += 1;
          }
          current = [clipped.a];
        }
        current.push(clipped.b);
      });
    }
    if (current.length > 1) cleanedPush(cleanedFrom(current, polyline), report);
    report.pathsSplit += Math.max(0, splitCount);
    return { polylines: output, report };

    function cleanedPush(item, itemReport) {
      const simplified = removeShortSegments(item.points, p.minimumSegmentLength, itemReport);
      if (simplified.length > 1) {
        itemReport.finalPoints += simplified.length;
        output.push({ ...item, splitFragment: output.length, points: simplified });
      }
    }
  }

  function cleanedFrom(points, source) {
    return {
      layer: source.layer,
      diagonal: source.diagonal,
      index: source.index,
      points: points.map((point) => ({ x: point.x, y: point.y }))
    };
  }

  function removeShortSegments(points, minLength, report) {
    if (points.length < 2) return [];
    const output = [points[0]];
    for (let index = 1; index < points.length; index += 1) {
      const length = distance(last(output), points[index]);
      if (length < minLength) {
        report.shortSegmentsRemoved += 1;
        report.debug.removedSegments.push([last(output), points[index]]);
      } else {
        output.push(points[index]);
      }
    }
    return output;
  }

  // Final minimum-stitch pass for a connected polyline: drops points closer than
  // minLength to the previous kept point, but always preserves the endpoints so it
  // never breaks routing continuity. Long perimeter travels (>= minLength) are untouched.
  function enforceMinimumStitch(points, minLength) {
    if (!Array.isArray(points) || points.length < 3 || !(minLength > 0)) return points;
    const output = [points[0]];
    for (let index = 1; index < points.length; index += 1) {
      const point = points[index];
      if (distance(last(output), point) >= minLength) {
        output.push(point);
      } else if (index === points.length - 1) {
        if (output.length > 1) output[output.length - 1] = point;
        else output.push(point);
      }
    }
    return output;
  }

  function enforceMinimumStitchOnLayer(connected, minLength) {
    if (!connected || !Array.isArray(connected.polylines) || !(minLength > 0)) return;
    connected.polylines.forEach((polyline) => {
      if (polyline && Array.isArray(polyline.points)) polyline.points = enforceMinimumStitch(polyline.points, minLength);
    });
  }

  // Thread-discharge on the outer panel border, at both the entry AND the exit of every run:
  // 3 vertical lock points on the border (anchor the thread) + a classic travel (at `stitch` mm)
  // to/from the original start/end of the run.
  function addStartEndLock(connected, boundary, stitch) {
    if (!connected || !Array.isArray(connected.polylines) || !boundary || !Array.isArray(boundary.points)) return;
    const s = Math.max(0.5, stitch || 3);
    const lockStep = Math.max(3, s); // the 3 lock points must be at least 3 mm apart
    // Tangent of the panel border at the projection point (direction of the closest edge segment).
    const borderTangent = (b) => {
      const pts = boundary.points;
      let bestD = Infinity;
      let projected = b;
      let tan = { x: 1, y: 0 };
      for (let i = 0; i < pts.length - 1; i += 1) {
        const a = pts[i];
        const c = pts[i + 1];
        const cand = closestPointOnSegment(b, a, c);
        const d = distance(b, cand);
        if (d < bestD) {
          bestD = d;
          projected = cand;
          const len = Math.hypot(c.x - a.x, c.y - a.y) || 1;
          tan = { x: (c.x - a.x) / len, y: (c.y - a.y) / len };
        }
      }
      return { point: projected, tan };
    };
    // 3 lock points ALONG the border (all coincide with the perimeter, >= 3 mm apart).
    const lockAt = (border) => {
      const { point, tan } = borderTangent(border);
      const march = (k) => closestPointOnBoundary({ x: point.x + tan.x * lockStep * k, y: point.y + tan.y * lockStep * k }, boundary) || point;
      return [point, march(1), march(2)];
    };
    connected.polylines.forEach((polyline) => {
      if (!polyline || !Array.isArray(polyline.points) || polyline.points.length < 2) return;
      const pts = polyline.points;
      const start = pts[0];
      const end = pts[pts.length - 1];
      const bStart = closestPointOnBoundary(start, boundary);
      const bEnd = closestPointOnBoundary(end, boundary);
      // Build with concat, never `push(...bigArray)`: spreading thousands of points into a
      // function call overflows the argument stack (RangeError on large SVGs).
      let out;
      if (bStart) {
        const lock = lockAt(bStart);
        const entry = resampleTravelPath([lock[lock.length - 1], start], s);
        out = lock.concat(entry.slice(1), pts.slice(1));
      } else {
        out = pts.slice();
      }
      if (bEnd) {
        const lock = lockAt(bEnd);
        const exit = resampleTravelPath([end, lock[0]], s);
        out = out.concat(exit.slice(1), lock.slice(1));
      }
      polyline.points = out;
    });
  }

  // Remove geometry that falls inside exclusion areas (inner contours of the reference of the
  // same colour), splitting each polyline so the pattern is interrupted there = empty area.
  function subtractExclusions(polylines, exclusions) {
    if (!Array.isArray(exclusions) || !exclusions.length) return polylines;
    const output = [];
    polylines.forEach((polyline) => {
      if (!polyline || !Array.isArray(polyline.points)) return;
      let run = [];
      polyline.points.forEach((point) => {
        const inside = exclusions.some((exclusion) => isInside(point, exclusion, 0));
        if (inside) {
          if (run.length > 1) output.push({ ...polyline, points: run });
          run = [];
        } else {
          run.push(point);
        }
      });
      if (run.length > 1) output.push({ ...polyline, points: run });
    });
    return output;
  }

  function cutGeneratedBorderRoute(exitPoint, reentryPoint, bounds, stitchLength, report) {
    report.cutExitReentryPairs += 1;
    report.debug.cutRouteExitPoints.push(exitPoint);
    report.debug.cutRouteReentryPoints.push(reentryPoint);
    const projectedExit = closestPointOnBoundary(exitPoint, bounds) || exitPoint;
    const projectedReentry = closestPointOnBoundary(reentryPoint, bounds) || reentryPoint;
    const snapTolerance = Math.max(
      state.params.perimeterLaneTolerance || 1,
      (stitchLength || 2) + (state.params.cleanupTolerance || 0.25),
      state.params.minimumSegmentLength || 1
    );
    if (distance(exitPoint, projectedExit) > snapTolerance || distance(reentryPoint, projectedReentry) > snapTolerance) {
      report.cutRoutesFailed += 1;
      return { points: [], route: { valid: false, reason: "cut_endpoint_too_far_from_boundary", projectedStart: projectedExit, projectedEnd: projectedReentry } };
    }
    const route = perimeterRoute(projectedExit, projectedReentry, bounds, {
      forceBorder: true,
      validateCandidates: true,
      preferredDirection: null
    });
    if (route.valid === false || !route.points.length) {
      report.cutRoutesFailed += 1;
      return { points: [], route };
    }
    const points = resamplePathMaxSpacing(route.points, Math.max(0.2, stitchLength || 2));
    const maxSegment = maxSegmentLength(points);
    if (maxSegment > (stitchLength || 2) + 0.01) {
      report.cutRoutesLongSegments += 1;
      report.cutRoutesFailed += 1;
      return { points: [], route: { ...route, valid: false, reason: "cut_route_segment_longer_than_stitch", projectedStart: projectedExit, projectedEnd: projectedReentry } };
    }
    report.cutRoutesCreated += 1;
    report.debug.cutGeneratedRoutes.push(points);
    report.debug.routingCandidates.push({
      type: "cut-generated-border-routing",
      startPoint: exitPoint,
      endPoint: reentryPoint,
      projectedStart: route.projectedStart || null,
      projectedEnd: route.projectedEnd || null,
      selectedDirection: route.direction,
      selectedLength: route.perimeterLength ?? route.length,
      pointCount: points.length,
      maxSegmentLength: maxSegment,
      reinserted: true,
      candidates: route.candidates || []
    });
    return { points, route };
  }

  function maxSegmentLength(points) {
    let max = 0;
    for (let index = 0; index < points.length - 1; index += 1) {
      max = Math.max(max, distance(points[index], points[index + 1]));
    }
    return max;
  }

  function resamplePathMaxSpacing(points, maxSpacing) {
    if (!points.length) return [];
    const result = [points[0]];
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const length = distance(a, b);
      const parts = Math.max(1, Math.ceil(length / Math.max(0.1, maxSpacing)));
      for (let step = 1; step <= parts; step += 1) {
        result.push(interpolate(a, b, step / parts));
      }
    }
    return result.filter((point, index, items) => index === 0 || !samePoint(point, items[index - 1]));
  }

  function isInside(point, bounds, tolerance = 0) {
    if (bounds.type === "polygon") return pointInPolygon(point, bounds.points) || distanceToBoundary(point, bounds) <= tolerance;
    return point.x >= bounds.minX - tolerance &&
      point.x <= bounds.maxX + tolerance &&
      point.y >= bounds.minY - tolerance &&
      point.y <= bounds.maxY + tolerance;
  }

  function snapToRect(point, bounds, maxDistance) {
    if (bounds.type === "polygon") {
      const projected = closestPointOnBoundary(point, bounds);
      return projected && distance(point, projected) <= maxDistance ? projected : null;
    }
    const candidates = [
      { x: clamp(point.x, bounds.minX, bounds.maxX), y: bounds.minY },
      { x: clamp(point.x, bounds.minX, bounds.maxX), y: bounds.maxY },
      { x: bounds.minX, y: clamp(point.y, bounds.minY, bounds.maxY) },
      { x: bounds.maxX, y: clamp(point.y, bounds.minY, bounds.maxY) }
    ];
    let best = null;
    let bestDistance = Infinity;
    candidates.forEach((candidate) => {
      const d = distance(point, candidate);
      if (d < bestDistance) {
        best = candidate;
        bestDistance = d;
      }
    });
    return bestDistance <= maxDistance ? best : null;
  }

  function clipSegmentToBoundary(a, b, bounds) {
    if (bounds.type !== "polygon") {
      const clipped = clipSegmentToRect(a, b, bounds);
      return clipped ? [clipped] : [];
    }
    return clipSegmentToPolygon(a, b, bounds.points);
  }

  function clipSegmentToRect(a, b, bounds) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    let t0 = 0;
    let t1 = 1;
    const checks = [
      [-dx, a.x - bounds.minX],
      [dx, bounds.maxX - a.x],
      [-dy, a.y - bounds.minY],
      [dy, bounds.maxY - a.y]
    ];
    for (const [edge, q] of checks) {
      if (edge === 0 && q < 0) return null;
      if (edge !== 0) {
        const r = q / edge;
        if (edge < 0) {
          if (r > t1) return null;
          if (r > t0) t0 = r;
        } else {
          if (r < t0) return null;
          if (r < t1) t1 = r;
        }
      }
    }
    return {
      a: { x: a.x + t0 * dx, y: a.y + t0 * dy },
      b: { x: a.x + t1 * dx, y: a.y + t1 * dy }
    };
  }

  function clipSegmentToPolygon(a, b, polygon) {
    const intersections = [{ t: 0, point: a }, { t: 1, point: b }];
    for (let index = 0; index < polygon.length - 1; index += 1) {
      const hit = segmentIntersectionParam(a, b, polygon[index], polygon[index + 1]);
      if (hit && hit.t >= 0 && hit.t <= 1) intersections.push(hit);
    }
    const unique = intersections
      .sort((left, right) => left.t - right.t)
      .filter((item, index, items) => index === 0 || Math.abs(item.t - items[index - 1].t) > 0.000001);
    const segments = [];
    for (let index = 0; index < unique.length - 1; index += 1) {
      const start = unique[index];
      const end = unique[index + 1];
      const midT = (start.t + end.t) / 2;
      const mid = interpolate(a, b, midT);
      if (pointInPolygon(mid, polygon)) segments.push({ a: start.point, b: end.point });
    }
    if (!segments.length && pointInPolygon(a, polygon) && pointInPolygon(b, polygon)) return [{ a, b }];
    return segments;
  }

  function segmentIntersectionParam(a, b, c, d) {
    const r = { x: b.x - a.x, y: b.y - a.y };
    const s = { x: d.x - c.x, y: d.y - c.y };
    const denominator = r.x * s.y - r.y * s.x;
    if (Math.abs(denominator) < 0.000001) return null;
    const uNumerator = (c.x - a.x) * r.y - (c.y - a.y) * r.x;
    const tNumerator = (c.x - a.x) * s.y - (c.y - a.y) * s.x;
    const t = tNumerator / denominator;
    const u = uNumerator / denominator;
    if (t < -0.000001 || t > 1.000001 || u < -0.000001 || u > 1.000001) return null;
    return { t: clamp(t, 0, 1), point: interpolate(a, b, clamp(t, 0, 1)) };
  }

  function interpolate(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function pointInPolygon(point, polygon) {
    let inside = false;
    for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
      const a = polygon[index];
      const b = polygon[previous];
      const intersects = ((a.y > point.y) !== (b.y > point.y)) &&
        point.x < ((b.x - a.x) * (point.y - a.y)) / ((b.y - a.y) || 0.000001) + a.x;
      if (intersects) inside = !inside;
    }
    return inside;
  }

  function closestPointOnBoundary(point, boundary) {
    let best = null;
    let bestDistance = Infinity;
    for (let index = 0; index < boundary.points.length - 1; index += 1) {
      const candidate = closestPointOnSegment(point, boundary.points[index], boundary.points[index + 1]);
      const d = distance(point, candidate);
      if (d < bestDistance) {
        best = candidate;
        bestDistance = d;
      }
    }
    return best;
  }

  function distanceToBoundary(point, boundary) {
    const candidate = closestPointOnBoundary(point, boundary);
    return candidate ? distance(point, candidate) : Infinity;
  }

  function closestPointOnSegment(point, a, b) {
    const lengthSquared = Math.max(0.000001, (b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    const t = clamp(((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / lengthSquared, 0, 1);
    return interpolate(a, b, t);
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function samePoint(a, b) {
    return distance(a, b) < 0.001;
  }

  function last(items) {
    return items[items.length - 1];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function connectLayerContinuity(polylines, bounds, layer, options = {}) {
    const report = emptyReport();
    if (!polylines.length) return { polylines: [], report, routingPolylines: [], intraDiagonalPolylines: [] };
    const diagonals = groupByDiagonal(polylines);
    const connected = options.disableInterDiagonalRouting ? [] : [{ layer, points: [] }];
    const routingPolylines = [];
    const intraDiagonalPolylines = [];
    const longestDiagonalPosition = longestDiagonalIndex(diagonals);
    report.longestDiagonalIndex = longestDiagonalPosition;
    diagonals.forEach((diagonalItems, diagonalPosition) => {
      const diagonalPath = connectDiagonalModules(diagonalItems, layer, report, {
        bounds,
        cutBoundary: options.cutBoundary || bounds,
        routeBoundaryCutConnectors: options.routeBoundaryCutIntraDiagonal
      });
      if (!diagonalPath.points.length) return;
      if (options.disableInterDiagonalRouting) {
        connected.push({ layer, diagonal: diagonalItems[0]?.diagonal ?? diagonalPosition, points: diagonalPath.points });
        appendItems(intraDiagonalPolylines, diagonalPath.intraDiagonalPolylines);
        return;
      }
      const current = last(connected);
      if (!current.points.length) {
        appendItems(current.points, diagonalPath.points);
        appendItems(intraDiagonalPolylines, diagonalPath.intraDiagonalPolylines);
        return;
      }
      const exitPoint = last(current.points);
      const entryPoint = diagonalPath.points[0];
      const phase = diagonalPosition <= longestDiagonalPosition ? "first_half" : "second_half";
      const routingStrategy = state.params.travelRoutingStrategy || "shortest_valid";
      const preferredDirection = routingStrategy === "clockwise" || routingStrategy === "counter_clockwise"
        ? routingStrategy
        : options.symmetricRouting && routingStrategy !== "shortest_valid"
          ? (phase === "first_half" ? "clockwise" : "counter_clockwise")
          : null;
      const route = perimeterRoute(exitPoint, entryPoint, bounds, {
        forceBorder: options.forceBorderRouting,
        preferredDirection,
        validateCandidates: options.symmetricRouting
      });
      const routeValid = route.points.length > 1 && route.valid !== false;
      if (routeValid && diagonalPosition > 0) {
        if (phase === "first_half") report.symmetricRoutingFirstHalf += 1;
        else report.symmetricRoutingSecondHalf += 1;
        report.borderConnectionsGenerated += 1;
        report.perimeterRoutingLength += route.length;
        report.totalTravelPathLength += route.stitchStats.total;
        report.averageTravelStitchLength = weightedAverage(
          report.averageTravelStitchLength,
          Math.max(0, report.debug.travelSegments.length),
          route.stitchStats.average,
          route.stitchStats.count
        );
        report.minTravelStitchLengthFound = minNullable(report.minTravelStitchLengthFound, route.stitchStats.min);
        report.maxTravelStitchLengthFound = maxNullable(report.maxTravelStitchLengthFound, route.stitchStats.max);
        report.debug.exitPoints.push(exitPoint);
        report.debug.entryPoints.push(entryPoint);
        report.debug.routingPaths.push(route.points);
        report.debug.routingCandidates.push({
          diagonal: diagonalItems[0]?.diagonal ?? diagonalPosition,
          diagonalPosition,
          longestDiagonalPosition,
          phase,
          startPoint: exitPoint,
          endPoint: entryPoint,
          projectedStart: route.projectedStart || null,
          projectedEnd: route.projectedEnd || null,
          selectedDirection: route.direction || preferredDirection || "auto",
          selectedLength: route.perimeterLength ?? route.length,
          rejectedDirection: (route.candidates || []).find((candidate) => !candidate.chosen)?.direction || null,
          rejectedReason: (route.candidates || []).find((candidate) => !candidate.chosen)?.rejectedReason || null,
          candidates: route.candidates || []
        });
        appendDebugItems(report.debug.travelPoints, route.points);
        appendDebugItems(report.debug.travelSegments, pointsToSegments(route.points));
        report.debug.reconstructedConnections.push([exitPoint, entryPoint]);
        routingPolylines.push({ layer: `${layer}-routing`, connectorType: "inter-diagonal-border-connector", points: route.points });
        appendItems(current.points, route.points.slice(1));
      } else if (diagonalPosition > 0) {
        report.routingFailures += 1;
        report.blockedDiagonalPassages += 1;
        report.invalidInternalShortcutsBlocked += 1;
        report.debug.blockedDiagonalPassages.push([exitPoint, entryPoint]);
        connected.push({ layer, diagonal: diagonalItems[0]?.diagonal ?? diagonalPosition, points: diagonalPath.points });
        appendItems(intraDiagonalPolylines, diagonalPath.intraDiagonalPolylines);
        return;
      }
      appendItems(current.points, diagonalPath.points.slice(1));
      appendItems(intraDiagonalPolylines, diagonalPath.intraDiagonalPolylines);
    });
    report.pathsBeforeCleanup = polylines.length;
    report.pathsAfterCleanup = connected.length;
    report.finalPoints = connected.reduce((sum, item) => sum + item.points.length, 0);
    return { polylines: connected, report, routingPolylines, intraDiagonalPolylines };
  }

  function groupByDiagonal(polylines) {
    const map = new Map();
    polylines.forEach((polyline) => {
      const key = polyline.diagonal ?? 0;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(polyline);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([, items]) => items.sort((a, b) => (a.index - b.index)));
  }

  function longestDiagonalIndex(diagonals) {
    let bestIndex = 0;
    let bestScore = -1;
    diagonals.forEach((items, index) => {
      const score = items.length;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
    return bestIndex;
  }

  function connectDiagonalModules(items, layer, report, options = {}) {
    const points = [];
    const intraDiagonalPolylines = [];
    let previousItem = null;
    items.forEach((item) => {
      if (!item.points.length) return;
      if (!points.length) {
        appendItems(points, item.points);
        previousItem = item;
        return;
      }
      const from = last(points);
      const to = item.points[0];
      if (!samePoint(from, to)) {
        const cutBoundary = options.cutBoundary || options.bounds;
        const shouldRouteCutConnector = options.routeBoundaryCutConnectors &&
          isBoundaryCutConnectorCandidate(previousItem, item, from, to, cutBoundary);
        if (shouldRouteCutConnector) {
          const cutRoute = cutGeneratedBorderRoute(from, to, cutBoundary, state.params.cutBorderStitchLength || 2, report);
          if (cutRoute.points.length > 1) {
            if (!samePoint(last(points), cutRoute.points[0])) points[points.length - 1] = cutRoute.points[0];
            appendItems(points, cutRoute.points.slice(1));
            intraDiagonalPolylines.push({ layer: `${layer}-cut-routing`, connectorType: "cut-generated-intra-diagonal-border-connector", points: cutRoute.points });
            report.cutPathsReconnected += 1;
          }
        } else {
        if (previousItem && previousItem.index !== item.index) {
          const connector = { layer: `${layer}-intra`, connectorType: "intra-diagonal-connector", points: [from, to] };
          intraDiagonalPolylines.push(connector);
          report.intraDiagonalConnectionsGenerated += 1;
          report.debug.intraDiagonalConnectors.push(connector.points);
        }
        points.push(to);
        }
      }
      appendItems(points, item.points.slice(1));
      previousItem = item;
    });
    return { points, intraDiagonalPolylines };
  }

  // Adaptive break distance for technical layers (level 0/1). Computed from the
  // distribution of real module-to-module gaps inside each diagonal so it works
  // at any scale/vectors. A normal step dominates the median; a gap left by
  // missing laser holes is a multiple of it and gets split instead of bridged.
  function technicalGapBreakDistance(diagonals) {
    const override = Number(state.params.technicalMaxTravelMm);
    if (override && override > 0) return override;
    const factor = Math.max(1, Number(state.params.technicalGapBreakFactor) || 2.5);
    const gaps = [];
    diagonals.forEach((items) => {
      for (let i = 1; i < items.length; i += 1) {
        const prev = items[i - 1].points;
        const cur = items[i].points;
        if (!prev || !prev.length || !cur || !cur.length) continue;
        if (items[i - 1].index === items[i].index) continue;
        const d = distance(last(prev), cur[0]);
        if (d > 0.0001) gaps.push(d);
      }
    });
    if (!gaps.length) return Infinity;
    gaps.sort((a, b) => a - b);
    const median = gaps[Math.floor(gaps.length / 2)];
    return Math.max(median * factor, state.params.minimumSegmentLength || 1);
  }

  // Technical join for level 0/1: keeps one polyline per diagonal (no
  // inter-diagonal routing), connects modules by index inside a diagonal, but
  // breaks the diagonal into a new polyline when the gap to the next module
  // exceeds the adaptive threshold, instead of forcing a long straight travel.
  function connectTechnicalDiagonals(polylines, layer) {
    const report = emptyReport();
    if (!polylines.length) return { polylines: [], report, routingPolylines: [], intraDiagonalPolylines: [] };
    const diagonals = groupByDiagonal(polylines);
    const breakDistance = technicalGapBreakDistance(diagonals);
    const output = [];
    const intraDiagonalPolylines = [];
    diagonals.forEach((items) => {
      const diagonalKey = items[0]?.diagonal ?? 0;
      let run = [];
      let previousItem = null;
      const flush = () => {
        const clean = removeConsecutiveDuplicates(run);
        if (clean.length > 1) output.push({ layer, diagonal: diagonalKey, points: clean });
        run = [];
      };
      items.forEach((item) => {
        if (!item.points || !item.points.length) return;
        if (!run.length) {
          appendItems(run, item.points);
          previousItem = item;
          return;
        }
        const from = last(run);
        const to = item.points[0];
        if (samePoint(from, to)) {
          appendItems(run, item.points.slice(1));
          previousItem = item;
          return;
        }
        if (distance(from, to) > breakDistance) {
          flush();
          appendItems(run, item.points);
          previousItem = item;
          return;
        }
        if (previousItem && previousItem.index !== item.index) {
          const connector = { layer: `${layer}-intra`, connectorType: "intra-diagonal-connector", points: [from, to] };
          intraDiagonalPolylines.push(connector);
          report.intraDiagonalConnectionsGenerated += 1;
          report.debug.intraDiagonalConnectors.push(connector.points);
        }
        run.push(to);
        appendItems(run, item.points.slice(1));
        previousItem = item;
      });
      flush();
    });
    report.pathsBeforeCleanup = polylines.length;
    report.pathsAfterCleanup = output.length;
    report.finalPoints = output.reduce((sum, item) => sum + item.points.length, 0);
    return { polylines: output, report, routingPolylines: [], intraDiagonalPolylines };
  }

  function perimeterRoute(exitPoint, entryPoint, bounds, options = {}) {
    const mode = state.params.travelPathMode || "Border Following";
    if (mode === "Straight" && !options.forceBorder && state.params.allowInternalShortcuts) {
      const points = resampleTravelPath([exitPoint, entryPoint], state.params.minimumTravelStitchLength);
      return { points, length: polylineLength(points), stitchStats: travelStitchStats(points) };
    }
    if (bounds.type === "polygon") {
      const route = polygonPerimeterRoute(exitPoint, entryPoint, bounds, options);
      let points = resampleTravelPath(route.points, state.params.minimumTravelStitchLength);
      if (mode === "Optimized" && !options.forceBorder && state.params.allowInternalShortcuts) {
        const straight = resampleTravelPath([exitPoint, entryPoint], state.params.minimumTravelStitchLength);
        if (polylineLength(straight) < polylineLength(points)) points = straight;
      }
      return { points, length: polylineLength(points), perimeterLength: route.length, stitchStats: travelStitchStats(points), direction: route.direction, candidates: route.candidates, valid: route.valid, projectedStart: route.projectedStart, projectedEnd: route.projectedEnd };
    }
    const a = projectToPerimeterLane(exitPoint, bounds);
    const b = projectToPerimeterLane(entryPoint, bounds);
    const clockwise = perimeterWalk(a, b, bounds, true);
    const counterClockwise = perimeterWalk(a, b, bounds, false);
    const laneRoute = choosePerimeterCandidate(clockwise, counterClockwise, bounds, options);
    const basePoints = [exitPoint, ...laneRoute.points, entryPoint].filter((point, index, items) => index === 0 || !samePoint(point, items[index - 1]));
    let points = resampleTravelPath(basePoints, state.params.minimumTravelStitchLength);
    if (mode === "Optimized" && !options.forceBorder && state.params.allowInternalShortcuts) {
      const straight = resampleTravelPath([exitPoint, entryPoint], state.params.minimumTravelStitchLength);
      if (polylineLength(straight) < polylineLength(points)) points = straight;
    }
    return { points, length: polylineLength(points), perimeterLength: laneRoute.length, stitchStats: travelStitchStats(points), direction: laneRoute.direction, candidates: laneRoute.candidates, valid: laneRoute.valid, projectedStart: stripSide(a), projectedEnd: stripSide(b) };
  }

  function choosePerimeterCandidate(clockwise, counterClockwise, bounds = null, options = {}) {
    clockwise.direction = "clockwise";
    counterClockwise.direction = "counter_clockwise";
    clockwise.valid = !options.validateCandidates || !bounds || validatePerimeterRoute(clockwise.points, bounds);
    counterClockwise.valid = !options.validateCandidates || !bounds || validatePerimeterRoute(counterClockwise.points, bounds);
    const candidates = [
      { direction: "clockwise", length: clockwise.length, valid: clockwise.valid, rejectedReason: clockwise.valid ? null : "invalid_perimeter_route" },
      { direction: "counter_clockwise", length: counterClockwise.length, valid: counterClockwise.valid, rejectedReason: counterClockwise.valid ? null : "invalid_perimeter_route" }
    ];
    const finish = (selected, reason = "selected") => {
      selected.candidates = candidates.map((candidate) => ({
        ...candidate,
        chosen: candidate.direction === selected.direction,
        rejectedReason: candidate.direction === selected.direction ? null : candidate.rejectedReason || reason
      }));
      selected.valid = Boolean(selected.valid);
      return selected;
    };
    if (options.preferredDirection) {
      const preferred = options.preferredDirection === "clockwise" ? clockwise : counterClockwise;
      const opposite = options.preferredDirection === "clockwise" ? counterClockwise : clockwise;
      const selected = preferred.valid ? preferred : opposite.valid ? opposite : preferred;
      return finish(selected, preferred.valid ? "manual_direction_not_selected" : "preferred_invalid");
    }
    const routingStrategy = state.params.travelRoutingStrategy || "shortest_valid";
    if (routingStrategy === "clockwise") return finish(clockwise, "manual_clockwise");
    if (routingStrategy === "counter_clockwise") return finish(counterClockwise, "manual_counter_clockwise");
    if (clockwise.valid && counterClockwise.valid) return finish(clockwise.length <= counterClockwise.length ? clockwise : counterClockwise, "longer_than_selected");
    if (clockwise.valid) return finish(clockwise, "counter_clockwise_invalid");
    if (counterClockwise.valid) return finish(counterClockwise, "clockwise_invalid");

    const strategy = state.params.travelSideStrategy || "auto";
    if (strategy === "clockwise") {
      return finish(clockwise, "legacy_clockwise");
    }
    if (strategy === "counter_clockwise") {
      return finish(counterClockwise, "legacy_counter_clockwise");
    }
    if (strategy === "prefer_top" || strategy === "prefer_bottom" || strategy === "prefer_left" || strategy === "prefer_right") {
      const side = strategy.replace("prefer_", "");
      const cwScore = routeSideScore(clockwise.points, side);
      const ccwScore = routeSideScore(counterClockwise.points, side);
      if (cwScore !== ccwScore) {
        const selected = cwScore > ccwScore ? clockwise : counterClockwise;
        return finish(selected, "side_preference");
      }
    }
    const selected = clockwise.length <= counterClockwise.length ? clockwise : counterClockwise;
    return finish(selected, "no_valid_candidate");
  }

  function routeSideScore(points, side) {
    const bounds = measurePointSets([points], { x: 0, y: 0, width: 1, height: 1 });
    if (side === "top") return -bounds.minY;
    if (side === "bottom") return bounds.maxY;
    if (side === "left") return -bounds.minX;
    if (side === "right") return bounds.maxX;
    return 0;
  }

  function polygonPerimeterRoute(exitPoint, entryPoint, boundary, options = {}) {
    const graph = perimeterGraph(boundary.points);
    const a = projectToPerimeterGraph(exitPoint, graph);
    const b = projectToPerimeterGraph(entryPoint, graph);
    const forward = walkPerimeterGraph(graph, a, b, true);
    const backward = walkPerimeterGraph(graph, a, b, false);
    const clockwise = { points: forward, length: polylineLength(forward), direction: "clockwise" };
    const counterClockwise = { points: backward, length: polylineLength(backward), direction: "counter_clockwise" };
    const laneRoute = choosePerimeterCandidate(clockwise, counterClockwise, boundary, options);
    return {
      points: [exitPoint, ...laneRoute.points, entryPoint].filter((point, index, items) => index === 0 || !samePoint(point, items[index - 1])),
      length: polylineLength(laneRoute.points),
      direction: laneRoute.direction,
      candidates: laneRoute.candidates,
      valid: laneRoute.valid,
      projectedStart: a.point,
      projectedEnd: b.point
    };
  }

  function perimeterGraph(points) {
    const loop = normalizePerimeterLoop(points, state.params.perimeterCloseTolerance || 0.1) || points;
    const cumulative = [0];
    for (let index = 0; index < loop.length - 1; index += 1) {
      cumulative.push(cumulative[index] + distance(loop[index], loop[index + 1]));
    }
    return { points: loop, cumulative, length: last(cumulative), winding: polygonArea(loop) >= 0 ? "clockwise" : "counter_clockwise" };
  }

  function projectToPerimeterGraph(point, graph) {
    let best = null;
    for (let index = 0; index < graph.points.length - 1; index += 1) {
      const projected = closestPointOnSegment(point, graph.points[index], graph.points[index + 1]);
      const segmentOffset = distance(graph.points[index], projected);
      const along = graph.cumulative[index] + segmentOffset;
      const candidate = { point: projected, index, distance: distance(point, projected), along };
      if (!best || candidate.distance < best.distance) best = candidate;
    }
    return best;
  }

  function walkPerimeterGraph(graph, a, b, forward) {
    if (!a || !b || graph.length <= 0) return [];
    const route = [a.point];
    if (Math.abs(a.along - b.along) < 0.001) return route;
    let cursor = a.index;
    let guard = 0;
    if (forward) {
      while (guard < graph.points.length + 2) {
        const nextVertexIndex = (cursor + 1) % (graph.points.length - 1);
        const nextAlong = graph.cumulative[cursor + 1] ?? graph.length;
        if (isAlongBetweenForward(nextAlong, a.along, b.along, graph.length)) route.push(graph.points[nextVertexIndex]);
        if (isAlongBetweenForward(b.along, a.along, nextAlong, graph.length)) break;
        cursor = nextVertexIndex;
        guard += 1;
      }
    } else {
      while (guard < graph.points.length + 2) {
        const prevVertexIndex = cursor;
        const prevAlong = graph.cumulative[prevVertexIndex];
        if (isAlongBetweenBackward(prevAlong, a.along, b.along, graph.length)) route.push(graph.points[prevVertexIndex]);
        if (isAlongBetweenBackward(b.along, a.along, prevAlong, graph.length)) break;
        cursor = (cursor - 1 + graph.points.length - 1) % (graph.points.length - 1);
        guard += 1;
      }
    }
    route.push(b.point);
    return route.filter((point, index, items) => index === 0 || !samePoint(point, items[index - 1]));
  }

  function isAlongBetweenForward(value, start, end, total) {
    const distanceToValue = (value - start + total) % total;
    const distanceToEnd = (end - start + total) % total;
    return distanceToValue > 0.001 && distanceToValue < distanceToEnd - 0.001;
  }

  function isAlongBetweenBackward(value, start, end, total) {
    const distanceToValue = (start - value + total) % total;
    const distanceToEnd = (start - end + total) % total;
    return distanceToValue > 0.001 && distanceToValue < distanceToEnd - 0.001;
  }

  function projectToPolygonPath(point, points) {
    let best = null;
    for (let index = 0; index < points.length - 1; index += 1) {
      const projected = closestPointOnSegment(point, points[index], points[index + 1]);
      const candidate = { point: projected, index, distance: distance(point, projected) };
      if (!best || candidate.distance < best.distance) best = candidate;
    }
    return best;
  }

  function polygonWalk(a, b, points, forward) {
    const route = [a.point];
    if (a.index === b.index) {
      route.push(b.point);
      return route;
    }
    let index = a.index;
    let guard = 0;
    while (index !== b.index && guard < points.length + 2) {
      index = forward ? (index + 1) % (points.length - 1) : (index - 1 + points.length - 1) % (points.length - 1);
      route.push(points[index]);
      guard += 1;
    }
    route.push(b.point);
    return route;
  }

  function validatePerimeterRoute(points, bounds) {
    if (points.length < 2) return false;
    const tolerance = Math.max(0.1, state.params.perimeterLaneTolerance || 1);
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const mid = interpolate(a, b, 0.5);
      if (bounds.type === "polygon") {
        if (pointInPolygon(mid, bounds.points) && distanceToBoundary(mid, bounds) > tolerance) return false;
      } else if (isInside(mid, bounds, -0.001)) {
        const nearEdge = Math.min(
          Math.abs(mid.x - bounds.minX),
          Math.abs(mid.x - bounds.maxX),
          Math.abs(mid.y - bounds.minY),
          Math.abs(mid.y - bounds.maxY)
        );
        if (nearEdge > tolerance) return false;
      }
    }
    return true;
  }

  function resampleTravelPath(points, minimumLength) {
    const result = [points[0]];
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const length = distance(a, b);
      const parts = Math.max(1, Math.floor(length / Math.max(0.1, minimumLength)));
      for (let step = 1; step <= parts; step += 1) {
        result.push({
          x: a.x + (b.x - a.x) * (step / parts),
          y: a.y + (b.y - a.y) * (step / parts)
        });
      }
    }
    return result.filter((point, index, items) => index === 0 || !samePoint(point, items[index - 1]));
  }

  function travelStitchStats(points) {
    const lengths = [];
    for (let index = 0; index < points.length - 1; index += 1) lengths.push(distance(points[index], points[index + 1]));
    const total = lengths.reduce((sum, value) => sum + value, 0);
    return {
      total,
      count: lengths.length,
      average: lengths.length ? total / lengths.length : 0,
      min: lengths.length ? Math.min(...lengths) : null,
      max: lengths.length ? Math.max(...lengths) : null
    };
  }

  function combinedTravelStats(polylines) {
    const lengths = [];
    polylines.forEach((polyline) => {
      for (let index = 0; index < polyline.points.length - 1; index += 1) {
        lengths.push(distance(polyline.points[index], polyline.points[index + 1]));
      }
    });
    const total = lengths.reduce((sum, value) => sum + value, 0);
    return {
      total,
      average: lengths.length ? total / lengths.length : 0,
      min: lengths.length ? Math.min(...lengths) : null,
      max: lengths.length ? Math.max(...lengths) : null
    };
  }

  function laneRect(bounds) {
    const lane = Math.max(0, state.params.perimeterLaneWidth || 0);
    return {
      minX: bounds.minX - lane,
      minY: bounds.minY - lane,
      maxX: bounds.maxX + lane,
      maxY: bounds.maxY + lane
    };
  }

  function projectToPerimeterLane(point, bounds) {
    const rect = laneRect(bounds);
    const candidates = [
      { x: clamp(point.x, rect.minX, rect.maxX), y: rect.minY, side: "top" },
      { x: rect.maxX, y: clamp(point.y, rect.minY, rect.maxY), side: "right" },
      { x: clamp(point.x, rect.minX, rect.maxX), y: rect.maxY, side: "bottom" },
      { x: rect.minX, y: clamp(point.y, rect.minY, rect.maxY), side: "left" }
    ];
    return candidates.reduce((best, candidate) => distance(point, candidate) < distance(point, best) ? candidate : best, candidates[0]);
  }

  function perimeterWalk(a, b, bounds, clockwise) {
    const rect = laneRect(bounds);
    const corners = clockwise
      ? [
        { x: rect.maxX, y: rect.minY, side: "top" },
        { x: rect.maxX, y: rect.maxY, side: "right" },
        { x: rect.minX, y: rect.maxY, side: "bottom" },
        { x: rect.minX, y: rect.minY, side: "left" }
      ]
      : [
        { x: rect.minX, y: rect.minY, side: "top" },
        { x: rect.minX, y: rect.maxY, side: "left" },
        { x: rect.maxX, y: rect.maxY, side: "bottom" },
        { x: rect.maxX, y: rect.minY, side: "right" }
      ];
    const points = [stripSide(a)];
    let guard = 0;
    let currentSide = a.side;
    while (currentSide !== b.side && guard < 8) {
      const corner = corners.find((item) => item.side === currentSide);
      points.push(stripSide(corner));
      currentSide = nextSide(currentSide, clockwise);
      guard += 1;
    }
    points.push(stripSide(b));
    return { points, length: polylineLength(points) };
  }

  function nextSide(side, clockwise) {
    const order = ["top", "right", "bottom", "left"];
    const index = order.indexOf(side);
    const next = clockwise ? (index + 1) % order.length : (index + order.length - 1) % order.length;
    return order[next];
  }

  function stripSide(point) {
    return { x: point.x, y: point.y };
  }

  function polylineLength(points) {
    let total = 0;
    for (let index = 0; index < points.length - 1; index += 1) total += distance(points[index], points[index + 1]);
    return total;
  }

  function weightedAverage(currentAverage, currentCount, nextAverage, nextCount) {
    if (!nextCount) return currentAverage;
    const totalCount = currentCount + nextCount;
    return totalCount ? ((currentAverage * currentCount) + (nextAverage * nextCount)) / totalCount : 0;
  }

  function minNullable(current, value) {
    if (value == null) return current;
    return current == null ? value : Math.min(current, value);
  }

  function maxNullable(current, value) {
    if (value == null) return current;
    return current == null ? value : Math.max(current, value);
  }

  function buildPolylineGroup(id, polylines, className) {
    const group = createEl("g", { id, class: className });
    group.style.display = state.layers[id] === false ? "none" : "";
    polylines.forEach((polyline) => {
      group.appendChild(createEl("polyline", {
        points: pointsAttr(polyline.points),
        class: "module-path",
        fill: "none",
        stroke: colorForLayer(polyline.layer),
        "stroke-width": "0.3",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
    });
    return group;
  }

  // Original imported source tracings (1:1, not tiled), all levels in one black group.
  // Used only in the "completo" export as a distinct reference layer.
  function buildOriginalSourcesGroup() {
    const group = createEl("g", { id: "original-sources", class: "layer-original", stroke: "#000000", fill: "none" });
    ["level0", "level1", "level2", "holes"].forEach((key) => {
      const source = state.sources[key];
      if (!source || !Array.isArray(source.elements)) return;
      source.elements.forEach((element) => {
        if (!element.points || element.points.length < 2) return;
        const tag = element.closed ? "polygon" : "polyline";
        group.appendChild(createEl(tag, {
          points: pointsAttr(element.points),
          class: "original-path",
          fill: "none",
          stroke: "#000000",
          "stroke-width": "0.3",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }));
      });
    });
    return group;
  }

  // Loaded cartamodello (panel DXF/SVG) as one export layer, all lines a single
  // distinct color (not used by the other layers). Used only in the "completo" export.
  function buildCartamodelloGroup(color = "#0057ff") {
    const group = createEl("g", { id: "cartamodello", class: "layer-cartamodello", stroke: color, fill: "none" });
    const source = state.sources.panel;
    if (!source || !Array.isArray(source.elements)) return group;
    source.elements.forEach((element) => {
      if (!element.points || element.points.length < 2) return;
      const tag = element.closed ? "polygon" : "polyline";
      group.appendChild(createEl(tag, {
        points: pointsAttr(element.points),
        class: "cartamodello-path",
        fill: "none",
        stroke: color,
        "stroke-width": "0.3",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
    });
    return group;
  }

  function colorForLayer(layer) {
    if (layer === "level0") return "#005f27";
    if (layer === "level2") return "#1c6f68";
    if (layer === "holes") return "#9d9100";
    return "#c51722";
  }

  function pointsAttr(points) {
    return points.map((point) => `${round(point.x)},${round(point.y)}`).join(" ");
  }

  function buildTravelPolylines(placements, levelName) {
    const bounds = formatBounds();
    const corridorY = bounds.y - 28;
    const polylines = [];
    for (let diagonal = 0; diagonal < placements.length - 1; diagonal += 1) {
      const current = placements[diagonal][placements[diagonal].length - 1];
      const next = placements[diagonal + 1][0];
      polylines.push({
        layer: `${levelName}-travel`,
        points: [
          { x: current.anchorX, y: current.anchorY },
          { x: current.anchorX, y: corridorY },
          { x: next.anchorX, y: corridorY },
          { x: next.anchorX, y: next.anchorY }
        ]
      });
    }
    return polylines;
  }

  function buildTravelLayer(polylines) {
    const group = createEl("g", { id: "travel", class: "layer-travel" });
    group.style.display = state.layers.travel && state.layers.travelPathVisualization ? "" : "none";
    polylines.forEach((polyline) => {
      group.appendChild(createEl("polyline", {
        points: pointsAttr(polyline.points),
        class: polyline.connectorType || "inter-diagonal-border-connector",
        fill: "none",
        stroke: "#7856a1",
        "stroke-width": "0.5"
      }));
    });
    return group;
  }

  function buildBoundaryLayer(patternBounds, decorativeBounds = patternBounds, references = {}) {
    const group = createEl("g", { id: "boundary", class: "layer-boundary" });
    group.style.display = state.layers.boundary ? "" : "none";
    if (state.layers.patternPreview) {
      group.appendChild(boundaryElement(patternBounds, {
        class: "original-pattern-contour",
        fill: "none",
        stroke: "#222",
        "stroke-width": "1"
      }));
    }
    if (state.layers.decorativeBoundary && decorativeBounds) {
      group.appendChild(boundaryElement(decorativeBounds, {
        class: "decorative-boundary",
        fill: "none",
        stroke: "#0c7c7c",
        "stroke-width": "0.8",
        "stroke-dasharray": "4 3"
      }));
    }
    const referenceStyles = [
      ["laser", "#9d9100", "6 3"],
      ["placement", "#005f27", "5 3"],
      ["satin", "#b8841f", "7 4"],
      ["cord", "#8a5a00", "2 2"]
    ];
    referenceStyles.forEach(([key, color, dash]) => {
      if (!references[key]) return;
      group.appendChild(boundaryElement(references[key], {
        class: `${key}-reference`,
        fill: "none",
        stroke: color,
        "stroke-width": "0.55",
        "stroke-dasharray": dash
      }));
    });
    return group;
  }

  function buildPanelShapeOverlayLayer() {
    const source = state.sources.panel;
    if (!state.params.showPanelShapeOverlay || !source?.elements?.length) return null;
    const group = createEl("g", {
      id: "panel-shape-overlay",
      class: "panel-shape-overlay",
      opacity: clamp(state.params.panelShapeOverlayOpacity ?? 0.45, 0, 1),
      "data-preview-only": "true"
    });
    const useOriginalColors = Boolean(state.params.panelShapeOverlayUseOriginalColors);
    const fallbackColor = state.params.panelShapeOverlayColor || "#e52421";
    source.elements.forEach((element) => {
      if (!element.points?.length) return;
      const stroke = useOriginalColors && isPaintActive(element.stroke)
        ? element.stroke
        : (useOriginalColors && isPaintActive(element.fill) ? element.fill : fallbackColor);
      const fill = useOriginalColors && element.closed && isPaintActive(element.fill)
        ? element.fill
        : "none";
      group.appendChild(createEl(element.closed && fill !== "none" ? "polygon" : "polyline", {
        points: pointsAttr(element.points),
        fill,
        stroke,
        "stroke-width": "0.7",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "vector-effect": "non-scaling-stroke"
      }));
    });
    return group;
  }

  function appendPanelShapeOverlayIfNeeded(target) {
    const overlay = buildPanelShapeOverlayLayer();
    if (overlay) target.appendChild(overlay);
  }

  function cloneWithoutPreviewOnly(svg) {
    const clone = svg.cloneNode(true);
    clone.querySelectorAll("[data-preview-only='true']").forEach((node) => node.remove());
    return clone;
  }

  function boundaryElement(boundary, attrs) {
    if (boundary.type === "polygon") {
      return createEl("polyline", { ...attrs, points: pointsAttr(boundary.points) });
    }
    return createEl("rect", {
      ...attrs,
      x: boundary.x,
      y: boundary.y,
      width: boundary.width,
      height: boundary.height
    });
  }

  function buildSatinLayer(patternBounds, decorativeBounds = patternBounds, cordBounds = patternBounds) {
    const group = createEl("g", { id: "satin-border", class: "layer-satin" });
    group.style.display = state.layers.satin && state.layers.borderPreview ? "" : "none";
    if (!state.params.enableZigZagBorder) return group;
    if (patternBounds && decorativeBounds && state.params.patternBorderOffset > 0) {
      group.appendChild(boundaryElement(patternBounds, {
        class: "satin-region satin-outer",
        fill: "none",
        stroke: "#b8841f",
        "stroke-width": Math.max(0.2, state.params.satinWidth || 1),
        "stroke-opacity": "0.45"
      }));
      group.appendChild(boundaryElement(decorativeBounds, {
        class: "satin-region satin-inner",
        fill: "none",
        stroke: "#d2a447",
        "stroke-width": "0.4",
        "stroke-dasharray": "2 2"
      }));
    }
    const zigZag = buildZigZagBorder(cordBounds);
    group.appendChild(createEl("polyline", {
      points: pointsAttr(zigZag.points),
      class: "zig-zag-border outer-cord",
      fill: "none",
      stroke: "#b8841f",
      "stroke-width": "0.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));
    group.dataset.borderLength = String(zigZag.borderLength);
    group.dataset.zigZagPeaks = String(zigZag.peaks.length);
    return group;
  }

  function buildZigZagBorder(bounds) {
    if (bounds.type === "polygon") return buildPolygonZigZagBorder(bounds);
    const density = Math.max(0.5, state.params.cordDensity || state.params.zigZagDensity || 3);
    const width = Math.max(0, state.params.cordWidth || state.params.zigZagWidth || 0);
    const mode = state.params.borderOffsetMode || "center";
    const baseOffset = mode === "inside" ? width / 2 : mode === "outside" ? -width / 2 : 0;
    const insetBounds = {
      minX: bounds.minX + baseOffset,
      minY: bounds.minY + baseOffset,
      maxX: bounds.maxX - baseOffset,
      maxY: bounds.maxY - baseOffset
    };
    const edges = [
      [{ x: insetBounds.minX, y: insetBounds.minY }, { x: insetBounds.maxX, y: insetBounds.minY }, { x: 0, y: 1 }],
      [{ x: insetBounds.maxX, y: insetBounds.minY }, { x: insetBounds.maxX, y: insetBounds.maxY }, { x: -1, y: 0 }],
      [{ x: insetBounds.maxX, y: insetBounds.maxY }, { x: insetBounds.minX, y: insetBounds.maxY }, { x: 0, y: -1 }],
      [{ x: insetBounds.minX, y: insetBounds.maxY }, { x: insetBounds.minX, y: insetBounds.minY }, { x: 1, y: 0 }]
    ];
    const points = [];
    const peaks = [];
    const valleys = [];
    let alternator = 0;
    edges.forEach(([a, b, normal]) => {
      const length = distance(a, b);
      const count = Math.max(1, Math.ceil(length / density));
      for (let index = 0; index <= count; index += 1) {
        if (points.length && index === 0) continue;
        const t = index / count;
        const center = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        const sign = alternator % 2 === 0 ? 1 : -1;
        const point = {
          x: center.x + normal.x * sign * width / 2,
          y: center.y + normal.y * sign * width / 2
        };
        points.push(point);
        (sign > 0 ? peaks : valleys).push(point);
        alternator += 1;
      }
    });
    if (points.length && !samePoint(points[0], last(points))) points.push(points[0]);
    return {
      points,
      peaks,
      valleys,
      borderLength: 2 * ((insetBounds.maxX - insetBounds.minX) + (insetBounds.maxY - insetBounds.minY)),
      width,
      density
    };
  }

  function buildPolygonZigZagBorder(boundary) {
    const density = Math.max(0.5, state.params.cordDensity || state.params.zigZagDensity || 3);
    const width = Math.max(0, state.params.cordWidth || state.params.zigZagWidth || 0);
    const center = { x: (boundary.minX + boundary.maxX) / 2, y: (boundary.minY + boundary.maxY) / 2 };
    const resampled = resampleClosedPolyline(boundary.points, density);
    const points = [];
    const peaks = [];
    const valleys = [];
    resampled.forEach((point, index) => {
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      const length = Math.hypot(dx, dy) || 1;
      const sign = index % 2 === 0 ? 1 : -1;
      const zig = {
        x: point.x + (dx / length) * sign * width / 2,
        y: point.y + (dy / length) * sign * width / 2
      };
      points.push(zig);
      (sign > 0 ? peaks : valleys).push(zig);
    });
    if (points.length && !samePoint(points[0], last(points))) points.push(points[0]);
    return {
      points,
      peaks,
      valleys,
      borderLength: polylineLength(boundary.points),
      width,
      density
    };
  }

  function resampleClosedPolyline(points, spacing) {
    const output = [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const length = distance(a, b);
      const count = Math.max(1, Math.ceil(length / spacing));
      for (let step = 0; step < count; step += 1) {
        const t = step / count;
        output.push(interpolate(a, b, t));
      }
    }
    return output;
  }

  function buildAnchorsLayer(placementsByLevel) {
    const group = createEl("g", { id: "anchors", class: "layer-anchors" });
    group.style.display = state.layers.anchors ? "" : "none";
    placementsByLevel.flat(2).forEach((place) => {
      group.appendChild(createEl("circle", { cx: round(place.anchorX), cy: round(place.anchorY), r: 3, fill: "#0d5f9a" }));
    });
    return group;
  }

  function buildDebugLayer(report, bounds, decorativeBounds = bounds, options = {}) {
    const group = createEl("g", { id: "cleanup-debug", class: "layer-debug-cleanup" });
    const coverageOnly = Boolean(options.coverageOnly);
    const showCoverageDebug = (state.layers.debugCoverageMask && state.params.coverageMaskPreview) ||
      state.layers.debugCoverageMap ||
      state.layers.debugCoveredTravelOptimizer;
    group.style.display = (state.layers.debugCleanup || showCoverageDebug) ? "" : "none";
    if (coverageOnly) {
      if (state.layers.debugCoverageMask && state.params.coverageMaskPreview) appendCoverageMask(group, report.debug.coverageMaskImages, report.debug.coverageMaskRuns);
      return group;
    }
    if (state.layers.debugCleanup) {
    if (state.layers.debugValidSegments) appendDebugSegments(group, report.debug.validSegments, "#3a8f3a", 0.55);
    if (state.layers.debugRemovedSegments) appendDebugSegments(group, report.debug.removedSegments, "#e08800", 0.8);
    if (state.layers.debugIntraDiagonalConnectors) appendDebugSegments(group, report.debug.intraDiagonalConnectors.flatMap(pointsToSegments), "#4b8cff", 0.8);
    if (state.layers.debugOriginalPoints) appendDebugPoints(group, report.debug.originalPoints, "#666", 0.8);
    if (state.layers.debugDeletedPoints) appendDebugPoints(group, report.debug.deletedPoints, "#d00", 2.2);
    if (state.layers.debugMovedPoints) appendDebugPoints(group, report.debug.movedPoints, "#1f78d1", 2.2);
    if (state.layers.debugIntersectionPoints) appendDebugPoints(group, report.debug.intersectionPoints, "#8b2bd3", 2.4);
    if (state.layers.debugRoutingPaths) {
      appendDebugSegments(group, report.debug.routingPaths.flatMap(pointsToSegments), "#006fc9", 1.2);
      appendDebugSegments(group, report.debug.cutGeneratedRoutes.flatMap(pointsToSegments), "#d14a00", 1.1);
    }
    if (state.layers.debugTravelPoints) {
      appendDebugPoints(group, report.debug.cutRouteExitPoints, "#d14a00", 2.4);
      appendDebugPoints(group, report.debug.cutRouteReentryPoints, "#6b2bd3", 2.4);
    }
    if (state.layers.debugTravelPoints) appendDebugPoints(group, report.debug.travelPoints, "#004f9f", 1.8);
    appendDebugPoints(group, report.debug.laserHolesAccepted, "#00a56a", 1.8);
    appendDebugPoints(group, report.debug.laserHolesRemoved, "#d22", 2.2);
    appendDebugPoints(group, report.debug.laserHolesIncomplete, "#ff8a00", 2.2);
    appendDebugSegments(group, report.debug.holeMatches, "#00a56a", 0.6);
    appendDebugSegments(group, report.debug.level0GeneratedOutlines.flatMap(pointsToSegments), "#005f27", 0.7);
    appendDebugSegments(group, report.debug.level0TravelPaths.flatMap(pointsToSegments), "#37a06b", 0.8);
    }
    if (state.layers.debugCoverageMask && state.params.coverageMaskPreview) appendCoverageMask(group, report.debug.coverageMaskImages, report.debug.coverageMaskRuns);
    if (state.layers.debugCoverageMap) {
      appendDebugPoints(group, report.debug.coverageMapCells, "#d8d8d8", 0.7);
      appendDebugPoints(group, report.debug.coverageHeatmap, "#7a4fd1", 1.1);
      appendDebugSegments(group, report.debug.coverageTravelPaths.flatMap(pointsToSegments), "#00a56a", 1.4);
      appendDebugSegments(group, report.debug.visibleTravelPaths.flatMap(pointsToSegments), "#d22", 1.4);
      appendDebugPoints(group, report.debug.coverageFailures, "#d22", 2.8);
    }
    if (state.layers.debugCoveredTravelOptimizer) {
      appendDebugSegments(group, report.debug.coverageRawRoutes.flatMap(pointsToSegments), "#1f78d1", 0.75);
      appendDebugSegments(group, report.debug.coverageOptimizedRoutes.flatMap(pointsToSegments), "#d14fd1", 1.1);
      appendDebugSegments(group, report.debug.coverageUncoveredSegments, "#d22", 1.6);
      appendDebugSegments(group, report.debug.coverageLowConfidenceSegments, "#e0b000", 1.2);
      appendDebugPoints(group, report.debug.coverageDirectionChanges, "#111", 1.8);
      appendDebugPoints(group, report.debug.coverageSimplifiedPoints, "#1f78d1", 1);
      appendDebugPoints(group, report.debug.coverageResampledPoints, "#d14fd1", 0.9);
    }
    if (state.layers.debugCleanup) {
    appendDebugSegments(group, report.debug.selectedRoutingContour.flatMap(pointsToSegments), "#111", 1.4);
    appendDebugSegments(group, report.debug.blockedDiagonalPassages, "#d22", 1.1);
    if (state.layers.debugZigZagPeaks) {
      appendDebugPoints(group, report.debug.zigZagPeaks, "#d17a00", 2);
      appendDebugPoints(group, report.debug.zigZagValleys, "#7a4fd1", 2);
    }
    if (state.layers.debugExitEntryPoints) {
      appendDebugPoints(group, report.debug.exitPoints, "#111", 3);
      appendDebugPoints(group, report.debug.entryPoints, "#00a56a", 3);
    }
    if (state.layers.debugPerimeterLane) {
      const lane = laneRect(bounds);
      group.appendChild(createEl("rect", {
        class: "perimeter-lane",
        x: lane.minX,
        y: lane.minY,
        width: lane.maxX - lane.minX,
        height: lane.maxY - lane.minY,
        fill: "none",
        stroke: "#006fc9",
        "stroke-width": "0.7",
        "stroke-dasharray": "8 4"
      }));
    }
    if (state.layers.debugScaleBboxes) {
      appendScaleBboxes(group, bounds);
      appendGlobalOffsetBboxes(group, report.globalPatternOffset);
    }
    if (state.layers.debugBoundary) {
      group.appendChild(boundaryElement(bounds, {
        fill: "none",
        stroke: "#000",
        "stroke-width": "1.4",
        "stroke-dasharray": "4 4"
      }));
      group.appendChild(boundaryElement(decorativeBounds, {
        fill: "none",
        stroke: "#0c7c7c",
        "stroke-width": "1",
        "stroke-dasharray": "2 3"
      }));
    }
    }
    return group;
  }

  function appendScaleBboxes(group, panelBounds) {
    group.appendChild(createEl("rect", {
      x: panelBounds.x,
      y: panelBounds.y,
      width: panelBounds.width,
      height: panelBounds.height,
      fill: "none",
      stroke: "#111",
      "stroke-width": "1",
      "stroke-dasharray": "2 6"
    }));
    const source = state.sources.level1;
    if (!source) return;
    group.appendChild(createEl("rect", {
      x: source.bounds.minX,
      y: source.bounds.minY,
      width: source.bounds.width,
      height: source.bounds.height,
      fill: "none",
      stroke: "#00a56a",
      "stroke-width": "1"
    }));
    const test = state.scaleTestReport;
    if (!test) return;
    group.appendChild(createEl("rect", {
      x: source.bounds.minX,
      y: source.bounds.minY,
      width: test.exportedModuleBboxWidthMm,
      height: test.exportedModuleBboxHeightMm,
      fill: "none",
      stroke: "#d22",
      "stroke-width": "1",
      "stroke-dasharray": "5 3"
    }));
  }

  function appendGlobalOffsetBboxes(group, offsetReport) {
    if (!offsetReport?.before || !offsetReport?.after) return;
    group.appendChild(createEl("rect", {
      x: offsetReport.before.minX,
      y: offsetReport.before.minY,
      width: offsetReport.before.width,
      height: offsetReport.before.height,
      fill: "none",
      stroke: "#7b7b7b",
      "stroke-width": "0.8",
      "stroke-dasharray": "6 3"
    }));
    group.appendChild(createEl("rect", {
      x: offsetReport.after.minX,
      y: offsetReport.after.minY,
      width: offsetReport.after.width,
      height: offsetReport.after.height,
      fill: "none",
      stroke: "#e04f00",
      "stroke-width": "1",
      "stroke-dasharray": "2 2"
    }));
  }

  function pointsToSegments(points) {
    const segments = [];
    for (let index = 0; index < points.length - 1; index += 1) segments.push([points[index], points[index + 1]]);
    return segments;
  }

  function appendDebugSegments(group, segments, color, width) {
    segments.slice(0, 5000).forEach(([a, b]) => {
      group.appendChild(createEl("line", {
        x1: round(a.x),
        y1: round(a.y),
        x2: round(b.x),
        y2: round(b.y),
        stroke: color,
        "stroke-width": width
      }));
    });
  }

  function appendCoverageMask(group, images, runs = []) {
    if (!images?.length && !runs?.length) return;
    const maskGroup = createEl("g", {
      id: "coverage-mask-preview",
      class: "coverage-mask-preview",
      opacity: clamp(state.params.coverageMaskOpacity ?? 0.38, 0.05, 0.9)
    });
    if (images?.length) {
      const image = images[0];
      maskGroup.appendChild(createEl("image", {
        x: round(image.x),
        y: round(image.y),
        width: round(image.width),
        height: round(image.height),
        href: image.href,
        preserveAspectRatio: "none"
      }));
      group.appendChild(maskGroup);
      return;
    }
    const maxRuns = 12000;
    const step = Math.max(1, Math.ceil(runs.length / maxRuns));
    runs.forEach((run, index) => {
      if (index % step !== 0) return;
      maskGroup.appendChild(createEl("rect", {
        x: round(run.x),
        y: round(run.y),
        width: round(run.width),
        height: round(run.height),
        fill: "#000"
      }));
    });
    group.appendChild(maskGroup);
  }

  function appendDebugPoints(group, points, color, radius) {
    points.slice(0, 5000).forEach((point) => {
      group.appendChild(createEl("circle", {
        cx: round(point.x),
        cy: round(point.y),
        r: radius,
        fill: color,
        stroke: "none"
      }));
    });
  }

  function renderStats(report) {
    const min = report.minLengthFound === null ? "n/a" : `${round(report.minLengthFound)} mm`;
    const holesInside = `${report.laserHolesAccepted || 0}/${report.laserHolesTotal || 0}`;
    const coverage = `${round(report.coverageMapCoveragePercent || 0)}%`;
    const routingFailures = Number(report.routingFailures || 0) + Number(report.level0CoverageBrokenPaths || 0);
    statsPanel.innerHTML = `
      <details class="stats-accordion">
        <summary>
          <span>Cleanup stats</span>
          <strong>${report.finalPoints || 0} pts</strong>
        </summary>
        <dl>
          <dt>Original points</dt><dd>${report.originalPoints || 0}</dd>
          <dt>Final points</dt><dd>${report.finalPoints || 0}</dd>
          <dt>Deleted points</dt><dd>${report.deletedPoints || 0}</dd>
          <dt>Moved points</dt><dd>${report.movedPoints || 0}</dd>
          <dt>Intersections</dt><dd>${report.intersectionsCreated || 0}</dd>
          <dt>Min length found</dt><dd>${min}</dd>
          <dt>Routing failures</dt><dd>${routingFailures}</dd>
          <dt>Laser holes inside</dt><dd>${holesInside}</dd>
          <dt>Level 0 routes</dt><dd>${report.level0CoverageRoutes || 0}</dd>
          <dt>Coverage map</dt><dd>${coverage}</dd>
        </dl>
      </details>
    `;
    return;
    const unit = state.unitReport;
    const pattern = unit?.patternShape;
    const template = unit?.template;
    const level1 = unit?.sources?.level1;
    const level2 = unit?.sources?.level2;
    const scaleTest = state.scaleTestReport;
    statsPanel.innerHTML = `
      <h2>Cleanup stats</h2>
      <dl>
        <dt>Original points</dt><dd>${report.originalPoints}</dd>
        <dt>Final points</dt><dd>${report.finalPoints}</dd>
        <dt>Deleted points</dt><dd>${report.deletedPoints}</dd>
        <dt>Moved points</dt><dd>${report.movedPoints}</dd>
        <dt>Intersections</dt><dd>${report.intersectionsCreated}</dd>
        <dt>Diagonals generated</dt><dd>${state.params.diagonalCount}</dd>
        <dt>Modules per diagonal</dt><dd>${state.params.modulesPerDiagonal}</dd>
        <dt>Intra-diagonal connections</dt><dd>${report.intraDiagonalConnectionsGenerated}</dd>
        <dt>Border connections</dt><dd>${report.borderConnectionsGenerated}</dd>
        <dt>Longest diagonal</dt><dd>${report.longestDiagonalIndex}</dd>
        <dt>Routing first half</dt><dd>${report.symmetricRoutingFirstHalf}</dd>
        <dt>Routing second half</dt><dd>${report.symmetricRoutingSecondHalf}</dd>
        <dt>Routing failures</dt><dd>${report.routingFailures}</dd>
        <dt>Diagonal passages blocked</dt><dd>${report.blockedDiagonalPassages}</dd>
        <dt>Routing contour vertices</dt><dd>${report.routingPerimeterVertices}</dd>
        <dt>Routing contour length</dt><dd>${round(report.routingPerimeterLength)} mm</dd>
        <dt>Routing contour area</dt><dd>${round(report.routingPerimeterArea)} mm2</dd>
        <dt>Internal shortcuts blocked</dt><dd>${report.invalidInternalShortcutsBlocked}</dd>
        <dt>Laser holes total</dt><dd>${report.laserHolesTotal}</dd>
        <dt>Laser holes inside</dt><dd>${report.laserHolesAccepted}</dd>
        <dt>Laser holes removed</dt><dd>${report.laserHolesRemoved}</dd>
        <dt>Laser incomplete removed</dt><dd>${report.laserHolesIncompleteRemoved}</dd>
        <dt>Laser outside removed</dt><dd>${report.laserHolesOutsideRemoved}</dd>
        <dt>Level 0 kept by holes</dt><dd>${report.level0ElementsKeptByHole}</dd>
        <dt>Level 0 removed by holes</dt><dd>${report.level0ElementsRemovedByHole}</dd>
        <dt>Level 0 modules kept</dt><dd>${report.level0ModulesKeptByClipMode}</dd>
        <dt>Level 0 modules removed</dt><dd>${report.level0ModulesRemovedByClipMode}</dd>
        <dt>Level 0 generated outlines</dt><dd>${report.level0GeneratedOutlines}</dd>
        <dt>Level 0 avg stitch</dt><dd>${round(report.level0AverageStitchLength)} mm</dd>
        <dt>Level 0 travel length</dt><dd>${round(report.level0TravelLength)} mm</dd>
        <dt>Coverage map covered</dt><dd>${round(report.coverageMapCoveragePercent || 0)}%</dd>
        <dt>Coverage requested resolution</dt><dd>${round(report.coverageMapRequestedResolutionMm || 0)} mm</dd>
        <dt>Coverage actual resolution</dt><dd>${round(report.coverageMapResolutionMm || 0)} mm</dd>
        <dt>Coverage radius</dt><dd>${round(report.coverageMapRadiusMm || 0)} mm</dd>
        <dt>Edge compensation</dt><dd>${round(report.coverageEdgeCompensationMm || 0)} mm</dd>
        <dt>Gap closing</dt><dd>${round(report.coverageGapClosingMm || 0)} mm</dd>
        <dt>Minimum coverage density</dt><dd>${report.coverageMinimumDensity || 1}</dd>
        <dt>Max coverage density</dt><dd>${report.coverageMaxDensity || 0}</dd>
        <dt>Preview pixels</dt><dd>${Math.round(report.coveragePreviewPixels || 0).toLocaleString()}</dd>
        <dt>Coverage source</dt><dd>${escapeHtml(state.params.coverageSource === "future_layers" ? "all future layers" : "Level 2 only")}</dd>
        <dt>Coverage mask meaning</dt><dd>black = Level 2 coverage, white/empty = no Level 2 coverage</dd>
        <dt>Level 0 coverage routes</dt><dd>${report.level0CoverageRoutes || 0}</dd>
        <dt>Level 0 visible direct routes</dt><dd>${report.level0DirectVisibleRoutes || 0}</dd>
        <dt>Covered travel length</dt><dd>${round(report.level0CoveredTravelLength || 0)} mm</dd>
        <dt>Uncovered travel length</dt><dd>${round(report.level0UncoveredTravelLength || 0)} mm</dd>
        <dt>Avg coverage distance</dt><dd>${round(report.level0AverageCoverageDistance || 0)} mm</dd>
        <dt>Min coverage distance</dt><dd>${report.level0MinimumCoverageDistance == null ? "n/a" : `${round(report.level0MinimumCoverageDistance)} mm`}</dd>
        <dt>Coverage fallbacks</dt><dd>${report.level0CoverageFallbacks || 0}</dd>
        <dt>Coverage broken paths</dt><dd>${report.level0CoverageBrokenPaths || 0}</dd>
        <dt>Travel visibility score</dt><dd>${round(report.level0AverageTravelVisibilityScore || 0)}</dd>
        <dt>Travel straightness score</dt><dd>${round(report.level0AverageStraightnessScore || 0)}%</dd>
        <dt>Travel smoothness score</dt><dd>${round(report.level0AverageSmoothnessScore || 0)}%</dd>
        <dt>Center coverage score</dt><dd>${round(report.level0AverageCenterCoverageScore || 0)}%</dd>
        <dt>Overall travel score</dt><dd>${round(report.level0AverageOverallTravelScore || 0)}%</dd>
        <dt>Direction changes</dt><dd>${report.level0DirectionChanges || 0}</dd>
        <dt>Level 0 broken paths</dt><dd>${report.level0BrokenPaths}</dd>
        <dt>Level 0 warnings</dt><dd>${report.level0Warnings}</dd>
        <dt>Level 1 kept by holes</dt><dd>${report.level1ElementsKeptByHole}</dd>
        <dt>Level 1 removed by holes</dt><dd>${report.level1ElementsRemovedByHole}</dd>
        <dt>Level 1 modules kept</dt><dd>${report.level1ModulesKeptByClipMode}</dd>
        <dt>Level 1 modules removed</dt><dd>${report.level1ModulesRemovedByClipMode}</dd>
        <dt>Cut segments detected</dt><dd>${report.cutSegmentsDetected}</dd>
        <dt>Cut exit/re-entry pairs</dt><dd>${report.cutExitReentryPairs}</dd>
        <dt>Cut routes created</dt><dd>${report.cutRoutesCreated}</dd>
        <dt>Cut routes failed</dt><dd>${report.cutRoutesFailed}</dd>
        <dt>Cut routes > stitch</dt><dd>${report.cutRoutesLongSegments}</dd>
        <dt>Cut paths reconnected</dt><dd>${report.cutPathsReconnected}</dd>
        <dt>Routing length</dt><dd>${round(report.perimeterRoutingLength)} mm</dd>
        <dt>Border length</dt><dd>${round(report.borderLength)} mm</dd>
        <dt>Zig-zag width</dt><dd>${round(state.params.zigZagWidth)} mm</dd>
        <dt>Zig-zag density</dt><dd>${round(state.params.zigZagDensity)} mm</dd>
        <dt>Zig-zag peaks</dt><dd>${report.zigZagPeaks}</dd>
        <dt>Total travel length</dt><dd>${round(report.totalTravelPathLength)} mm</dd>
        <dt>Avg travel stitch</dt><dd>${round(report.averageTravelStitchLength)} mm</dd>
        <dt>Min travel stitch</dt><dd>${report.minTravelStitchLengthFound == null ? "n/a" : `${round(report.minTravelStitchLengthFound)} mm`}</dd>
        <dt>Max travel stitch</dt><dd>${report.maxTravelStitchLengthFound == null ? "n/a" : `${round(report.maxTravelStitchLengthFound)} mm`}</dd>
        <dt>Short segments removed</dt><dd>${report.shortSegmentsRemoved}</dd>
        <dt>Minimum length found</dt><dd>${min}</dd>
        <dt>Paths before cleanup</dt><dd>${report.pathsBeforeCleanup}</dd>
        <dt>Paths after cleanup</dt><dd>${report.pathsAfterCleanup}</dd>
        <dt>Paths split</dt><dd>${report.pathsSplit}</dd>
        <dt>Level 0 paths clipped</dt><dd>${report.level0PathsClipped || 0}</dd>
        <dt>Level 1 paths clipped</dt><dd>${report.level1PathsClipped || 0}</dd>
        <dt>Level 2 paths clipped</dt><dd>${report.level2PathsClipped || 0}</dd>
        <dt>Global offset</dt><dd>${round(state.params.globalPatternOffsetX)} / ${round(state.params.globalPatternOffsetY)} mm</dd>
        <dt>Pattern bbox before</dt><dd>${report.globalPatternOffset ? `${round(report.globalPatternOffset.before.width)} x ${round(report.globalPatternOffset.before.height)} mm` : "n/a"}</dd>
        <dt>Pattern bbox after</dt><dd>${report.globalPatternOffset ? `${round(report.globalPatternOffset.after.width)} x ${round(report.globalPatternOffset.after.height)} mm` : "n/a"}</dd>
      </dl>
      <h2>Unit diagnostics</h2>
      <dl>
        <dt>Coordinate system</dt><dd>mm</dd>
        <dt>Template mode</dt><dd>${template ? template.mode : "auto offset mode"}</dd>
        <dt>Template warnings</dt><dd>${template?.warnings?.length ? template.warnings.length : 0}</dd>
        <dt>Master source</dt><dd>${template?.references?.master ? template.references.master.sourceType : "fallback"}</dd>
        <dt>Laser source</dt><dd>${template?.references?.laser ? template.references.laser.sourceType : "fallback"}</dd>
        <dt>Placement source</dt><dd>${template?.references?.placement ? template.references.placement.sourceType : "fallback"}</dd>
        <dt>Pattern source</dt><dd>${template?.references?.pattern ? template.references.pattern.sourceType : "fallback"}</dd>
        <dt>Satin source</dt><dd>${template?.references?.satin ? template.references.satin.sourceType : "fallback"}</dd>
        <dt>Cord source</dt><dd>${template?.references?.cord ? template.references.cord.sourceType : "fallback"}</dd>
        <dt>Pattern source</dt><dd>${pattern ? pattern.source : "n/a"}</dd>
        <dt>Master boundary</dt><dd>${pattern ? `${pattern.boundary.type} ${round(pattern.boundary.width)} x ${round(pattern.boundary.height)} mm` : "n/a"}</dd>
        <dt>Decorative boundary</dt><dd>${pattern ? `${round(pattern.decorativeBoundary.width)} x ${round(pattern.decorativeBoundary.height)} mm` : "n/a"}</dd>
        <dt>Border offset</dt><dd>${pattern ? `${round(pattern.offsets.decorative)} mm` : "n/a"}</dd>
        <dt>Module scale</dt><dd>${round(state.params.moduleScale)}</dd>
        <dt>Level 1 module</dt><dd>${level1 ? `${round(level1.scaledModuleWidthMm)} x ${round(level1.scaledModuleHeightMm)} mm` : "n/a"}</dd>
        <dt>Level 2 module</dt><dd>${level2 ? `${round(level2.scaledModuleWidthMm)} x ${round(level2.scaledModuleHeightMm)} mm` : "n/a"}</dd>
        <dt>L1 raw size</dt><dd>${level1 ? `${level1.originalWidthRaw || "none"} x ${level1.originalHeightRaw || "none"}` : "n/a"}</dd>
        <dt>L1 detected mm</dt><dd>${level1 ? `${displayMaybeMm(level1.declaredWidthMm)} x ${displayMaybeMm(level1.declaredHeightMm)}` : "n/a"}</dd>
        <dt>L1 viewBox</dt><dd>${level1 ? `${round(level1.viewBoxWidth)} x ${round(level1.viewBoxHeight)}` : "n/a"}</dd>
        <dt>L1 scale X/Y</dt><dd>${level1 ? `${round(level1.detectedUnitConversionFactorX)} / ${round(level1.detectedUnitConversionFactorY)}` : "n/a"}</dd>
        <dt>L1 imported bbox</dt><dd>${level1 ? `${round(level1.importedBoundingBoxMm.width)} x ${round(level1.importedBoundingBoxMm.height)} mm` : "n/a"}</dd>
        <dt>L1 method</dt><dd>${level1 ? level1.normalizationMethod : "n/a"}</dd>
        <dt>L2 raw size</dt><dd>${level2 ? `${level2.originalWidthRaw || "none"} x ${level2.originalHeightRaw || "none"}` : "n/a"}</dd>
        <dt>L2 detected mm</dt><dd>${level2 ? `${displayMaybeMm(level2.declaredWidthMm)} x ${displayMaybeMm(level2.declaredHeightMm)}` : "n/a"}</dd>
        <dt>L2 viewBox</dt><dd>${level2 ? `${round(level2.viewBoxWidth)} x ${round(level2.viewBoxHeight)}` : "n/a"}</dd>
        <dt>L2 scale X/Y</dt><dd>${level2 ? `${round(level2.detectedUnitConversionFactorX)} / ${round(level2.detectedUnitConversionFactorY)}` : "n/a"}</dd>
        <dt>L2 imported bbox</dt><dd>${level2 ? `${round(level2.importedBoundingBoxMm.width)} x ${round(level2.importedBoundingBoxMm.height)} mm` : "n/a"}</dd>
        <dt>L2 method</dt><dd>${level2 ? level2.normalizationMethod : "n/a"}</dd>
        <dt>Auto diagonals</dt><dd>${state.params.diagonalCount}</dd>
        <dt>Auto modules/diag</dt><dd>${state.params.modulesPerDiagonal}</dd>
      </dl>
      ${importReportsHtml()}
      <h2>Scale test</h2>
      <dl>
        <dt>Status</dt><dd>${scaleTest ? (scaleTest.testPassed ? "passed" : "failed") : "not run"}</dd>
        <dt>Original bbox</dt><dd>${scaleTest ? `${round(scaleTest.originalModuleBboxWidthMm)} x ${round(scaleTest.originalModuleBboxHeightMm)} mm` : "n/a"}</dd>
        <dt>Exported bbox</dt><dd>${scaleTest ? `${round(scaleTest.exportedModuleBboxWidthMm)} x ${round(scaleTest.exportedModuleBboxHeightMm)} mm` : "n/a"}</dd>
        <dt>Difference</dt><dd>${scaleTest ? `${round(scaleTest.widthDifferenceMm)} / ${round(scaleTest.heightDifferenceMm)} mm` : "n/a"}</dd>
        <dt>Ratio</dt><dd>${scaleTest ? `${round(scaleTest.scaleRatioX)} / ${round(scaleTest.scaleRatioY)}` : "n/a"}</dd>
      </dl>
    `;
  }

  function importReportsHtml() {
    const entries = Object.entries(state.sources).filter(([, source]) => source?.importReport);
    if (!entries.length) return "";
    return entries.map(([key, source]) => importReportHtml(source, key)).join("");
  }

  function importReportHtml(source, key = "") {
    const report = source.importReport;
    if (!report) return "";
    const ignoredReasons = report.ignored.slice(0, 12).map((item) => `${item.tag}: ${item.reason}${item.group ? ` (${item.group})` : ""}`).join("<br>") || "none";
    const groups = report.groups.slice(0, 16).map((group) => `
      <dt>${escapeHtml(group.name)}</dt><dd>${group.visible ? "visible" : "hidden"} | ${group.elementsContained} elem | ${group.bounds ? `${round(group.bounds.width)} x ${round(group.bounds.height)} mm` : "n/a"} | ${escapeHtml(group.colors.join(", ") || "no color")}</dd>
    `).join("");
    const pathDetails = (report.pathDetails || []).slice(0, 24).map((path) => `
      <dt>${escapeHtml(path.name)}</dt><dd>${path.closed ? "closed" : "open"} | ${path.candidateContour ? "candidate contour" : "not contour"} | fill ${escapeHtml(path.fill)} | stroke ${escapeHtml(path.stroke)} | area ${round(path.area)} mm2 | ${path.bounds ? `${round(path.bounds.width)} x ${round(path.bounds.height)} mm` : "n/a"} | ${escapeHtml(path.group)}</dd>
    `).join("");
    return `
      <h2>SVG Import Report ${key ? `(${escapeHtml(key)})` : ""}</h2>
      <dl>
        <dt>Source</dt><dd>${escapeHtml(source.name)}</dd>
        <dt>Total elements found</dt><dd>${report.totalElementsFound}</dd>
        <dt>Imported geometries</dt><dd>${report.importedElements}</dd>
        <dt>Paths</dt><dd>${report.pathsImported}</dd>
        <dt>Filled paths</dt><dd>${report.filledPaths}</dd>
        <dt>Stroked paths</dt><dd>${report.strokedPaths}</dd>
        <dt>Closed paths</dt><dd>${report.closedPaths}</dd>
        <dt>Open paths</dt><dd>${report.openPaths}</dd>
        <dt>Polylines</dt><dd>${report.polylinesImported}</dd>
        <dt>Polygons</dt><dd>${report.polygonsImported}</dd>
        <dt>Lines</dt><dd>${report.linesImported}</dd>
        <dt>Rect/circle/ellipse</dt><dd>${report.convertedShapes}</dd>
        <dt>Groups read</dt><dd>${report.groupsRead}</dd>
        <dt>Ignored</dt><dd>${report.ignoredCount}</dd>
        <dt>Visible ignored</dt><dd>${report.visibleIgnored}</dd>
        <dt>Ignored reasons</dt><dd>${ignoredReasons}</dd>
        ${pathDetails ? `<dt>Path details</dt><dd>Each imported path is listed below.</dd>${pathDetails}` : ""}
        ${groups}
      </dl>
    `;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function render() {
    readParams();
    if (!state.sources.level1 || !state.sources.level2) {
      setStatus("Load level 1 and level 2 stitch SVGs");
      return;
    }
    const incomplete = Object.entries(state.sources).find(([, source]) => source?.importReport?.visibleIgnored > 0);
    if (incomplete) {
      setStatus(`Import incomplete for ${incomplete[0]}: ${incomplete[1].importReport.visibleIgnored} visible geometries ignored`);
      renderImportReportOnly(incomplete[1]);
      return;
    }
    const patternBounds = activePatternBoundary();
    const bounds = decorativeBoundary(patternBounds);
    const laserBounds = laserBoundary(patternBounds);
    const placementBounds = placementBoundary(patternBounds);
    const satinBounds = satinBoundary(patternBounds);
    const cordBounds = cordBoundary(patternBounds);
    const routingBounds = routingPerimeterBoundary(patternBounds, bounds);
    preview.innerHTML = "";
    const outputMargin = Math.max(35, (state.params.perimeterLaneWidth || 0) + 5);
    setBaseViewBox(patternBounds.x - outputMargin, patternBounds.y - outputMargin, patternBounds.width + outputMargin * 2, patternBounds.height + outputMargin * 2);
    preview.setAttribute("width", `${round(patternBounds.width + outputMargin * 2)}mm`);
    preview.setAttribute("height", `${round(patternBounds.height + outputMargin * 2)}mm`);

    const holesEnabled = state.params.enableHolesLayer && state.sources.holes;
    const level0UsesModule = state.params.level0Mode !== "procedural";
    const level0Enabled = state.params.enableLevel0 && (level0UsesModule ? state.sources.level0 : holesEnabled);
    const level1Placements = generatePlacements(state.sources.level1, "level1");
    const level0PlacementsBase = level0Enabled && level0UsesModule ? generatePlacements(state.sources.level0, "level0") : [];
    const level2PlacementsBase = generatePlacements(state.sources.level2, "level2");
    const holesPlacementsBase = holesEnabled ? generatePlacements(state.sources.holes, "holes") : [];
    const rawLevel0Base = level0Enabled && level0UsesModule ? buildRawPolylines(state.sources.level0, level0PlacementsBase, "level0") : [];
    const rawLevel1Base = buildRawPolylines(state.sources.level1, level1Placements, "level1");
    const rawLevel2Base = buildRawPolylines(state.sources.level2, level2PlacementsBase, "level2");
    const rawHolesBase = holesEnabled ? buildRawPolylines(state.sources.holes, holesPlacementsBase, "holes") : [];
    const globalDx = state.params.globalPatternOffsetX || 0;
    const globalDy = state.params.globalPatternOffsetY || 0;
    const rawBeforeOffset = [...rawLevel0Base, ...rawLevel1Base, ...rawLevel2Base, ...rawHolesBase];
    const rawLevel0 = translatePolylines(rawLevel0Base, globalDx, globalDy);
    const rawLevel1 = translatePolylines(rawLevel1Base, globalDx, globalDy);
    const rawLevel2 = translatePolylines(rawLevel2Base, globalDx, globalDy);
    const rawHoles = translatePolylines(rawHolesBase, globalDx, globalDy);
    const rawAfterOffset = [...rawLevel0, ...rawLevel1, ...rawLevel2, ...rawHoles];
    const offsetDebug = patternOffsetDebug(rawBeforeOffset, rawAfterOffset);
    const level0Placements = translatePlacements(level0PlacementsBase, globalDx, globalDy);
    const level1PlacementsOffset = translatePlacements(level1Placements, globalDx, globalDy);
    const level2Placements = translatePlacements(level2PlacementsBase, globalDx, globalDy);
    const holesPlacements = translatePlacements(holesPlacementsBase, globalDx, globalDy);
    const borderReferenceDx = state.params.globalOffsetBorderReferences ? globalDx : 0;
    const borderReferenceDy = state.params.globalOffsetBorderReferences ? globalDy : 0;
    const displaySatinBounds = translateBoundary(satinBounds, borderReferenceDx, borderReferenceDy, satinBounds.name);
    const displayCordBounds = translateBoundary(cordBounds, borderReferenceDx, borderReferenceDy, cordBounds.name);
    const laserReport = emptyReport();
    const laserExport = holesEnabled
      ? buildLaserExportPolylines(rawHoles, laserBounds, patternBounds, laserReport)
      : { polylines: [], validIds: new Set(), validCenters: [], validHoles: [] };
    // Global rule: if placement/fixing share the pattern's perimeter selection, route them
    // like the pattern (continuous perimeter travel between diagonals); otherwise per-diagonal.
    const placementFollowsPattern = shouldPlacementFollowPattern();
    const placementRoutingOptions = {
      forceBorderRouting: true,
      preserveContinuousPerimeterRouting: true,
      symmetricRouting: true,
      routeBoundaryCutIntraDiagonal: true,
      cutBoundary: bounds
    };
    let level0CleanupReport = emptyReport();
    let connectedLevel0 = { polylines: [], report: emptyReport(), routingPolylines: [], intraDiagonalPolylines: [] };
    if (level0Enabled && level0UsesModule) {
      const level0HoleFiltered = !holesEnabled ? rawLevel0
        : state.params.pruneFeaturesWithoutHoles
          ? pruneLayerFeaturesByHoles(rawLevel0, laserExport.validCenters, state.params.holeMatchTolerance || 0.5)
          : filterPolylinesByValidHoles(rawLevel0, laserExport.validIds, laserExport.validCenters, "level0", laserReport);
      const level0 = applyModuleClipMode(level0HoleFiltered, placementBounds, state.params.level0ClipMode || "strict_clip", "level0", emptyReport());
      level0CleanupReport = level0.report;
      connectedLevel0 = placementFollowsPattern
        ? connectLayerContinuity(level0.polylines, routingBounds, "level0", placementRoutingOptions)
        : connectTechnicalDiagonals(level0.polylines, "level0");
    }
    const level1HoleFiltered = !holesEnabled ? rawLevel1
      : state.params.pruneFeaturesWithoutHoles
        ? pruneLayerFeaturesByHoles(rawLevel1, laserExport.validCenters, state.params.holeMatchTolerance || 0.5)
        : filterPolylinesByValidHoles(rawLevel1, laserExport.validIds, laserExport.validCenters, "level1", laserReport);
    const level1 = applyModuleClipMode(level1HoleFiltered, placementBounds, state.params.level1ClipMode || "strict_clip", "level1", emptyReport());
    const level2Cleanup = cleanupPolylines(rawLevel2, bounds);
    const level2CutReconnect = reconnectCutFragmentsOnBoundary(level2Cleanup.polylines, bounds);
    // Empty areas inside the pattern: inner contours of the pattern colour cut out the pattern.
    const level2WithVoids = state.params.enableExclusionAreas
      ? subtractExclusions(level2CutReconnect.polylines, bounds.exclusions)
      : level2CutReconnect.polylines;
    const level2 = { polylines: level2WithVoids, report: level2Cleanup.report };
    let coverageMap = null;
    const needsCoveragePreview = state.params.coverageMaskPreview || state.layers.debugCoverageMask || state.layers.debugCoverageMap || state.layers.debugCoveredTravelOptimizer;
    if ((level0Enabled && !level0UsesModule) || state.params.travelTestMode || needsCoveragePreview) {
      coverageMap = buildCoverageMap({
        level1: level1.polylines,
        level2: level2.polylines,
        satinBounds: displaySatinBounds,
        cordBounds: displayCordBounds,
        holes: laserExport.validHoles
      });
    }
    if (state.params.travelTestMode) {
      connectedLevel0 = buildCoveredTravelTest(coverageMap, emptyReport());
    } else if (level0Enabled && !level0UsesModule) {
      connectedLevel0 = buildProceduralLevel0(laserExport.validHoles, emptyReport(), coverageMap);
    }
    const connectedLevel1 = placementFollowsPattern
      ? connectLayerContinuity(level1.polylines, routingBounds, "level1", placementRoutingOptions)
      : connectTechnicalDiagonals(level1.polylines, "level1");
    const connectedLevel2 = connectLayerContinuity(level2.polylines, routingBounds, "level2", {
      forceBorderRouting: true,
      preserveContinuousPerimeterRouting: true,
      symmetricRouting: true,
      routeBoundaryCutIntraDiagonal: true,
      cutBoundary: bounds
    });
    // Final minimum-stitch pass: no segment shorter than the global minimum survives in the
    // connected output of Level 0/1/2 (removes sub-mm points from modules and their junctions).
    const minStitch = Math.max(0, state.params.minimumSegmentLength || 0);
    enforceMinimumStitchOnLayer(connectedLevel0, minStitch);
    enforceMinimumStitchOnLayer(connectedLevel1, minStitch);
    enforceMinimumStitchOnLayer(connectedLevel2, minStitch);
    // Thread-discharge sequence (panel-border lock + travel) at entry AND exit of each run.
    if (state.params.startLockEnabled) {
      const lockStitch = state.params.startLockStitchMm || 3;
      addStartEndLock(connectedLevel0, patternBounds, lockStitch);
      addStartEndLock(connectedLevel1, patternBounds, lockStitch);
      addStartEndLock(connectedLevel2, patternBounds, lockStitch);
    }
    const report = emptyReport();
    mergeReports(report, level0CleanupReport);
    mergeReports(report, level1.report);
    mergeReports(report, level2.report);
    mergeReports(report, level2CutReconnect.report);
    mergeReports(report, connectedLevel0.report);
    mergeReports(report, connectedLevel1.report);
    mergeReports(report, connectedLevel2.report);
    mergeReports(report, laserReport);
    addCoverageMapReport(report, coverageMap);
    addRoutingPerimeterStats(report, routingBounds);
    report.finalPoints = connectedLevel0.report.finalPoints + connectedLevel1.report.finalPoints + connectedLevel2.report.finalPoints;
    report.pathsBeforeCleanup = (level0UsesModule ? rawLevel0.length : connectedLevel0.report.pathsBeforeCleanup) + rawLevel1.length + rawLevel2.length;
    report.pathsAfterCleanup = connectedLevel0.polylines.length + connectedLevel1.polylines.length + connectedLevel2.polylines.length;
    report.level0PathsClipped = level0CleanupReport.pathsSplit || 0;
    report.level1PathsClipped = level1.report.pathsSplit;
    report.level2PathsClipped = level2.report.pathsSplit;
    report.globalPatternOffset = offsetDebug;

    const intraDiagonalPolylines = [];
    appendItems(intraDiagonalPolylines, connectedLevel0.intraDiagonalPolylines);
    appendItems(intraDiagonalPolylines, connectedLevel1.intraDiagonalPolylines);
    appendItems(intraDiagonalPolylines, connectedLevel2.intraDiagonalPolylines);
    const borderRoutingPolylines = [];
    appendItems(borderRoutingPolylines, connectedLevel0.routingPolylines);
    appendItems(borderRoutingPolylines, connectedLevel1.routingPolylines);
    appendItems(borderRoutingPolylines, connectedLevel2.routingPolylines);
    const travelPolylines = [];
    appendItems(travelPolylines, intraDiagonalPolylines);
    appendItems(travelPolylines, borderRoutingPolylines);
    const globalTravelStats = combinedTravelStats(borderRoutingPolylines);
    report.totalTravelPathLength = globalTravelStats.total;
    report.averageTravelStitchLength = globalTravelStats.average;
    report.minTravelStitchLengthFound = globalTravelStats.min;
    report.maxTravelStitchLengthFound = globalTravelStats.max;

    const coverageMaskOnly = state.params.coverageSource === "level2" && state.params.coverageMaskPreview;
    if (!state.params.panelShapeOverlayOnTop) appendPanelShapeOverlayIfNeeded(preview);
    if (!coverageMaskOnly) {
      preview.appendChild(buildBoundaryLayer(patternBounds, bounds, { laser: laserBounds, placement: placementBounds, satin: displaySatinBounds, cord: displayCordBounds }));
      preview.appendChild(buildPolylineGroup("level0", connectedLevel0.polylines, "layer-level0"));
      preview.appendChild(buildPolylineGroup("level1", connectedLevel1.polylines, "layer-level1"));
      preview.appendChild(buildTravelLayer(travelPolylines));
    }
    if (!coverageMaskOnly) preview.appendChild(buildPolylineGroup("level2", connectedLevel2.polylines, "layer-level2"));
    if (!coverageMaskOnly) preview.appendChild(buildPolylineGroup("holes", laserExport.polylines, "layer-holes"));
    const zigZagBorder = buildZigZagBorder(displayCordBounds);
    report.borderLength = zigZagBorder.borderLength;
    report.zigZagPeaks = zigZagBorder.peaks.length;
    appendDebugItems(report.debug.zigZagPeaks, zigZagBorder.peaks);
    appendDebugItems(report.debug.zigZagValleys, zigZagBorder.valleys);
    if (!coverageMaskOnly) {
      preview.appendChild(buildSatinLayer(displaySatinBounds, bounds, displayCordBounds));
      preview.appendChild(buildAnchorsLayer([level0Placements, level1PlacementsOffset, level2Placements, holesPlacements]));
    }
    if (coverageMaskOnly) preview.appendChild(buildDebugLayer(report, routingBounds, bounds, { coverageOnly: true }));
    else preview.appendChild(buildDebugLayer(report, routingBounds, bounds));
    if (state.params.panelShapeOverlayOnTop) appendPanelShapeOverlayIfNeeded(preview);

    state.generated = cloneWithoutPreviewOnly(preview);
    state.cleanupReport = {
      parameters: buildParameterPayload(),
      stats: { ...report, debug: undefined },
      note: "Cleanup uses the decorative boundary in millimeters with border-region continuity reconstruction. SVG pattern contours are supported; DXF import is reserved for the next parser layer."
    };
    state.routingReport = buildRoutingReport(report, borderRoutingPolylines, routingBounds, bounds);
    state.unitReport = buildUnitReport(patternBounds, bounds);
    state.debugSvg = cloneWithoutPreviewOnly(preview);
    renderStats(report);
    applyStateToControls();
    const moduleCount = state.params.diagonalCount * state.params.modulesPerDiagonal * 2;
    setStatus(`${moduleCount} modules, clean points ${report.finalPoints}, pattern ${round(patternBounds.width)} x ${round(patternBounds.height)} mm`);
  }

  function buildRoutingReport(report, routingPolylines, patternBounds, decorativeBounds = patternBounds) {
    return {
      routingPerimeterSource: state.params.routingPerimeterSource,
      perimeterCloseToleranceMm: state.params.perimeterCloseTolerance,
      perimeterLaneToleranceMm: state.params.perimeterLaneTolerance,
      allowInternalShortcuts: state.params.allowInternalShortcuts,
      perimeterLaneWidthMm: state.params.perimeterLaneWidth,
      borderRegionMm: state.params.patternBorderOffset,
      minimumTravelStitchLengthMm: state.params.minimumTravelStitchLength,
      travelPathMode: state.params.travelPathMode,
      travelRoutingStrategy: state.params.travelRoutingStrategy,
      masterPatternBoundary: boundaryReport(patternBounds),
      decorativeBoundary: boundaryReport(decorativeBounds),
      laneBounds: laneRect(patternBounds),
      borderConnectionsGenerated: report.borderConnectionsGenerated,
      longestDiagonalIndex: report.longestDiagonalIndex,
      symmetricRoutingFirstHalf: report.symmetricRoutingFirstHalf,
      symmetricRoutingSecondHalf: report.symmetricRoutingSecondHalf,
      routingFailures: report.routingFailures,
      blockedDiagonalPassages: report.blockedDiagonalPassages,
      invalidInternalShortcutsBlocked: report.invalidInternalShortcutsBlocked,
      routingContoursFound: report.routingContoursFound,
      routingClosedContours: report.routingClosedContours,
      selectedContourArea: report.routingPerimeterArea,
      selectedContourLength: report.routingPerimeterLength,
      selectedContourVertices: report.routingPerimeterVertices,
      selectedContourWinding: patternBounds.type === "polygon" ? (polygonArea(patternBounds.points) >= 0 ? "clockwise" : "counter_clockwise") : "rectangle",
      laserHolesTotal: report.laserHolesTotal,
      laserHolesAccepted: report.laserHolesAccepted,
      laserHolesRemoved: report.laserHolesRemoved,
      laserHolesIncompleteRemoved: report.laserHolesIncompleteRemoved,
      laserHolesOutsideRemoved: report.laserHolesOutsideRemoved,
      level0ElementsKeptByHole: report.level0ElementsKeptByHole,
      level0ElementsRemovedByHole: report.level0ElementsRemovedByHole,
      level0ClipMode: state.params.level0ClipMode,
      level0ModulesKeptByClipMode: report.level0ModulesKeptByClipMode,
      level0ModulesRemovedByClipMode: report.level0ModulesRemovedByClipMode,
      level0GeneratedOutlines: report.level0GeneratedOutlines,
      level0HoleStitchLengthMm: state.params.level0HoleStitchLength,
      level0TravelStitchLengthMm: state.params.level0TravelStitchLength,
      coverageResolutionMm: state.params.coverageResolutionMm,
      coverageDilationMm: state.params.coverageDilationMm,
      coverageGapClosingMm: state.params.coverageGapClosingMm,
      coverageMinimumDensity: state.params.coverageMinimumDensity,
      coverageErosionMm: state.params.coverageErosionMm,
      minimumCoverageWidthMm: state.params.minimumCoverageWidthMm,
      level0CoverageFallback: state.params.level0CoverageFallback,
      coverageMinimumTravelStitchLengthMm: state.params.coverageMinimumTravelStitchLength,
      coveredTravelStitchLengthMm: state.params.coveredTravelStitchLengthMm,
      holeEntryCandidateCount: state.params.holeEntryCandidateCount,
      holeExitCandidateCount: state.params.holeExitCandidateCount,
      allowDiagonalTravel: state.params.allowDiagonalTravel,
      pathOrthogonalityWeight: state.params.pathOrthogonalityWeight,
      mergeCollinearSegments: state.params.mergeCollinearSegments,
      removeRedundantTurns: state.params.removeRedundantTurns,
      minimumTurnDistanceMm: state.params.minimumTurnDistanceMm,
      travelOptimizerWeights: {
        visibility: state.params.visibilityWeight,
        center: state.params.centerWeight,
        turn: state.params.turnWeight,
        curvature: state.params.curvatureWeight,
        length: state.params.lengthWeight,
        pointCount: state.params.pointCountWeight,
        headingPersistence: state.params.headingPersistenceWeight
      },
      travelSimplificationToleranceMm: state.params.travelSimplificationToleranceMm,
      travelSmoothingEnabled: state.params.travelSmoothingEnabled,
      travelSmoothingStrength: state.params.travelSmoothingStrength,
      travelSmoothingIterations: state.params.travelSmoothingIterations,
      level0AverageStitchLengthMm: report.level0AverageStitchLength,
      level0TravelLengthMm: report.level0TravelLength,
      level0CoverageRoutes: report.level0CoverageRoutes,
      level0DirectVisibleRoutes: report.level0DirectVisibleRoutes,
      level0AverageTravelVisibilityScore: report.level0AverageTravelVisibilityScore,
      coverageMapCells: report.coverageMapCells,
      coverageMapCoveredCells: report.coverageMapCoveredCells,
      coverageMapCoveragePercent: report.coverageMapCoveragePercent,
      level0CoveredTravelLengthMm: report.level0CoveredTravelLength,
      level0UncoveredTravelLengthMm: report.level0UncoveredTravelLength,
      level0AverageCoverageDistanceMm: report.level0AverageCoverageDistance,
      level0MinimumCoverageDistanceMm: report.level0MinimumCoverageDistance,
      level0CoverageFallbacks: report.level0CoverageFallbacks,
      level0CoverageBrokenPaths: report.level0CoverageBrokenPaths,
      level0AverageStraightnessScore: report.level0AverageStraightnessScore,
      level0AverageSmoothnessScore: report.level0AverageSmoothnessScore,
      level0AverageCenterCoverageScore: report.level0AverageCenterCoverageScore,
      level0AverageOverallTravelScore: report.level0AverageOverallTravelScore,
      level0DirectionChanges: report.level0DirectionChanges,
      coverageRouteReports: report.debug.coverageRouteReports,
      level0BrokenPaths: report.level0BrokenPaths,
      level0Warnings: report.level0Warnings,
      level1ElementsKeptByHole: report.level1ElementsKeptByHole,
      level1ElementsRemovedByHole: report.level1ElementsRemovedByHole,
      level1ClipMode: state.params.level1ClipMode,
      level1ModulesKeptByClipMode: report.level1ModulesKeptByClipMode,
      level1ModulesRemovedByClipMode: report.level1ModulesRemovedByClipMode,
      cutBorderStitchLengthMm: state.params.cutBorderStitchLength,
      cutSegmentsDetected: report.cutSegmentsDetected,
      cutExitReentryPairs: report.cutExitReentryPairs,
      cutRoutesCreated: report.cutRoutesCreated,
      cutRoutesFailed: report.cutRoutesFailed,
      cutRoutesLongSegments: report.cutRoutesLongSegments,
      cutPathsReconnected: report.cutPathsReconnected,
      travelSideStrategy: state.params.travelSideStrategy,
      transitionRoutes: report.debug.routingCandidates,
      routingPerimeterTest: routingPerimeterTestReport(),
      expectedBorderConnectionsPerLevel: Math.max(0, state.params.diagonalCount - 1),
      expectedBorderConnectionsAllLevels: Math.max(0, (state.params.diagonalCount - 1) * 2),
      intraDiagonalConnectionsGenerated: report.intraDiagonalConnectionsGenerated,
      totalPerimeterRoutingLengthMm: report.perimeterRoutingLength,
      totalTravelPathLengthMm: report.totalTravelPathLength,
      averageTravelStitchLengthMm: report.averageTravelStitchLength,
      minTravelStitchLengthMm: report.minTravelStitchLengthFound,
      maxTravelStitchLengthMm: report.maxTravelStitchLengthFound,
      routeCount: routingPolylines.length,
      routes: routingPolylines.map((route) => ({
        layer: route.layer,
        pointCount: route.points.length,
        lengthMm: polylineLength(route.points),
        points: route.points
      }))
    };
  }

  function addRoutingPerimeterStats(report, boundary) {
    if (!boundary) return;
    if (boundary.type === "polygon") {
      report.routingContoursFound = 1;
      report.routingClosedContours = samePoint(boundary.points[0], last(boundary.points)) ? 1 : 0;
      report.routingPerimeterArea = Math.abs(polygonArea(boundary.points));
      report.routingPerimeterLength = polylineLength(boundary.points);
      report.routingPerimeterVertices = Math.max(0, boundary.points.length - 1);
      appendDebugItems(report.debug.selectedRoutingContour, [boundary.points]);
    } else {
      report.routingContoursFound = 1;
      report.routingClosedContours = 1;
      report.routingPerimeterArea = boundary.width * boundary.height;
      report.routingPerimeterLength = 2 * (boundary.width + boundary.height);
      report.routingPerimeterVertices = 4;
    }
  }

  function addCoverageMapReport(report, coverageMap) {
    if (!coverageMap) return;
    report.coverageMapCells = coverageMap.width * coverageMap.height;
    report.coverageMapCoveredCells = coverageMap.coveredCount || 0;
    report.coverageMapCoveragePercent = report.coverageMapCells
      ? report.coverageMapCoveredCells / report.coverageMapCells * 100
      : 0;
    report.coverageMapResolutionMm = coverageMap.resolution;
    report.coverageMapRequestedResolutionMm = coverageMap.requestedResolution;
    report.coverageMapRadiusMm = coverageMap.coverageRadius;
    report.coverageEdgeCompensationMm = coverageMap.edgeCompensation || 0;
    report.coverageGapClosingMm = coverageMap.gapClosing || 0;
    report.coverageMinimumDensity = coverageMap.coverageMinimumDensity || 1;
    report.coverageMaxDensity = coverageMap.coverageMaxDensity || 0;
    const image = coverageMap.debugMaskImages?.[0];
    report.coveragePreviewPixels = image ? image.pixelWidth * image.pixelHeight : 0;
    if (!report.debug.coverageMaskImages.length) appendDebugItems(report.debug.coverageMaskImages, coverageMap.debugMaskImages);
    if (!report.debug.coverageMaskRuns.length) appendDebugItems(report.debug.coverageMaskRuns, coverageMap.debugMaskRuns);
    if (!report.debug.coverageMapCells.length) appendDebugItems(report.debug.coverageMapCells, coverageMap.debugCoveredCells);
    if (!report.debug.coverageHeatmap.length) appendDebugItems(report.debug.coverageHeatmap, coverageMap.debugHeatmapCells);
  }

  function routingPerimeterTestReport() {
    const previousStrategy = state.params.travelRoutingStrategy;
    state.params.travelRoutingStrategy = "shortest_valid";
    const start = { x: 0, y: 25 };
    const end = { x: 50, y: 50 };
    const program = rectBoundary({ x: 0, y: 0, width: 100, height: 50 }, "test_program_rectangle");
    const imported = boundaryFromPoints([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 50 },
      { x: 0, y: 50 },
      { x: 0, y: 0 }
    ], "test_imported_svg_rectangle");
    const result = {
      programRectangle: routingPerimeterSingleTest(start, end, program),
      importedSvgRectangle: routingPerimeterSingleTest(start, end, imported)
    };
    state.params.travelRoutingStrategy = previousStrategy;
    return result;
  }

  function routingPerimeterSingleTest(start, end, boundary) {
    const route = perimeterRoute(start, end, boundary, { forceBorder: true, validateCandidates: true });
    const clockwise = route.candidates?.find((candidate) => candidate.direction === "clockwise");
    const counterClockwise = route.candidates?.find((candidate) => candidate.direction === "counter_clockwise");
    return {
      start,
      end,
      projectedStart: route.projectedStart,
      projectedEnd: route.projectedEnd,
      clockwiseLength: clockwise?.length ?? null,
      counterClockwiseLength: counterClockwise?.length ?? null,
      clockwiseValid: Boolean(clockwise?.valid),
      counterClockwiseValid: Boolean(counterClockwise?.valid),
      chosenDirection: route.direction,
      chosenLength: route.perimeterLength ?? route.length,
      routeValid: route.valid !== false
    };
  }

  function boundaryReport(boundary) {
    return {
      type: boundary.type,
      width: boundary.width,
      height: boundary.height,
      minX: boundary.minX,
      minY: boundary.minY,
      maxX: boundary.maxX,
      maxY: boundary.maxY,
      pointCount: boundary.points?.length || 0
    };
  }

  function buildUnitReport(bounds, decorativeBounds = bounds) {
    const sources = {};
    Object.entries(state.sources).forEach(([key, source]) => {
      if (!source) {
        sources[key] = null;
        return;
      }
      sources[key] = {
        name: source.name,
        normalizeFunction: "normalizeSvgToMm",
        normalizedInternalUnit: "mm",
        normalizationMethod: source.normalizationMethod,
        fallbackUnitAssumption: source.fallbackUnitAssumption,
        originalWidthRaw: source.originalWidthRaw,
        originalHeightRaw: source.originalHeightRaw,
        originalWidth: source.originalWidth,
        originalHeight: source.originalHeight,
        originalWidthUnit: source.originalWidthUnit,
        originalHeightUnit: source.originalHeightUnit,
        viewBox: source.viewBox,
        viewBoxWidth: source.viewBox.width,
        viewBoxHeight: source.viewBox.height,
        declaredWidthMm: source.declaredWidth,
        declaredHeightMm: source.declaredHeight,
        detectedUnitConversionFactorX: source.unitScaleX,
        detectedUnitConversionFactorY: source.unitScaleY,
        importedBoundingBoxSvgUnits: source.originalBoundsSvgUnits,
        importedBoundingBoxMm: source.bounds,
        detectedModuleBoundsMm: source.bounds,
        currentModuleScale: state.params.moduleScale,
        generationScale: state.params.moduleScale,
        exportScale: source.exportScale,
        finalScaleFromOriginalSvgUnitsX: source.importScaleX * state.params.moduleScale * source.exportScale,
        finalScaleFromOriginalSvgUnitsY: source.importScaleY * state.params.moduleScale * source.exportScale,
        finalScaleAfterImportX: state.params.moduleScale * source.exportScale,
        finalScaleAfterImportY: state.params.moduleScale * source.exportScale,
        scaledModuleWidthMm: source.bounds.width * state.params.moduleScale,
        scaledModuleHeightMm: source.bounds.height * state.params.moduleScale,
        unitAssumption: source.declaredWidth || source.declaredHeight ? "declared SVG physical size converted to mm once at import" : source.fallbackUnitAssumption,
        scaleAudit: {
          internalUnit: "mm",
          importAppliedOnce: true,
          exportAppliesAdditionalScale: false,
          noGlobalExportTransform: true
        },
        importReport: source.importReport || null
      };
    });
    return {
      coordinateSystem: "millimeters",
      schemaVersion: SCHEMA_VERSION,
      template: templateReportForExport(),
      patternShape: {
        source: state.sources.panel?.name || "manual rectangular format",
        boundary: boundaryReport(bounds),
        decorativeBoundary: boundaryReport(decorativeBounds),
        offsets: {
          top: state.params.patternTopOffset,
          right: state.params.patternRightOffset,
          bottom: state.params.patternBottomOffset,
          left: state.params.patternLeftOffset,
          decorative: state.params.patternBorderOffset
        },
        laserOffsets: {
          top: state.params.laserTopOffset,
          right: state.params.laserRightOffset,
          bottom: state.params.laserBottomOffset,
          left: state.params.laserLeftOffset
        },
        globalPatternOffset: {
          x: state.params.globalPatternOffsetX,
          y: state.params.globalPatternOffsetY,
          nudgeStep: state.params.nudgeStep,
          affectsBorderReferences: state.params.globalOffsetBorderReferences
        }
      },
      panelDimensionsMm: {
        originX: bounds.x,
        originY: bounds.y,
        width: bounds.width,
        height: bounds.height
      },
      overflowMarginMm: state.params.overflowMarginMm,
      autoFill: state.autoFillReport,
      sources
    };
  }

  function templateReportForExport() {
    if (!state.templateReport) return null;
    const references = {};
    Object.entries(state.templateReport.references || {}).forEach(([key, value]) => {
      references[key] = {
        sourceType: value.sourceType,
        layerName: value.layerName,
        boundary: value.boundary ? boundaryReport(value.boundary) : null
      };
    });
    return {
      mode: state.templateReport.mode,
      source: state.templateReport.source,
      warnings: state.templateReport.warnings,
      assignments: { ...state.templateAssignments },
      detectedLayers: (state.templateReport.layers || []).map((layer) => ({
        index: layer.index,
        name: layer.name,
        id: layer.id,
        bounds: layer.bounds,
        detectedRole: TEMPLATE_ROLE_ORDER.find((role) => state.sources.panel?.detectedTemplateRoles?.[role] === layer.index) || null
      })),
      detectedColors: (state.sources.panel?.colorLayers || []).map((layer) => ({
        color: layer.color,
        pathCount: layer.elements.length,
        bounds: layer.bounds
      })),
      references
    };
  }

  function buildParameterPayload() {
    return {
      schema_version: SCHEMA_VERSION,
      params: { ...state.params },
      layers: { ...state.layers },
      templateAssignments: { ...state.templateAssignments },
      clipPreview: state.clipPreview,
      sources: Object.fromEntries(Object.entries(state.sources).map(([key, value]) => [key, value?.name || null]))
    };
  }

  function optimizeExportClone(clone, svgKind) {
    const started = performance.now();
    const maxVertices = Math.max(2, Math.floor(state.params.maximumVerticesPerPath || 5000));
    const report = {
      kind: svgKind,
      maximumVerticesPerPath: maxVertices,
      validateExport: Boolean(state.params.validateExport),
      totalPoints: countSvgPolylinePoints(clone),
      exportedPoints: 0,
      importedPoints: null,
      pathCount: 0,
      averagePointsPerPath: 0,
      maximumPointsInOnePath: 0,
      svgGroups: 0,
      exportTimeMs: 0,
      warnings: []
    };
    const groupNames = {
      level0: "Level_0",
      level1: "Level_1",
      level2: "Level_2",
      travel: "Perimeter_Routing",
      holes: "Level_4_Laser",
      "satin-border": "Satin",
      boundary: "Boundary"
    };
    Array.from(clone.querySelectorAll(":scope > g")).forEach((group) => {
      const originalId = group.getAttribute("id") || "";
      if (groupNames[originalId]) group.setAttribute("id", groupNames[originalId]);
      splitGroupPolylinesForExport(group, originalId || group.getAttribute("id") || "Group", maxVertices, report);
    });
    report.svgGroups = clone.querySelectorAll("g").length;
    report.averagePointsPerPath = report.pathCount ? report.exportedPoints / report.pathCount : 0;
    if (state.params.validateExport) {
      const serialized = new XMLSerializer().serializeToString(clone);
      const reimported = new DOMParser().parseFromString(serialized, "image/svg+xml");
      report.importedPoints = countSvgPolylinePoints(reimported);
      if (report.importedPoints !== report.exportedPoints) {
        report.warnings.push(`Export validation mismatch: exported ${report.exportedPoints}, re-imported ${report.importedPoints}`);
      }
    }
    if (report.totalPoints !== report.exportedPoints) {
      report.warnings.push(`Point count mismatch before validation: generated ${report.totalPoints}, exported ${report.exportedPoints}`);
    }
    report.exportTimeMs = performance.now() - started;
    return report;
  }

  function splitGroupPolylinesForExport(group, groupId, maxVertices, report) {
    Array.from(group.children).forEach((child, childIndex) => {
      if (child.tagName.toLowerCase() !== "polyline") {
        if (isExportGeometry(child)) report.pathCount += 1;
        return;
      }
      const points = parsePolylinePoints(child.getAttribute("points"));
      if (!points.length) {
        child.remove();
        return;
      }
      const chunks = chunkPoints(points, maxVertices);
      const fragment = document.createDocumentFragment();
      chunks.forEach((chunk, chunkIndex) => {
        const next = child.cloneNode(false);
        next.setAttribute("points", pointsAttr(chunk));
        next.setAttribute("id", exportBlockId(groupId, childIndex, chunkIndex, chunks.length));
        next.setAttribute("data-export-block", groupId);
        next.setAttribute("data-source-points", String(chunk.length));
        fragment.appendChild(next);
        report.pathCount += 1;
        report.exportedPoints += chunk.length;
        report.maximumPointsInOnePath = Math.max(report.maximumPointsInOnePath, chunk.length);
      });
      child.replaceWith(fragment);
    });
  }

  function exportBlockId(groupId, childIndex, chunkIndex, chunkCount) {
    const base = groupId === "level0" || groupId === "level1" || groupId === "level2"
      ? `Diagonal_${String(childIndex + 1).padStart(3, "0")}`
      : `${groupId || "Block"}_${String(childIndex + 1).padStart(3, "0")}`;
    return chunkCount > 1 ? `${base}_part_${String(chunkIndex + 1).padStart(3, "0")}` : base;
  }

  function chunkPoints(points, maxVertices) {
    if (points.length <= maxVertices) return [points];
    const chunks = [];
    for (let index = 0; index < points.length; index += maxVertices) chunks.push(points.slice(index, index + maxVertices));
    return chunks;
  }

  function countSvgPolylinePoints(root) {
    return Array.from(root.querySelectorAll("polyline"))
      .reduce((sum, item) => sum + parsePolylinePoints(item.getAttribute("points")).length, 0);
  }

  function parsePolylinePoints(value) {
    if (!value) return [];
    const numbers = value.trim().split(/[\s,]+/).map(Number).filter(Number.isFinite);
    const points = [];
    for (let index = 0; index < numbers.length - 1; index += 2) points.push({ x: numbers[index], y: numbers[index + 1] });
    return points;
  }

  function isExportGeometry(node) {
    return ["path", "polyline", "line", "polygon", "rect", "circle", "ellipse"].includes(node.tagName.toLowerCase());
  }

  function setStatus(message) {
    status.textContent = message;
  }

  function round(value) {
    return Number(value).toFixed(3).replace(/\.?0+$/, "");
  }

  function displayMaybeMm(value) {
    return value == null ? "not declared" : `${round(value)} mm`;
  }

  async function loadExampleSources() {
    const entries = await Promise.all(Object.entries(EXAMPLES).filter(([, url]) => url).map(async ([key, url]) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Unable to load ${url}`);
      return [key, parseSvg(await response.text(), url)];
    }));
    entries.forEach(([key, value]) => {
      state.sources[key] = value;
    });
    render();
  }

  function readFileInput(input, key) {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      // Reopening a project exported by this app: the SVG embeds all parameters
      // and the original cartamodello (with its colours). Restore instead of importing as a shape.
      if (key === "panel") {
        const project = extractEmbeddedProject(text);
        if (project && restoreProjectFromData(project)) {
          setStatus("Progetto riaperto dal file SVG");
          return;
        }
      }
      const source = parseVectorSource(text, file.name);
      source.rawText = text;
      state.sources[key] = source;
      if (key === "panel") state.templateAssignments = { ...defaultTemplateAssignments };
      render();
    };
    reader.readAsText(file);
  }

  // Project-as-SVG: embed full parameters + the original cartamodello (base64), and
  // restore them on reopen so the mono-colour export doubles as a re-editable project.
  function buildProjectMetadata() {
    const panel = state.sources.panel;
    let panelSvg = null;
    if (panel && panel.rawText) {
      try { panelSvg = btoa(unescape(encodeURIComponent(panel.rawText))); } catch (error) { panelSvg = null; }
    }
    const project = { rgProject: true, schema_version: SCHEMA_VERSION, payload: buildParameterPayload(), panelSvg };
    const meta = createEl("metadata", { id: "rg-project" });
    meta.textContent = JSON.stringify(project);
    return meta;
  }

  function extractEmbeddedProject(text) {
    if (!text || text.indexOf("rgProject") === -1) return null;
    try {
      const doc = new DOMParser().parseFromString(text, "image/svg+xml");
      const metas = Array.from(doc.querySelectorAll("metadata"));
      for (const meta of metas) {
        const json = (meta.textContent || "").trim();
        if (json.indexOf("rgProject") === -1) continue;
        const project = JSON.parse(json);
        if (project && project.rgProject) return project;
      }
    } catch (error) { /* not an rg project */ }
    return null;
  }

  function restoreProjectFromData(project) {
    if (!project || !project.rgProject) return false;
    const payload = project.payload || {};
    Object.assign(state.params, payload.params || {});
    Object.assign(state.layers, payload.layers || {});
    state.templateAssignments = { ...defaultTemplateAssignments, ...(payload.templateAssignments || {}) };
    if (payload.clipPreview !== undefined) state.clipPreview = payload.clipPreview;
    if (project.panelSvg) {
      try {
        const raw = decodeURIComponent(escape(atob(project.panelSvg)));
        const source = parseVectorSource(raw, "progetto-cartamodello.svg");
        source.rawText = raw;
        state.sources.panel = source;
      } catch (error) { /* keep current panel if decode fails */ }
    }
    applyStateToControls();
    render();
    return true;
  }

  function readProjectInput(input) {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const project = JSON.parse(String(reader.result));
      Object.assign(state.params, project.params || {});
      Object.assign(state.layers, project.layers || {});
      state.templateAssignments = { ...defaultTemplateAssignments, ...(project.templateAssignments || {}) };
      if (!project.params || project.params.enableLevel0 === undefined) state.params.enableLevel0 = false;
      if (!project.params || project.params.enableHolesLayer === undefined) state.params.enableHolesLayer = false;
      state.clipPreview = project.clipPreview ?? state.clipPreview;
      applyStateToControls();
      render();
    };
    reader.readAsText(file);
  }

  function exportSvg(kind) {
    if (!state.generated) render();
    if (!state.generated) return;
    const exportKindMap = {
      fullEmbroidery: "clean",
      templateDebug: "debug",
      level0Placement: "level0",
      level1Stabilization: "level1",
      level2Logo: "level2",
      level4Laser: "holes",
      satinFill: "satin",
      cordoncino: "satin"
    };
    const filenameMap = {
      fullEmbroidery: "full_embroidery.svg",
      templateDebug: "template_debug.svg",
      level0Placement: "level_0_placement.svg",
      level1Stabilization: "level_1_stabilization.svg",
      level2Logo: "level_2_logo.svg",
      level4Laser: "level_4_laser_holes.svg",
      satinFill: "satin_fill.svg",
      cordoncino: "cordoncino.svg",
      completo: "rg_oblique_completo.svg"
    };
    const svgKind = exportKindMap[kind] || kind;
    if (kind === "params") {
      download("project_parameters.json", JSON.stringify(buildParameterPayload(), null, 2), "application/json");
      return;
    }
    if (kind === "cleanupReport") {
      download("rg-oblique-cleanup-report.json", JSON.stringify(state.cleanupReport, null, 2), "application/json");
      return;
    }
    if (kind === "routingReport") {
      download("rg-oblique-routing-report.json", JSON.stringify(state.routingReport, null, 2), "application/json");
      return;
    }
    if (kind === "unitReport") {
      download("rg-oblique-unit-report.json", JSON.stringify(state.unitReport, null, 2), "application/json");
      return;
    }
    if (kind === "exportReport") {
      download("rg-oblique-export-report.json", JSON.stringify(state.exportReport || { note: "Run an SVG export first." }, null, 2), "application/json");
      return;
    }
    if (kind === "scaleTestReport") {
      if (!state.scaleTestReport) runSingleModuleScaleTest();
      download("rg-oblique-scale-test-report.json", JSON.stringify(state.scaleTestReport, null, 2), "application/json");
      return;
    }
    const source = svgKind === "debug" ? state.debugSvg : state.generated;
    const clone = source.cloneNode(true);
    // The preview viewBox is zoom-dependent (base / zoom); the width/height are the real base mm.
    // Reset the exported viewBox to the un-zoomed base so 1 SVG unit = 1 mm — otherwise the
    // exported drawing is scaled by whatever zoom level was active (bigger/smaller than reality).
    if (state.baseViewBox) {
      const b = state.baseViewBox;
      clone.setAttribute("viewBox", `${round(b.x)} ${round(b.y)} ${round(b.width)} ${round(b.height)}`);
    }
    if (svgKind === "completo") {
      // One production file: Level 0/1/2 + laser holes as separate groups, no travel/debug/anchors/satin.
      const keepIds = new Set(["level0", "level1", "level2", "holes"]);
      Array.from(clone.children).forEach((child) => {
        const id = child.getAttribute?.("id") || "";
        if (!keepIds.has(id)) child.remove();
      });
      // Plus a distinct black reference layer with the original imported tracings (1:1).
      const originals = buildOriginalSourcesGroup();
      if (originals.childNodes.length) clone.appendChild(originals);
      // Plus the loaded cartamodello (panel DXF/SVG), all lines one distinct color.
      const cartamodello = buildCartamodelloGroup();
      if (cartamodello.childNodes.length) clone.appendChild(cartamodello);
    } else if (svgKind !== "clean" && svgKind !== "debug") {
      Array.from(clone.children).forEach((child) => {
        const id = child.getAttribute?.("id") || "";
        const keep =
          (svgKind === "level0" && id === "level0") ||
          (svgKind === "level1" && id === "level1") ||
          (svgKind === "level2" && id === "level2") ||
          (svgKind === "holes" && id === "holes") ||
          (svgKind === "travel" && id === "travel") ||
          (svgKind === "satin" && id === "satin-border");
        if (!keep) child.remove();
      });
    }
    if (svgKind === "clean") {
      clone.querySelector("#cleanup-debug")?.remove();
      clone.querySelector("#anchors")?.remove();
      clone.querySelector("#travel")?.remove();
      clone.querySelector("#holes")?.remove();
    }
    if (svgKind === "debug") {
      const debugLayer = clone.querySelector("#cleanup-debug");
      if (debugLayer) debugLayer.style.display = "";
    }
    clone.querySelectorAll("[clip-path]").forEach((node) => node.removeAttribute("clip-path"));
    clone.querySelectorAll("clipPath,mask").forEach((node) => node.remove());
    state.exportReport = optimizeExportClone(clone, svgKind);
    if (state.exportReport.warnings.length) setStatus(`Export warning: ${state.exportReport.warnings[0]}`);
    if (svgKind === "completo") clone.appendChild(buildProjectMetadata());
    const text = new XMLSerializer().serializeToString(clone);
    const payload = {
      kind,
      filename: filenameMap[kind] || `rg-oblique-${kind}.svg`,
      text: `<?xml version="1.0" encoding="UTF-8"?>\n${text}`,
      type: "image/svg+xml"
    };
    // Optional sink (used by the simplified UI easy.html to show a save modal / file picker).
    // index.html defines none, so it downloads as before.
    if (typeof window.__rgExportSink === "function" && window.__rgExportSink(payload)) return;
    download(payload.filename, payload.text, payload.type);
  }

  function handlePreset(action) {
    if (action === "saveLocal") {
      readParams();
      localStorage.setItem(PRESET_KEY, JSON.stringify(buildParameterPayload()));
      setStatus("Preset saved in browser localStorage");
      return;
    }
    if (action === "loadLocal") {
      const raw = localStorage.getItem(PRESET_KEY);
      if (!raw) {
        setStatus("No local preset found");
        return;
      }
      const preset = JSON.parse(raw);
      Object.assign(state.params, preset.params || {});
      Object.assign(state.layers, preset.layers || {});
      state.templateAssignments = { ...defaultTemplateAssignments, ...(preset.templateAssignments || {}) };
      if (!preset.params || preset.params.enableLevel0 === undefined) state.params.enableLevel0 = false;
      if (!preset.params || preset.params.enableHolesLayer === undefined) state.params.enableHolesLayer = false;
      state.clipPreview = preset.clipPreview ?? state.clipPreview;
      applyStateToControls();
      render();
      return;
    }
    if (action === "reset") {
      state.params = { ...defaultParams };
      state.layers = { ...defaultLayers };
      state.templateAssignments = { ...defaultTemplateAssignments };
      state.clipPreview = false;
      applyStateToControls();
      render();
    }
  }

  function download(filename, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function isTypingTarget(element) {
    if (!element) return false;
    return ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(element.tagName) || element.isContentEditable;
  }

  function setBaseViewBox(x, y, width, height) {
    state.baseViewBox = { x, y, width, height };
    state.panX = 0;
    state.panY = 0;
    updateZoom();
  }

  function currentViewBoxForZoom(zoom = state.zoom) {
    const base = state.baseViewBox || { x: 0, y: 0, width: state.params.formatWidth || 100, height: state.params.formatHeight || 100 };
    const safeZoom = clampZoom(zoom);
    const width = base.width / safeZoom;
    const height = base.height / safeZoom;
    return {
      x: base.x + (base.width - width) / 2 + state.panX,
      y: base.y + (base.height - height) / 2 + state.panY,
      width,
      height
    };
  }

  function applyViewBox(box) {
    preview.setAttribute("viewBox", `${round(box.x)} ${round(box.y)} ${round(box.width)} ${round(box.height)}`);
  }

  function clampZoom(value) {
    return Math.max(0.25, Math.min(4, value));
  }

  function updateZoom() {
    applyViewBox(currentViewBoxForZoom());
  }

  function setZoom(nextZoom, focalClientX = null, focalClientY = null) {
    const previousZoom = state.zoom;
    const next = clampZoom(nextZoom);
    if (next === previousZoom) return;
    const useFocalPoint = Number.isFinite(focalClientX) && Number.isFinite(focalClientY);
    let normalizedX = 0.5;
    let normalizedY = 0.5;
    let contentX = null;
    let contentY = null;
    if (useFocalPoint) {
      const current = currentViewBoxForZoom(previousZoom);
      const previewRect = preview.getBoundingClientRect();
      normalizedX = previewRect.width ? (focalClientX - previewRect.left) / previewRect.width : 0.5;
      normalizedY = previewRect.height ? (focalClientY - previewRect.top) / previewRect.height : 0.5;
      contentX = current.x + normalizedX * current.width;
      contentY = current.y + normalizedY * current.height;
    }
    state.zoom = next;
    if (useFocalPoint && state.baseViewBox) {
      const base = state.baseViewBox;
      const width = base.width / next;
      const height = base.height / next;
      const targetX = contentX - normalizedX * width;
      const targetY = contentY - normalizedY * height;
      state.panX = targetX - (base.x + (base.width - width) / 2);
      state.panY = targetY - (base.y + (base.height - height) / 2);
    }
    updateZoom();
  }

  let renderTimer = null;
  function scheduleRender() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(() => {
      renderTimer = null;
      render();
    }, 250);
  }

  document.getElementById("loadExamples").addEventListener("click", () => {
    loadExampleSources().catch((error) => {
      console.error(error);
      setStatus(error.message);
    });
  });
  document.getElementById("projectInput").addEventListener("change", (event) => readProjectInput(event.target));
  document.getElementById("level0Input").addEventListener("change", (event) => readFileInput(event.target, "level0"));
  document.getElementById("level1Input").addEventListener("change", (event) => readFileInput(event.target, "level1"));
  document.getElementById("level2Input").addEventListener("change", (event) => readFileInput(event.target, "level2"));
  document.getElementById("holesInput").addEventListener("change", (event) => readFileInput(event.target, "holes"));
  document.getElementById("panelInput").addEventListener("change", (event) => readFileInput(event.target, "panel"));
  document.getElementById("generate").addEventListener("click", render);
  document.getElementById("showRawImportedSvg").addEventListener("click", () => {
    renderRawImportedSvg(document.getElementById("rawImportSource").value);
  });
  document.getElementById("testSingleModuleScale").addEventListener("click", () => {
    runSingleModuleScaleTest();
  });
  document.querySelectorAll("[data-param]").forEach((input) => input.addEventListener("input", scheduleRender));
  document.querySelectorAll("[data-layer]").forEach((input) => input.addEventListener("change", render));
  document.getElementById("clipPreview").addEventListener("change", render);
  document.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => exportSvg(button.dataset.export));
  });
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => handlePreset(button.dataset.preset));
  });
  document.querySelectorAll("[data-nudge]").forEach((button) => {
    button.addEventListener("click", () => {
      readParams();
      const [dx, dy] = button.dataset.nudge.split(",").map(Number);
      const step = Number(state.params.nudgeStep || 1);
      state.params.globalPatternOffsetX = Number(state.params.globalPatternOffsetX || 0) + dx * step;
      state.params.globalPatternOffsetY = Number(state.params.globalPatternOffsetY || 0) + dy * step;
      applyStateToControls();
      render();
    });
  });
  document.getElementById("zoomIn")?.addEventListener("click", () => {
    setZoom(state.zoom + 0.2);
  });
  document.getElementById("zoomOut")?.addEventListener("click", () => {
    setZoom(state.zoom - 0.2);
  });
  document.getElementById("resetView")?.addEventListener("click", () => {
    setZoom(1);
  });
  let isSpacePanning = false;
  let pointerInsideViewport = false;
  let panState = null;
  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space" || event.repeat || isTypingTarget(document.activeElement) || !pointerInsideViewport) return;
    event.preventDefault();
    isSpacePanning = true;
    viewport.classList.add("is-space-panning");
  });
  document.addEventListener("keydown", (event) => {
    if (!pointerInsideViewport || isTypingTarget(document.activeElement)) return;
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setZoom(state.zoom * 1.12);
    }
    if (event.key === "-") {
      event.preventDefault();
      setZoom(state.zoom / 1.12);
    }
    if (event.key === "0") {
      event.preventDefault();
      state.panX = 0;
      state.panY = 0;
      setZoom(1);
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.code !== "Space") return;
    isSpacePanning = false;
    panState = null;
    viewport.classList.remove("is-space-panning", "is-panning");
  });
  viewport.addEventListener("pointerenter", () => {
    pointerInsideViewport = true;
  });
  viewport.addEventListener("pointerleave", () => {
    pointerInsideViewport = false;
    if (!panState) {
      isSpacePanning = false;
      viewport.classList.remove("is-space-panning", "is-panning");
    }
  });
  viewport.addEventListener("pointerdown", (event) => {
    if (!isSpacePanning || event.button !== 0) return;
    event.preventDefault();
    const viewBox = currentViewBoxForZoom();
    const previewRect = preview.getBoundingClientRect();
    panState = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: state.panX,
      panY: state.panY,
      unitsPerPixelX: previewRect.width ? viewBox.width / previewRect.width : 1,
      unitsPerPixelY: previewRect.height ? viewBox.height / previewRect.height : 1
    };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-panning");
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!panState || event.pointerId !== panState.pointerId) return;
    event.preventDefault();
    state.panX = panState.panX - (event.clientX - panState.x) * panState.unitsPerPixelX;
    state.panY = panState.panY - (event.clientY - panState.y) * panState.unitsPerPixelY;
    updateZoom();
  });
  viewport.addEventListener("pointerup", (event) => {
    if (!panState || event.pointerId !== panState.pointerId) return;
    panState = null;
    viewport.classList.remove("is-panning");
  });
  viewport.addEventListener("pointercancel", () => {
    panState = null;
    viewport.classList.remove("is-panning");
  });
  viewport.addEventListener("wheel", (event) => {
    if (!event.altKey && !event.ctrlKey) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
    setZoom(state.zoom * factor, event.clientX, event.clientY);
  }, { passive: false });
  // Optional per-page default overrides (used by the simplified UI easy.html).
  // Defined on window before app.js loads; index.html sets none, so it is unaffected.
  if (window.RG_PARAM_OVERRIDES) Object.assign(state.params, window.RG_PARAM_OVERRIDES);
  if (window.RG_LAYER_OVERRIDES) Object.assign(state.layers, window.RG_LAYER_OVERRIDES);
  applyStateToControls();
  loadExampleSources().catch((error) => {
    console.error(error);
    setStatus(error.message);
  });
})();
